import { Canvas } from "@react-three/fiber"
import Scene from "./components/Scene.jsx"
import { PopupProvider, usePopup } from "./context/PopupContext.jsx";
import BookPopup from "./components/ui/BookPopup.jsx";

function PopupContainer() {
  const { isOpen, popupType, popupData, closePopup } = usePopup();

  if (!isOpen) return null;

  switch (popupType) {
    case "books":
      return <BookPopup books={popupData} onClose={closePopup} />;
    case "certificates":
      return <CertificatePopup certs={popupData} onClose={closePopup} />;
    default:
      return null;
  }
}

export default function App() {
  return (
    <PopupProvider>
      <Scene />
      <PopupContainer />
    </PopupProvider>
  )
}
