import "../global.css";

import type { AppProps } from "next/app";
import Head from "next/head";

import style from "../style.module.css";

function MyApp({ Component, pageProps }: AppProps) {
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
        <Component {...pageProps} />
      </main>

      <footer className={`container ${style.footer}`}>
        <a
          href="https://play.battlesnake.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Play Battlesnake
        </a>
      </footer>
    </>
  );
}

export default MyApp;
