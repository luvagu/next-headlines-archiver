import { useRouter } from 'next/router'
import { searhNews } from '../../utils/fauna.helpers'

import PageContainer from '../../components/PageContainer'
import Metatags from '../../components/Metatags'
import SinglesTimeline from '../../components/SinglesTimeline'
import MessageBallon from '../../components/MessageBallon'

export const getServerSideProps = async (context) => {
    try {
        const results = await searhNews(decodeURIComponent(context.query.terms))
        
        return {
            props: { results }
        }
    } catch (error) {
        console.log('Error: %s', error?.message)
		return {
			notFound: true,
		}
    }
}

function SerchResultsPage({ results }) {
    const { query } = useRouter()
    const haveResults = results && results.length ? true : false

    return (
        <PageContainer withTimeline={haveResults}>
			<Metatags title={haveResults ? `Search results for: ${query.terms}` : 'No results found'} />

            <MessageBallon>
                {haveResults ? 'Showing results' : 'No results found'} for: <span className="text-yellow-400">{query.terms}</span>
            </MessageBallon>

            {haveResults && <SinglesTimeline cardsData={results} />}
        </PageContainer>
    )
}

export default SerchResultsPage
