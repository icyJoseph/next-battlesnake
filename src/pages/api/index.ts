// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { info } from "logic";
import type { InfoResponse } from "logic/types";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<InfoResponse | { error: string }>
) {
  if (req.method !== "GET") return res.status(404).json({ error: "Not Found" });

  return res.status(200).json(info());
}
