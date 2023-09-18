"use client"
import { ThemeContextProvider } from '@/context/theme';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {hardhat} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ChakraProvider } from '@chakra-ui/react'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { contractAddress } from '../constants.js'

const arpa3Chain = {
  id: 222222,
  name: 'Arpa3Chain',
  network: 'ARPA3BC',
  nativeCurrency: {
    decimals: 18,
    name: 'ETHEREUM',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://192.168.10.124:8545'],
    },
  },
  testnet: false,
};

const { chains, publicClient } = configureChains(
  
  [/*arpa3Chain*/hardhat],
  [jsonRpcProvider({rpc: chain => ({ http: chain.rpcUrls.default.http[0] }),}),]
);

const { connectors } = getDefaultWallets({
  appName: 'Next Wagmi App',
  projectId: '2102601ab7d2fc9e01b6b4e9b3ce7b3b',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            <ChakraProvider>
              <ThemeContextProvider>
                {children}
              </ThemeContextProvider>
            </ChakraProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}
