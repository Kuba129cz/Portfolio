import { useGLTF } from "@react-three/drei"

export default function House(props) {
  const { scene } = useGLTF("/models/House.glb")
  return <primitive object={scene} {...props} />
}