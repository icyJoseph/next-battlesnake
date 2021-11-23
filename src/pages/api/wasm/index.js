export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(404).json({ error: "No" });

  try {
    const wasm = await import("../../../../snake-rs/pkg");

    return res.status(200).json(wasm.get_info());
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
