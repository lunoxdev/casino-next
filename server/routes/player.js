import express from "express";
import pool from "../db/db.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Function to generate access token
const generateAccessToken = (nickname) => {
  return jwt.sign({ nickname }, JWT_SECRET, { expiresIn: "1d" });
};

// 🧩 REGISTER
router.post("/register", async (req, res) => {
  console.log("📨 Incoming /register request:", req.body);

  try {
    let { nickname } = req.body;

    if (!nickname || typeof nickname !== "string") {
      console.warn("⚠️ Nickname missing or invalid");
      return res.status(400).json({ error: "Nickname is required" });
    }

    nickname = nickname.trim().toLowerCase();

    if (nickname.length > 12) {
      console.warn("⚠️ Nickname too long:", nickname);
      return res
        .status(400)
        .json({ error: "Nickname too long (max 12 characters)" });
    }

    const { rows: existing } = await pool.query(
      "SELECT * FROM players WHERE nickname = $1",
      [nickname]
    );

    if (existing.length > 0) {
      console.warn("⚠️ Nickname already taken:", nickname);
      return res.status(409).json({ error: "Nickname already taken" });
    }

    const uuid = uuidv4();
    const refreshToken = uuidv4();
    const accessToken = generateAccessToken(nickname);

    await pool.query(
      "INSERT INTO players (nickname, balance, uuid, refresh_token) VALUES ($1, $2, $3, $4)",
      [nickname, 1000, uuid, refreshToken]
    );

    console.log("✅ Player registered:", nickname);

    res.json({ nickname, balance: 1000, token: accessToken, refreshToken });
  } catch (err) {
    console.error("❌ Error in /register:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🔄 REFRESH TOKEN
app.post("/register", async (req, res) => {
  const { nickname } = req.body;
  console.log("📨 Incoming /register request:", nickname);

  try {
    console.log("🔌 Attempting DB connection...");
    const result = await pool.query("SELECT NOW()");
    console.log("✅ DB connection successful:", result.rows[0]);

    // Aquí iría tu lógica de registro
    res.status(200).json({ message: "Registered successfully" });
  } catch (err) {
    console.error("❌ DB connection error:", err);

    // Log específico del certificado
    if (err.message.includes("self-signed certificate")) {
      console.error("🔐 SSL Error: Self-signed certificate in chain");
    }

    res
      .status(500)
      .json({ error: "Registration failed", details: err.message });
  }
});

// 🔑 LOGIN
router.post("/login", async (req, res) => {
  console.log("🔑 Incoming /login request:", req.body);

  try {
    const { nickname } = req.body;

    if (!nickname || typeof nickname !== "string") {
      console.warn("⚠️ Nickname missing or invalid");
      return res.status(400).json({ error: "Nickname is required" });
    }

    const { rows: players } = await pool.query(
      "SELECT * FROM players WHERE nickname = $1",
      [nickname.trim().toLowerCase()]
    );

    const player = players[0];
    if (!player) {
      console.warn("⚠️ Nickname not found:", nickname);
      return res.status(404).json({ error: "Nickname not found" });
    }

    const accessToken = generateAccessToken(player.nickname);
    const newRefreshToken = uuidv4();

    await pool.query(
      "UPDATE players SET refresh_token = $1 WHERE nickname = $2",
      [newRefreshToken, player.nickname]
    );

    console.log("✅ Login successful for:", player.nickname);

    res.json({
      nickname: player.nickname,
      balance: player.balance,
      token: accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error("❌ Error in /login:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
