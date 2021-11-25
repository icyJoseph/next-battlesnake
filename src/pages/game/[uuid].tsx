import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import useSWR from "swr";
import type { Directions, GameState } from "../../logic";

type Game = {
  moves: Directions[];
  end_game: GameState | null;
};

const defaultValue = { moves: [], end_game: null };

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
  const { data, error } = useSWR<Game>(
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

  const loading = !data && !error;

  const gameData = data || defaultValue;

  const victory = gameData.end_game?.board.snakes.find(
    (snake) => gameData.end_game?.you.id === snake.id
  );

  return (
    <div>
      <section>
        <h2>Result</h2>

        {loading ? (
          <p>Waiting...</p>
        ) : (
          <p>{victory ? "Winner!" : "Defeated"}</p>
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
