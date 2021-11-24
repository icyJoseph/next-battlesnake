import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import useSWR from "swr";
import style from "../style.module.css";

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
      <Head>
        <title>BattleSnake App</title>
        <meta name="description" content="Battle snake using Next + Vercel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={`container ${style.header}`}>
        <h1>Battlesnake</h1>

        <h2>
          Snake name: <pre>meta</pre>
        </h2>
      </header>

      <main className={`container ${style.content}`}>
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
      </main>

      <footer className={`container ${style.footer}`}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </>
  );
};

export default Home;
