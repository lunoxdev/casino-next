import { useRef, useState } from "react";
import clsx from "clsx";

interface InputLightEffectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnter?: () => void;
}

export const InputLightEffect = ({
  value,
  onChange,
  onEnter,
}: InputLightEffectProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [show, setShow] = useState<boolean>(false);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    if (!inputRef.current || isFocused) return;
    const rect = inputRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShow(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setShow(false);
  };

  const handleMouseEnter = () => setShow(true);
  const handleMouseLeave = () => !isFocused && setShow(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onEnter?.();
  };

  return (
    <div className="relative w-full mb-3">
      <input
        ref={inputRef}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        onMouseMove={handleMouseMove}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        autoComplete="off"
        placeholder="Nickname"
        type="text"
        name="nickname"
        maxLength={12}
        className="h-10 w-full rounded-md bg-black/0 px-4 text-xs sm:text-base text-center text-cyan-100 placeholder:text-cyan-100/50 transition-colors duration-300 focus:border-cyan-900 focus:outline-cyan-900 outline-none"
      />

      {/* Hover effect */}
      <div
        className={clsx(
          "pointer-events-none absolute left-0 top-0 z-10 h-10 w-full rounded-md border border-cyan-400 bg-transparent",
          "transition-opacity duration-500",
          show && !isFocused ? "opacity-100" : "opacity-0"
        )}
        style={{
          WebkitMaskImage: `radial-gradient(30% 30px at ${position.x}px ${position.y}px, black 45%, transparent)`,
          maskImage: `radial-gradient(30% 30px at ${position.x}px ${position.y}px, black 45%, transparent)`,
        }}
      />

      {/* Focus effect with transition */}
      <div
        className={clsx(
          "pointer-events-none absolute left-0 top-0 z-20 h-10 w-full rounded-md border border-cyan-400 bg-transparent",
          "transition-opacity duration-700 ease-out",
          isFocused ? "opacity-100" : "opacity-0"
        )}
        style={{
          WebkitMaskImage:
            "radial-gradient(circle at top left, black 6px, transparent 7px), \
             radial-gradient(circle at top right, black 6px, transparent 7px), \
             radial-gradient(circle at bottom left, black 6px, transparent 7px), \
             radial-gradient(circle at bottom right, black 6px, transparent 7px)",
          WebkitMaskComposite: "destination-in",
          maskImage:
            "radial-gradient(circle at top left, black 6px, transparent 7px), \
             radial-gradient(circle at top right, black 6px, transparent 7px), \
             radial-gradient(circle at bottom left, black 6px, transparent 7px), \
             radial-gradient(circle at bottom right, black 6px, transparent 7px)",
          maskComposite: "add",
        }}
      />
    </div>
  );
};
