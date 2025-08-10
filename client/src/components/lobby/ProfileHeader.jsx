import avatar from "../../assets/avatar.webp";

const ProfileHeader = ({ nickname, balance, players }) => {
  return (
    <section className="flex justify-between">
      <div className="flex space-x-4">
        <img src={avatar} alt="avatar" className="w-16 h-16" />
        <h1 className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 inline-block text-transparent bg-clip-text font-semibold">
          {nickname}
        </h1>
      </div>

      <div className="flex justify-center items-start gap-8">
        <p className="font-medium gap-1">
          Online:{" "}
          <span className="bg-gradient-to-r from-lime-500 via-lime-400 to-lime-500 text-transparent bg-clip-text font-semibold">
            {players.length}
          </span>
        </p>

        <button className="font-semibold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-transparent bg-clip-text hover:opacity-80 transition-opacity flex items-start gap-1">
          ${balance}
          <span className="text-lime-500 font-bold text-xl -mt-1">+</span>
        </button>
      </div>
    </section>
  );
};

export default ProfileHeader;
