// PairsTimeline component accepts data in the following shape:
// [ [ {cardDataLeft}, {cardDataRight}, timestamp ] ]
// Transform cardsData to be returned in the above shape
export const transformCardsData = (cardsData) =>
	cardsData.reduce((acc, cv, idx, source) => {
		if (idx % 2 === 0) {
			const pairs = source.slice(idx, idx + 2)
			const timestamp = pairs[0].headLineTs
			acc.push([...pairs, timestamp])
		}
		return acc
	}, [])
