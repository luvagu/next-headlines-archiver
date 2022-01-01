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
	.pubsub.schedule('0 */1 * * *') // scheduled to run every 2 hours
	.timeZone('America/New_York')
	.onRun(async context => {
		const headlines = await crawler([
			{
				provider: 'CNN',
				providerUrl: 'https://us.cnn.com/',
				elLink:
					'//*[@id="homepage1-zone-1"]/div[2]/div/div[1]/ul/li[1]/article/a',
				elTitle:
					'//*[@id="homepage1-zone-1"]/div[2]/div/div[1]/ul/li[1]/article/a/h2',
				elImage:
					'//*[@id="homepage1-zone-1"]/div[2]/div/div[1]/ul/li[1]/article/div/div[1]/a/img',
				elHeadLine:
					'//*[@id="homepage1-zone-1"]/div[2]/div/div[1]/ul/li[1]/article/div/div[2]/h3/a/span[2]/strong',
				elVideo: null,
			},
			{
				provider: 'Fox News',
				providerUrl: 'https://www.foxnews.com/',
				elLink:
					'//*[@id="wrapper"]/div/div[2]/div[1]/main/div/div/div[1]/div/article/div[1]/a',
				elTitle:
					'//*[@id="wrapper"]/div/div[2]/div[1]/main/div/div/div[1]/div/article/div[1]/a/div/span',
				elImage:
					'//*[@id="wrapper"]/div/div[2]/div[1]/main/div/div/div[1]/div/article/div[1]/a/picture/img',
				elHeadLine:
					'//*[@id="wrapper"]/div/div[2]/div[1]/main/div/div/div[1]/div/article/div[2]/header/h2/a',
				elVideo: null,
			},
		])

		if (!headlines.length || headlines.some(obj => obj === false)) {
			console.log('Saving data to db aborted due to a false headline value')
			return null
		}

		return await saveData(headlines)
	})
