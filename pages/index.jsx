import { useState } from 'react'
import { getLatestNews } from '../utils/fauna.helpers'
import HomeTimeline from '../components/HomeTimeline'
import PageContainer from '../components/PageContainer'
import Metatags from '../components/Metatags'
import LoadMorePages from '../components/LoadMorePages'

// HomeTimeline component accepts data in the following shape:
// [ {cardDataLeft}, {cardDataRight}, timestamp ]
// Transform cardsData to be compatible with HomeTimeline
const transformCardsData = (cardsData) =>
	cardsData.reduce((acc, cv, idx, source) => {
		if (idx % 2 === 0) {
			const pairs = source.slice(idx, idx + 2)
			const timestamp = pairs[0].headLineTs
			acc.push([...pairs, timestamp])
		}
		return acc
	}, [])

export const getStaticProps = async () => {
	try {
		const { after, cardsData } = await getLatestNews()
		const cardsDataPairs = transformCardsData(cardsData)

		return {
			props: {
				after,
				cardsData: cardsDataPairs,
			},
			revalidate: 60,
		}
	} catch (error) {
		console.log('Error: %s', error?.message)
		return {
			notFound: true,
		}
	}
}

function Home({ after, cardsData }) {
	const [isLoading, setIsLoading] = useState(false)
	const [cardsDataPairs, setCardsDataPairs] = useState(cardsData)
	const [nextPage, setNextPage] = useState(after)

	const getNextPage = async (e) => {
		setIsLoading(true)
		try {
			const { after, cardsData } = await getLatestNews(10, nextPage)
			setCardsDataPairs([
				...cardsDataPairs,
				...transformCardsData(cardsData),
			])
			setNextPage(after)
		} catch (error) {
			console.log('Error: %s', error?.message)
		}
		setIsLoading(false)
	}

	return (
		<PageContainer withTimeline>
			<Metatags />

			{cardsDataPairs &&
				cardsDataPairs.map((cardsDataPair) => (
					<HomeTimeline
						key={cardsDataPair[2]}
						cardsDataPair={cardsDataPair}
					/>
				))}

			<LoadMorePages
				nextPage={nextPage}
				isLoading={isLoading}
				onClickHandle={getNextPage}
			/>
		</PageContainer>
	)
}

export default Home
