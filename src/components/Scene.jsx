import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import Man from "./models/Man";
import PlayerControls from "./controls/PlayerControls.jsx";
import { KeyboardProvider } from "../hooks/KeyboardContext.jsx";
import { Physics, RigidBody } from "@react-three/rapier";

export default function Scene() {
  const playerRef = useRef();

  return (
    <Canvas shadows camera={{ position: [3, 2, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />

      <Physics>
        {/* Podlaha */}
        <RigidBody type="fixed">
          <mesh rotation-x={-Math.PI / 2} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="lightgray" />
          </mesh>
        </RigidBody>

        <KeyboardProvider>
          <Suspense fallback={null}>
            {/* Hráč */}
            <RigidBody
              ref={playerRef}
              colliders="cuboid"
              mass={1}
              position={[0, 1, 0]} // startuje nad zemí
            >
              <Man scale={[0.35, 0.35, 0.35]} />
            </RigidBody>

            {/* Ovládání */}
            <PlayerControls playerRef={playerRef} />
          </Suspense>
        </KeyboardProvider>
      </Physics>

      {/* Kamera */}
      <OrbitControls />
    </Canvas>
  );
}
