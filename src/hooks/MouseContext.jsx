import { createContext, useContext, useEffect, useRef, useState } from "react";

const MouseContext = createContext();

export function MouseProvider({ children }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setRotation((prev) => ({
        x: Math.max(-Math.PI / 3, Math.min(Math.PI / 3, prev.x - e.movementY * 0.002)),
        y: prev.y - e.movementX * 0.002,
      }));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <MouseContext.Provider value={rotation}>
      {children}
    </MouseContext.Provider>
  );
}

export const useMouseControls = () => useContext(MouseContext);