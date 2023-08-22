import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import { useThemeContext } from "@/context/theme"
import Winner from "../components/winner"
import Voter from "../components/vote"
import { Grid,GridItem, Card, CardBody,CardHeader, CardFooter,useToast,Textarea, Heading, 
         Button, Stack, List, VStack, ListItem, Text, Divider,Table,TableCaption,Thead,Tr,Td,Th,Tbody,
          } from '@chakra-ui/react'
import { hardhat,arpa3Chain } from 'wagmi/chains'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { readContract,prepareWriteContract, writeContract } from '@wagmi/core'
import Contract from '../public/Arpa3.json'
import TokenContract from '../public/ArpaCoin.json'
import { ethers } from 'ethers'

const privilege = () => {
    
    const { isConnected, address : addressAccount } = useAccount()
    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    const transport = http('http://localhost:8545')
    // Create client for Viem
    const client = createPublicClient({
        chain: hardhat,
        transport,
    })
    const [privi,setPrivi] = useState("")
    const [listePrivilege, setlistePrivilege] = useState("")
    const [balanceEth,setBalanceEth] = useState(0)
    const [depbalanceEth,setDepBalanceEth] = useState(0)    
    const [gain,setGain] = useState(0)
    const [balanceArpa,setBalanceArpa] = useState(0)
    const [allowance, setAllowance] = useState(0)
    const [allowanceHuman, setAllowanceHuman] = useState(0)
   
    const { workflowStatus, setWorkflowStatus } = useThemeContext(); 

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

    const getMyBalanceDep = async() => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "getMyBalanceDep"
            });
            const value = ethers.BigNumber.from(data);
            const formattedValue = ethers.utils.formatUnits(value, 18)
            setDepBalanceEth(formattedValue.substring(0, formattedValue.indexOf(".") + 3))
        } catch (err) {
            console.log(err.message)
        }
    }

    const getArpaCoin = async()=>{
        try {
            const data = await readContract({
                address: contractAddress,
                account: addressAccount,
                abi: Contract.abi,
                functionName: "getArpaTokenBalance"
            });
            console.log('solde ARPATOKEN')
            console.log(ethers.utils.formatEther(data))
            const value = ethers.utils.formatEther(data);
            setBalanceArpa(data)

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
            const value = ethers.BigNumber.from(data);
            setGain(value)
            getArpaCoin()
        } catch (err) {
            console.log(err.message)
        }
    }

    const toast = useToast()
    
    const addNewPrivilege = async() => {
        if( privi != ''){
            let amount = ethers.utils.parseEther("0.5")
            try {
                const { request } = await prepareWriteContract({
                    address: contractAddress,
                    abi: Contract.abi,
                    functionName: "addPrivilege",
                    args: [privi],
                    value: amount
                });
                await writeContract(request)
                
                toast({
                    title: 'Enregistrement dans la liste',
                    description: `Ton privilège à correctement été ajouté à la liste`,
                    status: 'success',
                    duration: 3000,
                    position: 'top',
                    isClosable: true,
                })
                setPrivi("")
                getListPrivilege()
                getBalanceEth()
                getMyBalanceDep()
            }
            catch(err) {
                console.log(err)
                toast({
                    title: 'Error!',
                    description: 'Impossible de déposer un privilège pour le moment',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
        } else {

            toast({
                title: 'Champs obligatoire',
                description: 'Champs obligatoire pour le privilège',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }

    }

    const approve = async(amount) => {
        
        try {
            const { request } = await prepareWriteContract({
                address: tokenAddress,
                abi: TokenContract.abi,
                account: addressAccount,
                functionName: "approve",
                args: ["0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",5000000000000000000],
            });
            await writeContract(request)
            
            toast({
                title: 'Achat du privilege',
                description: `Ton privilège est disponible`,
                status: 'success',
                duration: 3000,
                position: 'top',
                isClosable: true,
            })         
            getListPrivilege()
            checkAllowance()
        }
            catch(err) {
                console.log(err)
                toast({
                    title: 'Error!',
                    description: 'Impossible paiement pour ce privilege',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
    }

    const checkAllowance = async() => {
        try {
            const data = await readContract({
                address: tokenAddress,
                abi: TokenContract.abi,
                account: addressAccount,
                functionName: "allowance",
                args: [addressAccount,"0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"],
            });      
            console.log(ethers.utils.formatEther(data))
            setAllowance(data)
        } catch (err) {
            console.log(err.message)
        }
    }

    const buyToken = async(index,amount) => {
        console.log(amount)
        if( amount > 0 ){
            try {
                const { request } = await prepareWriteContract({
                    address: contractAddress,
                    abi: Contract.abi,
                    account: addressAccount,
                    functionName: "buyPrivilege",
                    args: [index,amount],
                });
                await writeContract(request)

                getArpaCoin()
                
                toast({
                    title: 'Achat du privilege',
                    description: `Ton privilège est disponible, a toi de le demander quand tu le souhaiteras`,
                    status: 'success',
                    duration: 3000,
                    position: 'top',
                    isClosable: true,
                })         
                getListPrivilege()
            }
            catch(err) {
                console.log(err)
                toast({
                    title: 'Error!',
                    description: 'Impossible paiement pour ce privilege',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
        } else {

            toast({
                title: 'Erreur de montant',
                description: 'Problème avec le montant du privilege',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
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

    useEffect(() => {
        getGain()
        getListPrivilege()
        getBalanceEth()
        getMyBalanceDep()
        getArpaCoin()
        checkAllowance()
     }, [])

  return (
    <> 
     <VStack h="full" p={10} spacing={5} alignItems={"flex-start"}>
        <Card align='center'>
            <CardHeader>
                <Heading size='sd'>AJOUTER UN PRIVILEGE</Heading>
            </CardHeader>
            <CardBody>
            <Stack spacing={3}>
                <Textarea size="lg" variant='flushed' placeholder='Je voudrais ...' value={privi} onChange={(e) => setPrivi(e.target.value)} />
                <Text fontSize='xs' color='tomato'>Coût 0.5 Ether</Text>
                <Button colorScheme='purple' onClick={() => addNewPrivilege()} >Enregister</Button>
            </Stack>
            </CardBody>
            <CardFooter>
                <Stack spacing={3}>
                
                </Stack>
            </CardFooter>
        </Card>

        </VStack>

        <VStack w="full" h="full" p={10} spacing={10} alignItems={"flex-start"}>                 
        <Grid templateColumns='repeat(4, 1fr)' gap={20}>
            <GridItem w='100%' h='10' >
                <Card align='center'>
                    <CardHeader>
                        <Heading size='md'>SOLDE ARPACOIN</Heading>
                        <Text fontSize='2xl'>{ethers.utils.formatEther(balanceArpa)}</Text>
                    </CardHeader>
                </Card>
            </GridItem>
            <GridItem w='100%' h='10'>
            <Card align='center'>
                    <CardHeader>
                        <Heading size='md'>SOLDE ETH</Heading>
                        <Text fontSize='2xl'>{balanceEth}</Text>
                    </CardHeader>
                </Card>
            </GridItem>
            <GridItem w='100%' h='10'>
            <Card align='center'>
                    <CardHeader>
                        <Heading size='md'>DEPENSES ETH</Heading>
                        <Text fontSize='2xl'>{depbalanceEth}</Text>
                    </CardHeader>
                </Card>
            </GridItem>
            <GridItem w='100%' h='10'>
            <Card align='center'>
                    <CardHeader>
                        <Heading size='md'>GAIN EN JEU</Heading>
                        <Text fontSize='2xl'>{Number(gain)}</Text>
                    </CardHeader>
                   
                </Card>
            </GridItem>
        </Grid>
        
        <Divider mt={20} orientation='horizontal' />

        <Grid templateColumns='repeat(2, 1fr)' gap={10}>
        <GridItem w='100%' h='10' >
                <Card align='center'>
                    <CardHeader>
                        <Heading size='md'>LISTE DES PRIVILEGES</Heading>
                    </CardHeader>
                    <CardBody>
                    <Table variant="striped" w='100%' colorScheme="blue" size="md">
                        <TableCaption>Listing des privilèges / prix</TableCaption>
                        <Thead>
                            <Tr>
                            <Th>Privilège</Th>
                            <Th>Coût ARPACOIN</Th>
                            <Th>Acheter</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                    
                {listePrivilege.length > 0 ? listePrivilege.map((event, index) => {
                        let amount = ethers.utils.formatEther(event.amount)
                                return <Tr key={uuidv4()}>                                   
                                        <Td>{event.description}</Td>
                                        <Td>{amount}</Td>
                                        <Td>
                                        {event.amount > 0 && balanceArpa > event.amount ? (
                                            <>
                                            {allowance > event.amount ? (
                                            <Button colorScheme='teal' variant='outline'
                                            onClick={()=>buyToken(index,amount)}>Buy</Button>
                                            ):(<Button colorScheme='purple' onClick={() => approve()} >Autoriser</Button>)}
                                            </>
                                        ) :(
                                            <Text size='xs'>not possible</Text>
                                        )}
                                        </Td>
                                         </Tr>
                            }) : (
                                <Tr>En attente ...</Tr>
                            )}
                        </Tbody>
                        </Table>
                    </CardBody>
                </Card>
            </GridItem>
            <GridItem w='100%' h='10'>
            
            {workflowStatus == 2 || workflowStatus ==1 ? (
                <Card align='center'>
                    <CardHeader>
                        <Heading size='md'>VOTE DE LA SEMAINE</Heading>
                    </CardHeader>
                    <CardBody>
                        <Voter />
                    </CardBody>
                </Card>
            ):(
                <Card align='center'>
                    <CardHeader>
                        <Heading size='md'>AND THE WINNER IS</Heading>
                    </CardHeader>
                    <CardBody>
                        <Winner />
                    </CardBody>
                </Card>
            )}
            
            </GridItem>
        </Grid>

        </VStack>
    </>
  )
}

export default privilege