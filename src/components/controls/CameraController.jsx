import { useState, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useMouseControls } from "../../hooks/MouseContext.jsx";
import { Vector3 } from "three";

export default function CameraController({ playerRef }) {
  const { camera } = useThree();
  const rotation = useMouseControls();

  const [targetRadius, setTargetRadius] = useState(5); 
  const radiusRef = useRef(5); 

  // scroll
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY * 0.01; 
      setTargetRadius((r) => {
        const newR = r + delta; 
        return Math.max(2, Math.min(10, newR)); 
      });
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  useFrame(() => {
    if (!playerRef.current) return;

    radiusRef.current += (targetRadius - radiusRef.current) * 0.1;

    const pos = playerRef.current.translation();
    const offset = new Vector3(
      Math.sin(rotation.y) * radiusRef.current,
      2 + rotation.x * 2,
      Math.cos(rotation.y) * radiusRef.current
    );

    const targetPos = new Vector3(pos.x, pos.y + 1, pos.z).add(offset);

    camera.position.lerp(targetPos, 0.1);
    camera.lookAt(pos.x, pos.y + 1, pos.z);
  });

  return null;
}
