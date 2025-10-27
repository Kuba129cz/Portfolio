import { useGLTF } from "@react-three/drei";

export default function Man(props) {
  const { scene } = useGLTF("/models/Man.glb");
  return <primitive object={scene} {...props} />;
}
