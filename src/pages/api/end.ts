// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { end } from "../../logic";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, string>>
) {
  if (req.method !== "POST")
    return res.status(404).json({ error: "Not Found" });

  end(req.body);

  return res.status(200).json({ ok: "End" });
}