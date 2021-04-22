import { useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import { ExternalLinkIcon, RefreshIcon, ThumbUpIcon } from '@heroicons/react/outline'
import Image from 'next/image'
import IntlDateFormat from './IntlDateFormat'

function Card({ cardData }) {	
	const {
		provider,
		headLineUrl,
		headLineTitle,
		headLineImg,
		headLineTxt,
		headLineTs,
		likes,
		ref,
	} = cardData

	const [isLoading, setIsLoading] = useState(false)
	const [hasLiked, setHasLiked] = useState(false)
    const [likesCount, setLikesCount] = useState(likes ? likes : 0)

	const { user } = useUser()
	const router = useRouter()

    const handleClick = async (e) => {
		if (!user) {
			router.push('/api/auth/login')
			return
		}

		if (hasLiked) return

		setIsLoading(true)

		try {
			// Example data update with api routes
			const updatedLikes = await fetch('/api/updateLikes', {
				method: 'PUT',
				body: JSON.stringify({ ref, userId: user.sub }),
				headers: {
					'Content-Type': 'application/json',
				},
			})

			const newLikesCount = await updatedLikes.json()

			// const newLikesCount = await updateDocLikes(ref, user.sub)
			
			if (newLikesCount) {
				setLikesCount(newLikesCount)
				setHasLiked(true)
			}
		} catch (error) {
			console.log('Error: %s', error?.message)
		}

		setIsLoading(false)
    }

	return (
		<div className="relative order-1 bg-gray-400 rounded-lg shadow-lg w-5/12 md:max-w-xs lg:max-w-md overflow-hidden">
			<span className="absolute z-10 right-2 top-2 p-1 text-sm text-white font-medium bg-black bg-opacity-50 rounded-md">
				&copy; {provider}
			</span>
			<div className="relative h-48 w-full text-gray-400">
				<Image
					layout="fill"
					objectFit="cover"
					src={headLineImg}
					alt={headLineTitle}
				/>
			</div>
			<div className="px-6 py-4 bg-white">
				<h3 className="mb-1 font-semibold text-gray-800 text-xl">
					{headLineTitle}
				</h3>
				<p className="mb-2 text-sm leading-snug tracking-wide text-gray-700">
					<IntlDateFormat timestamp={headLineTs} />
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
				{isLoading ? <RefreshIcon className="w-5 h-5 text-green-600 animate-spin" /> : (
					<button
						className="flex items-center hover:text-green-600 cursor-pointer"
						type="button"
						title="I like this"
						onClick={handleClick}
					>
						<ThumbUpIcon className="mr-1 w-5 h-5 pointer-events-none" />
						<span className="text-sm font-semibold pointer-events-none">
							{likesCount}
						</span>
					</button>
				)}
				
			</div>
		</div>
	)
}

export default Card
