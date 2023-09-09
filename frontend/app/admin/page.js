"use client"
import { v4 as uuidv4 } from 'uuid';
import { useThemeContext } from "@/context/theme"
import Header from "../../components/header"
import {Flex,Heading,Input,Button, Select,Table,TableCaption,Thead,Tr,Td,Th,Tbody,useToast,
        Modal,Text,
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
import Contract from '../../public/Arpa3.json'
import { contractAddress } from '../../constants.js'
import { ethers } from 'ethers'

const admin = () => {
    const { isConnected, address : addressAccount } = useAccount()
    const [isTheOwner, setIsTheOwner] = useState(0)
    const [listePrivilege, setlistePrivilege] = useState("")
    const [indexprivi,setIndexPrivi] = useState(null)
    const [amountPrivi,setAmountPrivi] = useState(0)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [votestatus,setVoteStatus] = useState(null)
    const [voteInProgress,setVoteInProgress] = useState(0)
    const [pricePrivilege,setPricePrivilege] = useState(null)
    const [gain,setGain] = useState(null)
    const toast = useToast()

    const transport = http('https://127.0.0.1:8545')
    // Create client for Viem
    const client = createPublicClient({
        chain: hardhat,
        transport,
    })

    const isOwner = async() => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "owner"
            });
        setIsTheOwner(data) 
        } catch (err) {
            console.log(err.message)
        }
    }

    const getListPrivilege = async() => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "getPrivilege"
            });
            setlistePrivilege(data)
            console.log(data)
        } catch (err) {
            console.log(err.message)
        }
    }

    const getVoteInProgress = async() => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "number"
            });
            setVoteInProgress(data)
            console.log(data)
        } catch (err) {
            console.log(err.message)
        }
    }

    const addPrice = async() => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "addPrivilegePrice",
                args: [indexprivi,ethers.utils.parseEther(amountPrivi)]
            });
            await writeContract(request)
            
            toast({
                title: 'Valorisation du privilège',
                description: `Valeur du privilège ajoutée`,
                status: 'success',
                duration: 3000,
                position: 'top',
                isClosable: true,
            })
            getListPrivilege()
            setIndexPrivi(null)
            setAmountPrivi(null)
            getVoteInProgress()
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
    }

    const setVoteSession = async() => {

        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "startVoteSession",
                args: []
            });
            await writeContract(request)
            
            toast({
                title: 'Session de Vote',
                description: `Le changement de la session de vote à bien été modifié`,
                status: 'success',
                duration: 3000,
                position: 'top',
                isClosable: true,
            })
            setVoteStatus(null)
            getVoteInProgress()
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
    }

    const getPrivilegePrice = async() => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "amountpriv"
            });
            setPricePrivilege(ethers.utils.formatEther(data))
        } catch (err) {
            console.log(err.message)
        }
    }

    const getGain = async() => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "rewardAmount"
            });
            setGain(ethers.utils.formatEther(data))
        } catch (err) {
            console.log(err.message)
        }
    }
    const addNewGain = async() => {
        
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "setRewardAmount",
                args: [ethers.utils.parseEther(gain)]
            });
            await writeContract(request)
            
            toast({
                title: 'Gestion des gains',
                description: `Le nouveau gain est effectif immédiatement à la clotûre du vote`,
                status: 'success',
                duration: 3000,
                position: 'top',
                isClosable: true,
            })
            getGain()
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
    }

    const addAmountPrivilegePrice = async() => {

        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "setAmountPrivilege",
                args: [ethers.utils.parseEther(pricePrivilege)]
            });
            await writeContract(request)
            
            toast({
                title: 'Prix pour ajouter un privilège',
                description: `Le prix à bien été modifié`,
                status: 'success',
                duration: 3000,
                position: 'top',
                isClosable: true,
            })
            getPrivilegePrice()
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
    }

    const moderatePrivilege = async() => {
        try {
            const { request } = await prepareWriteContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "moderatePrivilege",
                args: [indexprivi, false]
            });
            await writeContract(request)
            getListPrivilege()
            toast({
                title: 'Modération du privilège',
                description: `Le privilege à été retiré des propositions`,
                status: 'success',
                duration: 3000,
                position: 'top',
                isClosable: true,
            })
            
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
    }

    useEffect(() => {
        isOwner()
        getPrivilegePrice()
        getGain()
        getListPrivilege()
        getVoteInProgress()
     }, [])


return (
    <>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>COUT DU PRIVILEGE</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                <Input variant='flushed' placeholder='Coût du privilège' value={amountPrivi} onChange={(e) => setAmountPrivi(e.target.value)} />
                </ModalBody>

                <ModalFooter>
                    <Button mt={2} size='xs' colorScheme='teal' variant='outline'
                    onClick={()=> {addPrice();onClose()}}>MODIFIER</Button>

                    <Button mt={2} size='xs' colorScheme='red' variant='solid'
                    onClick={()=> {moderatePrivilege();onClose()}}>NON ELIGIBLE / POSSIBLE</Button>

                </ModalFooter>
            </ModalContent>
        </Modal>      

        <Header />
        {isConnected && addressAccount == isTheOwner ? (

        <>
        <Flex width="40%">
            <Flex direction="column" width="100%" ml={30} mr={30}>
                <Heading as='h2' size='sm' mt="2rem">
                    Nombre de vote en cours
                </Heading>
                <Text size='sm'>{Number(voteInProgress)}</Text>
            </Flex>
        </Flex>
        <Flex width="40%">
            <Flex direction="column" width="100%" ml={30} mr={30}>
                <Heading as='h2' size='sm' mt="2rem">
                    Gains en jeu
                </Heading>
                <Input onChange={e => setGain(e.target.value)} placeholder="Gain en Token" value={Number(gain)} />
                <Button colorScheme='purple' onClick={() => addNewGain()} >VALIDER</Button>
            </Flex>
        </Flex>
        <Flex width="40%">
            <Flex direction="column" width="100%" ml={30} mr={30}>
                <Heading as='h2' size='sm' mt="2rem">
                    Coût pour ajouter un privilege en Eth
                </Heading>
                <Input onChange={e => setPricePrivilege(e.target.value)} placeholder="Montant en Eth" value={pricePrivilege} />
                <Button colorScheme='purple' onClick={() => addAmountPrivilegePrice()} >VALIDER</Button>
            </Flex>
        </Flex>
        <Flex width="60%">
                <Flex direction="column" width="100%" ml={30} mr={30}>
                    <Heading as='h2' size='sm' mt="2rem">
                        Valorisation et modération des privilèges
                    </Heading>
                    <Flex mt="1rem">
                        <Table variant="striped" w='100%' colorScheme="blue" size="md">
                            <TableCaption>Listing des privilèges / prix</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>Privilège</Th>
                                    <Th>Coût APCoin</Th>
                                    <Th></Th>
                                    
                                </Tr>
                            </Thead>
                            <Tbody>
                                {listePrivilege.length > 0 ? listePrivilege.map((event, index) => {
                                    let amount = ethers.utils.formatEther(event.amount);
                                    if(event.isActive == true)
                                    return <Tr key={uuidv4()}>
                                        <Td>{event.description}</Td>
                                        <Td>{amount}</Td>
                                        <Td>
                                            <Button colorScheme='whatsapp' onClick={() => { onOpen(); setIndexPrivi(index); setAmountPrivi(amount); } }>GERER</Button>
                                        </Td>
                                       
                                    </Tr>;
                                }) : (
                                    <Tr>En attente ...</Tr>
                                )}
                            </Tbody>
                        </Table>
                    </Flex>
                </Flex>
            </Flex>
            <Flex width="40%">
                <Flex direction="column" width="100%" ml={30} mr={30} mb={100}>
                    <Heading as='h2' size='sm' mt="2rem">
                        Ouverture / Fermeture Vote
                    </Heading>
                    <Select variant='flushed' placeholder='Choisir une option' onChange={(e) => setVoteStatus(e.target.value)}>
                        <option value='2'>NOUVELLE SESSION DE VOTE</option>
                        <option value='3'>FERMETURE VOTE ET RESULTAT</option>
                    </Select>
                    <Button colorScheme='purple' onClick={() => setVoteSession()} >VALIDER</Button>
                </Flex>
            </Flex>
            </>
     ) : (
        <Flex p="2rem" justifyContent="center" alignItems="center">
            <Heading>Accès non autorisé</Heading>
        </Flex>

    )}
    </>

  )
}

export default admin