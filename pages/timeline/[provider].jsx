import { useEffect, useState } from 'react'
import { getNewsByProvider } from '../../utils/fauna.helpers'
import { useRouter } from 'next/router'
import MessageBallon from '../../components/MessageBallon'
import Metatags from '../../components/Metatags'
import PageContainer from '../../components/PageContainer'
import SearchTimeline from '../../components/SearchTimeline'
import LoadMorePages from '../../components/LoadMorePages'

const provierDBName = {
    'cnn': 'CNN',
    'fox-news': 'Fox News'
}

export const getStaticPaths = async () => {
    // Return a list of possible values for provider in the following shape
    // [
    //     { params: { id: 'ssg-ssr' } },
    // ]
    const paths = Object.keys(provierDBName).map(provider => ({ params: { provider } }))

	return {
		paths,
		fallback: false,
    }
}

export const getStaticProps = async ({ params }) => {
	try {
		const { after, cardsData: results } = await getNewsByProvider(provierDBName[params.provider])

		return {
			props: { after, results },
		}
	} catch (error) {
		console.log('Error: %s', error?.message)
		return {
			notFound: true,
		}
	}
}

function TimelineProvider({ after, results }) {
    const { query } = useRouter()

    const [isLoading, setIsLoading] = useState(false)
	const [cardsData, setCardsData] = useState(null)
	const [nextPage, setNextPage] = useState(null)

    const haveResults = cardsData && cardsData.length ? true : false

    // Effect nedded to reload component if the dynaic route changes
    useEffect(() => {
        setCardsData(results)
        setNextPage(after)
    }, [query.provider])

    const getNextPage = async (e) => {
		setIsLoading(true)
		try {
			const { after, cardsData: results } = await getNewsByProvider(provierDBName[query.provider], nextPage)
			setCardsData([ ...cardsData, ...results ])
			setNextPage(after)
		} catch (error) {
			console.log('Error: %s', error?.message)
		}
		setIsLoading(false)
	}

    return (
        <PageContainer withTimeline={haveResults}>
			<Metatags title={`${provierDBName[query.provider]} timeline`} />

            <MessageBallon>
                {haveResults 
                    ? <span className="text-yellow-400">{provierDBName[query.provider]} timeline</span>
                    : 'Provider not found'
                }
            </MessageBallon>

            {haveResults && <SearchTimeline cardsData={cardsData} />}

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

export default TimelineProvider
