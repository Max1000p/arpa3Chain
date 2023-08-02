"use client"
import Header from "../components/header"
import { Text,Button } from '@chakra-ui/react'
import { hardhat,arpa3Chain } from 'wagmi/chains'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { readContract,prepareWriteContract, writeContract } from '@wagmi/core'
import Contract from '../../public/Arpa3.json'

const contact = () => {
    const http = require('http')
    const httpServer = http.createServer()

    httpServer.on('request', (request, response) => {
        // On spécifie l'entête pour le CORS
        response.setHeader('Access-Control-Allow-Origin', '*');

        // On gère le cas où le navigateur fait un pré-contrôle avec OPTIONS ...
        // ... pas besoin d'aller plus loin dans le traitement, on renvoie la réponse
        if (request.method === 'OPTIONS') {
            // On liste des méthodes et les entêtes valides
            response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin, Authorization')
            response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')

            return response.end()
        }
    })
    const { isConnected, address : addressAccount } = useAccount()
    const contractAddress = '0x457DaDF045C29C7341431d1A63E1F2747EEfFD11'

    const transport = http('https://192.168.10.121:8545')
    // Create client for Viem
    const client = createPublicClient({
        chain: arpa3Chain,
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