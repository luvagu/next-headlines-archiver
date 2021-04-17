import { Client, query } from 'faunadb'

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
	Select,
	Var,
} = query

export const getLatestNews = async (size = 20) => {
	try {
		const { data } = await client.query(
			FMap(
				Paginate(Match(Index('news_sort_by_ts_provider_desc')), {
					size,
				}),
				Lambda(
					['ts', 'provider', 'ref'],
					Select(['data'], Get(Var('ref')))
				)
			)
		)
		return data
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