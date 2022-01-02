import { Fragment, useEffect, useState } from 'react'
import { getNewsByProvider } from '../../utils/fauna.helpers'
import { useRouter } from 'next/router'
import { useObserveLastElement } from '../../hooks/useObserver'

import MessageBallon from '../../components/MessageBallon'
import Metatags from '../../components/Metatags'
import PageContainer from '../../components/PageContainer'
import SinglesTimeline from '../../components/SinglesTimeline'
import LoadMorePages from '../../components/LoadMorePages'

const slugToDbName = {
	cnn: 'CNN',
	'fox-news': 'Fox News',
}

export default function TimelineProvider({ after, results }) {
	const { query } = useRouter()

	const [isLoading, setIsLoading] = useState(false)
	const [cardsData, setCardsData] = useState(null)
	const [nextPage, setNextPage] = useState(null)

	const hasResults = cardsData && cardsData.length ? true : false

	// Effect nedded to re-render component when
	// the dynamic route changes and new data is received
	useEffect(() => {
		setCardsData(results)
		setNextPage(after)
	}, [query.provider])

	const getNextPage = async e => {
		setIsLoading(true)
		try {
			const { after, cardsData: results } = await getNewsByProvider(
				slugToDbName[query.provider],
				nextPage
			)
			setCardsData([...cardsData, ...results])
			setNextPage(after)
		} catch (error) {
			console.log('Error: %s', error?.message)
		}
		setIsLoading(false)
	}

	const lastElement = useObserveLastElement(isLoading, nextPage, getNextPage)

	return (
		<PageContainer withTimeline={hasResults}>
			<Metatags
				title={
					hasResults
						? `${slugToDbName[query.provider]} | Timeline`
						: 'Provider not found'
				}
				description={`News headlines archives of ${
					slugToDbName[query.provider]
				} network news provider`}
			/>

			<MessageBallon>
				{hasResults ? (
					<Fragment>
						<span className='text-yellow-400'>
							{slugToDbName[query.provider]}
						</span>{' '}
						timeline
					</Fragment>
				) : (
					'Provider not found'
				)}
			</MessageBallon>

			{hasResults && (
				<Fragment>
					{cardsData.map((cardData, idx) => (
						<SinglesTimeline
							key={cardData.ref}
							ref={lastElement}
							cardData={cardData}
							idx={idx}
						/>
					))}
					<LoadMorePages nextPage={nextPage} />
				</Fragment>
			)}
		</PageContainer>
	)
}

export const getStaticPaths = async () => {
	// Return a list of possible values of news providers in the following shape
	// [
	//     { params: { id: 'ssg-ssr' } },
	// ]
	const paths = Object.keys(slugToDbName).map(provider => ({
		params: { provider },
	}))

	return {
		paths,
		fallback: false,
	}
}

export const getStaticProps = async ({ params }) => {
	try {
		const { after, cardsData: results } = await getNewsByProvider(
			slugToDbName[params.provider]
		)

		return {
			props: { after, results },
			revalidate: 1,
		}
	} catch (error) {
		console.log('Error: %s', error?.message)
		return {
			notFound: true,
		}
	}
}
