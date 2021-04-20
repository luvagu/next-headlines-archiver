function LoadMorePages({ nextPage, isLoading, onClickHandle }) {
    return (
        <div className="flex justify-center items-center w-full">
            {nextPage ? ( 
                <button 
                    className={`z-10 px-4 py-2 bg-white border border-gray-400 rounded-full text-sm ${isLoading ? 'border-gray-800 bg-gray-800 text-white' : 'hover:border-gray-400 hover:bg-gray-400 hover:text-white'}`} 
                    type="button"
                    onClick={onClickHandle}
                >
                    {isLoading ? 'Loading...' : 'Load more'}
                </button>
            ) : (
                <span className="z-10 px-4 py-2 rounded-full text-sm bg-gray-800 text-white">You have reached the end!</span>
            )}
        </div>
    )
}

export default LoadMorePages
