import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { CreateUserRequest, AuthResponse } from "@/types";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<AuthResponse>
) {
	// Only allow POST requests for user registration
	if (req.method !== "POST") {
		return res.status(405).json({
			success: false,
			message: "Method not allowed. Use POST.",
		});
	}

	try {
		const { username, email, password }: CreateUserRequest = req.body;

		// Validate required fields
		if (!username || !email || !password) {
			return res.status(400).json({
				success: false,
				message: "Username, email, and password are required.",
			});
		}

		// Check if user already exists
		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [{ email: email }, { username: username }],
			},
		});

		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User with this email or username already exists.",
			});
		}

		// Hash the password before storing it
		const saltRounds = 12;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Create the user in the database
		const newUser = await prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
			},
			select: {
				id: true,
				username: true,
				email: true,
				createdAt: true,
				updatedAt: true,
				// Don't return the password
			},
		});

		return res.status(201).json({
			success: true,
			message: "User created successfully.",
			user: newUser,
		});
	} catch (error) {
		console.error("Error creating user:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error. Please try again.",
		});
	}
}
