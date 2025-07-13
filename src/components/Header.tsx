import { Box, Button, Flex, Heading, Link, Avatar } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ColorModeToggle from "./ColorModeToggle";
import { isLoggedIn, removeAuthToken } from "@/lib/api";
import { useRouter } from "next/router";

const Header = () => {
    const [isClient, setIsClient] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
        setLoggedIn(isLoggedIn());
    }, []);

    return (
        <Box
            bg="surface-bg"
            borderBottom="1px"
            borderColor="border-color"
            py={4}
            px={6}
        >
            <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
                <Link
                    href="/"
                    _hover={{ textDecoration: "none", transform: "scale(1.05)" }}
                    transition="all 0.2s"
                >
                    <Heading size="lg" color="text-primary" fontWeight="bold">
                        💣
                    </Heading>
                </Link>
                <Flex gap={4} align="center">
                    {isClient && loggedIn ? (
                        <Button
                            colorScheme="red"
                            size={"sm"}
                            variant="solid"
                            onClick={() => {
                                removeAuthToken();
                                window.location.reload();
                            }}
                        >
                            Logout
                        </Button>
                    ) : isClient ? (
                        <Link href="/userauth">Login/Register</Link>
                    ) : null}

                    <ColorModeToggle />
                    <Avatar as="button" size="sm" onClick={() => { router.push("/profile") }} />
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;
