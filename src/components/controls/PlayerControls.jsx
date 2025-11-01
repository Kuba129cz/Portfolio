import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "../../hooks/KeyboardContext.jsx";
import { useMouseControls } from "../../hooks/MouseContext.jsx";
import { useRef } from "react";
import { Euler, Vector3, Quaternion, MathUtils } from "three";

export default function PlayerControls({ playerRef, setCurrentAction }) {
  const { forward, backward, left, right, run, jump } = useKeyboardControls();
  const rotation = useMouseControls();

  const speed = 4;
  const runMultiplier = 1.8;
  const jumpForce = 4.5;

  const direction = new Vector3();
  const forwardVector = new Vector3();
  const rightVector = new Vector3();

  const jumping = useRef(false);
  const currentActionRef = useRef("CharacterArmature|Idle_Neutral");

  // keep the current rotation for smooth slerp
  const currentQuatRef = useRef(new Quaternion());

  useFrame(() => {
    const body = playerRef.current;
    if (!body || typeof body.linvel !== "function") return;

    const linvel = body.linvel();

    // directions vectors
    forwardVector.set(Math.sin(rotation.y), 0, -Math.cos(rotation.y)).normalize();
    rightVector.crossVectors(forwardVector, new Vector3(0, 1, 0)).normalize();

    // inputs
    direction.set(0, 0, 0);
    if (forward) direction.add(forwardVector);
    if (backward) direction.sub(forwardVector);
    if (left) direction.sub(rightVector);
    if (right) direction.add(rightVector);

    const isMoving = direction.lengthSq() > 0;
    if (isMoving) direction.normalize();

    // Speed definition
    const targetSpeed = speed * (run ? runMultiplier : 1);
    const targetVel = direction.clone().multiplyScalar(targetSpeed);

    const newVel = new Vector3(
      MathUtils.lerp(linvel.x, targetVel.x, 0.2),
      linvel.y,
      MathUtils.lerp(linvel.z, targetVel.z, 0.2)
    );
    body.setLinvel(newVel);

    // Jump
    const onGround = Math.abs(linvel.y) < 0.05;
    if (jump && onGround && !jumping.current) {
      body.applyImpulse({ x: 0, y: jumpForce, z: 0 }, true);
      jumping.current = true;
    }
    if (onGround && jumping.current) jumping.current = false;

    // Animations selection
    let nextAction;
    if (jumping.current) {
      nextAction = "CharacterArmature|Idle";
    } else if (isMoving) {
      nextAction = run ? "CharacterArmature|Run" : "CharacterArmature|Walk";
    } else {
      nextAction = "CharacterArmature|Idle_Neutral";
    }

    if (nextAction !== currentActionRef.current) {
      currentActionRef.current = nextAction;
      setCurrentAction && setCurrentAction(nextAction);
    }

    if (isMoving) {
      const moveDir = direction.clone().normalize();
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      const targetQuat = new Quaternion().setFromEuler(new Euler(0, targetAngle, 0));

      // smooth rotation interpolation
      currentQuatRef.current.slerp(targetQuat, 0.2);
      body.setRotation(currentQuatRef.current);
    }

    const pos = body.translation();
    // console.log("Current altitude (y):", pos.y);
  });

  return null;
}
