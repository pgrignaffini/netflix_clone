import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from 'web3uikit';
import { ChakraProvider } from "@chakra-ui/provider";
import "../styles/globals.css"
import { theme } from "./helpers/theme"

function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <MoralisProvider appId="1SXKsQY6a2Z313Ny1xgy7pYjFKgVhRwg90wQFkOW" serverUrl="https://depxltvfnkhu.usemoralis.com:2053/server">
        <NotificationProvider>
          <div className="appDiv">
            <Component {...pageProps} theme={theme} />
          </div>
        </NotificationProvider>
      </MoralisProvider>
    </ChakraProvider>

  )
}

export default App
