"use client"
import Header from "./components/header"
import Profil from "./components/profil"
import {
  Text,Button,Flex,Heading,Center,Box,SimpleGrid,
  Step,Card,Stat,StatLabel,StatNumber,textColor,IconBox,
  StepDescription,iconBlue,WalletIcon,GlobeIcon,
  StepIcon,DocumentIcon,CartIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from '@chakra-ui/react'
import { arpa3Chain } from 'wagmi/chains'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { readContract,prepareWriteContract, writeContract } from '@wagmi/core'
import Contract from '../public/Arpa3.json'

export default function Home() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  const { isConnected, address : addressAccount } = useAccount()
  const [workflowStatus,setWorkflowStatus] = useState(0)
  const [IsAccountExist, setIsAccountExist] = useState(false)
  const [constant,setconstant] = useState("POP")
  
  const AccountExist =  async() => {
      try {
          const data = await readContract({
              address: contractAddress,
              abi: Contract.abi,
              functionName: "isAccountExist",
              account: addressAccount,
              args: [addressAccount]
          });
          setIsAccountExist(data)
      } catch(err) {
          console.log(err)
      }
  }

  useEffect(() => {
    console.log('Passe dans fonction')
     AccountExist()
  }, [])

  useEffect(() => {
    console.log('SetValeur' + IsAccountExist)
 }, [IsAccountExist])


  return (
    <div>
      <Header />
      {isConnected ? (

          <>       
          {IsAccountExist ? (
              <Text></Text>
            ):(
              <Profil />
            )}
          </>  

        ) : (
        
            <Flex p="2rem" justifyContent="center" alignItems="center">
                <Heading>Merci de vous connecter</Heading>
            </Flex>
          
      )}

    

    </div>
  )
}


