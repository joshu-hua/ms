import { Box, Button, Flex, Heading, Link, Avatar, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ColorModeToggle from "./ColorModeToggle";
import { isLoggedIn, removeAuthToken, getCurrentUsername } from "@/lib/api";
import { useRouter } from "next/router";

const Header = () => {
    const [isClient, setIsClient] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
        const userLoggedIn = isLoggedIn();
        setLoggedIn(userLoggedIn);

        if (userLoggedIn) {
            const currentUsername = getCurrentUsername();
            setUsername(currentUsername);
        }
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
                        <>
                            {username && (
                                <Text fontSize="sm" color="text-secondary">
                                    Welcome, {username}
                                </Text>
                            )}
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
                        </>
                    ) : isClient ? (
                        <Link href="/userauth">Login/Register</Link>
                    ) : null}

                    <ColorModeToggle />
                    <Avatar
                        as="button"
                        size="sm"
                        onClick={() => {
                            if (loggedIn) {
                                router.push("/profile/stats");
                            } else {
                                router.push("/");
                            }
                        }}
                    />
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;
