import express from "express";
import pool from "../db/db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Name is required" });
  }

  if (name.length < 3 || name.length > 12) {
    return res.status(400).json({
      error: "Name must be between 3 and 12 characters.",
    });
  }

  const validName = /^[a-zA-Z0-9]+$/.test(name);
  if (!validName) {
    return res.status(400).json({
      error: "Name must contain only letters and numbers.",
    });
  }

  const token = Math.random().toString(36).substring(2);

  try {
    const [existing] = await pool.query(
      "SELECT * FROM players WHERE name = ?",
      [name]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "Name already taken" });
    }

    await pool.query("INSERT INTO players (name, token) VALUES (?, ?)", [
      name,
      token,
    ]);
    res.json({ name, balance: 1000, token });
  } catch (err) {
    console.error("❌ Database error during registration:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

export default router;
