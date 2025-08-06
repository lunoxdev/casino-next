import supabase from "../db/supabase.js";

export async function getProfile(req, res) {
  const uuid = req.query.uuid;

  if (!uuid) {
    return res.status(400).json({ error: "UUID is required" });
  }

  try {
    const { data, error } = await supabase
      .from("players")
      .select("nickname, balance")
      .eq("uuid", uuid);

    if (error) throw error;

    const player = data[0];

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.json({
      nickname: player.nickname,
      balance: player.balance,
    });
  } catch (err) {
    console.error("❌ Error in getProfile:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}
