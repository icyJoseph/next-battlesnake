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
  winner: boolean;
  snake_name: string;
};

const locale = Intl.DateTimeFormat("sv-SE-u-hc-h23", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "numeric"
});

export const Winner = ({
  has_ended,
  winner
}: {
  has_ended: boolean;
  winner: boolean;
}) =>
  has_ended ? (
    <p>
      <span
        className="emoji"
        role="img"
        aria-label={winner ? "Winner" : "Loser"}
      >
        {winner ? "👑" : "☠️"}
      </span>
      <strong>{winner ? " Winner" : " Loser"}</strong>
    </p>
  ) : (
    <p>Game has not ended yet!</p>
  );

const defaultValue: GameSummary[] = [];

const Home: NextPage = () => {
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
          snake_name
        }) => (
          <article key={uuid}>
            <header>{locale.format(new Date(created_at))}</header>
            <div>
              <Winner has_ended={has_ended} winner={winner} />

              <p>Snake name: {snake_name}</p>

              <p>Total moves: {total_moves}</p>
            </div>
            <footer>
              <Link key={uuid} href={`/game/${uuid}?pk=${pk}`}>
                <a>See more.</a>
              </Link>
            </footer>
          </article>
        )
      )}
    </>
  );
};

export default Home;
