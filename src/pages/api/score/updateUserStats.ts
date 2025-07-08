import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import { UserStatsResponse } from "@/types";
import jwt from "jsonwebtoken";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<UserStatsResponse>
) {
	if (req.method !== "POST") {
		return res.status(405).json({
			success: false,
			message: "Method not allowed. Use POST.",
		});
	}

	try {
		// Extract JWT token and get userId
		const authHeader = req.headers.authorization;
		const token = authHeader?.replace("Bearer ", "");

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized. No token provided.",
			});
		}

		let userId: number;
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
				userId: number;
				email: string;
				username: string;
			};
			userId = decoded.userId;
		} catch (error) {
			return res.status(401).json({
				success: false,
				message: "Invalid or expired token",
			});
		}

		// Get data from request body
		const { difficulty, completed } = req.body;

		// Validate input
		if (!difficulty || typeof difficulty !== "string") {
			return res.status(400).json({
				success: false,
				message: "Difficulty is required and must be a string.",
			});
		}

		if (!["easy", "medium", "hard"].includes(difficulty)) {
			return res.status(400).json({
				success: false,
				message:
					"Invalid difficulty level. Must be 'easy', 'medium', or 'hard'.",
			});
		}

		if (typeof completed !== "boolean") {
			return res.status(400).json({
				success: false,
				message: "Completed must be a boolean.",
			});
		}

		// Update user stats using upsert
		const userStats = await prisma.userStats.upsert({
			where: {
				userId_difficulty: {
					userId: userId,
					difficulty: difficulty,
				},
			},
			create: {
				userId: userId,
				difficulty: difficulty,
				totalGames: 1,
				totalWins: completed ? 1 : 0,
				lastPlayed: new Date(),
			},
			update: {
				totalGames: { increment: 1 },
				totalWins: completed ? { increment: 1 } : { increment: 0 },
				lastPlayed: new Date(),
			},
		});

		return res.status(200).json({
			success: true,
			message: "User stats updated successfully.",
			stats: userStats,
		});
	} catch (error) {
		console.error("Error updating user stats:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error. Please try again.",
		});
	}
}
