# Next Headlines Archiver

Firebase Functions / Node.js / Puppeteer / FaunaDB / Next.js / Auth0 / Tailwind CSS

> Full Stack `Data Aggregation` app that archives the headlines content from CNN and Fox News on scheduled intervals and allows users to scroll through a news timeline to see how they are reported on these sites.

------

## How is data collected and displayed?

> **Firebase Cloud Function - Puppeteer - FaunaDB**

A Firebase `Pub/Sub Cloud Function` is setup to run a background job every hour. This function uses Node.js and [Puppeteer](https://pptr.dev/) to scrape the headlines content from both CNN and Fox and then saves it to FaunaDB using the [FaunaDB JavaScript Driver](https://github.com/fauna/faunadb-js).

> **Data Management with FaunaDB**

FaunaDB, the chosen database for this project, is a `transactional database` built in the cloud with a fast and developer friendly API.

The data collected from the web scraper is saved as documents in the `news` Collection with the following shape:

```js
{
  "ref": Ref(Collection("news"), "1"), // Fauna specific
  "ts": 1617917180920000, // Fauna specific
  "data": {
    "provider": "CNN or Fox",
    "headLineUrl": "headLineUrl",
    "headLineTitle": "headLineTitle",
    "headLineImg": "headLineImg",
    "headLineTxt": "headLineTxt",
    "headLineTs": 1617917167766,
    "headLineUTCDate": "Thu, 08 Apr 2021 21:26:07 GMT"
    "likes": 0
  }
}
```

Several `indexes` were created to enforce `uniqueness`, perform `searches` and `data sorting` as well as `custom functions` to pull the data for different scenarios and `paged` results.

> **Displaying Data with Next.js**

- The client-side is built with `Next.js`, a framework built on top of `React`, which features `hybrid static & server rendering`. The data is displayed in the form of a timeline with cards shown side by side.

## Client-side Features

- Hybrid pages featuring both `Static & Server Side Rendering` and `SEO`
- Homepage also features `Incremental Static Regeneration`
- Server and Client side rendering for search and filters
- Optimized images
- Data is displayed in cards over a timeline
- Uses Tailwind CSS framework for styling
- Responsive design
- Progress bar indicator shown on page transitions
- Search news
- Filters included by provider or by dates range
- Cards likes system
- Only logged in users may like cards once
- Auth0 for user authentication

## Clonning this repo

If you'd like to clone this repo, you'd first need to setup a firebase `Pub/Sub Cloud Function` for the web scrapper background job (code found in the `functions` folder). Then open a FaunaDb [account](https://fauna.com/) and setup a database with two collections (news and likes) and get a server key. However, further tweaks are needed to pull the correct data for the various API endpoints, search & sort and likes. Setup necessary environment variables.

```bash
git clone https://github.com/luvagu/next-headlines-archiver.git

cd next-headlines-archiver

npm run dev
```

See working demo at: 

Enjoy!
