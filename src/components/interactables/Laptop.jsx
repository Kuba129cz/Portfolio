import { useEffect, useState } from "react";
import { Box3, Vector3, Euler, Quaternion } from "three";
import { Html, useTexture } from "@react-three/drei";
import QuestionMark from "../ui/QuestionMark.jsx";
import useIsNear from "../../hooks/useIsNear.jsx";
import InteractionPrompt from "../ui/InteractionPrompt.jsx";
import { usePopup } from "../../context/PopupContext.jsx";
import { useKeyboardControls } from "../../hooks/KeyboardContext.jsx";

export default function Laptop({ target, playerRef }) {
  const webURL = "https://jakub-hampejs-web.vercel.app/";
  const screenTexture = useTexture("/textures/cv_web.png");

  const [questionMarkPos, setQuestionMarkPos] = useState(null);
  const [interactionCenter, setInteractionCenter] = useState(null);

  const [screenPos, setScreenPos] = useState(() => new Vector3());
  const [screenRot, setScreenRot] = useState(() => new Euler());
  const [screenSize, setScreenSize] = useState(() => new Vector3());

  const { isOpen, openPopup, setFocusTarget, readyToOpenPopup, setReadyToOpenPopup, closePopup, popupType, setPopupType  } = usePopup();
  const { keys, resetKeys } = useKeyboardControls();
  const { interact, escape } = keys;
  

  useEffect(() => {
    if (!target) return;

    const screenMesh = target.getObjectByName("Laptop_01_Cube025-Mesh_1");
    if (!screenMesh) {
      console.warn("Mesh: Laptop_01_Cube025-Mesh_1 has not been found.", target);
      return;
    }

    const worldPos = new Vector3();
    screenMesh.getWorldPosition(worldPos);
    worldPos.x += 0;
    worldPos.y += 0.54;
    worldPos.z += -0.6;
    setScreenPos(worldPos);

    const worldQuat = new Quaternion();
    screenMesh.getWorldQuaternion(worldQuat);
    const worldRot = new Euler().setFromQuaternion(worldQuat);
    worldRot.x += -0.19;
    setScreenRot(worldRot);

    const box = new Box3().setFromObject(screenMesh);
    const size = new Vector3();
    box.getSize(size);
    size.x *= 1.05;
    size.y *= 1.05;
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

  const isNear = useIsNear(playerRef, interactionCenter, 2.15);

    useEffect(() => {
    if (!isNear) return;

    if (interact && !isOpen)
    {        // foccus mode
        const screenForward = new Vector3(0, 0, 1).applyEuler(screenRot).normalize();
        setFocusTarget({
        position: screenPos.clone().add(screenForward.clone().multiplyScalar(1.2)),
        lookAt: screenPos.clone()
        });
        setReadyToOpenPopup(false); // wait before camera finish its animation
    }
    }, [isNear, interact, isOpen]);

    useEffect(() => { // for open popup
    if (readyToOpenPopup && !isOpen) {
        openPopup("webview", {
        url: webURL,
        position: screenPos.toArray(),
        rotation: [screenRot.x, screenRot.y, screenRot.z],
        size: [screenSize.x, screenSize.y]
        });
        setReadyToOpenPopup(false);
        setPopupType("webview")
    }
    }, [readyToOpenPopup]);

    useEffect(() => { // for close popup
      /*
        console.log(`readyToOpenPopup: ${readyToOpenPopup}`)
        console.log(`isOpen: ${isOpen}`)
        console.log(`escape: ${escape}`)
        console.log(`interact: ${interact}`)
        */
    if (isOpen && (escape || interact)) {
        console.log("Probehlo")
        closePopup()
        resetKeys()
    }
    }, [isOpen, escape, interact]);

  return (
    <>
      {questionMarkPos && <QuestionMark position={questionMarkPos.toArray()} visible={true} />}
      {interactionCenter && !isOpen && <InteractionPrompt position={interactionCenter} visible={isNear} />}

        {/* Maybe rewrite to BasicMesh */}
        <group position={screenPos} rotation={screenRot}>
        <rectAreaLight
            intensity={0.5}
            width={screenSize.x}
            height={screenSize.y}
            position={[0, 0, 0.1]}
        />
        <mesh>
            <planeGeometry args={[screenSize.x, screenSize.y]} />
            <meshStandardMaterial
            map={screenTexture}
            emissive={"#00b4d8"}
            emissiveIntensity={0.001}
            toneMapped={false}
            />
        </mesh>         

        {/* HTML iframe */}
        {isOpen && popupType === "webview" &&(
        <Html
            transform
            occlude
            distanceFactor={0.4256}
            position={[- 0.0 , 0, 0.001]} 
            rotation-x={ - 0 }
            style={{
            width: "1280px",
            height: "840px",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 0 20px rgba(0,0,0,0.5)",
            border: "2px solid rgba(0,0,0,1)"
            }}
        >
            <iframe
            src={webURL}
            style={{
                width: "100%",
                height: "100%",
                border: "none"
            }}
            />
        </Html>
        )}
      </group>
    </>
  );
}
