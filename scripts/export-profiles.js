/**
 * export-profiles.js
 *
 * Exports all SELF profiles with FCM tokens from Firestore to a local
 * profiles.json file for use by the KP fructification console app.
 *
 * Usage:
 *   node scripts/export-profiles.js
 *
 * Requirements:
 *   - Place your Firebase service account key at scripts/serviceAccountKey.json
 *   - Download it from: Firebase Console → Project Settings → Service Accounts
 *     → Generate new private key
 */

const admin = require("../functions/node_modules/firebase-admin");
const fs = require("fs");
const path = require("path");

const SERVICE_ACCOUNT_PATH = path.join(__dirname, "serviceAccountKey.json");
const OUTPUT_PATH = path.join(__dirname, "profiles.json");
const BATCH_SIZE = 500;

// ── Init ──────────────────────────────────────────────────────────────────────

if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error(
    "❌ serviceAccountKey.json not found at", SERVICE_ACCOUNT_PATH,
    "\n   Download it from Firebase Console → Project Settings → Service Accounts",
  );
  process.exit(1);
}

const serviceAccount = require(SERVICE_ACCOUNT_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ── Export ────────────────────────────────────────────────────────────────────

async function exportProfiles() {
  console.log("🔍 Querying SELF profiles with FCM tokens...");

  const profiles = [];
  let lastDoc = null;
  let batchNum = 0;

  while (true) {
    let query = db
      .collectionGroup("profiles")
      .where("type", "==", "SELF")
      .where("fcmToken", "!=", null)
      .orderBy("fcmToken")
      .limit(BATCH_SIZE);

    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }

    const snap = await query.get();

    if (snap.empty) break;

    batchNum++;
    console.log(`   Batch ${batchNum}: ${snap.size} profiles fetched`);

    snap.docs.forEach((doc) => {
      const d = doc.data();
      profiles.push({
        id: doc.id,
        dob: d.dob ?? null,
        latitude: d.latitude ?? null,
        longitude: d.longitude ?? null,
        timezone: d.timezone ?? null,
        rashi: d.rashi ?? null,
        mahaDashaLord: d.mahaDashaLord ?? null,
        antarDashaLord: d.antarDashaLord ?? null,
        pratyantarDashaLord: d.pratyantarDashaLord ?? null,
        fcmToken: d.fcmToken ?? null,
      });
    });

    if (snap.size < BATCH_SIZE) break;
    lastDoc = snap.docs[snap.docs.length - 1];
  }

  // Filter out profiles missing required birth data
  const valid = profiles.filter(
    (p) => p.dob && p.latitude && p.longitude && p.timezone,
  );
  const skipped = profiles.length - valid.length;

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(valid, null, 2));

  console.log(`\n✅ Export complete`);
  console.log(`   Total profiles exported : ${valid.length}`);
  if (skipped > 0) {
    console.log(`   Skipped (missing data)  : ${skipped}`);
  }
  console.log(`   Output file             : ${OUTPUT_PATH}`);
  console.log(`   Exported at             : ${new Date().toISOString()}`);
}

exportProfiles().catch((err) => {
  console.error("❌ Export failed:", err);
  process.exit(1);
});
