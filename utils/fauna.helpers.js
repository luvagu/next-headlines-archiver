import { Client, query } from 'faunadb'
import { parseJSON, toJSON } from 'faunadb/src/_json'

const client = new Client({ secret: process.env.NEXT_PUBLIC_FAUNA_SECRET })

const {
	Call,
	Function: Fn,
	Index,
	Map: FMap,
	Get,
	Lambda,
	Match,
	Paginate,
	Var,
} = query

export const getLatestNews = async (size = 20, nextPage = false) => {
	try {
		const { after = false, data } = await client.query(
			FMap(
				Paginate(Match(Index('news_sort_by_ts_provider_desc')), {
					size,
					...(nextPage && { after: parseJSON(nextPage) })
				}),
				Lambda(
					['ts', 'provider', 'ref'],
					// Select(['data'], Get(Var('ref')))
					Get(Var('ref'))
				)
			)
		)

		// Add doc ref to the doc data
		const cardsData = data.map((doc) => ({ ...doc.data, ref: doc.ref.id }))

		return { after: after ? toJSON(after) : false, cardsData }
	} catch (error) {
		console.log('Error: %s', error?.message)
	}
}

export const getNewsByTsRange = async (
	from,
	to,
	before = null,
	after = null
) => {
	try {
		// const paginateOptions = {
		// 	size: 4,
		// 	...(before && { before }),
		// 	...(after && { after }),
		// }

		const size = 10

		return await client.query(
			Call(Fn('getNewsByTsRange'), [from, to, size, before, after])
		)
	} catch (error) {
		console.log('Error: %s', error?.message)
	}
}

export const updateDocLikes = async (ref, userId) => {
	try {
		return await client.query(Call(Fn('updateLikesCount'), [ref, userId]))
	} catch (error) {
		console.log('Error: %s', error?.message)
	}
}

export const searhNews = async (terms) => {
	try {
		// Must pass a regex pattern in this form (term1|term2|term3|...)
		const searchRegx = `(${terms.trim().split(' ').join('|')})`
		const { data } = await client.query(Call(Fn('searchNews'), searchRegx))

		// Add doc ref to the doc data
		const cardsData = data.map((doc) => ({ ...doc.data, ref: doc.ref.id }))

		return cardsData
	} catch (error) {
		console.log('Error: %s', error?.message)
	}
}
