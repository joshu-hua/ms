import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import { GetUserStatsResponse } from "@/types";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<GetUserStatsResponse>
) {
	if (req.method !== "GET") {
		return res.status(405).json({
			success: false,
			message: "Method not allowed. Use GET.",
		});
	}

	try {
		const { userId } = req.query;

		// Validate userId if provided
		if (userId && (isNaN(Number(userId)) || Number(userId) <= 0)) {
			return res.status(400).json({
				success: false,
				message: "Invalid userId. Must be a positive number.",
			});
		}

		const userIdNumber = userId ? Number(userId) : null;

		if (userIdNumber) {
			// Get stats for specific user
			const userWithStats = await prisma.user.findUnique({
				where: { id: userIdNumber },
				include: {
					userStats: {
						orderBy: { difficulty: "asc" },
					},
				},
			});

			if (!userWithStats) {
				return res.status(404).json({
					success: false,
					message: "User not found.",
				});
			}

			return res.status(200).json({
				success: true,
				message: "User stats retrieved successfully.",
				stats: userWithStats.userStats,
				user: {
					id: userWithStats.id,
					username: userWithStats.username,
				},
			});
		} else {
			// Get all users' stats
			const allUsersStats = await prisma.userStats.findMany({
				include: {
					user: {
						select: {
							id: true,
							username: true,
						},
					},
				},
				orderBy: [{ difficulty: "asc" }, { totalWins: "desc" }],
			});

			return res.status(200).json({
				success: true,
				message: "All user stats retrieved successfully.",
				stats: allUsersStats,
			});
		}
	} catch (error) {
		console.error("Error fetching user stats:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error. Please try again.",
		});
	}
}
