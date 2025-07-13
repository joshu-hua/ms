import React from 'react'
import { Box, Flex, Link, StackDivider, VStack } from '@chakra-ui/react'

interface NavbarProps {
    links: string[];
    current: string;
}

const Navbar = ({ links, current }: NavbarProps) => {
    return (
        <Box as="nav" border="1px solid" borderColor="border-color" borderRadius="md" p={4} bg="surface-bg">
            <VStack align="start" divider={<StackDivider borderColor="gray.200" />}>
                {links.map((link, index) => (
                    <Link
                        key={index}
                        href={`/profile/${link.toLowerCase()}`}
                        px={4}
                        borderRadius="md"
                        color={current === link ? "blue.500" : "gray.600"}
                        fontWeight={current === link ? "bold" : "normal"}                    >
                        {link}
                    </Link>
                ))}
            </VStack>
        </Box>
    )
}

export default Navbar