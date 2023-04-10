import fs from "fs/promises";
import fetch from "node-fetch";
import { parse } from "csv-parse/sync";

async function main() {
  let cur_meta_data = await fs.readFile("./meta-data.json", {
    encoding: "utf8",
  });

  cur_meta_data = JSON.parse(cur_meta_data);

  let rawText = await fs.readFile("./nfl_stad_coords.csv", {
    encoding: "utf8",
  });

  const records = parse(rawText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    record_delimiter: "\n",
  });

  for (const r of records) {
    const k = Object.keys(cur_meta_data).find((e) => e.includes(r.Team));
    cur_meta_data[k].location.lat = r.latitude;
    cur_meta_data[k].location.lng = r.longitude;
  }

  console.log(cur_meta_data);

  fs.writeFile("meta-data.json", JSON.stringify(cur_meta_data), "utf8");
}

main();
