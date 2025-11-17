import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "../../hooks/KeyboardContext.jsx";
import { useRef, useEffect } from "react";
import { Vector3, Quaternion, Euler, MathUtils } from "three";
import { useMouseControls } from "../../hooks/MouseContext.jsx";
import { usePopup } from "../../context/PopupContext.jsx";

export default function PlayerControls({ playerRef, setCurrentAction }) {
  const { keys } = useKeyboardControls();
  const { forward, backward, left, right, run, jump } = keys;
  const rotation = useMouseControls();
  const { isOpen } = usePopup();

  // movement constants
  const speed = 4;
  const runMultiplier = 1.5;
  const jumpForce = 2;

  // reusable vectors
  const forwardVector = new Vector3();
  const rightVector = new Vector3();
  const direction = new Vector3();

  // jump & anim state
  const jumping = useRef(false);
  const currentActionRef = useRef("CharacterArmature|Idle_Neutral");

  // smooth rotation
  const smoothRotation = useRef(new Quaternion());

  // footstep sound
  const footstepAudio = useRef(null);
  const normalSpeed = speed * 0.5;

  // audio init
  useEffect(() => {
    footstepAudio.current = new Audio("/sounds/step.mp3");
    footstepAudio.current.loop = true;
  }, []);

  // stop footstep when popup open
  useEffect(() => {
    if (isOpen && footstepAudio.current && !footstepAudio.current.paused) {
      footstepAudio.current.pause();
      footstepAudio.current.currentTime = 0;
    }
  }, [isOpen]);

  useFrame(() => {
    if (isOpen) return;

    const body = playerRef.current;
    if (!body || typeof body.linvel !== "function") return;

    const linvel = body.linvel();

    // ---- camera relative movement ----
    const camRot = rotation.y;

    forwardVector
      .set(-Math.sin(camRot), 0, -Math.cos(camRot))
      .normalize();

    rightVector
      .set(Math.sin(camRot + Math.PI / 2), 0, Math.cos(camRot + Math.PI / 2))
      .normalize();

    direction.set(0, 0, 0);
    if (forward) direction.add(forwardVector);
    if (backward) direction.sub(forwardVector);
    if (left) direction.sub(rightVector);
    if (right) direction.add(rightVector);

    const isMoving = direction.lengthSq() > 0;
    if (isMoving) direction.normalize();

    // ---- footstep audio ----
    if (footstepAudio.current) {
      if (isMoving) {
        if (footstepAudio.current.paused) {
          footstepAudio.current.currentTime = 0;
          footstepAudio.current.play();
        }

        let currentSpeed = Math.sqrt(linvel.x * linvel.x + linvel.z * linvel.z);
        if (run) currentSpeed *= runMultiplier;

        footstepAudio.current.playbackRate = Math.max(
          0.1,
          currentSpeed / normalSpeed
        );
      } else {
        if (!footstepAudio.current.paused) {
          footstepAudio.current.pause();
          footstepAudio.current.currentTime = 0;
        }
      }
    }

    // ---- movement velocity ----
    const targetSpeed = speed * (run ? runMultiplier : 1);
    const targetVel = direction.clone().multiplyScalar(targetSpeed);

    const newVel = new Vector3(
      MathUtils.lerp(linvel.x, targetVel.x, 0.15),
      linvel.y,
      MathUtils.lerp(linvel.z, targetVel.z, 0.15)
    );

    body.setLinvel(newVel);

    // ---- jump ----
    const onGround = Math.abs(linvel.y) < 0.02;

    if (jump && onGround && !jumping.current) {
      body.applyImpulse({ x: 0, y: jumpForce, z: 0 }, true);
      jumping.current = true;
    }

    if (onGround && jumping.current) jumping.current = false;

    // ---- animations ----
    let nextAction;
    if (jumping.current) nextAction = "CharacterArmature|Jump";
    else if (isMoving) nextAction = run ? "CharacterArmature|Run" : "CharacterArmature|Walk";
    else nextAction = "CharacterArmature|Idle_Neutral";

    if (nextAction !== currentActionRef.current) {
      currentActionRef.current = nextAction;
      setCurrentAction && setCurrentAction(nextAction);
    }

    // ---- rotation ----
    if (isMoving) {
      const moveDir = direction.clone().normalize();
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      const targetQuat = new Quaternion().setFromEuler(
        new Euler(0, targetAngle, 0)
      );

      smoothRotation.current.slerp(targetQuat, 0.2);
      body.setRotation(smoothRotation.current);
    }
  });

  return null;
}
