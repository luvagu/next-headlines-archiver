import Card from './Card'
import DateFormat from './DateFormat'

function TimelineCards({ cardsDataPair }) {
	const [cardDataLeft, cardDataRight, timestamp] = cardsDataPair
	
	return (
		<div className="mb-8 flex justify-evenly items-center w-full">
			{cardDataRight && <Card cardData={cardDataRight} />}

			<div className="z-10 flex items-center order-1 bg-gray-800 shadow-xl w-20 h-20 rounded-full">
				<h1 className="mx-auto font-semibold text-xl text-white">
					<DateFormat timestamp={timestamp ? timestamp : 0} options={{ month: 'short', day: 'numeric' }} />
				</h1>
			</div>

			{cardDataLeft && <Card cardData={cardDataLeft} />}
		</div>
	)
}

export default TimelineCards
