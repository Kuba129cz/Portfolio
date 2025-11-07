import { createContext, useContext, useState } from "react";

const PopupContext = createContext();

export function PopupProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [popupType, setPopupType] = useState(null); // <--- velké S
  const [popupData, setPopupData] = useState(null); // <--- velké S

  const openPopup = (type, data = null) => {
    setPopupType(type);
    setPopupData(data);
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    setPopupData(null);
    setPopupType(null);
  };

  return (
    <PopupContext.Provider value={{ isOpen, popupType, popupData, openPopup, closePopup }}>
      {children}
    </PopupContext.Provider>
  );
}

export function usePopup() {
  return useContext(PopupContext);
}
