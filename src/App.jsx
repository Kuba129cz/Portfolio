import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Scene() {
  return (
    <>
      {/* Ambientní a směrové světlo */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />

      {/* Jednoduchá zem */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="lightgray" />
      </mesh>

      {/* Testovací krychle */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      {/* Kamera a ovládání */}
      <OrbitControls />
    </>
  );
}

export default function App() {
  return (
    <Canvas shadows camera={{ position: [3, 2, 5], fov: 50 }}>
      <Scene />
    </Canvas>
  );
}
