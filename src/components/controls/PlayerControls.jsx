// src/components/controls/PlayerControls.jsx
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "../../hooks/KeyboardContext.jsx";
import { Vector3 } from "three";
import { useState } from "react";

export default function PlayerControls({ playerRef }) {
  const { forward, backward, left, right, run, jump } = useKeyboardControls();
  const [currentAction, setCurrentAction] = useState("Idle");

  const speed = 4;
  const runMultiplier = 1.8;
  const jumpForce = 4.5;
  const direction = new Vector3();

  useFrame((state, delta) => {
    const body = playerRef.current;
    if (!body || typeof body.applyImpulse !== "function") return;

    // Pohybový vektor
    direction.set(
      (left ? 1 : 0) - (right ? 1 : 0),
      0,
      (forward ? 1 : 0) - (backward ? 1 : 0)
    );

    const moving = direction.length() > 0;
    const moveSpeed = run ? speed * runMultiplier : speed;

    // Animace
    setCurrentAction(moving ? (run ? "Run" : "Walk") : "Idle");

    // Normalizace směru
    direction.normalize();

    // Pohyb hráče
    body.applyImpulse(
      { x: direction.x * moveSpeed * delta, y: 0, z: direction.z * moveSpeed * delta },
      true
    );

    // Skok
    if (jump) {
      const linvel = body.linvel();
      if (Math.abs(linvel.y) < 0.05) {
        body.applyImpulse({ x: 0, y: jumpForce, z: 0 }, true);
        setCurrentAction("Jump");
      }
    }

    // Kamera sleduje hráče
    const pos = body.translation();
    state.camera.position.lerp({ x: pos.x, y: pos.y + 2, z: pos.z + 4 }, 0.1);
    state.camera.lookAt(pos.x, pos.y + 1, pos.z);
  });

  return null; // Nevykresluje nic
}
