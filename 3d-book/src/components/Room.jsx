import { useGLTF } from '@react-three/drei';
import React, { memo } from 'react';

const Room = memo(function Room() {
  
  const { scene } = useGLTF('/room.glb');
  return (
    <primitive 
      object={scene} 
      position={[0, -6, -9]}
      rotation={[0, Math.PI, 0]} 
      scale={[2, 2, 2]} 
      receiveShadow ={false}
    />
  );
});
export default Room;