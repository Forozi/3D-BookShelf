/* BookSpine.jsx */
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, invalidate } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import './GlintMaterial';
import '../styles/BookSpine.css';

// --- GLOBAL TIMING CONFIGURATION (Seconds) ---
const GLINT_DURATION = 3.0; 
const GLINT_COOLDOWN = 5.0; 
const TOTAL_LOOP = GLINT_DURATION + GLINT_COOLDOWN; 

export default function BookSpine({ data, onClick, onHoverChange, isAnyBookSelected }) {
  const { nodes } = useGLTF('/book.glb');
  const glintRef = useRef();
  const hoverTimeout = useRef(null); 
  const [hovered, setHover] = useState(false);

  // 1. Reset Hover logic
  useEffect(() => {
    if (isAnyBookSelected) {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHover(false);
      onHoverChange(false);
      invalidate();
    }
  }, [isAnyBookSelected, onHoverChange]);

  // 2. Glint Configuration
  const glintConfig = useMemo(() => {
    if (!data.is_completed) return { color: "#000000", show: false, rainbow: false };
    
    const r = data.rating;
    if (r === 0) return { color: "#000000", show: false, rainbow: false };
    if (r === 1) return { color: "#ffffff", show: true, rainbow: false }; 
    if (r === 2) return { color: "#ffea00", show: true, rainbow: false }; 
    if (r === 3) return { color: "#00f2ff", show: true, rainbow: false }; 
    if (r === 4) return { color: "#e600ff", show: true, rainbow: false }; 
    if (r === 5) return { color: "red", show: true, rainbow: true };  
    
    return { color: "#000000", show: false, rainbow: false };
  }, [data.rating, data.is_completed]);

  // 3. THE WAKE-UP SCHEDULER
  useEffect(() => {
    if (!glintConfig.show) return;

    let timerId;
    const scheduleWakeup = () => {
      const now = Date.now() / 1000;
      const positionInLoop = now % TOTAL_LOOP;
      const timeUntilNextStart = TOTAL_LOOP - positionInLoop;
      
      if (positionInLoop < GLINT_DURATION) {
        invalidate();
      }

      timerId = setTimeout(() => {
        invalidate(); 
        scheduleWakeup(); 
      }, timeUntilNextStart * 1000 + 20);
    };

    scheduleWakeup();
    return () => clearTimeout(timerId);
  }, [glintConfig.show]);

  // 4. RENDER LOOP
  useFrame(() => {
    if (!glintConfig.show || !glintRef.current) return;

    const now = Date.now() / 1000;
    const positionInLoop = now % TOTAL_LOOP;

    if (positionInLoop < GLINT_DURATION) {
        const progress = positionInLoop / GLINT_DURATION;
        glintRef.current.uTime = progress;
        invalidate(); 
    } else {
        if (glintRef.current.uTime !== -1.0) {
            glintRef.current.uTime = -1.0;
            invalidate(); 
        }
    }
  });

  // 5. Cursor Logic
  useEffect(() => {
    if (isAnyBookSelected) return;
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered, isAnyBookSelected]);

  // Handlers
  const handlePointerOver = (e) => {
    e.stopPropagation();
    if (isAnyBookSelected) return;
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHover(true);
    onHoverChange(true);
    invalidate();
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    hoverTimeout.current = setTimeout(() => {
        setHover(false);
        onHoverChange(false);
        invalidate();
    }, 100); 
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isAnyBookSelected) onClick(e);
  };

  return (
    <group position={[-0.1, 0, 0]}>
      {/* Tooltip */}
      {hovered && !isAnyBookSelected && (
        <Html 
            transform 
            position={[-1, 0.5, 0]} 
            rotation={[0, -Math.PI/2, 0]} 
            distanceFactor={6} 
            style={{ pointerEvents: 'none' }} 
        >
          <div className="tooltip-container">
            <span className="tooltip-title">{data.title}</span>
            <span className="tooltip-author">{data.author}</span>
          </div>
        </Html>
      )}
      <mesh 
        geometry={nodes.Spine.geometry}
        position={[0, 0, 0]} 
        rotation={[Math.PI / 2, Math.PI / 2, 0]} 
        scale={[2.03, 2.03, 2.03]}
        onClick={handleClick}
        onPointerOver={handlePointerOver} 
        onPointerOut={handlePointerOut}   
      >
        <glintMaterial 
          ref={glintRef} 
          transparent 
          uColor={new THREE.Color(glintConfig.color)} 
          uIsRainbow={glintConfig.rainbow} 
          uOpacity={glintConfig.show ? 0.6 : 0.0}
          depthWrite={false} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>
    </group>
  );
}