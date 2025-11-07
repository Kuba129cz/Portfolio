import { useState, useEffect } from "react";
import { usePopup } from "../../context/PopupContext.jsx";

export default function GenericPopup({ onClose }) {
  const { popupType, popupData } = usePopup();
  const [index, setIndex] = useState(0);

  useEffect(() => setIndex(0), [popupType]); // reset při změně typu popupu

  // zavření přes Esc
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!popupType) return null;

  const prevItem = () =>
    setIndex((i) => (i - 1 + (popupData?.length || 1)) % popupData.length);
  const nextItem = () =>
    setIndex((i) => (i + 1) % popupData.length);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.85)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        cursor: "auto",
      }}
    >
      <h2 style={{ marginBottom: "20px", textTransform: "capitalize" }}>
        {popupType}
      </h2>

      {popupType === "books" && popupData?.length > 0 && (
        <div
          style={{
            width: "250px",
            height: "350px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#111",
            borderRadius: "10px",
            overflow: "hidden",
            marginBottom: "10px",
          }}
        >
          <img
            src={popupData[index]}
            alt="Book Cover"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      {popupType === "books" && popupData?.length > 1 && (
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button onClick={prevItem}>◀ Prev</button>
          <button onClick={nextItem}>Next ▶</button>
        </div>
      )}

      {popupType === "certificates" && popupData?.length > 0 && (
        <div
          style={{
            maxWidth: "600px",
            maxHeight: "80%",
            overflowY: "auto",
            background: "#222",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          {popupData.map((cert, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              {cert}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onClose}
        style={{
          padding: "8px 16px",
          borderRadius: "5px",
          border: "none",
          background: "#555",
          color: "white",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  );
}
