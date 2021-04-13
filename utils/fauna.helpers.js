import { Client, query } from 'faunadb'

const client = new Client({ secret: process.env.NEXT_PUBLIC_FAUNA_SECRET })

const { Call, Function: Fn, Index, Map: FMap, Get, Lambda, Match, Paginate, Range, Var } = query

export const getNewsByTsRange = async (from, to) => {
	try {
		const { data } = await client.query(
			// FMap(
			// 	Paginate(Match(Index('all_news'))),
			// 	Lambda('ref', Get(Var('ref')))
			// )
            Call(Fn("getNewsByTsRange"), [from, to])
		)
	
		return data

	} catch (error) {
		console.log('Error: %s', error?.message)
	}
}
