import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(404).json({ error: "No" });

  try {
    const wasm = await import("@icyjoseph/battlesnake-rs");

    return res.status(200).json(wasm.get_info());
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
