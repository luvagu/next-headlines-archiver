function LoadMorePages({ nextPage }) {
	return (
		<div className='flex justify-center items-center w-full'>
			<span className='z-10 px-4 py-2 rounded-full text-sm bg-gray-800 text-white'>
				{nextPage ? 'Loading more...' : 'You have reached the end!'}
			</span>
		</div>
	)
}

export default LoadMorePages
