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

export default function Scene() {
  const playerRef = useRef();
  const [currentAction, setCurrentAction] = useState("Idle_Neutral");

  return (
    <Canvas shadows camera={{ position: [3, 2, 5], fov: 50 }}>
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
            {/*<CuboidCollider args={[0.35, 0.9, 0.35]} position={[0, 0.9, 0]} /> */}
            <CapsuleCollider args={[0.35, 0.9]} position={[0, 0.9, 0]} />
            <Man sd currentAction={currentAction} position={[0, 0, 0]} />

              {/* wireframe pro debug */}
              <mesh position={[0, 0.9, 0]}>
                <cylinderGeometry args={[0.35, 0.35, 1.8, 16]} />
                <meshBasicMaterial color="red" wireframe />
              </mesh>
          </RigidBody>

          {/* <RigidBody type="fixed" colliders="trimesh"> */}
            <House position={[-3, 0.01, 3]} />
          {/*</RigidBody> */}

        {/* Pohyb a ovládání */}
          <KeyboardProvider>
            <MouseProvider>
              <PlayerControls playerRef={playerRef} setCurrentAction={setCurrentAction} />
              <CameraController playerRef={playerRef} />
            </MouseProvider>
          </KeyboardProvider>
        </Physics>
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}
