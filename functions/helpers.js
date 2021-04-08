require('dotenv').config()

const chromium = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')
const faunadb = require('faunadb')

const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET })

const { Collection, Create, Map, Lambda, Var } = faunadb.query

const removeWhitespace = (str) => str.replace(/\s/g, ' ').trim()

const crawler = async (sitesArr) => {
	try {
		const data = []

		const browser = await puppeteer.launch({ 
			timeout: 60000,
			args: chromium.args,
			defaultViewport: chromium.defaultViewport,
			executablePath: await chromium.executablePath,
			headless: chromium.headless,
		})

		for (const site of sitesArr) {
			const [provider, providerUrl, elLink, elTitle, elImage, elHeadLine] = site

			console.log(`crawling >>> ${provider} at ${providerUrl}`)

			const page = await browser.newPage()

			await page.goto(providerUrl)

			const [elA] = await page.$x(elLink)
			const href = await elA.getProperty('href')
			const headLineUrl = await href.jsonValue()

			const [elH2] = await page.$x(elTitle)
			const txt = await elH2.getProperty('textContent')
			const headLineTitle = removeWhitespace(await txt.jsonValue())

			const [elImg] = await page.$x(elImage)
			const src = await elImg.getProperty('src')
			const headLineImg = await src.jsonValue()

			const [elSpan] = await page.$x(elHeadLine)
			const txt2 = await elSpan.getProperty('textContent')
			const headLineTxt = removeWhitespace(await txt2.jsonValue())

			await page.close()

			const date = new Date()

			data.push({
				provider,
				headLineUrl,
				headLineTitle,
				headLineImg,
				headLineTxt,
				headLineTs: date.getTime(),
				headLineUTCDate: date.toUTCString(),
			})
		}

		await browser.close()

		console.log('data >>>', data)
		return data
	} catch (error) {
		console.error(error)
		return false
	}
}

const saveData = async (entries) => {
	try {
		const response = await client.query(
			Map(
				[...entries],
				Lambda(
					'data',
					Create(Collection('news'), { data: Var('data') })
				)
			)
		)

		console.log('faunadb response >>>', response)
		return response
	} catch (error) {
		console.error(error)
		return null
	}
}

module.exports = { crawler, saveData }

// async function test() {
// 	const news = await crawler([
// 		[	
// 			'CNN',
// 			'https://us.cnn.com/',
// 			'//*[@id="homepage1-zone-1"]/div[2]/div/div[1]/ul/li[1]/article/a',
// 			'//*[@id="homepage1-zone-1"]/div[2]/div/div[1]/ul/li[1]/article/a/h2',
// 			'//*[@id="homepage1-zone-1"]/div[2]/div/div[1]/ul/li[1]/article/div/div[1]/a/img',
// 			'//*[@id="homepage1-zone-1"]/div[2]/div/div[1]/ul/li[1]/article/div/div[2]/h3/a/span[2]/strong'
// 		],
// 		[
// 			'Fox News',
// 			'https://www.foxnews.com/',
// 			'//*[@id="wrapper"]/div[2]/div[2]/div[1]/main/div/div/div[1]/div/article/div[2]/header/h2/a',
// 			'//*[@id="wrapper"]/div[2]/div[2]/div[1]/main/div/div/div[1]/div/article/div[1]/a/div/span',
// 			'//*[@id="wrapper"]/div[2]/div[2]/div[1]/main/div/div/div[1]/div/article/div[1]/a/picture/img',
// 			'//*[@id="wrapper"]/div[2]/div[2]/div[1]/main/div/div/div[1]/div/article/div[2]/header/h2/a'
// 		]
// 	])

// 	if (!news.length || news.some((val) => val === false)) return null

// 	return await saveEntries(news)
// }
// test()
