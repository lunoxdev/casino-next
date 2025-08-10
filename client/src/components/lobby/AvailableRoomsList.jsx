const AvailableRoomsList = ({ availableRooms, nickname, handleJoin }) => {
  return (
    <ul>
      {availableRooms
        .filter((room) => !room.players.some((p) => p.nickname === nickname))
        .map((room, index) => (
          <li
            key={index}
            className="border border-sky-200/30 rounded-md px-6 py-2 my-2"
          >
            {room.gameName}
            <br />
            <span className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 inline-block text-transparent bg-clip-text">
              {room.host.nickname}
            </span>
            <br />
            {room.host.nickname !== nickname &&
              !room.players.some((p) => p.nickname === nickname) && (
                <button
                  onClick={() => handleJoin(room.roomId)}
                  className="bg-sky-200/30 hover:bg-sky-600/80 rounded-md px-6 py-1 mt-4 cursor-pointer"
                >
                  Join
                </button>
              )}
          </li>
        ))}
    </ul>
  );
};

export default AvailableRoomsList;
