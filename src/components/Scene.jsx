import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { Physics, RigidBody, CapsuleCollider, CuboidCollider } from "@react-three/rapier";
import { KeyboardProvider } from "../hooks/KeyboardContext.jsx";
import { MouseProvider } from "../hooks/MouseContext.jsx";
import PlayerControls from "./controls/PlayerControls.jsx";
import CameraController from "./controls/CameraController.jsx";
import Man from "./models/Man";
import House from "./models/House.jsx"
import { usePointerLock } from "../hooks/usePointer.jsx";

export default function Scene() {
  const playerRef = useRef();
  const [currentAction, setCurrentAction] = useState("Idle_Neutral");

  const houseRef = useRef(); 

  const canvasRef = useRef();
  const { mouseLocked, lock, unlock } = usePointerLock(canvasRef);

  return (
    <Canvas ref={canvasRef} shadows camera={{ position: [3, 2, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />

      <Suspense fallback={null}>
        <Physics>
          {/* Floor */}
          <RigidBody type="fixed" colliders="cuboid">
            <mesh rotation-x={-Math.PI / 2} receiveShadow position={ [0, 0, 0] }>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="lightgray" />
            </mesh>
          </RigidBody>

          {/* Player */}
          <RigidBody
            ref={playerRef}
            colliders={false}
            mass={1}
            position={[0, 1, 0]} 
            restitution={0}
            friction={1}
            lockRotations
            linearDamping={1.5}
            angularDamping={2.5}
          >
            <CapsuleCollider args={[0.5, 0.3]} position={[0, 0.8, 0]} />
            <Man currentAction={currentAction} position={[0, 0, 0]} />
          </RigidBody>

           <RigidBody type="fixed" colliders="trimesh">
            <House ref={houseRef} position={[-3, 0.01, 3]} />
          </RigidBody> 

          {/* Camera collision */}

        {/* Pohyb a ovládání */}
          <KeyboardProvider>
            <MouseProvider>
              <PlayerControls playerRef={playerRef} setCurrentAction={setCurrentAction} />
              <CameraController playerRef={playerRef} houseRef={houseRef} />
            </MouseProvider>
          </KeyboardProvider>
        </Physics>
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}
