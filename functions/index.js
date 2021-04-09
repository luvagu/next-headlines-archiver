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
				'CNN',
				'https://us.cnn.com/',
				'//*[@id="homepage1-zone-1"]/div[2]/div/div[1]/ul/li[1]/article/a',
				'//*[@id="homepage1-zone-1"]/div[2]/div/div[1]/ul/li[1]/article/a/h2',
				'//*[@id="homepage1-zone-1"]/div[2]/div/div[1]/ul/li[1]/article/div/div[1]/a/img',
				'//*[@id="homepage1-zone-1"]/div[2]/div/div[1]/ul/li[1]/article/div/div[2]/h3/a/span[2]',
			],
			[
				'Fox News',
				'https://www.foxnews.com/',
				'//*[@id="wrapper"]/div[2]/div[2]/div[1]/main/div/div/div[1]/div/article/div[2]/header/h2/a',
				'//*[@id="wrapper"]/div[2]/div[2]/div[1]/main/div/div/div[1]/div/article/div[1]/a/div/span',
				'//*[@id="wrapper"]/div[2]/div[2]/div[1]/main/div/div/div[1]/div/article/div[1]/a/picture/img',
				'//*[@id="wrapper"]/div[2]/div[2]/div[1]/main/div/div/div[1]/div/article/div[2]/header/h2/a',
			],
		])

		if (!headlines.length || headlines.some((val) => val === false)) {
			console.log('Saving data to db aborted due to a false headline value')
			return null
		}

		return await saveData(headlines)
	})
