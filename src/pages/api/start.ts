// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

import { start } from "logic";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

supabase.auth.setAuth(process.env.SUPABASE_ROLE_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, string>>
) {
  if (req.method !== "POST")
    return res.status(404).json({ error: "Not Found" });

  start(req.body);

  res.status(200).json({ ok: "Start" });

  // create a new row on battlesnake table
  await supabase
    .from("battlesnake_history")
    .insert(
      { uuid: req.body.game.id, start_game: req.body },
      { returning: "minimal" }
    );
}
