import { NextRequest, NextResponse } from "next/server";

import { end } from "logic";
import { supabase } from "lib/supabase";

export async function POST(request: NextRequest) {
  const body = await request.json();

  end(body);

  if (process.env.NODE_ENV === "production") {
    await supabase
      .from("battlesnake_history")
      .update({
        end_game: body,
        has_ended: true,
        ended_at: new Date().toISOString(),
        winner: Boolean(
          body.board.snakes.find(
            (snake: { id: string }) => snake.id === body.you.id
          )
        ),
      })
      .eq("uuid", body.game.id);
  }

  return NextResponse.json({ ok: "End" });
}
