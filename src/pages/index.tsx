import type { NextPage } from "next";
import Link from "next/link";
import useSWR from "swr";

type GameSummary = {
  uuid: string;
  pk: string;
  created_at: string;
  ended_at: string;
  has_ended: boolean;
  total_moves: number;
};

const locale = Intl.DateTimeFormat("sv-SE-u-hc-h23", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "numeric"
});

const defaultValue: GameSummary[] = [];

const Home: NextPage = () => {
  const { data = defaultValue } = useSWR<GameSummary[]>("stats", () =>
    fetch("/api/stats").then((res) => res.json())
  );

  return (
    <>
      {data.map(({ uuid, pk, created_at, has_ended, total_moves }) => (
        <article key={uuid}>
          <header>{locale.format(new Date(created_at))}</header>
          <div>
            <p>Game status: {has_ended ? "Finished" : "Ongoing"}.</p>

            <Link key={uuid} href={`/game/${uuid}?pk=${pk}`}>
              <a>See more.</a>
            </Link>
          </div>
          <footer>Total moves: {total_moves}</footer>
        </article>
      ))}
    </>
  );
};

export default Home;
