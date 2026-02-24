"use client";

import Link from "next/link";
import useSWR from "swr";

import { Winner } from "components/winner";

type GameSummary = {
  uuid: string;
  pk: string;
  created_at: string;
  ended_at: string;
  has_ended: boolean;
  total_moves: number;
  winner: boolean;
  snake_name: string;
};

const locale = Intl.DateTimeFormat("sv-SE-u-hc-h23", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "numeric",
});

const defaultValue: GameSummary[] = [];

export default function Home() {
  const { data = defaultValue } = useSWR<GameSummary[]>("stats", () =>
    fetch("/api/stats").then((res) => res.json())
  );

  return (
    <>
      {data.map(
        ({
          uuid,
          pk,
          created_at,
          has_ended,
          total_moves,
          winner,
          snake_name,
        }) => (
          <article key={uuid}>
            <header>{locale.format(new Date(created_at))}</header>
            <div>
              <Winner has_ended={has_ended} winner={winner} />
              <p>Snake name: {snake_name}</p>
              <p>Total moves: {total_moves}</p>
            </div>
            <footer>
              <Link href={`/game/${uuid}?pk=${pk}`}>See more.</Link>
            </footer>
          </article>
        )
      )}
    </>
  );
}
