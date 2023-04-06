import fs from 'fs/promises'
import fetch from 'node-fetch'
import { parse } from "csv-parse/sync"

const stations = [
    "USW00013874",
    "USW00093721",
    "USW00014739",
    "USW00014733",
    "USW00013881",
    "USC00111577",
    "USW00093814",
    "USW00014820",
    "USW00003927",
    "USW00023062",
    "USW00094847",
    "USW00014898",
    "USC00283704",
    "USW00012960",
    "USW00093819",
    "USW00013889",
    "USW00003947",
    "USC00264439",
    "USW00092811",
    "USW00014922",
    "USW00013897",
    "USW00012916",
    "USW00013739",
    "USW00094823",
    "USW00023234",
    "USW00094290",
    "USW00012842",
    "USC00028499",
    "USC00049152",
    "USW00013743"
]

async function main() {

    const base_url = "https://www.ncei.noaa.gov/data/normals-monthly/2006-2020/access/"

    //let rawText = await fs.readFile('./USC00028499.csv', { encoding: 'utf8' })

    let newObj = {}

    for (let station of stations) {
        let rawText = await fetch(base_url + station + ".csv").then(d => d.text())

        const records = parse(rawText, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            record_delimiter: '\n'
        })

        for (let r of records) {
            let newR = {}
            newR['STATION'] = r.STATION
            newR['MONTH'] = +r.DATE
            newR['NAME'] = r.NAME
            newR['MLY-AVG-TEMP'] = +r['MLY-TAVG-NORMAL']
            newR['MLY-TMIN-NORMAL'] = +r['MLY-TMIN-NORMAL']
            newR['MLY-TMAX-NORMAL'] = +r['MLY-TMAX-NORMAL']
            newR['MLY-PRCP-NORMAL'] = +r['MLY-PRCP-NORMAL']
            newR['MLY-SNOW-NORMAL'] = +r['MLY-SNOW-NORMAL']
            newObj[newR['STATION']] ?
                newObj[newR['STATION']].push(newR) :
                newObj[newR['STATION']] = [newR]

        }
    }

    fs.writeFile('weather_data.json', JSON.stringify(newObj), 'utf8')
    //console.log(newObj)

}

main()