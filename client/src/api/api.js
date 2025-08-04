import axios from "axios";

const instance = axios.create({
  baseURL: "https://pvp-casino.fly.dev",
  timeout: 5000,
});

export default instance;
