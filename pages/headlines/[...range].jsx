import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { getNewsByTsRange } from '../../utils/fauna.helpers'
import { transformCardsData } from '../../utils/app.helpers'
import { useObserveLastElement } from '../../hooks/useObserver'

import PageContainer from '../../components/PageContainer'
import Metatags from '../../components/Metatags'
import MessageBallon from '../../components/MessageBallon'
import PairsTimeline from '../../components/PairsTimeline'
import LoadMorePages from '../../components/LoadMorePages'

export default function HeadlinesByDate({ fromTs, toTs, after, cardsData }) {
	const { query } = useRouter()
	const [, from, , to] = query.range

	const [isLoading, setIsLoading] = useState(false)
	const [cardsDataPairs, setCardsDataPairs] = useState(null)
	const [nextPage, setNextPage] = useState(null)

	const hasResults = cardsDataPairs && cardsDataPairs.length ? true : false

	// Effect nedded to reload component when
	// the dynamic route changes and new data is received
	useEffect(() => {
		setCardsDataPairs(cardsData)
		setNextPage(after)
	}, [query.range])

	const getNextPage = async e => {
		setIsLoading(true)
		try {
			const { after, cardsData } = await getNewsByTsRange(
				fromTs,
				toTs,
				null,
				nextPage
			)
			setCardsDataPairs([...cardsDataPairs, ...transformCardsData(cardsData)])
			setNextPage(after)
		} catch (error) {
			console.log('Error: %s', error?.message)
		}
		setIsLoading(false)
	}

	const lastPairElement = useObserveLastElement(
		isLoading,
		nextPage,
		getNextPage
	)

	return (
		<PageContainer withTimeline={hasResults}>
			<Metatags
				title={
					hasResults ? `Headlines from ${from} to ${to}` : 'No headlines found'
				}
			/>

			<MessageBallon>
				{hasResults ? 'Headlines' : 'No headlines found'} from{' '}
				<span className='text-yellow-400'>{from}</span> to{' '}
				<span className='text-yellow-400'>{to}</span>
			</MessageBallon>

			{hasResults &&
				cardsDataPairs.map((cardsDataPair, idx) => (
					<PairsTimeline
						ref={idx === cardsDataPairs.length - 1 ? lastPairElement : null}
						key={cardsDataPair[2]}
						cardsDataPair={cardsDataPair}
						flip
					/>
				))}

			{hasResults && (
				<LoadMorePages
					nextPage={nextPage}
					isLoading={isLoading}
					onClickHandle={getNextPage}
				/>
			)}
		</PageContainer>
	)
}

export const getServerSideProps = async context => {
	try {
		const [, from, , to] = context.query.range
		const fromTs = Date.parse(`${from} 00:00`)
		const toTs = Date.parse(`${to} 23:59`)

		const { after, cardsData } = await getNewsByTsRange(
			fromTs,
			toTs,
			null,
			null
		)

		const cardsDataPairs = transformCardsData(cardsData)

		return {
			props: {
				fromTs,
				toTs,
				after,
				cardsData: cardsDataPairs,
			},
		}
	} catch (error) {
		console.log('Error: %s', error?.message)
		return {
			notFound: true,
		}
	}
}
