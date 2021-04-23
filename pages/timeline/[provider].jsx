import { useEffect, useState } from 'react'
import { getNewsByProvider } from '../../utils/fauna.helpers'
import { useRouter } from 'next/router'
import MessageBallon from '../../components/MessageBallon'
import Metatags from '../../components/Metatags'
import PageContainer from '../../components/PageContainer'
import SinglesTimeline from '../../components/SinglesTimeline'
import LoadMorePages from '../../components/LoadMorePages'

const slugToDbName = {
    'cnn': 'CNN',
    'fox-news': 'Fox News'
}

export const getStaticPaths = async () => {
    // Return a list of possible values of news providers in the following shape
    // [
    //     { params: { id: 'ssg-ssr' } },
    // ]
    const paths = Object.keys(slugToDbName).map(provider => ({ params: { provider } }))

	return {
		paths,
		fallback: false,
    }
}

export const getStaticProps = async ({ params }) => {
	try {
		const { after, cardsData: results } = await getNewsByProvider(slugToDbName[params.provider])

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

function TimelineProvider({ after, results }) {
    const { query } = useRouter()

    const [isLoading, setIsLoading] = useState(false)
	const [cardsData, setCardsData] = useState(null)
	const [nextPage, setNextPage] = useState(null)

    const haveResults = cardsData && cardsData.length ? true : false

    // Effect nedded to reload component when
    // the dynaic route changes and new data is received
    useEffect(() => {
        setCardsData(results)
        setNextPage(after)
    }, [query.provider])

    const getNextPage = async (e) => {
		setIsLoading(true)
		try {
			const { after, cardsData: results } = await getNewsByProvider(slugToDbName[query.provider], nextPage)
			setCardsData([ ...cardsData, ...results ])
			setNextPage(after)
		} catch (error) {
			console.log('Error: %s', error?.message)
		}
		setIsLoading(false)
	}

    return (
        <PageContainer withTimeline={haveResults}>
			<Metatags 
                title={haveResults ? `${slugToDbName[query.provider]} | Timeline` : 'Provider not found'} 
                description={`News headlines archives of ${slugToDbName[query.provider]} network news provider`} 
            />

            <MessageBallon>
                {haveResults 
                    ? `${slugToDbName[query.provider]}'s timeline`
                    : 'Provider not found'
                }
            </MessageBallon>

            {haveResults && <SinglesTimeline cardsData={cardsData} />}

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
