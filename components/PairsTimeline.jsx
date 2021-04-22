import Card from './Card'
import IntlDateFormat from './IntlDateFormat'

function PairsTimeline({ cardsDataPair, flip = false }) {
	const [cardDataLeft, cardDataRight, timestamp] = cardsDataPair
	
	return (
		<div className={`mb-8 flex justify-evenly items-center w-full ${flip ? 'flex-row-reverse' : ''}`}>
			{cardDataRight && <Card cardData={cardDataRight} />}

			<div className="z-10 flex items-center order-1 bg-gray-800 shadow-xl w-20 h-20 rounded-full">
				<h1 className="mx-auto font-semibold text-xl text-white">
					<IntlDateFormat timestamp={timestamp ? timestamp : 0} options={{ month: 'short', day: 'numeric' }} />
				</h1>
			</div>

			{cardDataLeft && <Card cardData={cardDataLeft} />}
		</div>
	)
}

export default PairsTimeline
