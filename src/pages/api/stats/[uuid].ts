// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

import { decrypt } from "../../../utils";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

supabase.auth.setAuth(process.env.SUPABASE_ROLE_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(404).json({ error: "Not Found" });

  const { uuid } = req.query;
  const { pk } = req.body;

  if (Array.isArray(uuid)) return res.status(404).json({ error: "Not Found" });

  const { data, error } = await supabase
    .from<{ uuid: string }>("battlesnake_history")
    .select("uuid,has_ended,created_at,ended_at,start_game,end_game")
    .eq("uuid", decrypt({ iv: pk, content: uuid }));

  if (!data || error) return res.status(404).json({ error: "Not Found" });

  const remapped = data.map((entry) => {
    return { ...entry, pk, uuid: uuid };
  });

  return res.status(200).json(remapped);
}
