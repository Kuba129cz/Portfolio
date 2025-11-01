import { forwardRef, useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const Man = forwardRef(({ currentAction = "CharacterArmature|Idle_Neutral", ...props }, ref) => {
  const { scene, animations } = useGLTF("/models/BusinessMan.glb");
  const { actions } = useAnimations(animations, scene);

  const activeAction = useRef(null);

  useEffect(() => {
    if (!actions) return;

    const action = actions[currentAction];
    if (action && activeAction.current !== action) {
      // Fade out previous action
      if (activeAction.current) {
        activeAction.current.fadeOut(0.2);
      }

      // Setting up a new event
      activeAction.current = action;
      activeAction.current.reset().fadeIn(0.2).play();
    }
  }, [currentAction, actions]);

  useFrame(() => {
    if (activeAction.current) {
      activeAction.current.getMixer().update(0); // smooth switching even with framerate drops
    }
  });

  return <primitive ref={ref} object={scene} {...props} />;
});

export default Man;
