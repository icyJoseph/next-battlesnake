// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { move, MoveResponse } from "../../logic";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<MoveResponse | { error: string }>
) {
  if (req.method !== "POST")
    return res.status(404).json({ error: "Not Found" });

  const next = move(req.body);

  return res.status(200).json(next);
}
