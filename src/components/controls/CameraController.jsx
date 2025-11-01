import { useFrame, useThree } from "@react-three/fiber";
import { useMouseControls } from "../../hooks/MouseContext.jsx";
import { Vector3 } from "three";

export default function CameraController({ playerRef }) {
  const { camera } = useThree();
  const rotation = useMouseControls();

  useFrame(() => {
    if (!playerRef.current) return;

    const pos = playerRef.current.translation();
    const radius = 5;
    const offset = new Vector3(
      Math.sin(rotation.y) * radius,
      2 + rotation.x * 2,
      Math.cos(rotation.y) * radius
    );

    const targetPos = new Vector3(pos.x, pos.y + 1, pos.z).add(offset);
    camera.position.lerp(targetPos, 0.1);
    camera.lookAt(pos.x, pos.y + 1, pos.z);
  });

  return null;
}
