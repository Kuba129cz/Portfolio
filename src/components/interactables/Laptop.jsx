import { useEffect, useState } from "react";
import { Box3, Vector3, Euler, Quaternion } from "three";
import { Html } from "@react-three/drei";
import QuestionMark from "../ui/QuestionMark.jsx";
import useIsNear from "../../hooks/useIsNear.jsx";
import InteractionPrompt from "../ui/InteractionPrompt.jsx";
import { usePopup } from "../../context/PopupContext.jsx";
import { useKeyboardControls } from "../../hooks/KeyboardContext.jsx";

export default function Laptop({ target, playerRef }) {
  const [questionMarkPos, setQuestionMarkPos] = useState(null);
  const [interactionCenter, setInteractionCenter] = useState(null);

  const [screenPos, setScreenPos] = useState(() => new Vector3());
  const [screenRot, setScreenRot] = useState(() => new Euler());
  const [screenSize, setScreenSize] = useState(() => new Vector3());

  const { isOpen, openPopup } = usePopup();
  const { interact } = useKeyboardControls();

  useEffect(() => {
    if (!target) return;

    const screenMesh = target.getObjectByName("Laptop_01_Cube025-Mesh_1");
    if (!screenMesh) {
      console.warn("Nenašel jsem mesh: Laptop_01_Cube025-Mesh_1", target);
      return;
    }

    // Pozice
    const worldPos = new Vector3();
    screenMesh.getWorldPosition(worldPos);
    worldPos.x += 0;
    worldPos.y += 0.54;
    worldPos.z += -0.6;
    setScreenPos(worldPos);

    // Rotace
    const worldQuat = new Quaternion();
    screenMesh.getWorldQuaternion(worldQuat);
    const worldRot = new Euler().setFromQuaternion(worldQuat);
    worldRot.x += - 0.19; //uhel natoceni
    worldRot.y += 0;
    worldRot.z += 0;
    setScreenRot(worldRot);

    // Velikost
    const box = new Box3().setFromObject(screenMesh);
    const size = new Vector3();
    box.getSize(size);
    size.x *= 1.05;
    size.y *= 1.05; // vyska obrazovky
    setScreenSize(size);

  }, [target]);

  useEffect(() => {
    if (!target) return;

    const box = new Box3().setFromObject(target);
    const center = new Vector3();
    const size = new Vector3();
    box.getCenter(center);
    box.getSize(size);

    const interactionCenter = center.clone();
    const questionMarkPos = interactionCenter.clone();
    questionMarkPos.y += size.y / 2 + 0.3;

    setQuestionMarkPos(questionMarkPos);
    setInteractionCenter(interactionCenter);
  }, [target]);

  const isNear = useIsNear(playerRef, interactionCenter, 1.5);

  return (
    <>
      {questionMarkPos && <QuestionMark position={questionMarkPos.toArray()} visible={true} />}
      {interactionCenter && <InteractionPrompt position={interactionCenter} visible={isNear} />}

      {/* Mesh displeje */}
      <group position={screenPos} rotation={screenRot}>
        <mesh>
          <planeGeometry args={[screenSize.x, screenSize.y]} />
          <meshBasicMaterial color="red" />
        </mesh>
      </group>
    </>
  );
}
