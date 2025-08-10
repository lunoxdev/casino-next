const AvailableRoomsList = ({ availableRooms, nickname, handleJoin }) => {
  return (
    <ul>
      {availableRooms
        .filter((room) => !room.players.some((p) => p.nickname === nickname))
        .map((room, index) => (
          <li
            key={index}
            className="bg-gradient-to-br from-black/0 via-black/5 to-black/10 rounded-md px-6 py-2 my-2 hover:border hover:border-lime-500 border border-transparent cursor-pointer"
            onClick={() => handleJoin(room.roomId)}
          >
            {room.gameName}
            <br />
            <span className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 inline-block text-transparent bg-clip-text">
              {room.host.nickname}
            </span>
          </li>
        ))}
    </ul>
  );
};

export default AvailableRoomsList;
