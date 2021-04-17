import Link from 'next/link'
import { ArchiveIcon } from '@heroicons/react/outline'
import { SearchIcon, UserCircleIcon } from '@heroicons/react/solid'

function Navbar() {
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
						<button
							className="flex items-center flex-grow-0 flex-shrink pl-2 relative w-60 border rounded-full px-1  py-1"
							type="button"
						>
							<div className="block flex-grow flex-shrink overflow-hidden">
								Start your search
							</div>
							<div className="flex items-center justify-center relative h-8 w-8 rounded-full">
								<SearchIcon className="h-5 w-5" />
							</div>
						</button>
					</div>
				</div>
			</div>

			{/* login */}
			<div className="flex-initial">
				<div className="flex justify-end items-center">
					<button
						type="button"
						className="inline-flex items-center relative px-2 border rounded-full hover:shadow-lg"
					>
						<div className="pl-1">Sign In</div>
						<div className="block flex-grow-0 flex-shrink-0 h-10 w-12 pl-2">
							<UserCircleIcon className="h-full w-full" />
						</div>
					</button>
				</div>
			</div>
		</nav>
	)
}

export default Navbar
