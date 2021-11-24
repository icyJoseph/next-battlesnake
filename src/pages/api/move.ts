// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

import { move, MoveResponse } from "../../logic";

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

  // upsert row on battlesnake table

  const { data, error } = await supabase
    .from<{ uuid: string; history: any[]; moves: any[] }>("battlesnake_history")
    .select()
    .eq("uuid", req.body.game.id)
    .single();

  if (!data || error) return;

  // TODO: replace with an rpc

  await supabase.rpc("append_history", {
    row_id: req.body.game.id,
    entry: req.body,
    next_move: next.move
  });
}
