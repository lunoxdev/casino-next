import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useProfileStore } from "../stores/useProfileStore";
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
  const location = useLocation();
  const { gameName } = location.state as { gameName: keyof typeof gameUrls };

  useEffect(() => {
    if (loggedIn && token) {
      socket.emit("startMatch");
      socket.emit("playerJoined", { nickname, balance, token });
    }
  }, [loggedIn, token, nickname, balance]);

  return (
    <div className="flex items-center justify-center h-full">
      {/* Game iFrame */}
      <iframe
        title="Gate of Olympus"
        allowFullScreen={false}
        src={gameUrls[gameName]}
        className="w-[600px] lg:w-[1280px] aspect-video rounded-sm"
      />
    </div>
  );
};

export default Match;
