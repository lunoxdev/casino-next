const ProfileFooter = ({ handleCreateRoom, roomId }) => {
  return (
    <section className="flex justify-end items-end">
      {!roomId && (
        <button
          onClick={handleCreateRoom}
          className="w-1/6 bg-linear-to-r from-lime-600/30 via-lime-700 to-lime-600/30 hover:bg-lime-700 px-4 py-2 rounded transition cursor-pointer"
        >
          Create Room
        </button>
      )}
    </section>
  );
};

export default ProfileFooter;
