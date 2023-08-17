"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Flex, Text, Image } from "@chakra-ui/react";

const Header = () => {

    return (
        <Flex p="2rem" justifyContent="space-between" alignItems="Center">
            <Text>
            <Image
                    borderRadius='full'
                    boxSize='150px'
                    src='LogoARPAwards.png'
                    alt='ARPAwards'
                    />
            </Text>
            <ConnectButton  label="Se connecter" showBalance={false} />
        </Flex>
    )
}

export default Header