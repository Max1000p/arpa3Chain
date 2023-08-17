import { v4 as uuidv4 } from 'uuid';
import { useThemeContext } from "@/context/theme"
import { Button,Table,TableCaption,Thead,Tr,Td,Th,Tbody,Text,Avatar,Textarea,
        WrapItem,Popover,useToast,Input,Modal,
        ModalOverlay,
        ModalContent,
        ModalHeader,
        ModalFooter,
        ModalBody,
        ModalCloseButton} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { hardhat,arpa3Chain } from 'wagmi/chains'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { readContract,prepareWriteContract, writeContract } from '@wagmi/core'
import Contract from '../public/Arpa3.json'
import { ethers } from 'ethers'

const vote = () => {
    const { isConnected, address : addressAccount } = useAccount()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    const transport = http('http://localhost:8545')
    // Create client for Viem
    const client = createPublicClient({
        chain: hardhat,
        transport: http(),
    })
    const toast = useToast()
    const { workflowStatus, setWorkflowStatus } = useThemeContext();
    const [listVoter,setListVoter] = useState([])
    const [voted,setvoted] = useState(0)
    const [motivation,setmotivation] = useState("")
    const [indexvote,setIndexvote] = useState(null)
   
    const hasVoted = async() => {
        try {
            const data = await readContract({
                address: contractAddress,
                account: addressAccount,
                abi: Contract.abi,
                functionName: "hasVoted"
            });
            console.log(addressAccount + 'a deja voté')
            console.log(data)
            setvoted(data)
        } catch (err) {
            console.log(err.message)
        }
    }

    const setVote = async() => {
        if( motivation != ''){
            console.log(indexvote)
            try {
                const { request } = await prepareWriteContract({
                    address: contractAddress,
                    abi: Contract.abi,
                    functionName: "setVote",
                    args: [indexvote,motivation]
                });
                await writeContract(request)
                
                
                toast({
                    title: 'Vote accepté.',
                    description: `Votre vote a bien été pris en compte`,
                    status: 'success',
                    duration: 3000,
                    position: 'top',
                    isClosable: true,
                })
                
                setIndexvote(null)
                hasVoted()
                getProposal()
                
            }
            catch(err) {
                console.log(err)
                toast({
                    title: 'Error!',
                    description: 'Error system, contact Administrator',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
            
        } else {
            toast({
                title: 'Indiquer la motivation',
                description: `Ce champs ne doit pas être vide`,
                status: 'error',
                duration: 4000,
                position: 'top',
                isClosable: true,
            })
        }
    }

    const getProposal = async() => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "getProposal"
            });
            console.log(data)
            setListVoter(data)
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        getProposal()
        hasVoted()
     }, [])

  return (
    <>
    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>VALIDER VOTRE VOTE</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
      <Textarea size="lg" variant='flushed' placeholder='Indiquer la motivation du vote' value={motivation} onChange={(e) => setmotivation(e.target.value)} />
      </ModalBody>

      <ModalFooter>
        <Button mt={2} size='xs' colorScheme='teal' variant='outline'
         onClick={()=> {setVote();onClose()}}>Je Vote</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>      

    <Table variant="striped" w='100%' colorScheme="blue" size="md">
                        <TableCaption>Liste des participants</TableCaption>
                        <Thead>
                            <Tr>
                            <Th></Th>
                            <Th>L'ELU</Th>
                            <Th>SERVICE</Th>
                            <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                    
                {listVoter.length > 0 ? listVoter.map((event, index) => {
                            let concatenation = event.firstname.concat(" ", event.name)
                                return <Tr key={uuidv4()}>                                   
                                        <Td>
                                        <WrapItem>
                                            <Avatar name={concatenation} src='#' />
                                        </WrapItem>
                                        </Td>
                                        <Td>
                                            <Text>{event.name} {event.firstname}</Text>
                                            <Text>{event.addresse}</Text>
                                        </Td>
                                        <Td>{event.service}</Td>
                                        <Td>
                                            {workflowStatus == 2 ? (
                                                    <>
                                                        {voted ? (
                                                            <Text size='sm'>...</Text>
                                                        ):(
                                                            <>
                                                            {addressAccount == event.addresse ? (
                                                                <Text></Text>
                                                            ):(
                                                                <>
                                                                <Button size='sm' colorScheme='teal' variant='outline'
                                                                        onClick={() => {onOpen(); setIndexvote(index)} }>VOTE</Button>
                                                                </>
                                                    
                                                            )}
                                                            </>
                                                        )}
                                                    </>
                                            ):(
                                                <Text> ... </Text>
                                            )}
                                            </Td>
                                         
                                         </Tr>
                            }) : (
                                <Tr>En attente ...</Tr>
                            )}
                        </Tbody>
                        </Table>
        </>
  )
}

export default vote