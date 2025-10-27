import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import House from "./models/House";
import Man from "./models/Man";
import PlayerControls from "./controls/Player";

export default function Scene() {
  return (
    <Canvas shadows camera={{ position: [3, 2, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />

      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="lightgray" />
      </mesh>

      <Suspense fallback={null}>
        <House />
        {/* 
        <PlayerControls>
          <Man scale={1} />
        </PlayerControls>
        */}
      </Suspense>
      {/* OrbitControls můžeš později vypnout */}
      <OrbitControls />
    </Canvas>
  );
}
