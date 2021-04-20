import { searhNews } from "../../utils/fauna.helpers"

export default async function handler(req, res) {
    const searchTerms = req.body.terms

	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' })
	}

	try {
		const results = await searhNews(searchTerms)
		return res.status(200).json(results)
	} catch (err) {
		console.log('Error: %s', error?.message)
		res.status(500).json({ message: 'Something went wrong.' })
	}
}
