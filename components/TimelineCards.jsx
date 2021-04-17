import Image from 'next/image'
import DateFormat from './DateFormat'

function TimelineCards({ cardDataLeft, cardDataRight, timestamp }) {
	return (
		<div className="mb-8 flex justify-evenly items-center w-full">
			<Card cardData={cardDataLeft} />
			<div className="z-20 flex items-center order-1 bg-gray-800 shadow-xl w-20 h-20 rounded-full">
				<h1 className="mx-auto font-semibold text-xl text-white">
					<DateFormat timestamp={timestamp} options={{ month: 'short', day: 'numeric' }} />
				</h1>
			</div>
			<Card cardData={cardDataRight} />
		</div>
	)
}

function Card({ cardData }) {
	const { provider, headLineUrl, headLineTitle, headLineImg, headLineTxt, headLineTs } = cardData
	
	return (
		<div className="relative order-1 bg-gray-400 rounded-lg shadow-lg w-5/12 md:max-w-xs lg:max-w-md overflow-hidden">
			<span className="absolute right-2 top-1 text-sm text-white font-semibold uppercase">
				&copy; {provider}
			</span>
			<Image
				className="object-fill h-44 w-full"
				src={headLineImg}
				alt={headLineTitle}
			/>
			<div className="px-6 py-4 bg-white">
				<h3 className="mb-1 font-semibold text-gray-800 text-xl">
					{headLineTitle}
				</h3>
				<p className="mb-2 text-sm leading-snug tracking-wide text-gray-700">
					<DateFormat timestamp={headLineTs} />
				</p>
				<p className="text-sm leading-snug tracking-wide text-gray-900">
					{headLineTxt}
				</p>
			</div>
		</div>
	)
}

export default TimelineCards
