import fs from "fs/promises";

const OUTPUT_PATH = "./data/id.json";
const SOURCE_URL = "https://binge-jiotv.pages.dev/data/id.json";

async function fetchSource() {
  const res = await fetch(SOURCE_URL);

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }

  return res.json();
}
