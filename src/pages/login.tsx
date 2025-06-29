import { useState, useReducer } from "react";
import { useRouter } from "next/router";

import {
    Box,
    Flex,
    Text,
    FormControl,
    Input,
    Button,
    Checkbox,
    Spinner,
    Center
} from "@chakra-ui/react";
import Link from "next/link";
import Header from "@/components/Header";

type SignUpState = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// actions for the reducer (modification of states)
type SignUpAction =
    | { type: "CHANGE_USER_NAME"; payload: string }
    | { type: "CHANGE_EMAIL"; payload: string }
    | { type: "CHANGE_PASSWORD"; payload: string }
    | { type: "CHANGE_CONFIRM_PASSWORD"; payload: string };

const initialState: SignUpState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
};

function signUpReducer(state: SignUpState, action: SignUpAction): SignUpState {

    switch (action.type) {
        case "CHANGE_USER_NAME":
            return { ...state, username: action.payload };
        case "CHANGE_EMAIL":
            return { ...state, email: action.payload };
        case "CHANGE_PASSWORD":
            return { ...state, password: action.payload };
        case "CHANGE_CONFIRM_PASSWORD":
            return { ...state, confirmPassword: action.payload };
        default:
            return state;
    }
}


const Signup = () => {
    const [state, dispatch] = useReducer(signUpReducer, initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // validate all fields in the form
    // email must be valid, password must be strong
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string) => {
        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return false;
        }
        else if (!/[A-Z]/.test(password)) {
            setError("Password must contain at least one uppercase letter");
            return false;
        }
        else if (!/[a-z]/.test(password)) {
            setError("Password must contain at least one lowercase letter");
            return false;
        }
        else if (!/[0-9]/.test(password)) {
            setError("Password must contain at least one digit");
            return false;
        }
        else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            setError("Password must contain at least one special character");
            return false;
        }

        return true;

    }

    const validateForm = () => {
        if (!state.username) {
            setError("Username is required");
            return false;
        }

        if (!state.email) {
            setError("Email is required");
            return false;
        }

        if (!validateEmail(state.email)) {
            setError("Please enter a valid email address");
            return false;
        }

        if (!validatePassword(state.password)) {
            return false;
        }

        if (state.password !== state.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }


        if (!state.username || !state.email || !state.password || !state.confirmPassword) {
            setError("All fields are required");
            return false;
        }

        return true;
    };

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();

    //     if (!validateForm()) {
    //         return;
    //     }

    //     setIsLoading(true); // set loading while we try to create the user
    //     setError(null);
    //     try {
    //         const newUser: NewUser = {
    //             id: 0, // backend will generate this
    //             firstName: state.firstName,
    //             lastName: state.lastName,
    //             email: state.email,
    //             password: state.password,
    //             role: state.role as "Lecturer" | "Candidate",
    //         };

    //         const result = await userApi.createUser(newUser);

    //         if (result.success) {
    //             console.log("User created successfully");
    //             router.push("./signin");
    //         } else {
    //             // show error message generated in backend
    //             setError(result.message);
    //         }

    //     } catch (error) {
    //         console.error("Unexpected error creating user:", error);
    //         setError("An unexpected error occurred. Please try again.");
    //     } finally {
    //         setIsLoading(false);
    //     }

    // };


    if (isLoading) {
        return (
            <Box bgSize="cover" h="100vh">
                <Flex align="center" justify="center" height="100%">
                    <Box
                        p="6"
                        py={10}
                        borderWidth="1px"
                        bg="white"
                        opacity={0.95}
                        minW={"350px"}
                        maxW={"17.5%"}
                    >
                        <Center flexDirection="column" h="400px">
                            <Spinner
                                thickness="4px"
                                speed="0.65s"
                                emptyColor="gray.200"
                                color="green.500"
                                size="xl"
                            />
                            <Text mt={4} fontSize="lg" fontWeight="medium">
                                Creating your account...
                            </Text>
                        </Center>
                    </Box>
                </Flex>
            </Box>
        );
    }
    return (
        <>
            <Header />
            <Box bgSize="cover" h="100vh">
                <Flex align="center" justify="center" height="100%">
                    <Box
                        p="6"
                        py={10}
                        borderWidth="1px"
                        bg={"panel-bg"}
                        opacity={0.95}
                        minW={"350px"}
                        maxW={"17.5%"}
                    >
                        <Text
                            textAlign="center"
                            fontSize="3xl"
                            mb="50px"
                            data-testid="title"
                        >
                            Sign up
                        </Text>

                        <form
                            onSubmit={() => { console.log("hi") }}
                        >
                            <FormControl mb="10px">
                                <Input
                                    id="user-name"
                                    data-testid="user-name"
                                    name="username"
                                    type="text"
                                    placeholder="Username *"
                                    value={state.username}
                                    onChange={(e) => dispatch({ type: "CHANGE_USER_NAME", payload: e.target.value })}

                                />
                            </FormControl>
                            <FormControl mb="10px">
                                <Input
                                    id="email"
                                    data-testid="email"
                                    name="email"
                                    type="text"
                                    placeholder="Email Address *"
                                    value={state.email}
                                    onChange={(e) => dispatch({ type: "CHANGE_EMAIL", payload: e.target.value })}
                                />
                            </FormControl>
                            <FormControl mb="10px">
                                <Input
                                    id="password"
                                    data-testid="password"
                                    name="password"
                                    type="password"
                                    placeholder="Password *"
                                    value={state.password}
                                    onChange={(e) => dispatch({ type: "CHANGE_PASSWORD", payload: e.target.value })}
                                />
                            </FormControl>
                            <FormControl mb="20px">
                                <Input
                                    id="confirm-password"
                                    data-testid="confirm-password"
                                    name="confirm-password"
                                    type="password"
                                    placeholder="Confirm Password *"
                                    value={state.confirmPassword}
                                    onChange={(e) => dispatch({ type: "CHANGE_CONFIRM_PASSWORD", payload: e.target.value })}
                                />
                            </FormControl>
                            <Flex
                                gap={"10px"}
                                maxW={"100%"}
                                mb={"10px"}
                                justify="left"
                                alignItems={"center"}
                            >
                                <Checkbox mr="20px" required></Checkbox>
                                <Flex maxW={"75%"}>
                                    <Text textAlign="left" fontSize="sm" mb="10px">
                                        By signing up, you agree to our Terms of Service and
                                        Privacy Policy
                                    </Text>
                                    <Text color={"red.500"} fontSize="lg"> * </Text>
                                </Flex>
                            </Flex>
                            {error && (
                                <Text color="red.500" mb="3" textAlign="center">
                                    {error}
                                </Text>
                            )}
                            <Button
                                type="submit"
                                width="50%"
                                name="Signup"
                                w={"100%"}
                                isLoading={isLoading}
                                loadingText="Signing up"
                                variant={"outline"}
                                colorScheme="blue"
                            >
                                Submit
                            </Button>
                        </form>
                    </Box>
                </Flex>
            </Box>
        </>
    );
};

export default Signup;
