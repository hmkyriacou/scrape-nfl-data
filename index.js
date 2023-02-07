const cheerio = require('cheerio')
const fs = require('fs/promises')

const years = [2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010]

// ** data structure
// *  JSON -
// {
//     year: {
//         week_num : {
//             away_home : {
//                 winner: "home" or "away",
//                 home_score:
//                 away_score:
//                 date:
//             }
//         }
//     }
// }

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function main() {

    // Read in data and determine what year/week to start at
    let curData = await fs.readFile("./data.json", { encoding: 'utf8' })

    let curDataObj = JSON.parse(curData)

    let yearToStart = 'DONE'
    let weekToStart = 'DONE'

    //console.log(Object.keys(curDataObj[2021])[Object.keys(curDataObj[2021]).length - 1])

    for (const year in curDataObj) {
        let lastWeekDefined = Object.keys(curDataObj[year])[Object.keys(curDataObj[year]).length - 1]
        if (lastWeekDefined === undefined) {
            yearToStart = year
            continue
        } else if (Object.keys(curDataObj[year][lastWeekDefined]).length === 0) {
            yearToStart = year
            for (let i = Object.keys(curDataObj[year]).length - 1; i > 0; i--) {
                if (Object.keys(curDataObj[year][i]).length === 0) {
                    //console.log(year, i, Object.keys(curDataObj[year][i]).length)
                    continue
                } else {
                    weekToStart = i + 1
                    break
                }
            }
            break
        }
    }

    if (yearToStart === 'DONE') {
        console.log("All done")
        return
    }

    let yearsToDo = years.filter((v) => {
        if (v > yearToStart) {
            return false
        } else {
            return true
        }
    })

    let data = curDataObj //if starting new, {}

    for (const year of yearsToDo) {
        let url = `https://www.pro-football-reference.com/years/${year}`
        //console.log(url)
        let html = await fetch(url).then(d => d.text())
        //let html = await fs.readFile("./week_1.htm", { encoding: 'utf8' })


        let $ = cheerio.load(html)
        //console.log($.html())
        //console.log($(".game_summaries").children().length)
        let weeks_this_yr = $(".condensed > div:nth-child(2) > ul:nth-child(8)").children().length

        let year_data = {}

        let startWeek = 1

        if (year == yearToStart) {
            if (weekToStart !== 'DONE') {
                startWeek = weekToStart
            }
        }

        for (let week_num = startWeek; week_num <= weeks_this_yr; week_num++) {

            console.log(`Starting week ${week_num}, ${year}`)
            //await sleep(1000)

            url = `https://www.pro-football-reference.com/years/${year}/week_${week_num}.htm`
            html = await fetch(url).then(d => d.text())
            //html = await fs.readFile("./week_1.htm", { encoding: 'utf8' })


            $ = cheerio.load(html)

            let week_data = {}

            //console.log($(".game_summaries").children().length)

            for (let game_num = 1; game_num <= $(".game_summaries").children().length; game_num++) {

                let game_data = {}

                // Date
                let date = $(`div.game_summary:nth-child(${game_num}) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)`).text()
                // Away
                let away = $(`div.game_summary:nth-child(${game_num}) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > a:nth-child(1)`).text()
                // Away Score
                let away_score = $(`div.game_summary:nth-child(${game_num}) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)`).text()
                // Home
                let home = $(`div.game_summary:nth-child(${game_num}) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1)`).text()
                // Home Score
                let home_score = $(`div.game_summary:nth-child(${game_num}) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2)`).text()

                game_data = {
                    date,
                    away_score,
                    home_score
                }
                week_data[`${away}_${home}`] = game_data
            }
            year_data[week_num] = week_data

        }
        data[year] = year_data
    }

    fs.writeFile('data_updated.json', JSON.stringify(data), 'utf8')

    //console.log(data)
}

main()