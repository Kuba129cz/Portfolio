import { useEffect, useState, useCallback } from "react";
import { usePopup } from "../../context/PopupContext.jsx";
import { useThree } from "@react-three/fiber";
import { Vector3 } from "three";

export default function WebViewPopup({ popupData }) {
  const { closePopup } = usePopup();
  const { url, position, rotation, size } = popupData || {};
  const { camera, gl } = useThree();

  const [iframeStyle, setIframeStyle] = useState({});

  // Převod světových souřadnic na 2D pixely
  const worldToScreen = useCallback((pos) => {
    if (!camera || !gl) return { x: 0, y: 0 };
    const vector = new Vector3(...pos).project(camera);
    const x = ((vector.x + 1) / 2) * gl.domElement.clientWidth;
    const y = ((-vector.y + 1) / 2) * gl.domElement.clientHeight;
    return { x, y };
  }, [camera, gl]);

  // Aktualizace pozice iframe
  const updateIframeStyle = useCallback(() => {
    if (!position || !size) return;

    // body rohů displeje
    const topLeft = [
      position[0] - size[0] / 2,
      position[1] + size[1] / 2,
      position[2],
    ];
    const bottomRight = [
      position[0] + size[0] / 2,
      position[1] - size[1] / 2,
      position[2],
    ];

    const topLeftPx = worldToScreen(topLeft);
    const bottomRightPx = worldToScreen(bottomRight);

    const widthPx = bottomRightPx.x - topLeftPx.x;
    const heightPx = bottomRightPx.y - topLeftPx.y;

    setIframeStyle({
      position: "fixed",
      left: `${topLeftPx.x}px`,
      top: `${topLeftPx.y}px`,
      width: `${widthPx}px`,
      height: `${heightPx}px`,
      border: "none",
      zIndex: 9999,
      pointerEvents: "auto",
    });
  }, [position, size, worldToScreen]);

  // Přepočítat při resize okna
  useEffect(() => {
    updateIframeStyle();
    window.addEventListener("resize", updateIframeStyle);
    return () => window.removeEventListener("resize", updateIframeStyle);
  }, [updateIframeStyle]);

  // Zavření popupu klávesou Escape nebo E
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" || e.key === "e") {
        closePopup();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (!url) return null;

  return <iframe src={url} style={iframeStyle} />;
}
