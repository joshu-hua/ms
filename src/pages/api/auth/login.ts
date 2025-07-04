import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";
import { LoginRequest, AuthResponse } from "@/types";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<AuthResponse>
) {
	// Only allow POST requests for login
	if (req.method !== "POST") {
		return res.status(405).json({
			success: false,
			message: "Method not allowed. Use POST.",
		});
	}

	try {
		const { email, password }: LoginRequest = req.body;

		// Validate required fields
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Email and password are required.",
			});
		}

		// Find user by email
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid email or password.",
			});
		}

		// Verify password
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: "Invalid email or password.",
			});
		}

		// Create JWT token
		const token = jwt.sign(
			{
				userId: user.id,
				email: user.email,
				username: user.username,
			},
			process.env.JWT_SECRET || "your-secret-key", // We'll set this up next
			{ expiresIn: "7d" } // Token expires in 7 days
		);

		// Return success with user data and token
		return res.status(200).json({
			success: true,
			message: "Login successful.",
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			},
			token,
		});
	} catch (error) {
		console.error("Error during login:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error. Please try again.",
		});
	}
}
