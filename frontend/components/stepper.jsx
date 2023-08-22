import React from 'react'
import { useThemeContext } from "@/context/theme"
import {
    Box,
    Step,StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    useSteps,Flex
  } from '@chakra-ui/react'

import { hardhat,arpa3Chain } from 'wagmi/chains'
import { useState, useEffect } from 'react'
import { createPublicClient, http } from 'viem'
import { readContract } from '@wagmi/core'
import Contract from '../public/Arpa3.json'


const stepper = () => {

    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    const transport = http('https://127.0.0.1:8545')
    // Create client for Viem
    const client = createPublicClient({
        chain: hardhat,
        transport,
    })
    const steps = [
        { title: 'First', description: 'Liste privilèges' },
        { title: 'Second', description: 'Votes ouverts' },
        { title: 'Third', description: 'Votes fermés' },
      ]
    
    const { activeStep, setActiveStep } = useSteps({
        initialStep: 0,
    })
    
    const { workflowStatus, setWorkflowStatus } = useThemeContext();
    const { sessionID, setSessionID } = useThemeContext();
    const getworkflowStatus = async() => {
      try {
          const data = await readContract({
              address: contractAddress,
              abi: Contract.abi,
              functionName: "workflowstatus"
          });
          setWorkflowStatus(data);
          // return data;
      } catch (err) {
          console.log(err.message)
      }
    }

    const getSessionID = async() => {
        try {
            const data = await readContract({
                address: contractAddress,
                abi: Contract.abi,
                functionName: "votingSessionNumber"
            });
            setSessionID(data);
            // return data;
        } catch (err) {
            console.log(err.message)
        }
      }

    getworkflowStatus()
    getSessionID()
    
  return (
    
    <Stepper size='lg' index={workflowStatus} mr={200} ml={200}>
      {steps.map((step, index) => (
        <Step key={index}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>

          <Box flexShrink='0'>
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </Box>

          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  )
}

export default stepper