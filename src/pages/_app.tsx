import "../global.css";

import type { AppProps } from "next/app";
import Head from "next/head";

import Image from "next/image";

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
}

export default MyApp;
