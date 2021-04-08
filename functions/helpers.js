require('dotenv').config()
const puppeteer = require('puppeteer')
const faunadb = require('faunadb')

const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET })

const { Collection, Create, Map, Lambda, Var } = faunadb.query

const sanitize = (str) => str.replace(/\s/g, ' ').trim()

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
		return null
	}
}

module.exports = { crawler, saveEntries }