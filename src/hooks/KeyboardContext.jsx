import { createContext, useContext, useState, useEffect } from "react";

// Create context
const KeyboardContext = createContext();

// 2. Provider
export function KeyboardProvider({ children }) {
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    run: false,
    jump: false,
    interact: false,
    escape: false
  })

  const resetKeys = () => {
    setKeys({
      forward: false,
      backward: false,
      left: false,
      right: false,
      run: false,
      jump: false,
      interact: false,
      escape: false
    });
  };
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case "KeyW": setKeys(k => ({ ...k, forward: true })); break;
        case "KeyS": setKeys(k => ({ ...k, backward: true })); break;
        case "KeyA": setKeys(k => ({ ...k, left: true })); break;
        case "KeyD": setKeys(k => ({ ...k, right: true })); break;
        case "ShiftLeft": setKeys(k => ({ ...k, run: true })); break;
        case "Space": setKeys(k => ({ ...k, jump: true })); break;
        case "KeyE": setKeys(k => ({ ...k, interact: true })); break;
        case "Escape": setKeys(k => ({ ...k, escape: true })); break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.code) {
        case "KeyW": setKeys(k => ({ ...k, forward: false })); break;
        case "KeyS": setKeys(k => ({ ...k, backward: false })); break;
        case "KeyA": setKeys(k => ({ ...k, left: false })); break;
        case "KeyD": setKeys(k => ({ ...k, right: false })); break;
        case "ShiftLeft": setKeys(k => ({ ...k, run: false })); break;
        case "Space": setKeys(k => ({ ...k, jump: false })); break;
        case "KeyE": setKeys(k => ({ ...k, interact: false })); break;
        case "Escape": setKeys(k => ({ ...k, escape: false })); break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <KeyboardContext.Provider value={ {keys, resetKeys} }>
      {children}
    </KeyboardContext.Provider>
  );
}

// 3. Custom hook pro jednodušší použití
export function useKeyboardControls() {
  return useContext(KeyboardContext);
}
