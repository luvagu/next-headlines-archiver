import { Fragment } from 'react'

// send { month: 'short', day: 'numeric' } as options for the timeline date
function IntlDateFormat({ timestamp, options = { dateStyle: 'long', timeStyle: 'short' } }) {
    const locale = 'en-US'
	const date = new Date(timestamp)
	const localeFormat = new Intl.DateTimeFormat(locale, { ...options }).format(date)

	return <Fragment>{localeFormat}</Fragment>
}

export default IntlDateFormat
