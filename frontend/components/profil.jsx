import React from 'react'
import { useThemeContext } from "@/context/theme"
import { Center, Card, CardBody,CardHeader, CardFooter,useToast, Heading, Button, Stack, Input, Select } from '@chakra-ui/react'
import { hardhat,arpa3Chain } from 'wagmi/chains'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { readContract,prepareWriteContract, writeContract } from '@wagmi/core'
import Contract from '../public/Arpa3.json'

const profil = () => {

    const { isConnected, address : addressAccount } = useAccount()
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    const transport = http('https://127.0.0.1:8545')
    // Create client for Viem
    const client = createPublicClient({
        chain: hardhat,
        transport,
    })
    const [name, setName] = useState("")
    const [firstname, setFirstName] = useState("")
    const [service, setService] = useState("")
    const {IsAccountExist, setIsAccountExist} = useThemeContext();
    const toast = useToast()

    const addNewProfil = async() => {
        if( name != '' && firstname != '' && service != ''){
            try {
                const { request } = await prepareWriteContract({
                    address: contractAddress,
                    abi: Contract.abi,
                    functionName: "setProfilAndProposal",
                    args: [name,firstname,service]
                });
                await writeContract(request)
                
                toast({
                    title: 'Enregistrement du profil',
                    description: `Votre compte ${firstname} a bien été crée, c'est partit pour l'action`,
                    status: 'success',
                    duration: 3000,
                    position: 'top',
                    isClosable: true,
                })
                setName("")
                setFirstName("")
                setIsAccountExist(true)
            }
            catch(err) {
                console.log(err)
                toast({
                    title: 'Error!',
                    description: 'Le compte existe déjà avec cette adresse',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
        } else {
            toast({
                title: 'Champs requis obligatoire',
                description: 'tous les champs doivent être completés',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }

  return (
    <>
        <Card align='center' mt={10} width={300}>
            <CardHeader>
                <Heading size='md'>CREATION DU PROFIL</Heading>
            </CardHeader>
            <CardBody>
            <Stack spacing={3}>
                <Input variant='flushed' placeholder='Nom' value={name} onChange={(e) => setName(e.target.value)}/>
                <Input variant='flushed' placeholder='Prénom' value={firstname} onChange={(e) => setFirstName(e.target.value)} />
                <Select variant='flushed' placeholder='Choisir une option' onChange={(e) => setService(e.target.value)}>
                    <option value='ADMINISTRATIF'>ADMINISTRATIF</option>
                    <option value='CHEF DE PROJET'>CHEF DE PROJET</option>
                    <option value='COMMERCIAL'>COMMERCIAL</option>
                    <option value='COMMUNICATION'>COMMUNICATION</option>
                    <option value='DEVELOPPEUR'>DEVELOPPEUR</option>
                    <option value='DIRECTION'>DIRECTION</option>
                    <option value='WEBMARKETEUR'>WEBMARKETEUR</option>
                    <option value='WEBDESIGNER'>WEBDESIGNER</option>
                </Select>
            </Stack>
            </CardBody>
            <CardFooter>
                <Button colorScheme='purple' onClick={() => addNewProfil()} >Enregister</Button>
            </CardFooter>
        </Card>
   
    </>
    
  )
}

export default profil