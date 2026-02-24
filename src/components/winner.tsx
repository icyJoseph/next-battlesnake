export function Winner({
  has_ended,
  winner,
}: {
  has_ended: boolean;
  winner: boolean;
}) {
  if (!has_ended) return <p>Game has not ended yet!</p>;

  return (
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
  );
}
