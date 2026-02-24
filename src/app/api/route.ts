import { NextResponse } from "next/server";

import { info } from "logic";

export async function GET() {
  return NextResponse.json(info());
}
