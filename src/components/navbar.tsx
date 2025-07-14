import React from 'react'
import { Box, Link, StackDivider, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'

interface NavbarProps {
    links: string[];
    current: string;
}

const Navbar = ({ links, current }: NavbarProps) => {
    return (
        <Box as="nav" border="1px solid" borderColor="border-color" borderRadius="md" p={4} bg="surface-bg">
            <VStack align="start" divider={<StackDivider borderColor="gray.200" />}>
                {links.map((link, index) => (
                    <NextLink key={index} href={`/profile/${link.toLowerCase()}`} passHref>
                        <Link
                            px={4}
                            borderRadius="md"
                            color={current === link ? "blue.500" : "gray.600"}
                            fontWeight={current === link ? "bold" : "normal"}
                            textDecoration="none"
                        >
                            {link}
                        </Link>
                    </NextLink>
                ))}
            </VStack>
        </Box>
    )
}

export default Navbar