import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@auth0/nextjs-auth0'
import { ArchiveIcon } from '@heroicons/react/outline'
import { SearchIcon, UserCircleIcon } from '@heroicons/react/solid'

function Navbar() {
	const { isLoading, user } = useUser()

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
						<div className="flex items-center flex-grow-0 flex-shrink pl-2 relative w-60 border rounded-full px-1  py-1">
							<div className="block flex-grow flex-shrink overflow-hidden">
								Start your search
							</div>
							<div className="flex items-center justify-center relative h-8 w-8 rounded-full">
								<SearchIcon className="h-5 w-5" />
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* login */}
			<div className="flex-initial">
				<div className="flex justify-end items-center">
					{!isLoading && !user && (
						<Link href='/api/auth/login'>
							<a className="inline-flex items-center pl-3 border rounded-full hover:shadow-md">
								<div>Sign In</div>
								<div className="ml-1 block flex-grow-0 flex-shrink-0 h-10 w-10">
									<UserCircleIcon className="h-full w-full" />
								</div>
							</a>
						</Link>
					)}

					{!isLoading && user && (
						<Link href='/api/auth/logout'>
							<a className="inline-flex items-center pl-3 border rounded-full hover:shadow-md">
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
