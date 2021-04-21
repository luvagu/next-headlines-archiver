function MessageBallon({ children }) {
    return (
        <div className="flex justify-center items-center w-full mb-5">
            <span className="z-10 px-4 py-2 rounded-full text-sm bg-gray-800 text-white">
                {children}
            </span>
        </div>
    )
}

export default MessageBallon
