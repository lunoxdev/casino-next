import express from "express";
import supabase from "../db/db";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

const generateAccessToken = (nickname) => {
  return jwt.sign({ nickname }, JWT_SECRET, { expiresIn: "1d" });
};

router.post("/register", async (req, res) => {
  console.log("📨 Incoming /register request:", req.body);

  try {
    let { nickname } = req.body;

    if (!nickname || typeof nickname !== "string") {
      return res.status(400).json({ error: "Nickname is required" });
    }

    nickname = nickname.trim().toLowerCase();
    if (nickname.length > 12) {
      return res.status(400).json({ error: "Nickname too long" });
    }

    const { data: existing, error: findError } = await supabase
      .from("players")
      .select("*")
      .eq("nickname", nickname);

    if (findError) throw findError;
    if (existing.length > 0) {
      return res.status(409).json({ error: "Nickname already taken" });
    }

    const uuid = uuidv4();
    const refreshToken = uuidv4();
    const accessToken = generateAccessToken(nickname);

    const { error: insertError } = await supabase
      .from("players")
      .insert([{ nickname, balance: 1000, uuid, refresh_token: refreshToken }]);

    if (insertError) throw insertError;

    res.json({ nickname, balance: 1000, token: accessToken, refreshToken });
  } catch (err) {
    console.error("❌ Error in /register:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
