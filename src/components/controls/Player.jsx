// logika pohybu Man (WASD + kolize)
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import useKeyboardControls from "../../hooks/useKeyboardControls";

export default function PlayerControls({ children }) {
  const ref = useRef();
  const keys = useKeyboardControls();
  const { camera } = useThree();

  useFrame(() => {
    if (!ref.current) return;

    const speed = 0.05;

    if (keys.w) ref.current.position.z -= speed;
    if (keys.s) ref.current.position.z += speed;
    if (keys.a) ref.current.position.x -= speed;
    if (keys.d) ref.current.position.x += speed;

    // Kamera sleduje postavu zezadu
    camera.position.lerp(
      [
        ref.current.position.x + 3,
        ref.current.position.y + 2,
        ref.current.position.z + 5,
      ],
      0.1
    );
    camera.lookAt(ref.current.position);
  });

  return <group ref={ref}>{children}</group>;
}
