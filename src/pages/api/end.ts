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

  res.status(200).json({ ok: "End" });

  const result = await supabase.rpc("end_history", {
    row_id: req.body.game.id,
    entry: req.body
  });

  console.log(result);
}
