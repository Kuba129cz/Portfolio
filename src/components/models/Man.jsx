import { forwardRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

const Man = forwardRef(({ currentAction = "Idle", ...props }, ref) => {
  const { scene, animations } = useGLTF("/models/BusinessMan.glb");
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    Object.values(actions).forEach((action) => action.stop());
    if (actions[currentAction]) actions[currentAction].play();
  }, [actions, currentAction]);

  return (
      <RigidBody ref={ref} colliders="cuboid" mass={1} {...props}>
        <primitive object={scene} />
      </RigidBody>

  );
});

export default Man;
