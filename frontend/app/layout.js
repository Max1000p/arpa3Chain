"use client"
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {hardhat, goerli} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
  [hardhat,goerli],[publicProvider()]
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
            {children}
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}
