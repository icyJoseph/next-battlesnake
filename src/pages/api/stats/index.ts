// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

import { encrypt } from "utils";
import { GameState } from "logic/types";

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
    .from<{
      uuid: string;
      moves: string[];
      created_at: string;
      start_game: GameState;
    }>("battlesnake_history")
    .select("uuid,has_ended,created_at,ended_at,moves,winner,start_game")
    .order("created_at", { ascending: false })
    .range(0, 20);

  if (!data || error) return res.status(404).json({ error: "Not Found" });

  const encrypted = data
    .map(({ uuid, moves, start_game, ...rest }) => {
      const { iv, content } = encrypt(uuid);

      return {
        ...rest,
        snake_name: start_game.you.name,
        pk: iv,
        uuid: content,
        total_moves: moves.length
      };
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  return res.status(200).json(encrypted);
}
