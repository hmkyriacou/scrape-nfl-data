import fs from 'fs/promises'
import fetch from 'node-fetch'
import { parse } from "csv-parse/sync"

async function main() {
    
    let cur_meta_data = await fs.readFile("./meta-data.json", {encoding: 'utf8'})

    cur_meta_data = JSON.parse(cur_meta_data)

    console.log(cur_meta_data)

    for (let key in cur_meta_data) {

        
        
    }

    //fs.writeFile('meta-data.json', JSON.stringify(newObj), 'utf8')
}

main()
