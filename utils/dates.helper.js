const LOCALE = 'en-US'

export function formatDate(
	timestamp = 0,
	options = { dateStyle: 'long', timeStyle: 'short' }
) {
	const date = new Date(timestamp)
	const customDate = new Intl.DateTimeFormat(LOCALE, { ...options }).format(
		date
	)

	return customDate
}

export function yearOnly(timestamp = 0, format = 'short') {
	const date = new Date(timestamp)
	const year = new Intl.DateTimeFormat(LOCALE, {
		year: format === 'short' ? '2-digit' : 'numeric',
	}).format(date)

	return year
}
