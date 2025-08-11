import clsx from "clsx";

const RoomPanel = ({
  gameName,
  roomPlayers,
  handleStartMatch,
  handleLeave,
}) => {
  const isDisabled = roomPlayers.length <= 1;

  return (
    <section className="flex flex-col w-2/3 bg-gradient-to-br from-black/0 via-black/5 to-black/10 rounded-md px-6 py-2 my-2">
      {/* Game Name */}
      <p>{gameName}</p>

      {/* Players List */}
      <ul className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 inline-block text-transparent bg-clip-text">
        {roomPlayers.map((p, index) => (
          <li key={index}>{p.nickname}</li>
        ))}
      </ul>

      {/* Start Match Button */}
      {isDisabled ? (
        <p
          className={clsx(
            "bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 inline-block text-transparent bg-clip-text font-semibold animate-pulse mt-4"
          )}
        >
          Waiting for opponent...
        </p>
      ) : (
        <button
          onClick={handleStartMatch}
          className={clsx(
            "bg-linear-to-r from-lime-600/30 via-lime-700 to-lime-600/30 hover:bg-lime-700 px-4 py-1 rounded transition mt-4 cursor-pointer"
          )}
        >
          Start Match
        </button>
      )}

      {/* Leave Room Button */}
      <button
        onClick={handleLeave}
        className="bg-linear-to-r from-red-600/30 via-red-700 to-red-600/30 px-4 py-1 rounded hover:bg-red-700 transition mt-4 cursor-pointer"
      >
        Leave Room
      </button>
    </section>
  );
};

export default RoomPanel;
