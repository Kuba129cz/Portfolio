import { createContext, useContext, useState } from "react";

const PopupContext = createContext();

export function PopupProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [canOpen, setCanOpen] = useState(true); // lock for delay

  const openPopup = (type, data = null) => {
    if (!canOpen) return; 

    setPopupType(type);
    setPopupData(data);
    setIsOpen(true);
    setCanOpen(false);   
  };

  const closePopup = () => {
    setIsOpen(false);
    setPopupData(null);
    setPopupType(null);
    setTimeout(() => setCanOpen(true), 500);
  };

  return (
    <PopupContext.Provider value={{ isOpen, popupType, popupData, openPopup, closePopup, canOpen, setCanOpen }}>
      {children}
    </PopupContext.Provider>
  );
}

export function usePopup() {
  return useContext(PopupContext);
}
