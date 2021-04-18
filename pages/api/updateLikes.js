import { updateDocLikes } from '../../utils/fauna.helpers'

export default async function handler(req, res) {
	// const { user } = getSession(req, res)

	if (req.method !== 'PUT') {
		return res.status(405).json({ msg: 'Method not allowed' })
	}

	const { ref, userId } = req.body

	try {
		const updatedLikes = await updateDocLikes(ref, userId)
		return res.status(200).json(updatedLikes)
	} catch (err) {
		console.log('Error: %s', error?.message)
		res.status(500).json({ msg: 'Something went wrong.' })
	}
}
