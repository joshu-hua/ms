import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import { CreateScoreRequest, CreateScoreResponse } from "@/types";
import jwt from "jsonwebtoken";

interface DifficultySettings {
	easy: {
		gridSize: "10x10";
		mines: 10;
	};
	medium: {
		gridSize: "16x16";
		mines: 40;
	};
	hard: {
		gridSize: "16x30";
		mines: 99;
	};
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<CreateScoreResponse>
) {
	if (req.method !== "POST") {
		return res.status(405).json({
			success: false,
			message: "Method not allowed. Use POST.",
		});
	}

	try {
		const authHeader = req.headers.authorization;
		const token = authHeader?.replace("Bearer ", "");

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized. No token provided.",
			});
		}
		// Verify the JWT token and extract user ID
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

		const {
			time,
			difficulty,
			gridSize,
			mines,
			completed,
		}: CreateScoreRequest = req.body;

		if (
			typeof time !== "number" ||
			typeof difficulty !== "string" ||
			typeof gridSize !== "string" ||
			typeof mines !== "number" ||
			typeof completed !== "boolean"
		) {
			return res.status(400).json({
				success: false,
				message: "Invalid request data. Please check your input.",
			});
		}

		if (time < 0 || mines < 0) {
			return res.status(400).json({
				success: false,
				message: "Time and mines must be non-negative.",
			});
		}

		if (!["easy", "medium", "hard"].includes(difficulty)) {
			return res.status(400).json({
				success: false,
				message:
					"Invalid difficulty level. Use 'easy', 'medium', or 'hard'.",
			});
		}

		if (!time || !difficulty || !gridSize || !mines) {
			return res.status(400).json({
				success: false,
				message: "All fields are required.",
			});
		}

		if (!["10x10", "16x16", "16x30"].includes(gridSize)) {
			return res.status(400).json({
				success: false,
				message: "Invalid grid size. Use '10x10', '16x16', or '16x30'.",
			});
		}

		// Validate grid size and mines based on difficulty
		const difficultySettings: DifficultySettings = {
			easy: {
				gridSize: "10x10",
				mines: 10,
			},
			medium: {
				gridSize: "16x16",
				mines: 40,
			},
			hard: {
				gridSize: "16x30",
				mines: 99,
			},
		};

		const expectedSettings =
			difficultySettings[difficulty as keyof DifficultySettings];
		if (
			gridSize !== expectedSettings.gridSize ||
			mines !== expectedSettings.mines
		) {
			return res.status(400).json({
				success: false,
				message: `For ${difficulty} difficulty, grid size must be ${expectedSettings.gridSize} and mines must be ${expectedSettings.mines}.`,
			});
		}

		const existingBest = await prisma.score.findFirst({
			where: { userId, difficulty },
			orderBy: { time: "asc" },
		});

		if (!existingBest || time < existingBest.time) {
			const newScore = await prisma.score.create({
				data: {
					time,
					difficulty,
					gridSize,
					mines,
					completed,
					user: {
						connect: { id: userId },
					},
				},
				select: {
					id: true,
					userId: true,
					time: true,
					difficulty: true,
					gridSize: true,
					mines: true,
					completed: true,
					createdAt: true,
				},
			});

			return res.status(201).json({
				success: true,
				message: "Score created successfully.",
				score: newScore,
			});
		}

		return res.status(200).json({
			success: true,
			message: `Score not saved. Your personal best for ${difficulty} is ${existingBest.time} seconds.`,
		});
	} catch (error) {
		console.error("Error creating score:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error. Please try again.",
		});
	}
}
