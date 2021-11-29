import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import useSWR from "swr";
import { Winner } from "pages";
import type { Directions, GameState } from "logic/types";

type Game = {
  has_ended: boolean;
  moves: Directions[];
  end_game: GameState | null;
  winner: boolean;
};

const defaultValue = {
  has_ended: false,
  moves: [],
  end_game: null,
  winner: false
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

const SingleGame = ({ uuid, pk }: { uuid: string; pk: string }) => {
  const { data = defaultValue } = useSWR<Game>(
    [uuid, pk],
    () =>
      fetch(`/api/stats/${uuid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ pk })
      }).then((res) => res.json()),
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  const gameData = data || defaultValue;

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
          {gameData.moves.map((move, index) => (
            <span key={move + index}> {toUnicode(move)} </span>
          ))}
        </code>
      </section>
    </div>
  );
};
const Game: NextPage = () => {
  const router = useRouter();
  const { uuid, pk } = router.query;

  if (!uuid || !pk) return null;

  if (Array.isArray(uuid) || Array.isArray(pk)) return null;

  return <SingleGame uuid={uuid} pk={pk} />;
};

export default Game;
