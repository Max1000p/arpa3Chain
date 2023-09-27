import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import { useThemeContext } from "@/context/theme"
import Winner from "../components/winner"
import Voter from "../components/vote"
import { Grid,GridItem, Card, CardBody,CardHeader,useToast,Textarea, Heading,UnorderedList,
         Button, Stack, ListItem, VStack,Text, Divider,Table,TableCaption,Thead,Tr,Td,Th,Tbody, Tag,
          } from '@chakra-ui/react'
import { hardhat,arpa3Chain } from 'wagmi/chains'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { readContract,prepareWriteContract, writeContract } from '@wagmi/core'
import Contract from '../public/Arpa3.json'
import TokenContract from '../public/ArpaCoin.json'
import { contractAddress, tokenAddress } from '../constants.js'
import { ethers } from 'ethers'

const privilege = () => {
    
    const { isConnected, address : addressAccount } = useAccount()
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
    const [orders,setOrders] = useState([])
    const [pricePrivilege,setPricePrivilege] = useState(null)
   
    const { workflowStatus, setWorkflowStatus } = useThemeContext(); 

    const [transactionHash, setTransactionHash] = useState('');
    const [confirmationCount, setConfirmationCount] = useState(0);

    const getBalanceEth = async() => {
        try {
            const data = await readContract({
                address: contractAddress,
                account: addressAccount,
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
                account: addressAccount,
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
           
            setGain(ethers.utils.formatEther(data))
            getArpaCoin()
        } catch (err) {
            console.log(err.message)
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

    const toast = useToast()
    
    const addNewPrivilege = async() => {
        if( privi != ''){
            let amount = ethers.utils.parseEther(pricePrivilege)

            try {
                const { request } = await prepareWriteContract({
                    address: contractAddress,
                    abi: Contract.abi,
                    functionName: "addPrivilege",
                    args: [privi],
                    value: amount
                });

                const { hash } = await writeContract(request)
                const tx = await client.waitForTransactionReceipt( 
                    { hash: hash }
                )
                console.log(tx)

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

    const approve = async() => {
        
        try {
            const { request } = await prepareWriteContract({
                address: tokenAddress,
                abi: TokenContract.abi,
                account: addressAccount,
                functionName: "approve",
                args: [contractAddress,2000000000000000000],
            });
            await writeContract(request)
            
            toast({
                title: 'Autorisation dépense Token APCoin',
                description: `Autorisation de transfert de token APCoin pour l'achat de privilège OK`,
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
                    description: "Echec dans l'autorisation",
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
                args: [addressAccount,contractAddress],
            });      
            setAllowance(data)
        } catch (err) {
            console.log(err.message)
        }
    }

    const buyToken = async(index,amount) => {
        if( amount > 0 ){
            try {
                const { request } = await prepareWriteContract({
                    address: contractAddress,
                    abi: Contract.abi,
                    account: addressAccount,
                    functionName: "buyPrivilege",
                    args: [index,Number(amount)],
                });
                await writeContract(request)

                toast({
                    title: 'Achat du privilege',
                    description: `Ton privilège est disponible, a toi de le demander quand tu le souhaiteras`,
                    status: 'success',
                    duration: 3000,
                    position: 'top',
                    isClosable: true,
                })         
                getArpaCoin()
                checkAllowance()
                getListPrivilege()
                getOrders()
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

    const getOrders = async() => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "getOrders"
            });
            console.log("liste acquis")
            console.log(data)
            setOrders(data)
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        getGain()
        getPrivilegePrice()
        getListPrivilege()
        getBalanceEth()
        getMyBalanceDep()
        getArpaCoin()
        checkAllowance()
        getOrders()
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
                <Textarea size="lg" variant='flushed' placeholder='Votre souhait ...' value={privi} onChange={(e) => setPrivi(e.target.value)} />
                <Text fontSize='xs' color='tomato'>Coût {pricePrivilege} Ether</Text>
                <Button colorScheme='purple' onClick={() => addNewPrivilege()} >Enregister</Button>
            </Stack>
            </CardBody>
        </Card>

        </VStack>

        <VStack w="full" h="full" p={10} spacing={10} alignItems={"flex-start"}>                 
        <Grid templateColumns='repeat(4, 1fr)' gap={20}>
            <GridItem w='100%' h='10' >
                <Card align='center'>
                    <CardHeader>
                        <Heading size='md'>SOLDE APCoin</Heading>
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
                            <Th>Coût APCoin</Th>
                            <Th>Acheter</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                    
                {listePrivilege.length > 0 ? listePrivilege.map((event, index) => {
                        let amount = ethers.utils.formatEther(event.amount)
                        if(event.isActive == true)
                                return <Tr key={uuidv4()}>                                   
                                        <Td>{event.description}</Td>
                                        <Td>{amount}</Td>
                                        <Td>
                                        {event.amount > 0 && balanceArpa > event.amount ? (
                                            <>
                                            {allowance >= event.amount ? (
                                            <Button colorScheme='teal' variant='outline'
                                            onClick={()=>buyToken(index,event.amount)}>Buy</Button>
                                            ):(<Button colorScheme='purple' onClick={() => approve()} >Autoriser</Button>)}
                                            </>
                                        ) :(
                                            <Text size='xs'><Button colorScheme='red' variant='ghost'>;(</Button></Text>
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

                <Divider mt={10} orientation='horizontal' />

                <Card align='center' mb={30}>
                    <CardHeader>
                        <Heading size='md'>PRIVILEGE ACQUIS</Heading>
                    </CardHeader>
                    <CardBody>
                    <UnorderedList>
                        {orders.length > 0 ? 
                            orders.map((event) => {
                                if (event.winnerAddress == addressAccount)
                                return <ListItem key={uuidv4()}>{event.descprivi} - 
                                    <Tag colorScheme='teal'>
                                        {!event.consoprivi ? (<Text>Disponible</Text>):(<Text>Consommé</Text>)}
                                    </Tag>
                                </ListItem>  
                            }) : (
                                <ListItem>-</ListItem>
                            )}
                        </UnorderedList>
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