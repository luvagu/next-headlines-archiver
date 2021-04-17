import { useState } from 'react'
import { ExternalLinkIcon, ThumbUpIcon } from '@heroicons/react/outline'
import Image from 'next/image'
import DateFormat from './DateFormat'

function Card({ cardData }) {
	const {
		provider,
		headLineUrl,
		headLineTitle,
		headLineImg,
		headLineTxt,
		headLineTs,
		likes,
	} = cardData

    const [likesCount, setLikesCount] = useState(likes ? likes : 0)

    const handleClick = async (e) => {
        setLikesCount(likesCount + 1)
    }

	return (
		<div className="relative order-1 bg-gray-400 rounded-lg shadow-lg w-5/12 md:max-w-xs lg:max-w-md overflow-hidden">
			<span className="absolute z-10 right-2 top-1 text-sm text-white font-semibold uppercase">
				&copy; {provider}
			</span>
			<div className="relative h-44 w-full">
				<Image
					layout="fill"
					objectFit="fit"
					src={headLineImg}
					alt={headLineTitle}
				/>
			</div>
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
			<div className="flex justify-between items-center px-6 py-4 bg-gray-100">
				<a
					className="flex items-center text-sm hover:text-indigo-600"
					href={headLineUrl}
					target="_blank"
				>
					<span>Story link</span>
					<ExternalLinkIcon className="ml-1 w-5 h-5" />
				</a>
				<button
					className="flex items-center hover:text-green-600 cursor-pointer"
					type="button"
                    onClick={handleClick}
				>
					<ThumbUpIcon className="mr-1 w-5 h-5 pointer-events-none" />
					<span className="text-sm font-semibold pointer-events-none">
						{likesCount}
					</span>
				</button>
			</div>
		</div>
	)
}

export default Card
