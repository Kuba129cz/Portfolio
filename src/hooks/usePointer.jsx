import { useState, useEffect } from "react";
import { usePopup } from "../context/PopupContext.jsx";

export function usePointerLock(canvasRef) {
  const [mouseLocked, setMouseLocked] = useState(false);
  const { isOpen } = usePopup(); // access to popup state

  useEffect(() => {
    const handleUserInput = (e) => {
      if (isOpen) return; // if there is a popup, do not lock the mouse
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

  // if the popup is open, ensure that the mouse is unlocked
  useEffect(() => {
    if (isOpen) unlock();
  }, [isOpen]);

  return { mouseLocked, lock, unlock };
}
