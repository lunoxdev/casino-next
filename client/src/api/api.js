import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:3001",
  baseURL: "https://pvp-casino.fly.dev",
  timeout: 5000,
});

export default instance;
