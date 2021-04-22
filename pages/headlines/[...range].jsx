import { getNewsByTsRange } from '../../utils/fauna.helpers'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import PageContainer from '../../components/PageContainer'
import Metatags from '../../components/Metatags'
import MessageBallon from '../../components/MessageBallon'
import PairsTimeline from '../../components/PairsTimeline'
import LoadMorePages from '../../components/LoadMorePages'

// PairsTimeline component accepts data in the following shape:
// [ {cardDataLeft}, {cardDataRight}, timestamp ]
// Transform cardsData to be compatible with PairsTimeline
const transformCardsData = (cardsData) =>
	cardsData.reduce((acc, cv, idx, source) => {
		if (idx % 2 === 0) {
			const pairs = source.slice(idx, idx + 2)
			const timestamp = pairs[0].headLineTs
			acc.push([...pairs, timestamp])
		}
		return acc
	}, [])

export const getServerSideProps = async (context) => {
    try {
		const [, from, , to] = context.query.range
		const fromTs = Date.parse(`${from} 00:00`)
		const toTs = Date.parse(`${to} 23:59`)

        const { after, cardsData } = await getNewsByTsRange(fromTs, toTs, null, null)

		const cardsDataPairs = transformCardsData(cardsData)
    
        return {
            props: { 
				fromTs,
				toTs,
				after, 
				cardsData: cardsDataPairs
			}
        }
    } catch (error) {
        console.log('Error: %s', error?.message)
		return {
			notFound: true,
		}
    }
}

function HeadlinesByDate({ fromTs, toTs, after, cardsData }) {
	const { query } = useRouter()
	const [, from, , to] = query.range

	const [isLoading, setIsLoading] = useState(false)
	const [cardsDataPairs, setCardsDataPairs] = useState(null)
	const [nextPage, setNextPage] = useState(null)

	const haveResults = cardsDataPairs && cardsDataPairs.length ? true : false

	useEffect(() => {
		setCardsDataPairs(cardsData)
		setNextPage(after)
	}, [query.range])

	const getNextPage = async (e) => {
		setIsLoading(true)
		try {
			const { after, cardsData } = await getNewsByTsRange(fromTs, toTs, null, nextPage)
			setCardsDataPairs([ ...cardsDataPairs, ...transformCardsData(cardsData) ])
			setNextPage(after)
		} catch (error) {
			console.log('Error: %s', error?.message)
		}
		setIsLoading(false)
	}

	return (
		<PageContainer withTimeline={haveResults}>
			<Metatags title={`Headlines from ${from} to ${to}`} />

			<MessageBallon>
				{haveResults ? 'Headlines' : 'No headlines found'} {' '}
				from <span className="text-yellow-400">{from}</span> {' '}
				to <span className="text-yellow-400">{to}</span>
			</MessageBallon>

			{haveResults &&
				cardsDataPairs.map((cardsDataPair) => (
					<PairsTimeline
						key={cardsDataPair[2]}
						cardsDataPair={cardsDataPair}
						flip
					/>
				))}

			{haveResults && 
				<LoadMorePages
					nextPage={nextPage}
					isLoading={isLoading}
					onClickHandle={getNextPage}
				/>
			}
		</PageContainer>
	)
}

export default HeadlinesByDate
