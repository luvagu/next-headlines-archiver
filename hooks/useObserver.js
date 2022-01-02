import { useCallback, useRef } from 'react'

export function useObserveLastElement(isLoading, moreNodes, callback) {
	const observer = useRef(null)

	return useCallback(
		node => {
			if (isLoading) return

			if (observer.current) observer.current.disconnect()

			observer.current = new IntersectionObserver(
				entries => {
					if (entries[0].isIntersecting && moreNodes) {
						// console.log('last node is visible')
						callback()
					}
				},
				{
					// rootMargin: '0px',
					threshold: 1.0,
				}
			)

			if (node) observer.current.observe(node)
		},
		[isLoading, moreNodes]
	)
}
