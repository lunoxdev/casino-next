import { type AvailableRoomsListProps } from "../../types/room";

const AvailableRoomsList = ({
  availableRooms,
  nickname,
  handleJoin,
}: AvailableRoomsListProps) => {
  return (
    <ul className="flex w-full flex-col items-end">
      {availableRooms
        .filter((room) => !room.players.some((p) => p.nickname === nickname))
        .map((room, index) => (
          <li
            key={index}
            className="flex flex-col w-2/4 bg-gradient-to-tl from-sky-500/0 via-sky-500/5 to-sky-500/10 shadow-xs shadow-black/10 rounded-md px-6 py-2 my-2 hover:shadow-md hover:shadow-sky-700 cursor-pointer transition"
            onClick={() => handleJoin(room.roomId)}
          >
            <span>{room.gameName}</span>
            <span className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 inline-block text-transparent bg-clip-text">
              {room.host.nickname}
            </span>
          </li>
        ))}
    </ul>
  );
};

export default AvailableRoomsList;
