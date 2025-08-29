import AppRoutes from "./routes";
import "./App.css";
import OrientationOverlay from "./components/common/OrientationOverlay";

function App() {
  return (
    <>
      <OrientationOverlay />
      <AppRoutes />
    </>
  );
}

export default App;
