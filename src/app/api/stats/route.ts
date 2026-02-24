import { NextResponse } from "next/server";

import { encrypt } from "utils";
import { supabase } from "lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("battlesnake_history")
    .select("uuid,has_ended,created_at,ended_at,moves,winner,start_game")
    .order("created_at", { ascending: false })
    .range(0, 20);

  if (!data || error) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  const encrypted = (data as Array<Record<string, any>>)
    .map(({ uuid, moves, start_game, ...rest }) => {
      const { iv, content } = encrypt(uuid);
      return {
        ...rest,
        snake_name: start_game.you.name,
        pk: iv,
        uuid: content,
        total_moves: moves.length,
      };
    })
    .sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  return NextResponse.json(encrypted);
}
