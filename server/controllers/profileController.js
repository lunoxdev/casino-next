import supabase from "../db/supabase.js";

export async function getProfile(req, res) {
  try {
    const nickname = req.nickname;

    const { data, error } = await supabase
      .from("players")
      .select("nickname, balance")
      .eq("nickname", nickname);

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
