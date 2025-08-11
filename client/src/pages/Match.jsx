import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useLocation } from "react-router-dom";
import socket from "../socket";

const gameUrls = {
  "Resurrecting Riches":
    "https://demogamesfree.pragmaticplay.net/hub-demo/openGame.do?lang=en&cur=USD&websiteUrl=https%3A%2F%2Fclienthub.pragmaticplay.com%2F&gcpif=2831&gameSymbol=vswaysresurich&jurisdiction=99&lobbyUrl=https://clienthub.pragmaticplay.com/slots/game-library/",
  "Gates of Olympus":
    "https://demogamesfree.eotofjxixi.net/gs2c/openGame.do?gameSymbol=vs20olympgold&lang=en&cur=USD&lobbyUrl=https://stake.com/casino/home&cashierUrl=https://stake.com/casino/home?tab=deposit&currency=btc&modal=wallet&stylename=rare_stake&jurisdiction=99&isGameUrlApiCalled=true&userId=demo",
  "Sugar Rush":
    "https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?jurisdiction=99&lang=en&cur=EUR&gameSymbol=vs20sugarrushx",
  "Wanted Dead or a Wild":
    "https://static-live.hacksawgaming.com/1067/1.19.0/index.html?language=en&channel=desktop&gameid=1067&mode=2&token=123131&lobbyurl=https%3A%2F%2Fwww.hacksawgaming.com&currency=EUR&partner=demo&env=https://rgs-demo.hacksawgaming.com/api",
  "Witch Heart":
    "https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=en&cur=USD&websiteUrl=https%3A%2F%2Fclienthub.pragmaticplay.com%2F&gcpif=3482&gameSymbol=vswayswildbrst&jurisdiction=99",
};

const Match = () => {
  const { name, balance, setBalance, token, loggedIn } = useAuthStore();
  const [players, setPlayers] = useState([]);
  const [spinMessages, setSpinMessages] = useState({});
  const [showButton, setShowButton] = useState(true);

  const location = useLocation();
  const { gameName } = location.state;

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
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-xl lg:text-4xl mb-2">
        ⚔{" "}
        <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 inline-block text-transparent bg-clip-text">
          {gameName}
        </span>{" "}
        ⚔
      </h1>

      {/* Game iFrame */}
      <iframe
        title="Gate of Olympus"
        allowFullScreen="false"
        src={gameUrls[gameName]}
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
