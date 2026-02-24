import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";

import { supabase } from "lib/supabase";
import { Winner } from "components/winner";
import type { Directions } from "logic/types";

async function getGame(uuid: string) {
  "use cache";
  cacheLife("max");
  cacheTag(`game-${uuid}`);

  const { data } = await supabase
    .from("battlesnake_history")
    .select(
      "uuid,has_ended,created_at,ended_at,start_game,end_game,moves,winner"
    )
    .eq("uuid", uuid)
    .single();

  return data;
}

function toUnicode(move: Directions) {
  switch (move) {
    case "left":
      return "←";
    case "right":
      return "→";
    case "up":
      return "↑";
    case "down":
      return "↓";
    default:
      return "?";
  }
}

async function GameContent({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  const data = await getGame(uuid);

  if (!data) return <p>Game not found.</p>;

  return (
    <div>
      <header>
        <h2>
          Snake name:{" "}
          <pre>{(data as any).end_game?.you.name || "Unknown"}</pre>
        </h2>
      </header>

      <section>
        <h2>Result</h2>
        <Winner has_ended={data.has_ended} winner={data.winner} />
      </section>

      <section>
        <h2>Moves</h2>
        <code>
          {(data.moves as Directions[]).map((move, index) => (
            <span key={move + index}> {toUnicode(move)} </span>
          ))}
        </code>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from("battlesnake_history")
    .select("uuid")
    .order("created_at", { ascending: false })
    .range(0, 20);

  return (data ?? []).map(({ uuid }: { uuid: string }) => ({ uuid }));
}

export default function GamePage(props: {
  params: Promise<{ uuid: string }>;
}) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <GameContent params={props.params} />
    </Suspense>
  );
}
