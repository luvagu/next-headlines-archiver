import Head from 'next/head'
import { getNewsByTsRange } from '../utils/fauna.helpers'

export default function Home() {
  
  getNewsByTsRange(1617917167766, 1618084829194).then(data => console.log(data))

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

    </div>
  )
}
