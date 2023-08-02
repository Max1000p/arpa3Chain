"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Flex, Text } from "@chakra-ui/react";

const Header = () => {

    const http = require('http')
    const httpServer = http.createServer()

    httpServer.on('request', (request, response) => {
        // On spécifie l'entête pour le CORS
        response.setHeader('Access-Control-Allow-Origin', '*');

        // On gère le cas où le navigateur fait un pré-contrôle avec OPTIONS ...
        // ... pas besoin d'aller plus loin dans le traitement, on renvoie la réponse
        if (request.method === 'OPTIONS') {
            // On liste des méthodes et les entêtes valides
            response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin, Authorization')
            response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')

            return response.end()
        }
    })

    return (
        <Flex p="2rem" justifyContent="space-between" alignItems="Center">
            <Text>
                Logo
            </Text>
            <ConnectButton  label="Sign in" showBalance={true} />
        </Flex>
    )
}

export default Header