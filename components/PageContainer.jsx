function PageContainer({ withTimeline = false, children }) {
    return (
        <div className="container mx-auto w-full h-full">
			<div className="relative overflow-hidden p-5 h-full">
                {/* timeline middle vertical line */}
			    {withTimeline && <div className="absolute border-2 border-opacity-50 border-gray-700 h-full inset-x-1/2 transform -translate-x-1/2" />}
                {children}
            </div>
        </div>
    )
}

export default PageContainer
