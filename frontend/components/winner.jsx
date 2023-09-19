import { v4 as uuidv4 } from 'uuid';
import { useThemeContext } from "@/context/theme"
import { OrderedList,Text,Avatar,Textarea,
        WrapItem,Popover,useToast, LightMode, List, ListItem} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { hardhat,arpa3Chain } from 'wagmi/chains'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { readContract,prepareWriteContract, writeContract } from '@wagmi/core'
import Contract from '../public/Arpa3.json'
import { contractAddress } from '../constants.js'
import { ethers } from 'ethers'

const winner = () => {

    const { isConnected, address : addressAccount } = useAccount()
    const transport = http('http://localhost:8545')
    // Create client for Viem
    const client = createPublicClient({
        chain: hardhat,
        transport,
    })
    const toast = useToast()
    const { workflowStatus, setWorkflowStatus } = useThemeContext()
    const { sessionID, setSessionID } = useThemeContext();
    const [winner,setwinner] = useState("")
    const [historicEvents,setHistoricEvents] = useState([])

    const getWinner = async() => {
        try {
            const data = await readContract({
                address: contractAddress,
                account: addressAccount,
                abi: Contract.abi,
                functionName: "getWinner"
            });
          
            setwinner(data)
           
        } catch (err) {
            console.log(err.message)
        }
    }

    const getEvents = async() => {
        const historicLogs = await client.getLogs({
            event: parseAbiItem('event HistoricVote(uint _session, address _adresse, string motivation)'),
            fromBlock: 0n,
            toBlock: 'latest'
        })
        setHistoricEvents(historicLogs.map(
            log => ({
                sessionid: log.args._session,
                addressproposal: log.args._adresse,
                motivationproposal: log.args.motivation
            })
        ))
    }

    useEffect(() => {
       getWinner()
       getEvents()
     }, [])

  return (
    <>
    <Text align='center' size='2xl' as='b'>{winner.firstname} {winner.name} | {winner.service}</Text>
    <Text mt={10}>Les motifs de son éléction par le groupe</Text>
    <OrderedList>
    {historicEvents.length > 0 ? 
        historicEvents.map((event) => {
            if (event.addressproposal == winner.addresse && sessionID == event.sessionid)
            return <ListItem key={uuidv4()}>{event.motivationproposal}</ListItem>  
        }) : (
            <ListItem>-</ListItem>
        )}
    </OrderedList>
    </>
    )
    
}

export default winner