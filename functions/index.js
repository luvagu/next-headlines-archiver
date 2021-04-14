'use strict'

const functions = require('firebase-functions')

const { crawler, saveData } = require('./helpers')

const options = {
	memory: '1GB',
	timeoutSeconds: 300,
}

exports.scheduledCrawler = functions
	.runWith(options)
	.region('us-east1')
	.pubsub
    .schedule('0 */4 * * *')
	.timeZone('America/New_York')
	.onRun(async (context) => {
		const headlines = await crawler([
			[
				'CNN', // provider
				'https://us.cnn.com/', // providerUrl
				'//*[@id="homepage1-zone-1"]/div[2]/div/div[1]/ul/li[1]/article/a', // elLink
				'//*[@id="homepage1-zone-1"]/div[2]/div/div[1]/ul/li[1]/article/a/h2', // elTitle
				'//*[@id="homepage1-zone-1"]/div[2]/div/div[1]/ul/li[1]/article/div/div[1]/a/img', // elImage
				'//*[@id="homepage1-zone-1"]/div[2]/div/div[1]/ul/li[1]/article/div/div[2]/h3/a/span[2]', // elHeadLine
			],
			[
				'Fox News', // provider
				'https://www.foxnews.com/', // providerUrl
				'//*[@id="wrapper"]/div[2]/div[2]/div[1]/main/div/div/div[1]/div/article/div[2]/header/h2/a', // elLink
				'//*[@id="wrapper"]/div[2]/div[2]/div[1]/main/div/div/div[1]/div/article/div[1]/a/div/span', // elTitle
				'//*[@id="wrapper"]/div/div[2]/div[1]/main/div/div/div[1]/div/article/div[1]/a/span/picture[2]/img', // elImage
				'//*[@id="wrapper"]/div[2]/div[2]/div[1]/main/div/div/div[1]/div/article/div[2]/header/h2/a', // elHeadLine
			],
		])

		if (!headlines.length || headlines.some((obj) => obj === false)) {
			console.log('Saving data to db aborted due to a false headline value')
			return null
		}

		return await saveData(headlines)
	})
