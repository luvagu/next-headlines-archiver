import { Fragment } from 'react'

// send { month: 'short', day: 'numeric' } as options for the timeline date
export default function DateFormat({ timestamp, options = { dateStyle: 'long', timeStyle: 'short' } }) {
    const locale = 'en-US'
	const date = new Date(timestamp)
	const localeFormat = new Intl.DateTimeFormat(locale, { ...options }).format(date)

	return <Fragment>{localeFormat}</Fragment>
}
