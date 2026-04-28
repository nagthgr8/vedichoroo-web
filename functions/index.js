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
const Anthropic = require("@anthropic-ai/sdk").default;
const {GoogleGenerativeAI} = require("@google/generative-ai");
const {defineSecret} = require("firebase-functions/params");

const OPENAI_KEY = defineSecret("OPENAI_KEY");
const ANTHROPIC_KEY = defineSecret("ANTHROPIC_KEY");
const GEMINI_KEY = defineSecret("GEMINI_KEY");

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
    {secrets: [OPENAI_KEY, ANTHROPIC_KEY, GEMINI_KEY]},
    async (req, res) => {
      cors(req, res, async () => {
        try {
          if (req.method !== "POST") {
            return res.status(405).send("Method Not Allowed");
          }

          const body = req.body;
          res.set("Cache-Control", "no-store");

          // ── Agent mode: { provider, payload } ──────────────────────────────
          // The client adapter already built the full provider wire-format
          // payload. We forward it verbatim and return the raw response so the
          // client adapter can parse it (OpenAiAdapter / ClaudeAdapter).
          if (body.provider && body.payload) {
            const {provider, payload} = body;

            if (provider === "openai") {
              const client = new OpenAI({apiKey: OPENAI_KEY.value()});
              const raw = await client.chat.completions.create(payload);
              logUsage("openai", raw.usage);
              return res.json(raw);
            }

            if (provider === "claude") {
              const client = new Anthropic({apiKey: ANTHROPIC_KEY.value()});
              const raw = await client.messages.create(payload);
              logUsage("claude", raw.usage);
              return res.json(raw);
            }

            if (provider === "gemini") {
              const genAI = new GoogleGenerativeAI(GEMINI_KEY.value());
              const model = genAI.getGenerativeModel({
                model: payload.model || "gemini-2.0-flash",
                systemInstruction: payload.systemInstruction,
                tools: payload.tools,
              });
              const result = await model.generateContent({
                contents: payload.contents,
              });
              const raw = result.response;
              logUsage("gemini", raw.usageMetadata);
              return res.json(raw);
            }

            return res.status(400).json({
              error: `Unsupported provider: ${provider}`,
            });
          }

          // ── Legacy mode: { prompt } ─────────────────────────────────────
          // Fixed-prompt flow — unchanged so current pages keep working.
          const {prompt} = body;
          if (!prompt) {
            return res.status(400).json({
              error: "prompt or provider+payload required",
            });
          }
          if (prompt.length > 100000) {
            return res.status(400).json({error: "Prompt too long"});
          }

          const client = new OpenAI({apiKey: OPENAI_KEY.value()});
          const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {role: "system", content: "You are a senior Vedic astrologer."},
              {role: "user", content: prompt},
            ],
            temperature: 0.7,
            max_tokens: 800,
          });

          logUsage("openai-legacy", completion.usage);
          return res.json({answer: completion.choices[0].message.content});
        } catch (err) {
          console.error("LLM error:", err);
          res.status(500).json({error: "LLM processing failed"});
        }
      });
    },
);

function logUsage(provider, usage) {
  if (!usage) return;
  // OpenAI: prompt_tokens / completion_tokens
  // Claude: input_tokens / output_tokens
  const input = usage.input_tokens ?? usage.prompt_tokens ?? 0;
  const output = usage.output_tokens ?? usage.completion_tokens ?? 0;
  const total = input + output;
  console.log(`[${provider}] in:${input} out:${output} total:${total}`);
}

exports.sendTestNotification = functions.https.onRequest(
    async (_req, res) => {
      try {
        const targetEmail = "mohchvvk@gmail.com";

        // Find user by email
        const usersSnap = await db.collection("users")
            .where("email", "==", targetEmail)
            .limit(1)
            .get();

        if (usersSnap.empty) {
          return res.status(404).json({error: "User not found"});
        }

        const userDoc = usersSnap.docs[0];
        const userRef = userDoc.ref;

        // Get SELF profile
        const profilesSnap = await userRef.collection("profiles")
            .where("type", "==", "SELF")
            .limit(1)
            .get();

        if (profilesSnap.empty) {
          return res.status(404).json({error: "SELF profile not found"});
        }

        const profile = profilesSnap.docs[0].data();
        console.log("Profile rashi:", profile.rashi);
        console.log("Profile fcmToken:", profile.fcmToken || "(none)");
        console.log(
            "notificationsEnabled:", userDoc.data().notificationsEnabled,
        );

        // Resolve FCM token
        let token = profile.fcmToken;
        if (!token) {
          const tokensSnap = await userRef.collection("fcmTokens").get();
          const toks = tokensSnap.docs
              .map((d) => d.data().token)
              .filter(Boolean);
          console.log("fcmTokens subcollection count:", toks.length);
          if (toks.length === 0) {
            return res.status(404).json({error: "No FCM token found"});
          }
          token = toks[0];
        }

        console.log("Sending test notification to token:", token);

        const response = await admin.messaging().send({
          token,
          notification: {
            title: "Test Notification",
            body: "This is a test from sendTestNotification function",
          },
          data: {type: "test"},
          android: {
            priority: "high",
          },
        });

        console.log("FCM response:", response);
        return res.status(200).json({
          success: true,
          messageId: response,
          rashi: profile.rashi,
          fcmSource: profile.fcmToken ?
            "profile.fcmToken" : "fcmTokens subcollection",
        });
      } catch (err) {
        console.error("sendTestNotification error:", err);
        return res.status(500).json({error: err.message});
      }
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
        android: {
          priority: "high",
        },
      };

      const response = await admin.messaging()
          .sendEachForMulticast({tokens, ...payload});

      console.log(
          `Horoscope notifications sent: ` +
      `${response.successCount}/${tokens.length}`,
      );

      // Clean up tokens that FCM rejected as invalid/unregistered
      const staleTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const code = resp.error?.code;
          if (
            code === "messaging/registration-token-not-registered" ||
            code === "messaging/invalid-registration-token"
          ) {
            staleTokens.push(tokens[idx]);
          }
        }
      });

      if (staleTokens.length > 0) {
        console.log(`Cleaning up ${staleTokens.length} stale tokens`);
        const usersSnap = await admin.firestore()
            .collection("users")
            .get();
        await Promise.all(
            usersSnap.docs.map(async (userDoc) => {
              const tokensSnap = await userDoc.ref
                  .collection("fcmTokens")
                  .get();
              const deleteOps = tokensSnap.docs
                  .filter((d) => staleTokens.includes(d.data().token))
                  .map((d) => d.ref.delete());
              if (deleteOps.length > 0) {
                // Also clear denormalized fcmToken on SELF profile if stale
                const profilesSnap = await userDoc.ref
                    .collection("profiles")
                    .where("fcmToken", "in", staleTokens)
                    .get();
                profilesSnap.docs.forEach((p) =>
                  deleteOps.push(
                      p.ref.update({
                        fcmToken: admin.firestore.FieldValue.delete(),
                      }),
                  ),
                );
                await Promise.all(deleteOps);
              }
            }),
        );
      }
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
   Reads pre-computed fructifications from kp_fructifications/{profileId}/{date}
   written by the local console app, and sends a separate FCM push notification.
----------------------------- */

async function checkAndNotifyKPEvents() {
  const today = new Date().toISOString().split("T")[0];

  // 1. Load all SELF profiles
  const profilesSnap = await db
      .collectionGroup("profiles")
      .where("type", "==", "SELF")
      .get();

  if (profilesSnap.empty) {
    console.log("No SELF profiles found");
    return;
  }

  console.log(`KP check: ${profilesSnap.size} SELF profiles for ${today}`);

  await Promise.all(
      profilesSnap.docs.map(async (profileDoc) => {
        const profile = profileDoc.data();
        const userRef = profileDoc.ref.parent.parent;
        if (!userRef) return;

        try {
          // Respect global notifications toggle on user doc
          const userSnap = await userRef.get();
          if (!userSnap.exists) return;
          if (userSnap.data()?.notificationsEnabled === false) return;

          // 1. Read pre-computed fructification for today
          const fructRef = db
              .collection("kp_fructifications")
              .doc(profileDoc.id)
              .collection("dates")
              .doc(today);

          const fructSnap = await fructRef.get();
          if (!fructSnap.exists) return;

          const fruct = fructSnap.data();
          const eventNames = fruct.events || [];
          if (eventNames.length === 0) return;

          // 2. FCM token — prefer denormalized field, fallback to subcollection
          let token = profile.fcmToken;
          if (!token) {
            const tokensSnap = await userRef.collection("fcmTokens").get();
            const toks = tokensSnap.docs
                .map((d) => d.data().token)
                .filter(Boolean);
            if (toks.length === 0) return;
            token = toks[0];
          }

          // 3. Build and send notification
          const top = eventNames.slice(0, 2).join(" & ");
          const extra = eventNames.length > 2 ? " & more" : "";
          const body = `${top}${extra} — your stars are aligned today.`;

          await admin.messaging().send({
            token,
            notification: {
              title: "Auspicious Events Today ⭐",
              body,
            },
            data: {
              type: "kp_event",
              events: eventNames.join(","),
              date: today,
            },
            android: {
              priority: "high",
            },
          });

          console.log(
              `✅ KP notification → ${userRef.id}: ${eventNames.join(", ")}`,
          );
        } catch (err) {
          console.error(`❌ KP check failed for ${profileDoc.id}:`, err);
        }
      }),
  );

  console.log("KP event notification job completed");
}

exports.notifyKPEvents = onSchedule(
    {
      schedule: "30 5 * * *", // 05:30 IST — after daily horoscope
      timeZone: "Asia/Kolkata",
    },
    async (_event) => {
      console.log("KP event notification job started");
      await checkAndNotifyKPEvents();
    },
);

/* -----------------------------
   VECTOR PROXY
   Stores and queries RAG embeddings in Firestore Vector Search.
   No external API key required — uses Firebase service account credentials.

   POST { action, ...params }
   Actions: ensureIndex | upsert | query | existsById | deleteById
----------------------------- */

const {FieldValue} = require("firebase-admin/firestore");
const RAG_COLLECTION = "rag_users";

function _ragRef(namespace, id) {
  return db.collection(RAG_COLLECTION).doc(namespace).collection("vectors")
      .doc(id);
}

function _ragCol(namespace) {
  return db.collection(RAG_COLLECTION).doc(namespace).collection("vectors");
}

exports.vectorProxy = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
      }

      const {action, ...p} = req.body;

      // ── ensureIndex — no-op for Firestore ───────────────────
      if (action === "ensureIndex") {
        return res.json({ok: true});
      }

      // ── upsert ──────────────────────────────────────────────
      if (action === "upsert") {
        const {namespace, id, vector, metadata} = p;
        await _ragRef(namespace, id).set({
          id,
          namespace,
          embedding: FieldValue.vector(vector),
          metadata,
        });
        return res.json({});
      }

      // ── query ───────────────────────────────────────────────
      if (action === "query") {
        const {namespace, vector, topK = 5} = p;
        const snapshot = await _ragCol(namespace)
            .findNearest({
              vectorField: "embedding",
              queryVector: FieldValue.vector(vector),
              limit: topK,
              distanceMeasure: "COSINE",
              distanceResultField: "_distance",
            })
            .get();
        const matches = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: data.id,
            score: 1 - (data._distance ?? 0),
            metadata: data.metadata,
          };
        });
        return res.json({matches});
      }

      // ── existsById ──────────────────────────────────────────
      if (action === "existsById") {
        const {namespace, id} = p;
        const doc = await _ragRef(namespace, id).get();
        return res.json({exists: doc.exists});
      }

      // ── deleteById ──────────────────────────────────────────
      if (action === "deleteById") {
        const {namespace, ids} = p;
        const batch = db.batch();
        for (const id of ids) {
          batch.delete(_ragRef(namespace, id));
        }
        await batch.commit();
        return res.json({});
      }

      return res.status(400).json({error: `Unknown action: ${action}`});
    } catch (err) {
      console.error("vectorProxy error:", err);
      return res.status(500).json({error: err.message});
    }
  });
});
