import { useState } from 'react'
import { getLatestNews } from '../utils/fauna.helpers'
import TimelineCards from '../components/TimelineCards'
import PageContainer from '../components/PageContainer'
import Metatags from '../components/Metatags'
import LoadMorePages from '../components/LoadMorePages'

// TimelineCards component accepts data in the following shape:
// [ {cardDataLeft}, {cardDataRight}, timestamp ]
// Transform cardsData to be compatible with TimelineCards
const transformCardsData = (cardsData) => cardsData.reduce((acc, cv, idx, source) => {
	if (idx % 2 === 0) {
		const pairs = source.slice(idx, idx + 2)
		const timestamp = pairs[0].headLineTs
		acc.push([...pairs, timestamp])
	}
	return acc
}, [])

export const getStaticProps = async () => {
	const { after, cardsData } = await getLatestNews()
	const cardsDataPairs = transformCardsData(cardsData)
	
	return {
		props: {
			after,
			cardsData: cardsDataPairs,
		},
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
			setCardsDataPairs([ ...cardsDataPairs, ...transformCardsData(cardsData) ])
			setNextPage(after)
		} catch (error) {
			console.log('Error: %s', error?.message)
		}
		setIsLoading(false)
	} 

	return (
		<PageContainer>
			<Metatags />
			{/* timeline middle vertical line */}
			<div className="border-2 absolute border-opacity-50 border-gray-700 h-full inset-x-1/2 transform -translate-x-1/2" />

			{cardsDataPairs && cardsDataPairs.map(cardsDataPair => 
				<TimelineCards key={cardsDataPair[2]} cardsDataPair={cardsDataPair} />)}

			 
			<LoadMorePages nextPage={nextPage} isLoading={isLoading} onClickHandle={getNextPage} />
		</PageContainer>
	)
}

export default Home
