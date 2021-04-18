import { updateDocLikes } from '../../utils/fauna.helpers'

export default async function handler(req, res) {
	const { ref, userId } = req.body

	if (req.method !== 'PUT') {
		return res.status(405).json({ message: 'Method not allowed' })
	}

	try {
		const updatedLikes = await updateDocLikes(ref, userId)
		return res.status(200).json(updatedLikes)
	} catch (err) {
		console.log('Error: %s', error?.message)
		res.status(500).json({ message: 'Something went wrong.' })
	}
}
