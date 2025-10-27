import { useState, useEffect } from "react";

export default function useKeyboardControls() {
  const [keys, setKeys] = useState({ w: false, a: false, s: false, d: false });

  useEffect(() => {
    const handleDown = (e) => {
      if (keys[e.key] !== undefined) setKeys((prev) => ({ ...prev, [e.key]: true }));
    };
    const handleUp = (e) => {
      if (keys[e.key] !== undefined) setKeys((prev) => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener("keydown", handleDown);
    window.addEventListener("keyup", handleUp);

    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
    };
  }, []);

  return keys;
}
