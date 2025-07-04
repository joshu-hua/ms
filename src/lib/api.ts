import { CreateUserRequest, LoginRequest, AuthResponse } from "@/types";

const API_BASE = "/api";

// Register a new user
export async function registerUser(
	userData: CreateUserRequest
): Promise<AuthResponse> {
	try {
		const response = await fetch(`${API_BASE}/auth/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		});

		const data: AuthResponse = await response.json();
		return data;
	} catch (error) {
		console.error("Error registering user:", error);
		return {
			success: false,
			message: "Network error. Please try again.",
		};
	}
}

// Login a user
export async function loginUser(
	credentials: LoginRequest
): Promise<AuthResponse> {
	try {
		const response = await fetch(`${API_BASE}/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(credentials),
		});

		const data: AuthResponse = await response.json();
		return data;
	} catch (error) {
		console.error("Error logging in:", error);
		return {
			success: false,
			message: "Network error. Please try again.",
		};
	}
}

// Store JWT token in localStorage
export function storeAuthToken(token: string): void {
	if (typeof window !== "undefined") {
		localStorage.setItem("authToken", token);
	}
}

// Get JWT token from localStorage
export function getAuthToken(): string | null {
	if (typeof window !== "undefined") {
		return localStorage.getItem("authToken");
	}
	return null;
}

// Remove JWT token from localStorage
export function removeAuthToken(): void {
	if (typeof window !== "undefined") {
		localStorage.removeItem("authToken");
	}
}

// Check if user is logged in
export function isLoggedIn(): boolean {
	const token = getAuthToken();
	return token !== null;
}
