import { formatDate, yearOnly } from '../utils/dates.helper'

// send { month: 'short', day: 'numeric' } as options for the timeline date
function CircleTimelineDate({ timestamp }) {
	const monthDay = formatDate(timestamp, { month: 'short', day: 'numeric' })
	const year = yearOnly(timestamp)

	return (
		<div className='z-10 pt-1 flex items-center order-1 bg-gray-800 shadow-xl w-20 h-20 rounded-full overflow-hidden'>
			<h1 className='flex flex-col items-center mx-auto font-semibold text-white truncate whitespace-nowrap'>
				<span className='text-lg'>{monthDay}</span>
				<span className='text-md'>{year}&apos;</span>
			</h1>
		</div>
	)
}

export default CircleTimelineDate
