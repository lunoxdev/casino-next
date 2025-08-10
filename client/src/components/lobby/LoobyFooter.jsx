const ProfileFooter = ({ handleCreateRoom, roomId }) => {
  return (
    <section className="flex justify-end items-end">
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
