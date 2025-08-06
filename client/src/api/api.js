import axios from "axios";

const instance = axios.create({
  baseURL: "https://pvp-casino.fly.dev",
  // baseURL: "http://localhost:3001",
  timeout: 5000,
  withCredentials: true,
});

export default instance;
