import { forwardRef } from 'react'

import Card from './Card'

import CircleTimelineDate from './CircleTimelineDate'

const PairsTimeline = forwardRef(({ cardsDataPair, flip = false }, ref) => {
	const [cardDataLeft, cardDataRight, timestamp] = cardsDataPair

	return (
		<div
			ref={ref}
			className={`mb-8 flex justify-evenly items-center w-full ${
				flip ? 'flex-row-reverse' : ''
			}`}
		>
			{cardDataRight ? (
				<Card cardData={cardDataRight} />
			) : (
				<div className='order-1 w-5/12 md:max-w-xs lg:max-w-md' />
			)}

			<CircleTimelineDate timestamp={timestamp} />

			{cardDataLeft ? (
				<Card cardData={cardDataLeft} />
			) : (
				<div className='order-1 w-5/12 md:max-w-xs lg:max-w-md' />
			)}
		</div>
	)
})

export default PairsTimeline
