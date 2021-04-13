'use strict'

require('dotenv').config()

const chromium = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')
const faunadb = require('faunadb')

const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET })

const { Collection, Create, Map: FMap, Lambda, Var } = faunadb.query

const removeWhitespace = (str) => str.replace(/\s/g, ' ').trim()

const crawler = async (sitesArr) => {
	try {
		const data = []

		// To test browser locally, install full version of puppeteer and remove the launch() options
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

		console.log('crawler data.length >>>', data.length)
		return data
	} catch (error) {
		console.error('crawler error >>>', error?.message)
		return false
	}
}

const saveData = async (entries) => {
	try {
		const response = await client.query(
			FMap(
				[...entries],
				Lambda(
					'data',
					Create(Collection('news'), { data: Var('data') })
				)
			)
		)

		console.log('saveData response.length >>>', response.length)
		return response
	} catch (error) {
		console.error('saveData error >>>', error?.message)
		return false
	}
}

module.exports = { crawler, saveData }
