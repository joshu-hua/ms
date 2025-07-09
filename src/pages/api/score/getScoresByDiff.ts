import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import { Score } from "@/types";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<{
		success: boolean;
		scores?: Score[];
		message?: string;
	}>
) {
	if (req.method !== "GET") {
		return res.status(405).json({
			success: false,
			message: "Method not allowed. Use GET.",
		});
	}

	try {
		const { difficulty } = req.body;

		if (!difficulty || typeof difficulty !== "string") {
			return res.status(400).json({
				success: false,
				message: "Difficulty is required and must be a string.",
			});
		}

		const scores = await prisma.score.findMany({
			where: { difficulty },
			orderBy: { time: "asc" },
			include: { user: { select: { username: true } } },
		});

		return res.status(200).json({
			success: true,
			scores,
		});
	} catch (error) {
		console.error("Error fetching scores:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
}
