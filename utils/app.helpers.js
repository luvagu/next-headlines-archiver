// PairsTimeline component accepts data in the following shape:
// [ [ {cardDataLeft}, {cardDataRight}, timestamp ] ]
// Transform cardsData to be returned in the above shape
export const transformCardsData = cardsData =>
	cardsData.reduce((acc, cv, idx, source) => {
		if (idx % 2 === 0) {
			const arrPair = source.slice(idx, idx + 2)
			if (arrPair.length === 1) arrPair[1] = null // always fill index 1 if empty
			const timestamp = arrPair[0].headLineTs
			acc.push([...arrPair, timestamp])
		}
		return acc
	}, [])
