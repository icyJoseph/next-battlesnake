import type { Metadata } from "next";

import "../global.css";
import style from "../style.module.css";

export const metadata: Metadata = {
  title: "BattleSnake App",
  description: "Battle snake using Next + Vercel",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css"
        />
      </head>
      <body>
        <header className={`container ${style.header}`}>
          <h1>Battlesnake</h1>
        </header>

        <main className={`container ${style.content}`}>{children}</main>

        <footer className={`container ${style.footer}`}>
          <a
            href="https://play.battlesnake.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Play Battlesnake
          </a>
        </footer>
      </body>
    </html>
  );
}
