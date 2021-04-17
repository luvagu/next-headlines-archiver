function PageContainer({ children }) {
    return (
        <div className="container mx-auto w-full h-full">
			<div className="relative overflow-hidden p-10 h-full">{children}</div>
        </div>
    )
}

export default PageContainer
