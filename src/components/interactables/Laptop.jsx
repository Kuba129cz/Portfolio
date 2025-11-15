import { useEffect, useState } from "react";
import { Box3, Vector3, Euler, Quaternion } from "three";
import QuestionMark from "../ui/QuestionMark.jsx";
import useIsNear from "../../hooks/useIsNear.jsx";
import InteractionPrompt from "../ui/InteractionPrompt.jsx";
import { usePopup } from "../../context/PopupContext.jsx";
import { useKeyboardControls } from "../../hooks/KeyboardContext.jsx";

export default function Laptop({ target, playerRef }) {
  const [questionMarkPos, setQuestionMarkPos] = useState(null);
  const [interactionCenter, setInteractionCenter] = useState(null);

  // -> sem uložíme skutečnou světovou pozici a rotaci displeje
  const [screenPos] = useState(() => new Vector3());
  const [screenRot] = useState(() => new Euler());

  /** 🔥 1) ZÍSKÁNÍ POZICE A ROTACE DISPLEJE */
  useEffect(() => {
    if (!target) return;

    // sem dáš lokální pozici displeje uvnitř mesh laptopu
    // pak si ji doladíš podle potřeby
    const displayLocal = new Vector3(0, 0.15, 0.07);

    // převedeme do světové pozice
    target.localToWorld(screenPos.copy(displayLocal));

    // převedeme i rotaci do světové rotace
    const q = new Quaternion();
    target.getWorldQuaternion(q);
    screenRot.setFromQuaternion(q);

  }, [target]);


  /** 2) VÝPOČET OTÁZNÍKU A INTERAKČNÍHO BODU */
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
      {questionMarkPos && (
        <QuestionMark position={questionMarkPos.toArray()} visible={true} />
      )}

      {interactionCenter && (
        <InteractionPrompt position={interactionCenter} visible={isNear} />
      )}

      {/* 🔥 3) ČERVENÝ PLANE PŘILEPENÝ NA DISPLEJI */}
      <group position={screenPos} rotation={screenRot}>
        <mesh>
          <planeGeometry args={[0.22, 0.14]} />
          <meshBasicMaterial color="red" />
        </mesh>
      </group>
    </>
  );
}
