const RoomPanel = ({
  gameName,
  roomPlayers,
  handleStartMatch,
  handleLeave,
}) => {
  return (
    <section className="flex flex-col bg-gradient-to-br from-black/0 via-black/5 to-black/10 rounded-md px-6 py-2 my-2">
      <p>{gameName}</p>
      <ul className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 inline-block text-transparent bg-clip-text">
        {roomPlayers.map((p, index) => (
          <li key={index}>{p.nickname}</li>
        ))}
      </ul>

      {roomPlayers.length === 2 ? (
        <button
          onClick={handleStartMatch}
          className="bg-cyan-600 px-4 py-1 rounded hover:bg-cyan-700 transition mt-4 cursor-pointer"
        >
          Start Match
        </button>
      ) : (
        <button
          onClick={handleLeave}
          className="bg-red-600 px-4 py-1 rounded hover:bg-red-700 transition mt-4 cursor-pointer"
        >
          Leave Room
        </button>
      )}
    </section>
  );
};

export default RoomPanel;
