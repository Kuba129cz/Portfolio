import { useGLTF } from "@react-three/drei"

export default function House(props) {
  const { scene } = useGLTF("/models/House.glb")
 // console.log( scene )
  return <primitive object={scene} {...props} />
}