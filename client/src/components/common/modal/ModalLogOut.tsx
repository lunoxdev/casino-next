interface ModalLogOutProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ModalLogOut: React.FC<ModalLogOutProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center w-full space-x-20 bg-black/50 backdrop-blur">
      <button
        onClick={onConfirm}
        className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 inline-block text-transparent bg-clip-text font-semibold rounded transition cursor-pointer hover:scale-110"
      >
        LOG OUT
      </button>
      <button
        onClick={onCancel}
        className="bg-gradient-to-r from-lime-600 via-lime-500 to-lime-600 inline-block text-transparent bg-clip-text font-semibold rounded transition cursor-pointer hover:scale-110"
      >
        CANCEL
      </button>
    </div>
  );
};

export default ModalLogOut;
