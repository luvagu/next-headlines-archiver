import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useUser } from '@auth0/nextjs-auth0'
import { ArchiveIcon } from '@heroicons/react/outline'
import { SearchIcon, UserCircleIcon } from '@heroicons/react/solid'

function Navbar() {
	const [searchTerm, setSearchTerm] = useState('')
	const { isLoading, user } = useUser()
	const router = useRouter()

	const startSearch = (e) => {
		e.preventDefault()
		if (!searchTerm || searchTerm.length < 3) return
		router.push(`/search/${searchTerm}`)
		setSearchTerm('')
		e.target.reset()
		e.target.search.blur()
	}

	return (
		<nav className="sticky z-30 top-0 bg-white w-full flex justify-between items-center mx-auto px-8 h-20 shadow-sm">
			{/* logo */}
			<div className="inline-flex">
                <Link href='/'>
                    <a>
                        <div className="flex items-center">
                            <ArchiveIcon className="h-10 w-10 mr-2" />
                            <div className="hidden md:flex flex-col items-center -space-y-2">
                                <span className="font-semibold text-base tracking-tight">
                                    headline
                                </span>
                                <span className="font-semibold text-base tracking-tight">
                                    archives
                                </span>
                            </div>
                        </div>
                    </a>
                </Link>
			</div>

			{/* search */}
			<div className="hidden sm:block flex-shrink flex-grow-0 justify-start px-2">
				<div className="inline-block">
					<div className="inline-flex items-center max-w-full">
						<form 
							className="flex items-center flex-grow-0 flex-shrink pl-2 relative w-60 border rounded-full px-2 py-1 overflow-hidden focus-within:border-gray-900 focus-within:shadow"
							onSubmit={startSearch}
						>
							<input 
								type="search"
								name="search"
								className="flex-grow flex-shrink px-3 outline-none overflow-hidden" 
								placeholder="Search headlines"
								autoComplete="off"
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							<button 
								className="flex items-center justify-center relative h-8 w-8 rounded-full" 
								type="submit"
							>
								<SearchIcon className="h-5 w-5" />
							</button>
						</form>
					</div>
				</div>
			</div>

			{/* login */}
			<div className="flex-initial">
				<div className="flex justify-end items-center">
					{!isLoading && !user && (
						<Link href='/api/auth/login'>
							<a className="inline-flex items-center pl-3 border rounded-full hover:shadow">
								<div>Sign In</div>
								<div className="ml-1 block flex-grow-0 flex-shrink-0 h-10 w-10">
									<UserCircleIcon className="h-full w-full" />
								</div>
							</a>
						</Link>
					)}

					{!isLoading && user && (
						<Link href='/api/auth/logout'>
							<a className="inline-flex items-center pl-3 border rounded-full hover:shadow">
								<div>Sign Out</div>
								<div className="relative ml-1 block flex-grow-0 flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
									<Image src={user?.picture} layout="fill" objectFit="cover" />
								</div>
							</a>
						</Link>
					)}
				</div>
			</div>
		</nav>
	)
}

export default Navbar
