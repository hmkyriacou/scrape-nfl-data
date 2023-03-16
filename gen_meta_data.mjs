import fs from 'fs/promises'
import fetch from 'node-fetch'
import { parse } from "csv-parse/sync"

async function main() {
    let newObj = {}
    
    let image_data = await fs.readFile("./image-data.json", {encoding: 'utf8'})

    let imageObj = JSON.parse(image_data)

    for (let key in imageObj) {

        newObj[key] = {}
        newObj[key].img = imageObj[key]

        let coords = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(key)}&key=AIzaSyAflS3z5O4jDI8jKrgt-JLzIO1EYawkZ6g`).then(res => res.json())
        let coordsObj 
        console.log(key)
        try {
            coordsObj = coords.results[0].geometry.location
        } catch (e) {
            coords = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(key.substring(0, key.lastIndexOf(" ")))}&key=AIzaSyAflS3z5O4jDI8jKrgt-JLzIO1EYawkZ6g`).then(res => res.json())
            coordsObj = coords.results[0].geometry.location
        }
        console.log(coordsObj)

        newObj[key].location = coordsObj
    }

    fs.writeFile('meta-data.json', JSON.stringify(newObj), 'utf8')
}

main()
