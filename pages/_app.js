import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
html, body {
  height: 100vh;
  margin: 0;
}
`
function MyApp({ Component, pageProps }) {
  return (
  <>
    <GlobalStyle/>
    <Component {...pageProps} />
  </>
  )
}

export default MyApp
