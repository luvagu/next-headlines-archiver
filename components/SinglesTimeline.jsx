import { forwardRef } from 'react'
import { classNames } from '../utils/tailwind.helpers'

import Card from './Card'
import CircleTimelineDate from './CircleTimelineDate'

const SinglesTimeline = forwardRef(({ cardData, idx }, ref) => {
	return (
		<div
			ref={ref}
			className={classNames(
				'mb-8 flex justify-evenly items-center w-full',
				idx % 2 === 1 && 'flex-row-reverse'
			)}
		>
			{cardData && <Card cardData={cardData} />}

			<CircleTimelineDate timestamp={cardData.headLineTs} />

			<div className='order-1 w-5/12 md:max-w-xs lg:max-w-md' />
		</div>
	)
})

export default SinglesTimeline
