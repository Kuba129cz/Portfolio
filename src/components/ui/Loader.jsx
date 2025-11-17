import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import "./Loader.css"; 
import Key from "./Key";

export default function Loader({ onStart }) {
  const { progress } = useProgress();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => setReady(true), 400);
    }
  }, [progress]);

  return (
    <div className="loader-container">
      <h1 className="loader-title">Načítání scény…</h1>

      <div className="bar-outer">
        <div className="bar-inner" style={{ width: `${progress}%` }} />
      </div>

      <p className="loader-percent">{Math.floor(progress)}%</p>

      <div className="controls-wrapper">
        <div className="keyboard">
          
          <div className="row">
            <div className="spacer-335" />
            <Key label="W" desc="forward" active />
            <div className="spacer-90" />
            <Key label="E" desc="interact" active />
          </div>

          <div className="row">
            <Key label="SHIFT" desc="run" wide active />
            <div className="spacer-40" />
            <Key label="A" desc="left" active className="key-margin" />
            <Key label="S" desc="backward" active className="key-margin" />
            <Key label="D" desc="right" active className="key-margin" />
          </div>

          <div className="row">
            <div style={{ width: "180px" }} />
            <Key label="SPACE" desc="jump" wide active style={{ width: "180px", margin: "6px" }} />
          </div>
        </div>

        <div className="mouse">
          <div className="mouse-wheel" />
          <p className="mouse-label">zoom</p>
        </div>
      </div>

      {ready && (
        <button className="start-btn" onClick={onStart}>
          ▶ Begin
        </button>
      )}
    </div>
  );
}
