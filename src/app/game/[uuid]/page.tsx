import { Suspense } from "react";
import GameContent from "./game-content";

async function GameLoader({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <GameContent uuid={uuid} />;
}

export default function GamePage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <GameLoader params={params} />
    </Suspense>
  );
}
