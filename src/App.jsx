import { Canvas } from "@react-three/fiber"
import Scene from "./components/Scene.jsx"
import { PopupProvider, usePopup } from "./context/PopupContext.jsx";
import DocumentPopup from "./components/ui/DocumentPopup.jsx";
import WebViewPopup from "./components/ui/WebViewPopup.jsx";

function PopupContainer() {
  const { isOpen, popupType, popupData, closePopup } = usePopup();

  if (!isOpen) return null;

  switch (popupType) {
    case "books":
      return <DocumentPopup documents={popupData} title="Bookshelf" />;
    case "certificates":
      return <DocumentPopup documents={popupData} title="Certificates" />;
     case "webview":
       return <WebViewPopup url={popupData} />; 
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
