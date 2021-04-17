import { getLatestNews } from '../utils/fauna.helpers'
import TimelineCards from '../components/TimelineCards'
import PageContainer from '../components/PageContainer'
import Metatags from '../components/Metatags'

export const getStaticProps = async () => {
	const cardsData = await getLatestNews()
	const cardsDataPairs = cardsData.reduce((acc, cv, idx, source) => {
		if (idx % 2 === 0) {
			const pairs = source.slice(idx, idx + 2)
			const timestamp = pairs[0].headLineTs
			acc.push([...pairs, timestamp])
		}
		return acc
	}, [])

	return {
		props: {
			cardsDataPairs,
		},
	}
}

function Home({ cardsDataPairs }) {
	return (
		<PageContainer>
			<Metatags />
			{/* timeline middle vertical line */}
			<div className="border-2 absolute border-opacity-50 border-gray-700 h-full inset-x-1/2 transform -translate-x-1/2" />
			{cardsDataPairs.length > 0 && cardsDataPairs.map(cardsDataPair => <TimelineCards key={cardsDataPair[2]} cardsDataPair={cardsDataPair} />)}
		</PageContainer>
	)
}

export default Home
