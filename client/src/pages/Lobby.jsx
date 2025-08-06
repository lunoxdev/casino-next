import { useAuthStore } from "../stores/useAuthStore";
import AuthForm from "../components/auth/AuthForm";
import LobbyContent from "../components/lobby/LobbyContent";

const Lobby = () => {
  const { registered } = useAuthStore();

  return (
    <div className="flex flex-col items-center justify-center">
      {registered ? <LobbyContent /> : <AuthForm />}
    </div>
  );
};

export default Lobby;
