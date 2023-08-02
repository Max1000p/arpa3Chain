"use client"
import '@rainbow-me/rainbowkit/styles.css';
import NextCors from 'nextjs-cors';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {hardhat, goerli} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

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
      http: ['http://192.168.10.121:8545'],
    },
  },
  testnet: false,
};

const { chains, publicClient } = configureChains(
  
  [hardhat,goerli,arpa3Chain],
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

async function handler(req, res) {
  // Run the cors middleware
  // nextjs-cors uses the cors package, so we invite you to check the documentation https://github.com/expressjs/cors
  await NextCors(req, res, {
     // Options
     methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
     origin: '*',
     optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  // Rest of the API logic
  res.json({ message: 'Hello NextJs Cors!' });
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            {children}
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}
