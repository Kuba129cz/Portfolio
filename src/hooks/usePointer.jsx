import { useState, useEffect } from "react";

export function usePointerLock(canvasRef) 
{
    const [mouseLocked, setMouseLocked] = useState(false);

useEffect(() => {
  const handleUserInput = (e) => {
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
}, [canvasRef]);


    useEffect(() => 
    {
        const handlePointerLockChange = () => 
        {
            setMouseLocked(document.pointerLockElement === canvasRef.current);
        };
        document.addEventListener("pointerlockchange", handlePointerLockChange);

        return () => 
        {
            document.removeEventListener("pointerlockchange", handlePointerLockChange);
        };
    }, [canvasRef]);

    const lock = () => canvasRef.current?.requestPointerLock();
    const unlock = () => document.exitPointerLock();

    return { mouseLocked, lock, unlock };
}
