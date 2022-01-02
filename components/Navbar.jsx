import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useUser } from '@auth0/nextjs-auth0'
import {
	ArchiveIcon,
	ArrowCircleRightIcon,
	CalendarIcon,
	FilterIcon,
} from '@heroicons/react/outline'
import { SearchIcon, UserCircleIcon } from '@heroicons/react/solid'

const today = new Date()
const year = today.getFullYear()
const month = today.getMonth() + 1
const day = today.getDate()
const MIN_DATE = '2021-04-08' // Database first record
const MAX_DATE = `${year}-${month < 10 ? `0${month}` : month}-${
	day < 10 ? `0${day}` : day
}`

function Navbar() {
	const [searchTerm, setSearchTerm] = useState('')
	const [dateRange, setDateRange] = useState({ from: MIN_DATE, to: '' })
	const { isLoading, user } = useUser()
	const router = useRouter()

	const startSearch = e => {
		e.preventDefault()
		if (!searchTerm || searchTerm.length < 3) return
		router.push(`/search/${encodeURIComponent(searchTerm)}`)
		setSearchTerm('')
		e.target.reset()
		e.target.search.blur()
	}

	const startNewsByRange = e => {
		e.preventDefault()
		const { from, to } = dateRange
		if (!from || !to) return
		router.push(`/headlines/from/${from}/to/${to}`)
		e.target.reset()
	}

	const activeClass = path =>
		router.asPath === path
			? 'bg-gray-900 text-yellow-400'
			: 'text-gray-200 hover:bg-gray-700 hover:text-white'

	return (
		<nav className='lg:sticky md:z-30 md:top-0 bg-gray-800 shadow-sm'>
			<div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 divide-y divide-gray-500 divide-opacity-50'>
				{/* top nav */}
				<div className='flex items-center justify-between h-16'>
					{/* logo */}
					<div className='inline-flex'>
						<Link href='/'>
							<a>
								<div className='flex items-center text-yellow-400'>
									<ArchiveIcon className='h-10 w-10 mr-2' />
									<div className='hidden md:flex flex-col items-center -space-y-2'>
										<span className='font-medium text-base tracking-tight'>
											headline
										</span>
										<span className='font-medium text-base tracking-tight'>
											archives
										</span>
									</div>
								</div>
							</a>
						</Link>
					</div>

					{/* search */}
					<div className='flex flex-shrink flex-grow-0 justify-start'>
						<div className='inline-block'>
							<div className='inline-flex items-center max-w-full'>
								<form
									className='flex items-center flex-grow-0 flex-shrink pl-2 w-60 bg-gray-700 border border-gray-800 rounded-lg px-2 py-1 overflow-hidden focus-within:border-gray-900 focus-within:shadow'
									onSubmit={startSearch}
								>
									<input
										type='search'
										name='search'
										className='flex-grow flex-shrink px-3 bg-transparent text-gray-200 outline-none overflow-hidden'
										placeholder='Search headlines'
										autoComplete='off'
										onChange={e => setSearchTerm(e.target.value)}
									/>
									<button
										className='flex items-center justify-center h-8 w-8 rounded-full text-gray-400 hover:text-white focus:outline-none'
										type='submit'
									>
										<SearchIcon className='h-5 w-5' />
									</button>
								</form>
							</div>
						</div>
					</div>

					{/* login */}
					<div className='flex-initial'>
						<div className='flex justify-end items-center'>
							{!isLoading && !user && (
								<Link href='/api/auth/login'>
									<a className='inline-flex items-center pl-3 text-sm rounded-full hover:shadow bg-gray-900 text-gray-300 hover:bg-gray-700 hover:text-white'>
										<div>Sign In</div>
										<div className='ml-1 block flex-grow-0 flex-shrink-0 h-10 w-10'>
											<UserCircleIcon className='h-full w-full' />
										</div>
									</a>
								</Link>
							)}

							{!isLoading && user && (
								<Link href='/api/auth/logout'>
									<a className='inline-flex items-center pl-3 text-sm rounded-full bg-gray-900 text-gray-300 hover:bg-gray-700 hover:text-white'>
										<div>Sign Out</div>
										<div className='relative ml-1 block flex-grow-0 flex-shrink-0 h-10 w-10 rounded-full overflow-hidden'>
											<Image
												src={user?.picture}
												layout='fill'
												objectFit='cover'
											/>
										</div>
									</a>
								</Link>
							)}
						</div>
					</div>
				</div>

				{/* filter options */}
				<div className='flex flex-wrap flex-col md:flex-row items-center justify-between md:h-14 py-2 md:py-0'>
					{/* timelines by provider */}
					<div className='flex items-center space-x-4 mb-2 md:mb-0'>
						<div className='flex space-x-2 text-gray-400 items-center text-sm font-medium'>
							<FilterIcon className='h-6 w-6' />
							<span>Timelines</span>
						</div>

						<Link href='/timeline/cnn'>
							<a
								className={`px-3 py-2 rounded-md text-sm font-medium ${activeClass(
									'/timeline/cnn'
								)}`}
							>
								CNN
							</a>
						</Link>

						<Link href='/timeline/fox-news'>
							<a
								className={`px-3 py-2 rounded-md text-sm font-medium ${activeClass(
									'/timeline/fox-news'
								)}`}
							>
								Fox News
							</a>
						</Link>
					</div>

					{/* timelines by date range */}
					<form
						className='flex items-center space-x-2'
						onSubmit={startNewsByRange}
					>
						<CalendarIcon className='h-6 w-6 text-gray-400 text-sm font-medium' />

						<div className='relative'>
							<div className='absolute pl-2 inset-y-0 left-0 flex items-center pointer-events-none'>
								<span className='text-gray-400 sm:text-sm'>From</span>
							</div>
							<input
								type='date'
								name='from'
								className='outline-none overflow-hidden block w-full pl-11 py-1 text-gray-200 text-sm bg-gray-700 border border-gray-800 rounded-md focus:border-gray-900 focus:shadow'
								// defaultValue={MIN_DATE}
								min={MIN_DATE}
								max={MAX_DATE}
								required
								onChange={e =>
									setDateRange({ ...dateRange, from: e.target.value })
								}
							/>
						</div>

						<div className='relative'>
							<div className='absolute pl-2 inset-y-0 left-0 flex items-center pointer-events-none'>
								<span className='text-gray-400 sm:text-sm'>To</span>
							</div>
							<input
								type='date'
								name='to'
								className='outline-none overflow-hidden block w-full pl-7 py-1 text-gray-200 text-sm bg-gray-700 border border-gray-800 rounded-md focus:border-gray-900 focus:shadow'
								// defaultValue={MAX_DATE}
								min={dateRange.from}
								max={MAX_DATE}
								required
								onChange={e =>
									setDateRange({ ...dateRange, to: e.target.value })
								}
							/>
						</div>

						<button
							type='submit'
							className='text-gray-400 hover:text-white focus:outline-none text-sm font-medium'
						>
							<ArrowCircleRightIcon className='h-6 w-6' />
						</button>
					</form>
				</div>
			</div>
		</nav>
	)
}

export default Navbar
