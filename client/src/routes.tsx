import { Routes, Route } from "react-router-dom";
import Lobby from "./pages/Lobby";
import Match from "./pages/Match";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Lobby />} />
      <Route path="/match" element={<Match />} />
    </Routes>
  );
};

export default AppRoutes;
