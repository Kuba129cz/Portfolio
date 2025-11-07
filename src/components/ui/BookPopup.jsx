import { useState, useEffect } from "react";
import { usePopup } from "../../context/PopupContext.jsx";

export default function BookPopup({ books = [], title = "Bookshelf" }) {
  const [index, setIndex] = useState(0);
  const { closePopup } = usePopup();

  const prevBook = () => setIndex((i) => (i - 1 + books.length) % books.length);
  const nextBook = () => setIndex((i) => (i + 1) % books.length);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case "KeyA":
          prevBook();
          break;
        case "KeyD":
          nextBook();
          break;
        case "KeyE":
        case "Escape":
          closePopup();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [books, closePopup]);

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
      }}
    >
      <h2>{title}</h2>

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
        }}
      >
        <img
          src={books[index]}
          alt={`${title} ${index + 1}`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
        <button onClick={prevBook}>◀ Prev</button>
        <span style={{ minWidth: "40px", textAlign: "center" }}>
          {index + 1} / {books.length}
        </span>
        <button onClick={nextBook}>Next ▶</button>
      </div>

      <button onClick={closePopup} style={{ marginTop: "20px" }}>
        Close
      </button>
    </div>
  );
}
