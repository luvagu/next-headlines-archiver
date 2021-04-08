require('dotenv').config()

const puppeteer = require('puppeteer')

const faunadb = require('faunadb')
const { Collection, Create, Map, Lambda, Var } = faunadb.query
const client = new faunadb.Client({
	secret: process.env.FAUNA_SECRET,
})

const sanitize = (str) => str.replace(/\s/g, ' ').trim()

const saveEntries = async (entries) => {
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

		return console.log(response)
	} catch (error) {
		console.error(error)
	}
}

const crawler = async (
	provider,
	providerUrl,
	elLink,
	elTitle,
	elImage,
	elHeadLine
) => {
	try {
		console.log(`crawling >>> ${providerUrl}`)

		const browser = await puppeteer.launch({ timeout: 60000 })

		const page = await browser.newPage()

		await page.goto(providerUrl)

		const [elA] = await page.$x(elLink)
		const href = await elA.getProperty('href')
		const headLineUrl = await href.jsonValue()

		const [elH2] = await page.$x(elTitle)
		const txt = await elH2.getProperty('textContent')
		const headLineTitle = sanitize(await txt.jsonValue())

		const [elImg] = await page.$x(elImage)
		const src = await elImg.getProperty('src')
		const headLineImg = await src.jsonValue()

		const [elSpan] = await page.$x(elHeadLine)
		const txt2 = await elSpan.getProperty('textContent')
		const headLineTxt = sanitize(await txt2.jsonValue())

		await browser.close()

        const date = new Date()

		return {
			provider,
			headLineUrl,
			headLineTitle,
			headLineImg,
			headLineTxt,
			headLineTs: date.getTime(),
            headLineUTCDate: date.toUTCString()
		}
	} catch (error) {
		console.error(error)
		return false
	}
}

Promise.all([
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
]).then((news) => saveEntries(news))
