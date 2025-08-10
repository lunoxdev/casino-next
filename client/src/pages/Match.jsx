import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import socket from "../socket";

const Match = () => {
  const { name, balance, setBalance, token, loggedIn } = useAuthStore();
  const [players, setPlayers] = useState([]);
  const [spinMessages, setSpinMessages] = useState({});
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    if (loggedIn && token) {
      socket.emit("startMatch");

      socket.emit("playerJoined", { name, balance, token }); // In case the player reload
    }

    socket.on("matchPlayers", (list) => {
      setPlayers(list);
    });

    socket.on("spinResult", ({ token, message, balance }) => {
      setBalance(balance);

      if (message) {
        setTimeout(() => {
          setSpinMessages((prev) => ({
            ...prev,
            [token]: message,
          }));

          setTimeout(() => {
            setSpinMessages((prev) => ({
              ...prev,
              [token]: "",
            }));
          }, 3000);
        }, 3000);
      }
    });

    return () => {
      socket.off("matchPlayers");
      socket.off("spinResult");
    };
  }, [loggedIn, token, name, balance, setBalance]);

  const handleSpin = () => {
    setShowButton(false);
    socket.emit("spin", { token });

    setTimeout(() => {
      setShowButton(true);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-xl lg:text-4xl mb-2">
        ⚔{" "}
        <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 inline-block text-transparent bg-clip-text">
          Battle
        </span>{" "}
        ⚔
      </h1>

      {/* Game iFrame */}
      <iframe
        title="Gate of Olympus"
        allowFullScreen="false"
        // src="https://example.com"
        src="https://demogamesfree.eotofjxixi.net/gs2c/openGame.do?gameSymbol=vs20olympgold&amp;lang=en&amp;cur=USD&amp;lobbyUrl=https://stake.com/casino/home&amp;cashierUrl=https://stake.com/casino/home?tab=deposit&amp;currency=btc&amp;modal=wallet&amp;stylename=rare_stake&amp;jurisdiction=99&amp;treq=m618tX112Qn6xBt1hupM1AS4H9vMQAV2qqJFuZdSWhtIwbtSYw3DCji6YLGkQYCP&amp;isGameUrlApiCalled=true&amp;userId=demo"
        className="w-[540px] lg:w-[980px] aspect-video mb-1 rounded-sm block"
      />

      <div className="grid grid-cols-3 gap-4 items-center text-center text-white text-lg font-semibold">
        {/* Player */}
        <div>
          {players[0] ? (
            <>
              {players[0] && spinMessages[players[0].token] && (
                <p className="text-yellow-400 text-sm mt-1">
                  {spinMessages[players[0].token]}
                </p>
              )}
              <p className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 inline-block text-transparent bg-clip-text">
                {players[0].name}
              </p>
              <p className="text-sm lg:text-xl">💰 ${players[0].balance}</p>
            </>
          ) : (
            <p>Waiting for you...</p>
          )}
        </div>

        {/* VS Text */}
        <div>
          <p className="text-2xl bg-gradient-to-r from-gray-500 via-gray-300 to-gray-500 inline-block text-transparent bg-clip-text">
            VS
          </p>
        </div>

        {/* Opponent */}
        <div>
          {players[1] ? (
            <>
              {players[1] && spinMessages[players[1].token] && (
                <p className="text-yellow-400 text-sm mt-1">
                  {spinMessages[players[1].token]}
                </p>
              )}
              <p className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 inline-block text-transparent bg-clip-text">
                {players[1].name}
              </p>
              <p className="text-sm lg:text-xl">💰 ${players[1].balance}</p>
            </>
          ) : (
            <p>Waiting for opponent...</p>
          )}
        </div>
      </div>

      {/* ⚠️ Temporal spin button */}
      {showButton && (
        <div className="relative">
          <button
            onClick={handleSpin}
            className="border border-white/5 p-6 rounded-full transition font-bold cursor-pointer absolute bottom-0 left-52 lg:left-[250px] transform -translate-x-1.5 -translate-y-[120px] lg:-translate-y-[90px] animate-ping"
          ></button>
        </div>
      )}
    </div>
  );
};

export default Match;
