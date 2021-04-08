const functions = require("firebase-functions")
const { crawler, saveEntries } = require('./helpers')

exports.scheduledCrawler = functions.pubsub.schedule('every 8 hours').timeZone('America/New_York').onRun(async () => {
    const news = await Promise.all([
        crawler(
            'CNN',
            'https://us.cnn.com/',
            '//*[@id="homepage1-zone-1"]/div[2]/div/div[1]/ul/li[1]/article/a',
            '//*[@id="homepage1-zone-1"]/div[2]/div/div[1]/ul/li[1]/article/a/h2',
            '//*[@id="homepage1-zone-1"]/div[2]/div/div[1]/ul/li[1]/article/div/div[1]/a/img',
            '//*[@id="homepage1-zone-1"]/div[2]/div/div[1]/ul/li[1]/article/div/div[2]/h3/a/span[2]/strong'
        ),
        crawler(
            'Fox News',
            'https://www.foxnews.com/',
            '//*[@id="wrapper"]/div[2]/div[2]/div[1]/main/div/div/div[1]/div/article/div[2]/header/h2/a',
            '//*[@id="wrapper"]/div[2]/div[2]/div[1]/main/div/div/div[1]/div/article/div[1]/a/div/span',
            '//*[@id="wrapper"]/div[2]/div[2]/div[1]/main/div/div/div[1]/div/article/div[1]/a/picture/img',
            '//*[@id="wrapper"]/div[2]/div[2]/div[1]/main/div/div/div[1]/div/article/div[2]/header/h2/a'
        ),
    ])

    if (!news.length || news.some(val => val === false)) return null

    return await saveEntries(news)
})
