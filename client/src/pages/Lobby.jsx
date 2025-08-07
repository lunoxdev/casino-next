import { useAuthStore } from "../stores/useAuthStore";
import AuthForm from "../components/auth/AuthForm";
import Profile from "../components/lobby/Profile";

const Lobby = () => {
  const { registered } = useAuthStore();

  return (
    <div className="flex flex-col items-center justify-center">
      {registered ? <Profile /> : <AuthForm />}
    </div>
  );
};

export default Lobby;
