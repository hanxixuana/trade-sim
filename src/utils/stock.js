const secret = 'Bearer 4lZlCeof8gnhup7J8cOb3n9cTd0nXcvF'
const maxTries = 6

function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time))
}

function dateToDateStr(date) {
    return date.toISOString().split('T')[0]
}

/**
 * Get stock names
 * @returns {array}
 */
 export async function getRICsAsync(date) {
    let url
    let tryCount = 0
    let resultsCount = 0
    let response
    let content

    while (!resultsCount && tryCount <= maxTries) {
        console.log(`[getStockSnapshot] Starting to fetch stock names on ${dateToDateStr(date)}`)
        url = `https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/${dateToDateStr(date)}?adjusted=true`
        response = await fetch(
            url, 
            {
                headers: {
                    Authorization: secret
                }
            }
        )
        content = await response.json()
        resultsCount = content.resultsCount
        console.log('[getStockSnapshot] Count of fetched results: ' + resultsCount)
        if (!resultsCount) {
            console.log('[getStockSnapshot] URL: ' + url)
            console.log('[getStockSnapshot] Response: ' + JSON.stringify(content))
            console.log(`[getRICs] got ${resultsCount} RICs on ${dateToDateStr(date)} - will try the prev date`)
            date.setDate(date.getDate() - 1)
            tryCount += 1
            await sleep(1000 + Math.random() * 2000)
        }
    }
    console.log('[getStockSnapshot] Response example: ' + JSON.stringify(content.results[0]))

    let results = new Set()
    content.results.forEach(element => results.add(element.T));
    results = [...results]
    results.sort()
    return results
}

export function getRICsSync(date, callBack) {
    getRICsAsync(date).then(results => callBack(results))
}

/**
 * Get historical closes of a stock
 * @param {string} ric Stock RIC
 * @param {date} startDate Start Date
 * @param {date} endDate End Date
 * @return {array}
 */
export async function getClosesAsync(ric, startDate, endDate) {
    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]
    const url = `https://api.polygon.io/v2/aggs/ticker/${ric}/range/1/day/${startDateStr}/${endDateStr}?adjusted=true&sort=asc&limit=50000`

    console.log('[getPrices] Starting to fetch prices')
    await sleep(1000 + Math.random() * 2000)
    const response = await fetch(
        url, 
        {
            headers: {
                Authorization: secret
            }
        }
    )
    const content = await response.json()
    
    console.log('[getPrices] Count of fetched results: ' + content.resultsCount)
    console.log('[getPrices] Example: ' + JSON.stringify(content.results[0]))

    const results = []
    content.results.forEach(
        element => {
            let date = new Date(0)
            date.setUTCMilliseconds(element.t)
            results.push(
                {
                    date: dateToDateStr(date),
                    close: element.c
                }
            )
        }
    );
    return results
}

export function getClosesSync(ric, startDate, endDate, callBack) {
    getClosesAsync(ric, startDate, endDate).then(results => callBack(results))
}