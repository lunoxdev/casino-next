import { useAuthStore } from "../stores/useAuthStore";
import AuthForm from "../components/auth/AuthForm";
import Profile from "../components/lobby/Profile";
import Background from "../components/common/Background";

const Lobby = () => {
  const loggedIn = useAuthStore((state) => state.loggedIn);

  return (
    <div className="flex flex-col items-center justify-center">
      <Background />
      {loggedIn ? <Profile /> : <AuthForm />}
    </div>
  );
};

export default Lobby;
