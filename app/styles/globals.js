import { injectGlobal } from 'emotion'

injectGlobal`
  body {
    margin: 0;
    padding: 0
  }

  body, div, * {
    font-family: 'Roboto Condensed', sans-serif;
    box-sizing: border-box
  }
  
  h1,h2,h3,h4,h5 {
    margin: 0
  }
`