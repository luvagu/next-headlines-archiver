import Head from 'next/head'
import { getLatestNews } from '../utils/fauna.helpers'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

    </div>
  )
}



