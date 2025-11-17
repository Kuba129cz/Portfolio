import { useState, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { usePopup } from "../../context/PopupContext.jsx";
import { useMouseControls } from "../../hooks/MouseContext.jsx";
import { Vector3, Box3 } from "three";

export default function CameraController({ playerRef, houseRef }) {
  const { camera } = useThree();
  const rotation = useMouseControls();
  const { isOpen, focusTarget, setReadyToOpenPopup } = usePopup();

  // Zoom radius
  const radiusRef = useRef(5);
  const [targetRadius, setTargetRadius] = useState(5);

  // House boundaries
  const houseBox = useRef(new Box3());

  useEffect(() => {
    if (houseRef?.current) {
      houseBox.current.setFromObject(houseRef.current);
    }
  }, [houseRef]);

  // Smooth zoom on scroll
  useEffect(() => {
    const handleWheel = (e) => {
      if (isOpen) return; 

      e.preventDefault();
      const delta = e.deltaY * 0.01;

      setTargetRadius((prev) =>
        Math.min(10, Math.max(2, prev + delta))
      );
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isOpen]);

  useFrame(() => {
    // Focus mode (laptop)
    if (focusTarget) {
      camera.position.lerp(focusTarget.position, 0.1);
      camera.lookAt(focusTarget.lookAt);

      if (camera.position.distanceTo(focusTarget.position) < 0.05) {
        setReadyToOpenPopup(true);
      }

      return;
    }

    if (!playerRef.current || isOpen) return;

    const playerPos = playerRef.current.translation();

    // Smooth zoom
    radiusRef.current += (targetRadius - radiusRef.current) * 0.12;

    // Camera offset
    const offset = new Vector3(
      Math.sin(rotation.y) * radiusRef.current,
      1.6 + rotation.x * 1.5,
      Math.cos(rotation.y) * radiusRef.current
    );

    const desiredPos = new Vector3().copy(playerPos).add(offset);

    // Clamp inside house
    if (houseRef?.current) {
      const box = houseBox.current;
      const buffer = 0.7;

      desiredPos.x = Math.min(box.max.x - buffer, Math.max(box.min.x + buffer, desiredPos.x));
      desiredPos.y = Math.min(box.max.y - buffer, Math.max(box.min.y + buffer, desiredPos.y));
      desiredPos.z = Math.min(box.max.z - buffer, Math.max(box.min.z + buffer, desiredPos.z));
    }

    // Smooth movement
    camera.position.lerp(desiredPos, 0.15);

    // Look slightly above player's head
    camera.lookAt(playerPos.x, playerPos.y + 1.5, playerPos.z);
  });

  return null;
}
