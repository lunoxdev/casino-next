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

router.post("/register", async (req, res) => {
  try {
    let { nickname } = req.body;

    if (!nickname || typeof nickname !== "string") {
      return res.status(400).json({ error: "Nickname is required" });
    }

    nickname = nickname.trim().toLowerCase();

    if (nickname.length > 12) {
      return res
        .status(400)
        .json({ error: "Nickname too long (max 12 characters)" });
    }

    const { rows: existing } = await pool.query(
      "SELECT * FROM players WHERE nickname = $1",
      [nickname]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "Nickname already taken" });
    }

    const uuid = uuidv4();
    const refreshToken = uuidv4();
    const accessToken = generateAccessToken(nickname);

    await pool.query(
      "INSERT INTO players (nickname, balance, uuid, refresh_token) VALUES ($1, $2, $3, $4)",
      [nickname, 1000, uuid, refreshToken]
    );

    res.json({ nickname, balance: 1000, token: accessToken, refreshToken });
  } catch (err) {
    console.error("❌ Error en /register:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(400).json({ error: "Refresh token required" });

    const { rows: players } = await pool.query(
      "SELECT * FROM players WHERE refresh_token = $1",
      [refreshToken]
    );
    const player = players[0];

    if (!player)
      return res.status(403).json({ error: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(player.nickname);
    const newRefreshToken = uuidv4();

    await pool.query(
      "UPDATE players SET refresh_token = $1 WHERE nickname = $2",
      [newRefreshToken, player.nickname]
    );

    res.json({ token: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error("❌ Error en /refresh:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { nickname } = req.body;

    if (!nickname || typeof nickname !== "string") {
      return res.status(400).json({ error: "Nickname is required" });
    }

    const { rows: players } = await pool.query(
      "SELECT * FROM players WHERE nickname = $1",
      [nickname.trim().toLowerCase()]
    );

    const player = players[0];
    if (!player) {
      return res.status(404).json({ error: "Nickname not found" });
    }

    const accessToken = generateAccessToken(player.nickname);
    const newRefreshToken = uuidv4();

    await pool.query(
      "UPDATE players SET refresh_token = $1 WHERE nickname = $2",
      [newRefreshToken, player.nickname]
    );

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
