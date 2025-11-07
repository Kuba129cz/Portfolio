import { useState, useEffect } from "react";
import { usePopup } from "../../context/PopupContext.jsx";

export default function DocumentPopup({ documents = [], title = "Documents" }) {
  const [index, setIndex] = useState(0);
  const { closePopup } = usePopup();

  const prevDocument = () => setIndex((i) => (i - 1 + documents.length) % documents.length);
  const nextDocument = () => setIndex((i) => (i + 1) % documents.length);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case "KeyA":
          prevDocument();
          break;
        case "KeyD":
          nextDocument();
          break;
        case "KeyE":
        case "Escape":
          closePopup();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [documents, closePopup]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        color: "white",
        padding: "20px",
      }}
    >
      <h2>{title}</h2>

      <div
        style={{
          width: "90vw",
          height: "90vh",
          maxWidth: "800px",
          maxHeight: "1100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <img
          src={documents[index]}
          alt={`${title} ${index + 1}`}
          style={{ width: "100%", height: "100%", objectFit: "contain", background: "#111" }}
        />
      </div>

      <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
        <button onClick={prevDocument}>◀ Prev</button>
        <span style={{ minWidth: "40px", textAlign: "center" }}>
          {index + 1} / {documents.length}
        </span>
        <button onClick={nextDocument}>Next ▶</button>
      </div>

      <button onClick={closePopup} style={{ marginTop: "20px" }}>
        Close
      </button>
    </div>
  );
}
