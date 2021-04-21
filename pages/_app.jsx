import { UserProvider } from '@auth0/nextjs-auth0'
import Router from 'next/router'
import NProgress from 'nprogress'
import Navbar from '../components/Navbar'

import '../styles/globals.css'
import 'nprogress/nprogress.css'

NProgress.configure({
	minimum: 0.3,
	easing: 'ease',
	speed: 800,
	showSpinner: false,
})

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function App({ Component, pageProps }) {
	return (
		<UserProvider>
			<Navbar />
			<Component {...pageProps} />
		</UserProvider>
	)
}

export default App
