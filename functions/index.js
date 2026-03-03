const functions = require("firebase-functions");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const {onDocumentUpdated} = require("firebase-functions/v2/firestore");
const {onDocumentWritten} =
  require("firebase-functions/v2/firestore");
const {onMessagePublished} = require("firebase-functions/v2/pubsub");
const admin = require("firebase-admin");
const {XMLParser} = require("fast-xml-parser");
const cors = require("cors")({origin: true});
const OpenAI = require("openai").default;
const {defineSecret} = require("firebase-functions/params");

const OPENAI_KEY = defineSecret("OPENAI_KEY");
const AZURE_FUNC_URL = defineSecret("AZURE_FUNC_URL");
const AZURE_FUNC_KEY = defineSecret("AZURE_FUNC_KEY");

admin.initializeApp();
const db = admin.firestore();

/* -----------------------------
   ZODIAC RSS SOURCES
----------------------------- */
const zodiacFeeds = {
  Aries: "https://astrobix.com/feeds/rashiaries",
  Taurus: "https://astrobix.com/feeds/rashitaurus",
  Gemini: "https://astrobix.com/feeds/rashigemini",
  Cancer: "https://astrobix.com/feeds/rashicancer",
  Leo: "https://astrobix.com/feeds/rashileo",
  Virgo: "https://astrobix.com/feeds/rashivirgo",
  Libra: "https://astrobix.com/feeds/rashilibra",
  Scorpio: "https://astrobix.com/feeds/rashiscorpio",
  Sagittarius: "https://astrobix.com/feeds/rashisagittarius",
  Capricorn: "https://astrobix.com/feeds/rashicapricorn",
  Aquarius: "https://astrobix.com/feeds/rashiaquarius",
  Pisces: "https://astrobix.com/feeds/rashipisces",
};

/* -----------------------------
   CLEANING HELPERS (C# → JS)
----------------------------- */
function cleanHtml(input = "") {
  return input.replace(/<[^>]*>/g, "");
}

function removeReferences(input = "") {
  // input = input.replace(/Astrobix\.com:?/gi, "");
  input = input.replace(/Your Moon sign is [A-Za-z]+\./gi, "");
  return input.replace(/\s+/g, " ").trim();
}

function cleanDescription(text) {
  if (!text) return "";
  let out = cleanHtml(text);
  out = removeReferences(out);
  return out.replace(/^[:\s]+/, "").trim();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/* -----------------------------
   CORE LOGIC (SHARED)
----------------------------- */
async function fetchAndStoreDailyHoroscope() {
  const today = new Date().toISOString().split("T")[0];
  const parser = new XMLParser();

  console.log("Daily horoscope job started:", today);

  for (const [rashi, url] of Object.entries(zodiacFeeds)) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Failed fetch for ${rashi}`);
        continue;
      }

      const xml = await response.text();
      const parsed = parser.parse(xml);

      const item = parsed?.rss?.channel?.item;
      if (!item || !item.description) {
        console.error(`Invalid RSS for ${rashi}`);
        continue;
      }

      const message = cleanDescription(item.description);
      const shortMessage = message.substring(0, 140) + "...";
      // CHANGED: We now point directly to daily_horoscope/{rashi}
      // This overwrites the document every day instead of creating new ones
      await db
          .collection("daily_horoscope")
          .doc(rashi)
          .set({
            rashi,
            date: today, // Keeps track of which day the content belongs to
            message,
            shortMessage,
            source: "rss",
            fetchedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

      console.log(`✔ Updated horoscope for ${rashi}`);

      // Send notifications after storing horoscope
      // const docRef = await db.collection("daily_horoscope").doc(rashi).get();
      // if (docRef.exists) {
      //   await notifyUsersOfDailyHoroscope(rashi, docRef.data());
      // }
    } catch (err) {
      console.error(`❌ Error processing ${rashi}`, err);
    }
  }

  console.log("Daily horoscope job completed");
}
/* -----------------------------
   SCHEDULED FUNCTION
----------------------------- */
exports.fetchDailyHoroscope = onSchedule(
    {
      schedule: "0 5 * * *",
      timeZone: "Asia/Kolkata",
    },
    async (event) => {
      console.log("Scheduled daily horoscope running...");
      await fetchAndStoreDailyHoroscope();
    },
);


/* -----------------------------
   MANUAL HTTP TRIGGER (TEST)
----------------------------- */
exports.fetchDailyHoroscopeNow = functions.https.onRequest(
    async (req, res) => {
      try {
        await fetchAndStoreDailyHoroscope();
        res.status(200).send("Daily horoscope fetched successfully");
      } catch (err) {
        console.error(err);
        res.status(500).send("Failed");
      }
    },
);

/* -----------------------------
   REPORT → ORDER CREATION
----------------------------- */
exports.onReportPaid = onDocumentUpdated(
    "users/{userId}/reports/{reportId}",
    async (event) => {
      const before = event.data.before.data();
      const after = event.data.after.data();

      // Only act on INITIATED -> PAID
      if (before.status === "PAID" || after.status !== "PAID") {
        return;
      }

      const {userId, reportId} = event.params;

      const orderRef = admin.firestore()
          .collection("orders")
          .doc(reportId);

      if ((await orderRef.get()).exists) {
        console.log("Order already exists:", reportId);
        return;
      }

      await orderRef.set({
        orderId: reportId,
        uid: userId,
        reportRef: event.data.after.ref.path,
        name: after.name ?? "",
        dob: after.dob ?? "",
        email: after.email ?? "",
        mobile: after.mobile ?? "",
        question: after.question ?? "",
        chartType: after.chartType ?? "",
        productId: after.productId ?? "",
        transactionId: after.transactionId ?? "",
        status: "NEW",
        assignedTo: null,
        source: "payment-confirmation",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Order created for PAID report ${reportId}`);
    },
);

/**
 * Google Play Real-Time Developer Notification handler
 */
exports.onPlayBillingNotification = onMessagePublished(
    "play-billing-rtdn",
    async (event) => {
      try {
        if (!event.data?.message?.data) {
          console.warn("⚠️ Empty RTDN payload");
          return;
        }

        // Decode base64 message
        const decoded = Buffer.from(
            event.data.message.data,
            "base64",
        ).toString("utf8");

        const notification = JSON.parse(decoded);
        console.log("📩 RTDN received:", notification);

        /**
       * Handle ONE-TIME PRODUCT purchase
       */
        if (notification.oneTimeProductNotification) {
          await handleOneTimeProduct(notification.oneTimeProductNotification);
          return;
        }

        /**
       * Handle SUBSCRIPTION purchase (future-proofing)
       */
        if (notification.subscriptionNotification) {
          await handleSubscription(notification.subscriptionNotification);
          return;
        }

        console.warn("⚠️ Unknown RTDN message type");
      } catch (err) {
        console.error("❌ RTDN handler failed:", err);
      }
    },
);

async function handleOneTimeProduct(n) {
  const {
    orderId: playOrderId,
    purchaseToken,
    sku,
    purchaseState,
  } = n;

  console.log("🧾 RTDN one-time product:", {
    playOrderId,
    sku,
    purchaseState,
  });

  // Only act on successful payment
  if (purchaseState !== 0) {
    console.log("⏭️ Ignoring non-paid state");
    return;
  }

  // Find report by purchaseToken
  const reportSnap = await admin.firestore()
      .collectionGroup("reports")
      .where("transactionId", "==", purchaseToken)
      .limit(1)
      .get();

  if (reportSnap.empty) {
    console.warn("⚠️ No report found for purchaseToken");
    return;
  }

  const reportDoc = reportSnap.docs[0];
  const report = reportDoc.data();
  const reportId = reportDoc.id;

  const orderRef = admin.firestore()
      .collection("orders")
      .doc(reportId);

  // Idempotency: order already created
  const existing = await orderRef.get();
  if (existing.exists) {
    console.log(`⏭️ Order already exists for report ${reportId}`);
    return;
  }

  // ✅ CREATE order
  await orderRef.set({
    orderId: reportId,
    reportRef: reportDoc.ref.path,
    uid: report.uid ?? null,

    name: report.name ?? "",
    email: report.email ?? "",
    mobile: report.mobile ?? "",

    productId: sku,
    playOrderId,
    purchaseToken,

    status: "NEW", // Ready for agent
    paymentStatus: "PAID",

    source: "rtdn",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Update report as paid
  await reportDoc.ref.update({
    status: "PAID",
    paidAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(`✅ Order CREATED for report ${reportId}`);
}

/* -------------------------------------------------- */
/* Subscription handler (optional / future use)       */
/* -------------------------------------------------- */
async function handleSubscription(n) {
  console.log("🔁 Subscription event:", n);
  // You can extend later
}

exports.askAstrologer = functions.https.onRequest(
    {secrets: [OPENAI_KEY]},
    async (req, res) => {
      cors(req, res, async () => {
        try {
          if (req.method !== "POST") {
            return res.status(405).send("Method Not Allowed");
          }

          const {prompt} = req.body;

          if (!prompt) {
            return res.status(400).json({error: "Prompt is required"});
          }

          if (prompt.length > 8000) {
            return res.status(400).json({error: "Prompt too long"});
          }

          const client = new OpenAI({
            apiKey: OPENAI_KEY.value(),
          });

          const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {role: "system", content: "You are a senior Vedic astrologer."},
              {role: "user", content: prompt},
            ],
            temperature: 0.7,
            max_tokens: 600,
          });
          // usage info
          const usage = completion.usage;
          console.log("Prompt tokens:", usage.prompt_tokens);
          console.log("Completion tokens:", usage.completion_tokens);
          console.log("Total tokens:", usage.total_tokens);

          // approximate cost
          const inputCost = (usage.prompt_tokens / 1000) * 0.001;
          const outputCost = (usage.completion_tokens / 1000) * 0.002;
          const totalCost = inputCost + outputCost;
          console.log("Estimated cost ($):", totalCost);
          res.set("Cache-Control", "no-store");

          res.json({
            answer: completion.choices[0].message.content,
          });
        } catch (err) {
          console.error("LLM error:", err);
          res.status(500).json({error: "LLM processing failed"});
        }
      });
    },
);

exports.notifyDailyHoroscope = onDocumentWritten(
    "daily_horoscope/{rashi}",
    async (event) => {
      if (!event.data?.after?.exists) return;

      const rashi = event.params.rashi;
      const data = event.data.after.data();

      // Prevent duplicate notifications for same day
      if (
        event.data.before?.exists &&
      event.data.before.data()?.date === data.date
      ) {
        console.log("Already notified for today:", rashi);
        return;
      }

      console.log("Sending notifications for rashi:", rashi);

      // 🔥 Query profiles
      const profilesSnap = await admin.firestore()
          .collectionGroup("profiles")
          .where("type", "==", "SELF")
          .where("rashi", "==", rashi)
          .get();

      if (profilesSnap.empty) {
        console.log("No profiles found for rashi:", rashi);
        return;
      }

      // Parallel reads: all users processed concurrently.
      // Prefer fcmToken on profile (no extra read);
      // fall back to fcmTokens subcollection for older users.
      const tokenResults = await Promise.all(
          profilesSnap.docs.map(async (profileDoc) => {
            const profileData = profileDoc.data();
            const userRef = profileDoc.ref.parent.parent;
            if (!userRef) return [];

            const userSnap = await userRef.get();
            if (!userSnap.exists) return [];
            if (userSnap.data()?.notificationsEnabled === false) return [];

            if (profileData.fcmToken) {
              return [profileData.fcmToken];
            }

            const tokensSnap =
              await userRef.collection("fcmTokens").get();
            return tokensSnap.docs
                .map((d) => d.data().token)
                .filter(Boolean);
          }),
      );
      const tokens = tokenResults.flat();

      if (tokens.length === 0) {
        console.log("No FCM tokens found");
        return;
      }

      const payload = {
        notification: {
          title: `Today’s ${capitalize(rashi)} Horoscope`,
          body: data.shortMessage,
        },
        data: {
          type: "daily_horoscope",
          rashi,
          date: data.date,
        },
      };

      const response = await admin.messaging()
          .sendEachForMulticast({tokens, ...payload});

      console.log(
          `Horoscope notifications sent: ` +
      `${response.successCount}/${tokens.length}`,
      );
    },
);

/* -----------------------------
   TEXT EMBEDDING (OpenAI)
   POST { text: string }  →  { embedding: number[] }
   Model: text-embedding-3-small (1536 dims)
----------------------------- */

exports.embedText = functions.https.onRequest(
    {secrets: [OPENAI_KEY]},
    async (req, res) => {
      cors(req, res, async () => {
        try {
          if (req.method !== "POST") {
            return res.status(405).send("Method Not Allowed");
          }

          const {text} = req.body;
          if (!text || typeof text !== "string") {
            return res.status(400).json({
              error: "text is required",
            });
          }

          if (text.length > 10000) {
            return res.status(400).json({
              error: "text too long (max 10000 chars)",
            });
          }

          const openai = new OpenAI({
            apiKey: OPENAI_KEY.value(),
          });

          const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text,
          });

          const embedding = response.data?.[0]?.embedding;

          if (!Array.isArray(embedding)) {
            console.error("Unexpected OpenAI response:", response);
            return res.status(502).json({
              error: "Unexpected embedding response",
            });
          }

          res.set("Cache-Control", "no-store");
          res.json({embedding});
        } catch (err) {
          console.error("embedText error:", err);
          return res.status(err?.status || 500).json({
            error: err?.message || "Embedding failed",
          });
        }
      });
    },
);

/* -----------------------------
   KP EVENT FRUCTIFICATION NOTIFICATION
   Runs daily at 05:30 IST (after daily horoscope at 05:00 IST).
   For each user whose SELF profile has dasha lords stored,
   calls the Azure CheckKPEventFructification function to check
   if any KP life event is favorable today, then sends FCM push.
----------------------------- */

async function checkAndNotifyKPEvents() {
  const azureBase = AZURE_FUNC_URL.value();
  const azureKey = AZURE_FUNC_KEY.value();

  // 1. Load all SELF profiles
  const profilesSnap = await db
      .collectionGroup("profiles")
      .where("type", "==", "SELF")
      .get();

  if (profilesSnap.empty) {
    console.log("No SELF profiles found");
    return;
  }

  // Filter to profiles that have dasha lords stored
  const withLords = profilesSnap.docs.filter((d) => {
    const lord = d.data().mahaDashaLord;
    return typeof lord === "string" && lord.trim().length > 0;
  });

  console.log(`KP check: ${withLords.length} profiles with dasha lords`);

  await Promise.all(
      withLords.map(async (profileDoc) => {
        const profile = profileDoc.data();
        const userRef = profileDoc.ref.parent.parent;
        if (!userRef) return;

        try {
          // Respect global notifications toggle on user doc
          const userSnap = await userRef.get();
          if (!userSnap.exists) return;
          if (userSnap.data()?.notificationsEnabled === false) return;

          const {
            dob,
            latitude,
            longitude,
            timezone,
            mahaDashaLord,
            antarDashaLord,
            pratyantarDashaLord,
            fcmToken,
          } = profile;

          if (!dob || !latitude || !longitude || !timezone) {
            console.log(`Skipping ${profileDoc.id} — missing birth data`);
            return;
          }

          // Parse Firestore dob "YYYY-M-DDTHH:MM:SS[Z]"
          // → Dob "DD|MM|YYYY", Tob "HH|MM|SS"
          const clean = dob.replace("Z", "");
          const [datePart, rawTime = "0:0:0"] = clean.split("T");
          const [yr, mo, dy] = datePart.split("-").map(Number);
          const [hh = 0, mm = 0, ss = 0] = rawTime.split(":").map(Number);

          // 2. Call Azure CheckKPEventFructification
          const endpoint =
            `${azureBase}/api/CheckKPEventFructification` +
            `?code=${azureKey}`;

          const azureRes = await fetch(endpoint, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
              Dob: `${dy}|${mo}|${yr}`,
              Tob: `${hh}|${mm}|${ss}`,
              LatLng: `${latitude}|${longitude}`,
              Timezone: timezone,
              AyanId: 4, // NC Lahiri — app default
              CurrentMaha: mahaDashaLord || "",
              CurrentAntar: antarDashaLord || "",
              CurrentPratyantar: pratyantarDashaLord || "",
            }),
          });

          if (!azureRes.ok) {
            console.error(
                `Azure error for ${profileDoc.id}: ${azureRes.status}`,
            );
            return;
          }

          const result = await azureRes.json();
          if (!result.hasFavorableEvents) return;

          // 3. FCM token — prefer denormalized field, fallback to subcollection
          let token = fcmToken;
          if (!token) {
            const tokensSnap = await userRef
                .collection("fcmTokens")
                .get();
            const toks = tokensSnap.docs
                .map((d) => d.data().token)
                .filter(Boolean);
            if (toks.length === 0) return;
            token = toks[0];
          }

          // 4. Build notification
          const eventNames = [
            ...new Set(
                result.favorableEvents.map((e) => e.eventName),
            ),
          ];
          const top = eventNames.slice(0, 2).join(" & ");
          const extra = eventNames.length > 2 ? " & more" : "";
          const body =
            `${top}${extra} — your stars are aligned today.`;

          await admin.messaging().send({
            token,
            notification: {
              title: "Your Stars Are Active Today",
              body,
            },
            data: {
              type: "kp_event",
              events: eventNames.join(","),
              date: result.date,
            },
          });

          console.log(
              `✅ KP notification → ${userRef.id}: ` +
              `${eventNames.join(", ")}`,
          );
        } catch (err) {
          console.error(
              `❌ KP check failed for ${profileDoc.id}:`, err,
          );
        }
      }),
  );

  console.log("KP event notification job completed");
}

exports.notifyKPEvents = onSchedule(
    {
      schedule: "30 5 * * *", // 05:30 IST — after daily horoscope
      timeZone: "Asia/Kolkata",
      secrets: [AZURE_FUNC_URL, AZURE_FUNC_KEY],
    },
    async (_event) => {
      console.log("KP event notification job started");
      await checkAndNotifyKPEvents();
    },
);
