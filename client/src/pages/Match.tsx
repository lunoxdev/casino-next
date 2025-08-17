import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useProfileStore } from "../stores/useProfileStore";
import { useRoomsStore } from "../stores/useRoomsStore";
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
  const { token, loggedIn } = useAuthStore();
  const { nickname, balance } = useProfileStore();
  const { myRoom } = useRoomsStore();
  const { roomPlayers } = myRoom;
  const location = useLocation();
  const { gameName } = location.state;

  useEffect(() => {
    if (loggedIn && token) {
      socket.emit("startMatch");
      socket.emit("playerJoined", { nickname, balance, token });
    }
  }, [loggedIn, token, nickname, balance]);

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
          {roomPlayers && roomPlayers[0] ? (
            <>
              <p className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 inline-block text-transparent bg-clip-text">
                {roomPlayers[0].nickname}
              </p>
              <p className="text-sm lg:text-xl">💰 $1000</p>
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

        {/* Player 2 */}
        <div>
          {roomPlayers && roomPlayers[1] ? (
            <>
              <p className="bg-gradient-to-r from-rose-500 via-rose-400 to-rose-500 inline-block text-transparent bg-clip-text">
                {roomPlayers[1].nickname}
              </p>
              <p className="text-sm lg:text-xl">💰 $1000</p>
            </>
          ) : (
            <p>Waiting for opponent...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Match;
