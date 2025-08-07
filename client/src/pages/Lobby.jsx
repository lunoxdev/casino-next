import { useAuthStore } from "../stores/useAuthStore";
import AuthForm from "../components/auth/AuthForm";
import Profile from "../components/lobby/Profile";

const Lobby = () => {
  const { loggedIn } = useAuthStore();

  return (
    <div className="flex flex-col items-center justify-center">
      {loggedIn ? <Profile /> : <AuthForm />}
    </div>
  );
};

export default Lobby;
