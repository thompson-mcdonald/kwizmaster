import Header from "../components/layout/Header/Header"
import "../styles/globals.css"

export default function App({ Component, pageProps }: any) {
  return (
    <div>
      {/* <Header>Test</Header> */}
      <Component {...pageProps} />
    </div>
  )
}
