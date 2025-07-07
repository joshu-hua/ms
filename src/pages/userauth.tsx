import { useState, useReducer, useEffect } from "react";
import { useRouter } from "next/router";
import { loginUser, registerUser } from "@/lib/api";

import {
    Box,
    Flex,
    Text,
    FormControl,
    Input,
    Button,
    Checkbox,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    TabPanels
} from "@chakra-ui/react";
import Header from "@/components/Header";
import { CreateUserRequest, LoginRequest } from "@/types";


type LoginState = {
    email: string;
    password: string;
}


type LoginAction =
    | { type: "CHANGE_EMAIL_LOGIN"; payload: string }
    | { type: "CHANGE_PASSWORD_LOGIN"; payload: string };


const initialLoginState = {
    email: "",
    password: "",
};


function loginReducer(state: LoginState, action: LoginAction) {
    switch (action.type) {
        case "CHANGE_EMAIL_LOGIN":
            return { ...state, email: action.payload };
        case "CHANGE_PASSWORD_LOGIN":
            return { ...state, password: action.payload };
        default:
            return state;
    }
}

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


const UserAuth = () => {
    const router = useRouter();
    const [state, dispatch] = useReducer(signUpReducer, initialState);
    const [loginState, loginDispatch] = useReducer(loginReducer, initialLoginState);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // for signup
    const [loginError, setLoginError] = useState<string | null>(null); // for login

    // validate all fields in the form
    // email must be valid, password must be strong
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string) => { // for SIGNUP
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

    const validateForm = () => { // for SIGNUP
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

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true); // set loading while we try to create the user
        setError(null);
        try {
            const newUser: CreateUserRequest = {
                username: state.username,
                email: state.email,
                password: state.password,
            };

            const result = await registerUser(newUser);

            if (result.success) {
                console.log("User created successfully");
                router.push("/");
            } else {
                // show error message generated in backend
                setError(result.message);
            }

        } catch (error) {
            console.error("Unexpected error creating user:", error);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }

    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!loginState.email || !loginState.password) {
            setLoginError("Email and password are required");
            return;
        }

        if (!validateEmail(loginState.email)) {
            setLoginError("Please enter a valid email address");
            return;
        }

        setIsLoading(true); // set loading while we try to login
        setLoginError(null);

        try {
            const credentials: LoginRequest = {
                email: loginState.email,
                password: loginState.password,
            };

            const result = await loginUser(credentials);

            if (result.success && result.token) {
                console.log("Login successful");

                if (typeof window !== "undefined") {
                    localStorage.setItem("authToken", result.token);
                }

                router.push("/");
            } else {
                // show error message generated in backend
                setLoginError(result.message || "Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Unexpected error during login:", error);
            setLoginError("An unexpected error occurred. Please try again.");
        }
        finally {
            setIsLoading(false);
        }

    };


    return (
        <>
            <Header />
            <Box h="100vh">
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
                        <Tabs variant={"soft-rounded"}>
                            <TabList>
                                <Tab color={"text-secondary"}>
                                    Login
                                </Tab>
                                <Tab color={"text-secondary"}>
                                    Register
                                </Tab>
                            </TabList>

                            <TabPanels>
                                <TabPanel pt={12} pb={0}>

                                    <form onSubmit={handleLogin}>
                                        <FormControl mb="10px">
                                            <Input
                                                id="email-login"
                                                data-testid="email-login"
                                                name="email-login"
                                                type="text"
                                                placeholder="Email Address *"
                                                value={loginState.email}
                                                onChange={(e) => loginDispatch({ type: "CHANGE_EMAIL_LOGIN", payload: e.target.value })}
                                            />
                                        </FormControl>
                                        <FormControl mb="10px">
                                            <Input
                                                id="password-login"
                                                data-testid="password-login"
                                                name="password-login"
                                                type="password"
                                                placeholder="Password *"
                                                value={loginState.password}
                                                onChange={(e) => loginDispatch({ type: "CHANGE_PASSWORD_LOGIN", payload: e.target.value })}
                                            />
                                        </FormControl>
                                        {loginError && (
                                            <Text color="red.500" mb="3" textAlign="center">
                                                {loginError}
                                            </Text>
                                        )}
                                        <Button
                                            type="submit"
                                            width="50%"
                                            name="Login"
                                            w={"100%"}
                                            variant={"outline"}
                                            colorScheme="blue"
                                            {...loginError ? {} : { mt: 4 }}
                                            isLoading={isLoading}
                                            loadingText="Logging in..."
                                        >
                                            Login
                                        </Button>
                                    </form>
                                </TabPanel>
                                <TabPanel pt={12} pb={0}>

                                    <form
                                        onSubmit={handleRegister}
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
                                            name="Register"
                                            w={"100%"}
                                            isLoading={isLoading}
                                            loadingText="Registering..."
                                            variant={"outline"}
                                            colorScheme="blue"
                                        >
                                            Register
                                        </Button>
                                    </form>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                </Flex>
            </Box>
        </>
    );
};

export default UserAuth;
