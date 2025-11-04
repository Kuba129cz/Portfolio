import { Html } from '@react-three/drei';

export default function InteractionPrompt({ position, visible = false }) {
  if (!visible || !position) return null;

  return (
    <Html 
      position={position.toArray()}
      center
      distanceFactor={10}
    >
    <div
    style={{
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: '#fff',
        padding: '6px 12px',
        borderRadius: '6px',
        fontWeight: 'bold',
        pointerEvents: 'none',
        fontFamily: 'sans-serif',
        whiteSpace: 'nowrap',
        textAlign: 'center',
        fontSize: '12px',
    }}
    >
    Press [E]
    </div>

    </Html>
  );
}
