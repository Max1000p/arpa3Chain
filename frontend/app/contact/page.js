"use client"
import Header from "../../components/header"
import { Text,Button } from '@chakra-ui/react'
import { hardhat,arpa3Chain } from 'wagmi/chains'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { readContract,prepareWriteContract, writeContract } from '@wagmi/core'
import Contract from '../../public/Arpa3.json'

const contact = () => {
    const { isConnected, address : addressAccount } = useAccount()
    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    console.log(contractAddress)
    const transport = http('https://127.0.0.1:8545')
    // Create client for Viem
    const client = createPublicClient({
        chain: hardhat,
        transport,
    })

    const setNumber = async() => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "setNumber",
                args: [20]
            });
        await writeContract(request)
    } catch(err) {
        console.log(err)
    }
}
    

    return (
        <main>
        <Header />
        <Button onClick={()=>setNumber()}>SETNUMBER</Button>
        </main>
    )
}

export default contact