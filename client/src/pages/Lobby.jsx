import { useAuthStore } from "../stores/useAuthStore";
import AuthForm from "../components/auth/AuthForm";
import Profile from "../components/lobby/Profile";
import Background from "../components/common/Background";

const Lobby = () => {
  const loggedIn = useAuthStore((state) => state.loggedIn);

  return (
    <>
      <Background />
      {loggedIn ? <Profile /> : <AuthForm />}
    </>
  );
};

export default Lobby;
