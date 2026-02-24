import { NextRequest, NextResponse } from "next/server";

import { move } from "logic";
import { supabase } from "lib/supabase";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const next = move(body);

  const response = NextResponse.json(next);

  if (process.env.NODE_ENV !== "development") {
    await supabase.rpc("add_move", {
      row_id: body.game.id,
      next_move: next.move,
    });
  }

  return response;
}
