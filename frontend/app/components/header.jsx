"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Flex, Text } from "@chakra-ui/react";

const Header = () => {

    return (
        <Flex p="2rem" justifyContent="space-between" alignItems="Center">
            <Text>
                ARPACHAIN
            </Text>
            <ConnectButton  label="Se connecter" showBalance={false} />
        </Flex>
    )
}

export default Header