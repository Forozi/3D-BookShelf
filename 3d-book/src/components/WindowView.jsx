import React from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function WindowView({ position = [0, 2, -10], rotation = [0, 0, 0], scale = [20, 12, 1] }) {
  const texture = useTexture('/street.jpg');

  // eslint-disable-next-line react-hooks/immutability
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <planeGeometry />
      <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}