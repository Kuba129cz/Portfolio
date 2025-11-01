import { useState, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useMouseControls } from "../../hooks/MouseContext.jsx";
import { Vector3, Box3 } from "three";

export default function CameraController({ playerRef, houseRef }) {
  const { camera } = useThree();
  const rotation = useMouseControls();

  const [targetRadius, setTargetRadius] = useState(5); 
  const radiusRef = useRef(5);

  // Zoom
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY * 0.02; 
      setTargetRadius((r) => Math.max(2, Math.min(10, r + delta)));
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  // Bounding box domu
  const houseBox = useRef(new Box3());

  useEffect(() => {
    if (houseRef?.current) {
      houseBox.current.setFromObject(houseRef.current);
    }
  }, [houseRef]);

  useFrame(() => {
    if (!playerRef.current) return;

    const playerPos = playerRef.current.translation();

    // Smooth zoom radius
    radiusRef.current += (targetRadius - radiusRef.current) * 0.1;

    // Desired camera offset
    const offset = new Vector3(
      Math.sin(rotation.y) * radiusRef.current,
      2 + rotation.x * 2, // vertical camera offset
      Math.cos(rotation.y) * radiusRef.current
    );

    const desiredPos = new Vector3().copy(playerPos).add(offset);

    // Clamp camera inside house bounding box
    if (houseRef?.current) {
      const box = houseBox.current;
      const wallBuffer = 1; // velikost odstupu od zdí
      desiredPos.x = Math.max(box.min.x + wallBuffer, Math.min(box.max.x - wallBuffer, desiredPos.x));
      desiredPos.y = Math.max(box.min.y + wallBuffer, Math.min(box.max.y - wallBuffer, desiredPos.y));
      desiredPos.z = Math.max(box.min.z + wallBuffer, Math.min(box.max.z - wallBuffer, desiredPos.z));
    }

    // Smooth camera movement
    camera.position.lerp(desiredPos, 0.15);
    camera.lookAt(playerPos.x, playerPos.y + 1.5, playerPos.z);
  });

  return null;
}
