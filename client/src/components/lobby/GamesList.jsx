import { useRef } from "react";

import resurrectingRiches from "../../assets/games/mp4/resurrecting-riches.mp4";
import gatesOfOlympus from "../../assets/games/mp4/gates-of-olympus-1000.mp4";
import sugarRush from "../../assets/games/mp4/sugar-rush-1000.mp4";
import wantedDeadOrWild from "../../assets/games/mp4/wanted-dead-or-a-wild.mp4";
import witchHeart from "../../assets/games/mp4/witch-heart.mp4";

const games = [
  { name: "Resurrecting Riches", image: resurrectingRiches },
  { name: "Gates of Olympus", image: gatesOfOlympus },
  { name: "Sugar Rush", image: sugarRush },
  { name: "Wanted Dead or a Wild", image: wantedDeadOrWild },
  { name: "Witch Heart", image: witchHeart },
];

const GamesList = ({ handleCreateRoom, roomId }) => {
  const videoRefs = useRef([]);

  const handleHover = (hoveredIndex) => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === hoveredIndex) {
        video.currentTime = 0;
        video.play();
      } else {
        video.pause();
      }
    });
  };

  const handleLeave = () => {
    videoRefs.current.forEach((video) => {
      if (video) video.play();
    });
  };

  const handleClick = (gameName) => {
    if (handleCreateRoom) {
      handleCreateRoom(gameName, roomId);
    }
  };

  return (
    <div className="grid grid-cols-5 gap-3 group">
      {games.map((game, index) => (
        <div
          key={index}
          className="flex flex-col items-center p-2 rounded-xl backdrop-blur-4xl shadow-2xl transition-transform duration-500 hover:scale-110 group-hover:opacity-40 hover:!opacity-100 cursor-pointer"
          onMouseEnter={() => handleHover(index)}
          onMouseLeave={handleLeave}
          onClick={() => handleClick(game.name)}
        >
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            src={game.image}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto rounded-md"
          />
        </div>
      ))}
    </div>
  );
};

export default GamesList;
