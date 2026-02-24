import { NextRequest, NextResponse } from "next/server";

import { start } from "logic";
import { supabase } from "lib/supabase";

export async function POST(request: NextRequest) {
  const body = await request.json();

  start(body);

  if (process.env.NODE_ENV !== "development") {
    await supabase
      .from("battlesnake_history")
      .insert({ uuid: body.game.id, start_game: body, moves: [] });
  }

  return NextResponse.json({ ok: "Start" });
}
