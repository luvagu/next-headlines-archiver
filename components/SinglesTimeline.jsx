import Card from './Card'
import IntlDateFormat from './IntlDateFormat'

function SinglesTimeline({ cardsData }) {
    return cardsData && cardsData.map((cardData, idx) => (
        <div key={cardData.ref} className={`mb-8 flex justify-evenly items-center w-full ${idx % 2 === 1 ? 'flex-row-reverse' : ''}`}>
			{cardData && <Card cardData={cardData} />}

			<div className="z-10 flex items-center order-1 bg-gray-800 shadow-xl w-20 h-20 rounded-full">
				<h1 className="mx-auto font-semibold text-xl text-white">
					<IntlDateFormat timestamp={cardData.headLineTs} options={{ month: 'short', day: 'numeric' }} />
				</h1>
			</div>

            <div className="order-1 w-5/12 md:max-w-xs lg:max-w-md" />
		</div>
    ))
}

export default SinglesTimeline
