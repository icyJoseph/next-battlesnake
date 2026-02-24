import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";

import { supabase } from "lib/supabase";
import { Winner } from "components/winner";

const locale = Intl.DateTimeFormat("sv-SE-u-hc-h23", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "numeric",
});

async function GameList() {
  "use cache";
  cacheLife("hours");
  cacheTag("gamelist");

  const { data } = await supabase
    .from("battlesnake_history")
    .select("uuid,has_ended,created_at,ended_at,moves,winner,start_game")
    .order("created_at", { ascending: false })
    .range(0, 20);

  if (!data || data.length === 0) return <p>No games yet.</p>;

  return (
    <>
      {(data as Array<Record<string, any>>).map(
        ({
          uuid,
          created_at,
          has_ended,
          moves,
          winner,
          start_game,
        }) => (
          <article key={uuid}>
            <header>{locale.format(new Date(created_at))}</header>
            <div>
              <Winner has_ended={has_ended} winner={winner} />
              <p>Snake name: {start_game.you.name}</p>
              <p>Total moves: {moves.length}</p>
            </div>
            <footer>
              <Link href={`/game/${uuid}`}>See more.</Link>
            </footer>
          </article>
        )
      )}
    </>
  );
}

export default function Home() {
  return <GameList />;
}
