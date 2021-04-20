import { searhNews } from '../../utils/fauna.helpers'
import PageContainer from '../../components/PageContainer'
import Metatags from '../../components/Metatags'
import SearchTimeline from '../../components/SearchTimeline'
import { useRouter } from 'next/router'

export const getServerSideProps = async (context) => {
    try {
        const results = await searhNews(context.query.terms)

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
			<Metatags title={`Search results for: ${query.terms}`} />

            <div className="flex justify-center items-center w-full mb-10">
                <span className="z-10 px-4 py-2 rounded-full text-sm bg-gray-800 text-white">
                    {haveResults ? 'Showing results' : 'No results found'} for: <span className="text-yellow-400">{query.terms}</span>
                </span>
            </div>

            {haveResults && <SearchTimeline cardsData={results} />}
        </PageContainer>
    )
}

export default SerchResultsPage
