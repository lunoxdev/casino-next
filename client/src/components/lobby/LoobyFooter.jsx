const ProfileFooter = ({ handleLogOut, handleCreateRoom, roomId }) => {
  return (
    <section className="flex justify-between items-end">
      <button
        onClick={handleLogOut}
        className="text-xs text-red-600 rounded hover:underline transition cursor-pointer"
      >
        Log Out
      </button>

      {!roomId && (
        <button
          onClick={handleCreateRoom}
          className="w-1/6 bg-lime-600 px-4 py-1 rounded hover:bg-lime-700 transition cursor-pointer"
        >
          Create Room
        </button>
      )}
    </section>
  );
};

export default ProfileFooter;
