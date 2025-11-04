import { useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

export default function useIsNear(playerRef, target, threshold = 2) {
  const [isNear, setIsNear] = useState(false);

useFrame(() => {
  if (!playerRef.current || !target) return;

  const playerRaw = playerRef.current.translation(); // <- funkce
  const playerPos = new Vector3(playerRaw.x, playerRaw.y, playerRaw.z);

  const targetRaw = target.position || target;
  const targetPos = new Vector3(targetRaw.x, targetRaw.y, targetRaw.z);

  const distance = playerPos.distanceTo(targetPos);
 // console.log(playerPos, targetPos, distance);

  setIsNear(distance < threshold);
});


  return isNear;
}
