import fs from "fs/promises";

const OUTPUT_FILE = "./stream.json";

// 🔁 Replace this with your actual PUBLIC source
const SOURCE_URL = "https://example.com/api/channels.json";

async function fetchSource() {
  const res = await fetch(SOURCE_URL);

  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status}`);
  }

  return res.json();
}

function transformData(data) {
  // Adjust mapping based on your real API structure
  const channels = (data.channels || []).map((ch, i) => ({
    id: ch.id || `ch${i}`,
    name: ch.name || "Unknown",
    url: ch.url || "",
    logo: ch.logo || ""
  }));

  return {
    updatedAt: new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata"
    }),
    channels
  };
}

async function saveFile(json) {
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(json, null, 2));
  console.log("✅ stream.json updated");
}

async function main() {
  try {
    console.log("⏳ Fetching...");
    const source = await fetchSource();

    console.log("🔄 Transforming...");
    const finalData = transformData(source);

    console.log("💾 Saving...");
    await saveFile(finalData);

    console.log("🚀 Done");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

main();
