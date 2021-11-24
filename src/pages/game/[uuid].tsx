import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import Image from "next/image";
import style from "../../style.module.css";

const Game: NextPage = () => {
  const router = useRouter();
  const { uuid, pk } = router.query;

  if (!uuid || !pk) return null;

  if (Array.isArray(uuid) || Array.isArray(pk)) return null;

  return (
    <>
      <Head>
        <title>BattleSnake App</title>
        <meta name="description" content="Battle snake using Next + Vercel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={`container ${style.header}`}>
        <h1>Battlesnake / meta</h1>

        <h2>Game: {uuid}</h2>
      </header>

      <main className={`container ${style.content}`}></main>

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

export default Game;
