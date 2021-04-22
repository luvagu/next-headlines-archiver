import { getNewsByTsRange } from '../../utils/fauna.helpers'
import { useRouter } from 'next/router'

export const getServerSideProps = async (context) => {
    try {
		const [, from, , to] = context.query.range
		const fromTs = Date.parse(from)
		const toTs = Date.parse(to)

        const results = await getNewsByTsRange(fromTs, toTs, null, null)
        
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

function HeadlinesByDate({ results }) {
	console.log(results);
	const { query } = useRouter()
	return <div></div>
}

export default HeadlinesByDate
