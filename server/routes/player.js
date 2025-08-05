import express from "express";
import supabase from "../db/supabase.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

const generateAccessToken = (nickname) => {
  return jwt.sign({ nickname }, JWT_SECRET, { expiresIn: "1d" });
};

router.post("/register", async (req, res) => {
  console.log("📨 Incoming /register request:", req.body);

  try {
    let { nickname } = req.body;

    // Validate nickname
    if (!nickname || typeof nickname !== "string") {
      return res.status(400).json({ error: "Nickname is required" });
    }

    // Trim and lowercase nickname to sanitize input
    nickname = nickname.trim().toLowerCase();

    // Validate nickname length
    if (nickname.length > 12) {
      return res
        .status(400)
        .json({ error: "Nickname too long (3 and 12 characters allowed)" });
    }

    // Check if nickname is already taken
    const { data: existing, error: findError } = await supabase
      .from("players")
      .select("*")
      .eq("nickname", nickname);

    if (findError) throw findError;

    if (existing.length > 0) {
      return res.status(409).json({ error: "Nickname already taken" });
    }

    // Generate UUIDs, refresh token and access token for the player
    const uuid = uuidv4();
    const refreshToken = uuidv4();
    const accessToken = generateAccessToken(nickname);

    // Insert the player into the database
    const { error: insertError } = await supabase
      .from("players")
      .insert([{ nickname, balance: 1000, uuid, refresh_token: refreshToken }]);

    if (insertError) throw insertError;

    // Return the player's data
    res.json({ nickname, balance: 1000, token: accessToken, refreshToken });
  } catch (err) {
    console.error("❌ Error in /register:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { nickname } = req.body;

    // Validate nickname
    if (!nickname || typeof nickname !== "string") {
      return res.status(400).json({ error: "Nickname is required" });
    }

    // Trim and lowercase nickname to sanitize input
    nickname = nickname.trim().toLowerCase();

    // Search for the player in the players table
    const { data: players } = await supabase
      .from("players")
      .select("*")
      .eq("nickname", nickname);

    const player = players[0];

    if (!player) {
      return res.status(404).json({ error: "Nickname not found" });
    }

    // Generate new refresh token
    const accessToken = generateAccessToken(player.nickname);
    const newRefreshToken = uuidv4();

    // Update players table supabase
    await supabase
      .from("players")
      .update({ refresh_token: newRefreshToken })
      .eq("nickname", player.nickname);

    res.json({
      nickname: player.nickname,
      balance: player.balance,
      token: accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error("❌ Error en /login:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
