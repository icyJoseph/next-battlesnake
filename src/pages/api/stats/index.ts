// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

import { encrypt } from "../../../utils";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

supabase.auth.setAuth(process.env.SUPABASE_ROLE_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(404).json({ error: "Not Found" });

  const { data, error } = await supabase
    .from<{ uuid: string }>("battlesnake_history")
    .select("uuid,has_ended,created_at,ended_at")
    .range(0, 10);

  if (!data || error) return res.status(404).json({ error: "Not Found" });

  const encrypted = data.map((entry) => {
    const { iv, content } = encrypt(entry.uuid);

    return { ...entry, pk: iv, uuid: content };
  });
  return res.status(200).json(encrypted);
}
