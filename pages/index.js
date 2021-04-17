import Head from 'next/head'
import TimelineCards from '../components/TimelineCards'
import PageContainer from '../components/PageContainer'
import { getLatestNews } from '../utils/fauna.helpers'

export default function Home() {
	return (
		<PageContainer>
			<Head>
				<title>Headline archives</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{/* timeline middle vertical line */}
			<div className="border-2 absolute border-opacity-50 border-gray-700 h-full inset-x-1/2 transform -translate-x-1/2" />
			<TimelineCards />
		</PageContainer>
	)
}
