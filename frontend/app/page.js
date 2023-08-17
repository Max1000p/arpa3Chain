"use client"
import { useThemeContext } from "@/context/theme"
import Header from "../components/header"
import Profil from "../components/profil"
import Workflow from "../components/stepper"
import Privilege from "../components/privilege"
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
  Container,
  VStack,
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
  const {IsAccountExist, setIsAccountExist} = useThemeContext()
  const { workflowStatus, setWorkflowStatus } = useThemeContext()
  
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
  }, [isConnected])

  useEffect(() => {
    console.log('SetValeur' + IsAccountExist)
 }, [IsAccountExist])


  return (
    <div>
      <Header />
      
      <Workflow />
      {isConnected ? (
        
        <Container maxW="container.xxl" p={0}>
           
          {IsAccountExist ? (
              <Flex py={20}> 
                <Privilege />
              </Flex>
            ):(
              <Flex p="2rem" justifyContent="center" alignItems="center">
                <Profil />
              </Flex>
            )} 
        </Container>
        
        ) : (
            <Flex p="2rem" justifyContent="center" alignItems="center">
                <Heading>Merci de vous connecter</Heading>
            </Flex>

      )}

      

    

    </div>
  )
}


