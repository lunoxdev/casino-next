import express from "express";
import { getProfile } from "../controllers/profileController.js";

const router = express.Router();

router.get("/", verifyToken, getProfile);

export default router;
