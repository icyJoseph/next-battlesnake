"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";

import { Winner } from "components/winner";
import type { Directions, GameState } from "logic/types";

type Game = {
  has_ended: boolean;
  moves: Directions[];
  end_game: GameState | null;
  winner: boolean;
};

const defaultValue: Game = {
  has_ended: false,
  moves: [],
  end_game: null,
  winner: false,
};

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

function SingleGame({ uuid, pk }: { uuid: string; pk: string }) {
  const { data = defaultValue } = useSWR<Game>(
    [uuid, pk],
    () =>
      fetch(`/api/stats/${uuid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pk }),
      }).then((res) => res.json()),
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  return (
    <div>
      <header>
        <h2>
          Snake name: <pre>{data.end_game?.you.name || "Waiting..."}</pre>
        </h2>
      </header>

      <section>
        <h2>Result</h2>
        {data === defaultValue ? (
          <p>Waiting...</p>
        ) : (
          <Winner has_ended={data.has_ended} winner={data.winner} />
        )}
      </section>

      <section>
        <h2>Moves</h2>
        <code>
          {data.moves.map((move, index) => (
            <span key={move + index}> {toUnicode(move)} </span>
          ))}
        </code>
      </section>
    </div>
  );
}

export default function GameContent({ uuid }: { uuid: string }) {
  const searchParams = useSearchParams();
  const pk = searchParams.get("pk");

  if (!pk) return null;

  return <SingleGame uuid={uuid} pk={pk} />;
}
