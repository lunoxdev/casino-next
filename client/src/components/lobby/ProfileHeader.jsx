import { useState } from "react";
import avatar from "../../assets/avatar.webp";
import ModalLogOut from "../common/modal/ModalLogOut";

const ProfileHeader = ({ nickname, balance, players, handleLogOut }) => {
  const [showLogOut, setShowLogOut] = useState(false);

  const handleAvatarClick = () => {
    setShowLogOut((prev) => !prev);
  };

  const handleLogOutClick = () => {
    handleLogOut();
    setShowLogOut(false);
  };

  const handleCancel = () => {
    setShowLogOut(false);
  };

  return (
    <section className="flex justify-between">
      <div className="flex space-x-4">
        {showLogOut && (
          <ModalLogOut onConfirm={handleLogOutClick} onCancel={handleCancel} />
        )}

        {/* Avatar */}
        <button
          onClick={handleAvatarClick}
          className="relative h-16 w-16 overflow-hidden rounded-sm border border-gray-800 backdrop-blur-3xl hover:opacity-80 duration-300 cursor-pointer hover:scale-105 transition-transform"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#1447e6_0%,#00a6f4_50%,#1447e6_100%)]" />
          <img
            src={avatar}
            alt="avatar"
            loading="eager"
            className="relative rounded-xl object-cover animate-none"
          />
        </button>
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
