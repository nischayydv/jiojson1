import fs from "fs/promises";

const OUTPUT_FILE = "./stream.json";

// 🔁 PUT YOUR REAL SOURCE URL HERE
const SOURCE_URL = "https://binge-jiotv.pages.dev/data/id.json";

async function fetchSource() {
  try {
    const res = await fetch(SOURCE_URL, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-IN,en;q=0.9"
      }
    });

    if (!res.ok) {
      console.log(`⚠️ Fetch failed: ${res.status}`);
      return null;
    }

    const data = await res.json();

    // 🔍 Debug first item (remove later if not needed)
    console.log("Sample channel:", JSON.stringify(data?.channels?.[0], null, 2));

    return data;
  } catch (err) {
    console.log("❌ Fetch error:", err.message);
    return null;
  }
}

function transformData(data) {
  return {
    updatedAt: new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata"
    }),
    channels: data?.channels || []
  };
}

async function saveFile(json) {
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(json, null, 2));
  console.log("✅ stream.json saved");
}

async function main() {
  console.log("⏳ Fetching...");

  const source = await fetchSource();

  if (!source) {
    console.log("🚫 No data fetched. Skipping update.");
    return;
  }

  console.log("🔄 Transforming...");
  const finalData = transformData(source);

  console.log("💾 Saving...");
  await saveFile(finalData);

  console.log("🚀 Done");
}

main();
