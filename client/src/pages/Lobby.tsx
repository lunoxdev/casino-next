import { useAuthStore } from "../stores/useAuthStore";
import AuthForm from "../components/auth/AuthForm";
import LobbyHome from "../components/lobby/LobbyHome";
import Background from "../components/common/Background";
import WebChat from "../components/common/WebChat";

const Lobby = () => {
  const loggedIn = useAuthStore((state) => state.loggedIn);

  return (
    <>
      <Background />
      {loggedIn ? <LobbyHome /> : <AuthForm />}
      <WebChat />
    </>
  );
};

export default Lobby;
