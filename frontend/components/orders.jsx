import React, { useState,useEffect } from 'react'
import {  Text } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { readContract } from '@wagmi/core'
import Contract from '../../public/Arpa3.json'
import { ethers } from 'ethers'

const orders = () => {
    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    const transport = http('http://localhost:8545')

    const [orders,setOrders] = useState([])
    
    const getOrders = async() => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "getOrders"
            });
            setOrders(data)
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        getOrders()
    }, [])


  return (
    <div>orders</div>
  )
}

export default orders