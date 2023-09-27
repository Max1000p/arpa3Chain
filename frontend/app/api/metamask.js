// pages/api/metamask.js

import { ethers } from 'ethers';
import { detectEthereumProvider } from '@metamask/detect-provider';

export default async (req, res) => {
  try {
    const provider = await detectEthereumProvider();
    if (provider) {
      await provider.request({ method: 'eth_requestAccounts' });
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      res.status(200).json({ provider: ethersProvider });
    } else {
      res.status(400).json({ error: 'Metamask not detected' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}