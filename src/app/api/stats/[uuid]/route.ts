import { NextRequest, NextResponse } from "next/server";

import { decrypt } from "utils";
import { supabase } from "lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await params;
  const { pk } = await request.json();

  if (!pk || typeof pk !== "string") {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("battlesnake_history")
    .select(
      "uuid,has_ended,created_at,ended_at,start_game,end_game,moves,winner"
    )
    .eq("uuid", decrypt({ iv: pk, content: uuid }))
    .single();

  if (!data || error) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  return NextResponse.json({ ...data, pk, uuid });
}
