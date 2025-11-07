import { useState, useEffect } from "react";
import { usePopup } from "../context/PopupContext.jsx";

export function usePointerLock(canvasRef) {
  const [mouseLocked, setMouseLocked] = useState(false);
  const { isOpen } = usePopup(); // přístup ke stavu popupu

  useEffect(() => {
    const handleUserInput = (e) => {
      if (isOpen) return; // pokud je popup, neuzamykáme myš
      if (document.pointerLockElement !== canvasRef.current) {
        canvasRef.current?.requestPointerLock();
      }
    };

    window.addEventListener("keydown", handleUserInput);
    window.addEventListener("mousedown", handleUserInput);

    return () => {
      window.removeEventListener("keydown", handleUserInput);
      window.removeEventListener("mousedown", handleUserInput);
    };
  }, [canvasRef, isOpen]);

  useEffect(() => {
    const handlePointerLockChange = () => {
      setMouseLocked(document.pointerLockElement === canvasRef.current);
    };
    document.addEventListener("pointerlockchange", handlePointerLockChange);
    return () => document.removeEventListener("pointerlockchange", handlePointerLockChange);
  }, [canvasRef]);

  const lock = () => {
    if (!isOpen) canvasRef.current?.requestPointerLock();
  };
  const unlock = () => document.exitPointerLock();

  // pokud je popup otevřený, zajistíme že myš je odemčená
  useEffect(() => {
    if (isOpen) unlock();
  }, [isOpen]);

  return { mouseLocked, lock, unlock };
}
