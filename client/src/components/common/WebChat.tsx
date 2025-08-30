import { useState } from "react";
import { Webchat, Fab } from "@botpress/webchat";

function App() {
  const clientId = import.meta.env.VITE_BOTPRESS_CLIENTID;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <>
      <Webchat
        clientId={clientId}
        style={{
          width: "400px",
          height: "600px",
          display: isOpen ? "flex" : "none",
          position: "fixed",
          bottom: "100px",
          right: "20px",
          borderRadius: "16px",
          boxShadow: "0 8px 16px #000",
          background: "linear-gradient(180deg, #0f172a 0%, #1e3a8a 100%)",
          overflow: "hidden",
        }}
      />
      <Fab
        onClick={toggle}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
          boxShadow: "0 6px 10px #121212",
          fontSize: "24px",
        }}
      />
    </>
  );
}

export default App;
