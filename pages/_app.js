import { UserProvider } from '@auth0/nextjs-auth0'

import '../styles/globals.css'
import Navbar from '../components/Navbar'

function App({ Component, pageProps }) {
	return (
		<UserProvider>
			<Navbar />
			<Component {...pageProps} />
		</UserProvider>
	)
}

export default App
