import type { NextApiRequest, NextApiResponse } from "next";
import { assignmentService } from "@/services/assignmentService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {
            const scope = typeof req.query.scope === "string" ? req.query.scope : undefined;
            const data = scope === "teacher"
                ? await assignmentService.getAll()
                : await assignmentService.getPublished();
            res.status(200).json(data ?? []);
            return;
        }

        if (req.method === "POST") {
            const created = await assignmentService.create(req.body);
            res.status(201).json(created);
            return;
        }

        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).json({ error: "Method Not Allowed" });
    } catch (error) {
        console.error("API Error (pages) assignments:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const config = {
    api: {
        bodyParser: true,
    },
};