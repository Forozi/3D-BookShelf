import React, { useRef, useState, useEffect } from 'react';
import { invalidate } from '@react-three/fiber';
import gsap from 'gsap';
import BookSpine from './BookSpine';
import BookModel from './BookModel';

export default function Book({ 
  position, 
  controlsRef, 
  onSelectionChange, 
  onOpenChange, 
  defaultCam, 
  defaultTarget, 
  data, 
  isActive, 
  isAnyBookSelected, 
  busyRef,
  mode = 'view',
  onAddBook
}) {
  const [viewState, setViewState] = useState('shelf'); 
  const [showContent, setShowContent] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);

  const groupRef = useRef();         
  const hingeRef = useRef();         
  const manualRotateRef = useRef(); 
  
  const pendingAddData = useRef(null);
  const shelfPosRef = useRef(position);

  useEffect(() => {
    if (viewState !== 'shelf' || isActive) return;

    const shouldPop = hovered && !isAnyBookSelected;
    const targetZ = shouldPop ? position[2] + 0.8 : position[2];
    const targetScale = shouldPop ? 1.1 : 1;

    gsap.to(groupRef.current.position, {
        z: targetZ,
        duration: 0.4,
        ease: "back.out(2)",
        overwrite: true,
        onUpdate: () => invalidate()
    });

    gsap.to(groupRef.current.scale, {
        x: targetScale,
        y: targetScale,
        z: targetScale,
        duration: 0.4,
        ease: "back.out(2)",
        overwrite: true
    });
  }, [hovered, viewState, isActive, position, isAnyBookSelected]);

  const handlePointerDown = (e) => {
    if (viewState !== 'focused' || busyRef.current) return;
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      e.stopPropagation();
      setIsDragging(false);
      e.target.releasePointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging || busyRef.current) return;
    e.stopPropagation();
    if(manualRotateRef.current) {
        manualRotateRef.current.rotation.y += e.movementX * 0.005;
        manualRotateRef.current.rotation.x += e.movementY * 0.005;
        invalidate(); 
    }
  };

  const handleFocus = (e) => {
    if (e) e.stopPropagation();
    if (busyRef.current || isAnyBookSelected || viewState !== 'shelf') return;
    busyRef.current = true;
    onSelectionChange(data.id);
    setHovered(false); 

    shelfPosRef.current = [...groupRef.current.position];
    shelfPosRef.current[2] = position[2]; 

    const tl = gsap.timeline({
      onUpdate: () => invalidate(),
      onComplete: () => { setViewState('focused'); busyRef.current = false; }
    });

    tl.to(controlsRef.current.object.position, { 
        x: defaultCam[0], y: defaultCam[1], z: defaultCam[2], 
        duration: 1.0, ease: "power2.inOut", onUpdate: () => controlsRef.current.update() 
    }, 0);
    tl.to(controlsRef.current.target, { 
        x: defaultTarget[0], y: defaultTarget[1], z: defaultTarget[2], 
        duration: 1.0, ease: "power2.inOut" 
    }, 0);

    tl.to(groupRef.current.position, { z: 1.2, duration: 0.5, ease: "power2.out" }, 0.8);
    tl.to(groupRef.current.position, { x: 0, y: 0, duration: 0.8, ease: "back.out(0.8)" }, 1.1);
    tl.to(groupRef.current.rotation, { y: 0, duration: 0.8, ease: "power2.inOut" }, 1.1);
    tl.to(groupRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.5 }, 0);
  };

  const handleOpen = (e) => {
    if (e) e.stopPropagation();
    if (busyRef.current || viewState !== 'focused') return;
    setIsDragging(false); 
    busyRef.current = true;
    onOpenChange(true);

    const tl = gsap.timeline({
      onUpdate: () => invalidate(),
      onComplete: () => { 
        setShowContent(true); 
        busyRef.current = false; 
      }
    });
    
    const rotationResetDuration = 0.5;
    if (manualRotateRef.current) {
      tl.to(manualRotateRef.current.rotation, { x: 0, y: 0, duration: rotationResetDuration, ease: "power2.out" }, 0);
    }

    tl.call(() => setViewState('opened'), null, rotationResetDuration);
    
    tl.to(controlsRef.current.object.position, { x: -1, y: 0, z: 5, duration: 0.8, ease: "power2.inOut", onUpdate: () => controlsRef.current.update() }, rotationResetDuration);
    tl.to(controlsRef.current.target, { x: -1, y: 0, z: 0, duration: 0.8 }, rotationResetDuration);
    tl.to(hingeRef.current.rotation, { y: -Math.PI, duration: 1, ease: "power2.inOut" }, rotationResetDuration);
    tl.to(groupRef.current.position, { z: 1.5, duration: 0.6 }, rotationResetDuration);
  };

  const handleClose = () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setShowContent(false);
    onOpenChange(false);
    setViewState('focused');
    
    const tl = gsap.timeline({
      onUpdate: () => invalidate(),
      onComplete: () => { 
          setViewState('shelf'); 
          onSelectionChange(null); 
          busyRef.current = false; 

          if (pendingAddData.current && onAddBook) {
              onAddBook(pendingAddData.current);
              pendingAddData.current = null;
          }
      }
    });
    // Animation return shelf
    tl.to(controlsRef.current.object.position, { x: defaultCam[0], y: defaultCam[1], z: defaultCam[2], duration: 0.5, onUpdate: () => controlsRef.current.update() }, 0);
    tl.to(controlsRef.current.target, { x: 0, y: 0, z: 0, duration: 0.5 }, 0);
    tl.to(hingeRef.current.rotation, { y: 0, duration: 0.5 }, 0);
    tl.to(groupRef.current.position, { 
        x: shelfPosRef.current[0], 
        y: shelfPosRef.current[1], 
        duration: 0.6, 
        ease: "power2.inOut" 
    }, 0.2);
    
    tl.to(groupRef.current.rotation, { y: Math.PI / 2, duration: 0.6 }, 0.2);
    tl.to(groupRef.current.position, { 
        z: shelfPosRef.current[2], 
        duration: 0.4, 
        ease: "power2.in" 
    }, 0.7);
    
    if(manualRotateRef.current) tl.to(manualRotateRef.current.rotation, { x: 0, y: 0, duration: 0.5 }, 0);
  };

  const handleAddBookWrapper = (data) => {
      pendingAddData.current = data;
  };

  return (
    <group ref={groupRef} position={position} rotation={[0, Math.PI / 2, 0]}>
      
      <BookModel 
        data={data}
        isActive={isActive}
        viewState={viewState}
        showContent={showContent}
        manualRotateRef={manualRotateRef}
        hingeRef={hingeRef}
        onOpen={handleOpen}
        onClose={handleClose}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        mode={mode}
        onAddBook={handleAddBookWrapper} 
      />

      {viewState === 'shelf' && (
        <BookSpine 
          data={data} 
          onClick={handleFocus}
          onHoverChange={setHovered}
          isAnyBookSelected={isAnyBookSelected} 
        />
      )}

    </group>
  );
}