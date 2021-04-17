import { updateDocLikes } from '../../utils/fauna.helpers'

export default async function handler(req, res) {
	// const session = getSession(req, res)
	// const userId = session.user.sub

	if (req.method !== 'PUT') {
		return res.status(405).json({ msg: 'Method not allowed' })
	}

	const { ref, likes, userId } = req.body

	try {
		const { data } = await updateDocLikes(ref, likes)
		return res.status(200).json(data.likes)
	} catch (err) {
		console.log('Error: %s', error?.message)
		res.status(500).json({ msg: 'Something went wrong.' })
	}
}