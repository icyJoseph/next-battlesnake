// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

import { end } from "../../logic";

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

  end(req.body);

  const result = await supabase
    .from("battlesnake_history")
    .update(
      {
        end_game: req.body,
        has_ended: true,
        ended_at: new Date().toISOString()
      },
      { returning: "minimal" }
    )
    .eq("uuid", req.body.game.id);

  console.log(result);
  return res.status(200).json({ ok: "End" });
}
