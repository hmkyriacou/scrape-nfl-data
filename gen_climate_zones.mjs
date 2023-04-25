import fs from "fs/promises";
import fetch from "node-fetch";
import { parse } from "csv-parse/sync";

async function main() {
  let climate_txt = await fs.readFile("./KoeppenGeiger.UScounty.txt", {
    encoding: "utf8",
  });

  let records = parse(climate_txt, {
    columns: true,
    delimiter: "\t",
    trim: true,
    record_delimiter: "\n",
  });

  const duplicates = Object.values(
    records.reduce((acc, obj, index) => {
      acc[`${obj.COUNTY}+${obj.STATE}`] =
        acc[`${obj.COUNTY}+${obj.STATE}`] || [];
      acc[`${obj.COUNTY}+${obj.STATE}`].push(index);
      return acc;
    }, [])
  );

  let newArr = duplicates
    .filter((indices) => indices.length === 1)
    .map((e) => records[e[0]]);

  duplicates
    .filter((indices) => indices.length > 1)
    .forEach((arr) => {
      const maxObj = arr.reduce((prev, current) => {
        return records[prev].PROP > records[current].PROP ? prev : current;
      });

      newArr.push(records[maxObj]);
    });

  console.log(newArr.length);

  //fs.writeFile("koppen_climate_data.json", JSON.stringify(newArr), "utf8");
}

main();
