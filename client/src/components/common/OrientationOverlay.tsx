import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const OrientationOverlay = () => {
  const [showOverlay, setShowOverlay] = useState<boolean>(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Check if device is in portrait mode
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      // Check if screen width is less than 767px (mobile devices)
      const isSmallScreen = window.matchMedia("(max-width: 767px)").matches;

      setShowOverlay(isPortrait && isSmallScreen);
    };

    checkOrientation(); // Initial check

    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  if (!showOverlay) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex flex-col items-center h-screen w-screen justify-center z-50 backdrop-blur-3xl">
      <DotLottieReact
        src="/rotate-phone.lottie"
        loop
        autoplay
        speed={2}
        className="w-full h-auto"
      />
      <p className="text-sm sm:text-xl font-bold px-4 animate-pulse">
        Rotate your phone for better experience
      </p>
    </div>
  );
};

export default OrientationOverlay;
