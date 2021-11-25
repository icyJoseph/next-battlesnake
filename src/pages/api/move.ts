// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

import { move } from "logic";
import type { MoveResponse } from "logic/types";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

supabase.auth.setAuth(process.env.SUPABASE_ROLE_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MoveResponse | { error: string }>
) {
  if (req.method !== "POST")
    return res.status(404).json({ error: "Not Found" });

  const next = move(req.body);

  res.status(200).json(next);

  if (process.env.NODE_ENV === "development") return;

  await supabase.rpc("add_move", {
    row_id: req.body.game.id,
    next_move: next.move
  });
}
