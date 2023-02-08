const fs = require('fs/promises')

const years = [2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010]

async function main() {
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
    console.log(yearToStart, weekToStart)

    let years_ = years.filter((v) => {
        if (v > yearToStart) {
            return false
        } else {
            return true
        }
    })

    //console.log(curDataObj[yearToStart])
}

main()