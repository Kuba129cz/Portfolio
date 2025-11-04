import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text3D } from "@react-three/drei";

export default function QuestionMark({ position = [0, 0, 0], visible = true }) {
  const ref = useRef();
  const baseY = position[1];

 // console.log(position)
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta;
      ref.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 2) * 0.1; 
    }
  });

  if (!visible) return null;

  return (
    <group position={position} ref={ref}>
      <Text3D
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.4}
        height={0.05}
      >
        ?
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffaa00"
          emissiveIntensity={0.5}
        />
      </Text3D>
    </group>
  );
}
