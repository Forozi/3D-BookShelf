// --- START OF FILE ShelfNavigation.jsx ---

import React, { useState } from 'react';
import { Text } from '@react-three/drei';
import { useCursor } from '@react-three/drei';

function NavArrow({ direction, onClick, disabled, position }) {
  const [hovered, setHover] = useState(false);
  useCursor(hovered && !disabled);

  if (disabled) return null;

  return (
    <group position={position}>
        <Text
        font="/fonts/PlayfairDisplay-Regular.ttf"
        fontSize={2}
        anchorX="center"
        anchorY="middle"
        color={hovered ? "yellow" : "white"}
        outlineWidth={0.05}
        outlineColor="#000"
        onClick={(e) => {
            e.stopPropagation();
            onClick();
        }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        >
        {direction === 'left' ? "‹" : "›"}
        </Text>

    </group>
  );
}

export default function ShelfNavigation({ page, totalPages, setPage, isAnyBookSelected }) {
  const LEFT_POS = [-6.2, 0.6, -8.5]; 
  const RIGHT_POS = [6.2, 0.6, -8.5];

  return (
    <group>
      <NavArrow 
        direction="left" 
        position={LEFT_POS} 
        // Disabled if on first page OR if any book is currently selected/active
        disabled={page === 0 || isAnyBookSelected} 
        onClick={() => setPage(p => Math.max(0, p - 1))} 
      />

      <NavArrow 
        direction="right" 
        position={RIGHT_POS} 
        // Disabled if on last page OR if any book is currently selected/active
        disabled={page >= totalPages - 1 || isAnyBookSelected} 
        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} 
      />
      
      <Text
        font="/fonts/PlayfairDisplay-Regular.ttf"
        position={[0, 0.4, -8]}
        fontSize={0.6}
        color="yellow"
        anchorX="center"
        anchorY="middle"
        visible={!isAnyBookSelected} 
        >
        {`${page + 1} / ${totalPages}`}
    </Text>
    </group>
  );
}