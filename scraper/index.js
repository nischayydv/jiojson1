import fs from "fs/promises";
import fetch from "node-fetch";

const OUTPUT_PATH = "./data/id.json";

// 🔁 Replace this with your LEGAL / PUBLIC source
const SOURCE_URL = "https://binge-jiotv.pages.dev/data/id.json";

async function fetchSource() {
  const res = await fetch(SOURCE_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch source: ${res.status}`);
  }

  return res.json();
}

function transformData(source) {
  // 🔧 Adjust mapping depending on your real API
  const channels = (source.channels || []).map((ch, i) => ({
    id: ch.id || `ch${i}`,
    name: ch.name || "Unknown",
    url: ch.url || "",
    logo: ch.logo || ""
    
    // ❌ DO NOT include DRM keys / cookies
  }));

  return {
    updatedAt: new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata"
    }),
    channels
  };
}

async function saveData(data) {
  await fs.mkdir("./data", { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(data, null, 2));
  console.log("✅ Data saved to", OUTPUT_PATH);
}

async function main() {
  try {
    console.log("⏳ Fetching source...");
    const source = await fetchSource();

    console.log("🔄 Transforming...");
    const finalData = transformData(source);

    console.log("💾 Saving...");
    await saveData(finalData);

    console.log("🚀 Done");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

main();
