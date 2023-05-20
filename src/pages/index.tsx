import Head from "next/head"
import Image from "next/image"
import GetData from "@/components/atoms/GetData/GetData"

export default function Home() {
  return (
    <>
      <Head>
        <title>Silly Author GPT</title>
        <meta name="description" content="Co-write stories with Chat-GPT." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:url" content="https://author.sillyactive.com" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="KWIZMASTER" />
        <meta
          property="og:description"
          content="Co-write stories with Chat-GPT."
        />
        <meta property="og:image" content="/fb.png" />
      </Head>
      <main>
        <GetData />
      </main>
    </>
  )
}
