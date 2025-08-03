import express from "express";
import pool from "../db/db.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Function to generate access token
const generateAccessToken = (name) => {
  return jwt.sign({ name }, JWT_SECRET, { expiresIn: "24h" });
};

router.post("/register", async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Name is required" });
  }

  const [existing] = await pool.query("SELECT * FROM players WHERE name = ?", [
    name,
  ]);
  
  if (existing.length > 0) {
    return res.status(409).json({ error: "Name already taken" });
  }

  const refreshToken = uuidv4();
  const accessToken = generateAccessToken(name);

  await pool.query(
    "INSERT INTO players (name, token, refresh_token) VALUES (?, ?, ?)",
    [name, accessToken, refreshToken]
  );

  res.json({ name, balance: 1000, token: accessToken, refreshToken });
});

// Refresh token
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(400).json({ error: "Refresh token required" });

  const [players] = await pool.query(
    "SELECT * FROM players WHERE refresh_token = ?",
    [refreshToken]
  );
  const player = players[0];

  if (!player) return res.status(403).json({ error: "Invalid refresh token" });

  const newAccessToken = generateAccessToken(player.name);
  const newRefreshToken = uuidv4();

  await pool.query(
    "UPDATE players SET token = ?, refresh_token = ? WHERE name = ?",
    [newAccessToken, newRefreshToken, player.name]
  );

  res.json({ token: newAccessToken, refreshToken: newRefreshToken });
});

export default router;
