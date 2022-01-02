import { Fragment } from 'react'
import { useRouter } from 'next/router'
import { searhNews } from '../../utils/fauna.helpers'

import PageContainer from '../../components/PageContainer'
import Metatags from '../../components/Metatags'
import SinglesTimeline from '../../components/SinglesTimeline'
import MessageBallon from '../../components/MessageBallon'
import LoadMorePages from '../../components/LoadMorePages'

export default function SerchResultsPage({ results }) {
	const { query } = useRouter()
	const hasResults = results && results.length ? true : false

	const resCount = results ? results.length : 0
	const terms = <span className='text-yellow-400'>{query.terms}</span>
	const resCountTxt = <span className='text-yellow-400'>{resCount}</span>

	return (
		<PageContainer withTimeline={hasResults}>
			<Metatags
				title={
					hasResults ? `Search results for: ${query.terms}` : 'No results found'
				}
			/>

			<MessageBallon>
				{hasResults ? (
					<>
						Showing {resCountTxt} {resCount > 1 ? 'results' : 'result'} for:{' '}
						{terms}
					</>
				) : (
					<>No results found for: {terms}</>
				)}
			</MessageBallon>

			{hasResults && (
				<Fragment>
					{results.map((cardData, idx) => (
						<SinglesTimeline key={cardData.ref} cardData={cardData} idx={idx} />
					))}
					<LoadMorePages nextPage={false} />
				</Fragment>
			)}
		</PageContainer>
	)
}

export const getServerSideProps = async context => {
	try {
		const results = await searhNews(decodeURIComponent(context.query.terms))

		return {
			props: { results },
		}
	} catch (error) {
		console.log('Error: %s', error?.message)
		return {
			notFound: true,
		}
	}
}
