import React, { useState,useEffect } from 'react'
import {  Text } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { readContract } from '@wagmi/core'
import Contract from '../../public/Arpa3.json'
import { contractAddress } from '../constants.js'
import { ethers } from 'ethers'
const balanceEth = () => {

    const [balanceEth,setBalanceEth] = useState(0)
    const getBalanceEth = async() => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "getMyEthBalance"
            });
            const value = ethers.BigNumber.from(data);
            const formattedValue = ethers.utils.formatUnits(value, 18)
            setBalanceEth(formattedValue.substring(0, formattedValue.indexOf(".") + 3))
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        getBalanceEth()
    }, [balanceEth])


  return (
    <Text>{balanceEth}</Text>
  )
}

export default balanceEth