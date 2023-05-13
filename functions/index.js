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
					'/html/body/div[1]/section[3]/section/div/section/div/div/div/div[2]/div/div[1]/div[1]/div/div[2]/div/div[2]/a',
				elTitle:
					'/html/body/div[1]/section[3]/section/div/section/div/div/div/div[2]/div/div[1]/div[1]/div/div[2]/div/div[2]/a/h2',
				elImage:
					'/html/body/div[1]/section[3]/section/div/section/div/div/div/div[2]/div/div[1]/div[1]/div/div[2]/div/div[3]/div/div/div[1]/a[1]/div/div/div/div[1]/picture/img',
				elHeadLine:
					'/html/body/div[1]/section[3]/section/div/section/div/div/div/div[2]/div/div[1]/div[1]/div/div[2]/div/div[3]/div/div/div[1]/a[2]/div/div/span',
				elVideo: null,
				elPicture:
					'/html/body/div[1]/section[3]/section/div/section/div/div/div/div[2]/div/div[1]/div[1]/div/div[2]/div/div[3]/div/div/div[1]/a[1]/div/div/div/div[1]/picture',
			},
			{
				provider: 'Fox News',
				providerUrl: 'https://www.foxnews.com/',
				elLink:
					'//*[@id="wrapper"]/div[2]/div[2]/main/div[1]/div/article/div[1]/a',
				elTitle:
					'//*[@id="wrapper"]/div[2]/div[2]/main/div[1]/div/article/div[1]/a/div/span',
				elImage:
					'//*[@id="wrapper"]/div[2]/div[2]/main/div[1]/div/article/div[1]/a/picture/img',
				elHeadLine:
					'//*[@id="wrapper"]/div[2]/div[2]/main/div[1]/div/article/div[2]/header/h3/a',
				elVideo: null,
				elPicture:
					'//*[@id="wrapper"]/div[2]/div[2]/main/div[1]/div/article/div[1]/a/picture',
			},
		])

		if (!headlines.length || headlines.some(obj => obj === false)) {
			console.log('Saving data to db aborted due to a false headline value')
			return null
		}

		return await saveData(headlines)
	})
