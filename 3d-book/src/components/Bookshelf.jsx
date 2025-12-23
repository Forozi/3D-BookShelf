import React, { useState, useMemo, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import Book from './Book';
import ShelfNavigation from './ShelfNavigation';
import * as THREE from 'three';

// --- CONFIGURATION ---
const CONFIG = {
  BOOKS_PER_ROW: 15, 
  TOTAL_SLOTS: 30,
  ROW_HEIGHTS: [5.5, 2.3], 
  SPACING: 0.7, 
  SECTION_GAP: 0.75,
  SHELF_DEPTH: -10, 
};

export default function Bookshelf({ 
  books,
  onAddBook, 
  controlsRef, 
  defaultCam, 
  defaultTarget, 
  activeBookId, 
  setActiveBookId, 
  setIsOpened, 
  busyRef,
  isLoggedIn = false,
  position = [0, 0, 0],
  rotation = [0, 0, 0]
}) {
  const { scene } = useGLTF('/bookshelf.glb');

  // --- MATERIAL OPTIMIZATION ---
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        if (child.userData.isOptimized) return;
        
        child.material.side = THREE.DoubleSide; 
        child.material.roughness = 0.7;         
        child.material.envMapIntensity = 1.5;   
        
        child.castShadow = false;
        child.receiveShadow = false;

        child.userData.isOptimized = true;
      }
    });
  }, [scene]);

  // --- PAGINATION ---
  const REAL_BOOKS_PER_PAGE = CONFIG.TOTAL_SLOTS - 1; 
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(Math.max(books.length, 1) / REAL_BOOKS_PER_PAGE);
  const visibleBooks = useMemo(() => {
    const start = page * REAL_BOOKS_PER_PAGE;
    const end = start + REAL_BOOKS_PER_PAGE;
    return books.slice(start, end);
  }, [books, page]);
  const isAnyBookSelected = activeBookId !== null;

  // --- POSITIONING ---
  const getBookPosition = (index) => {
    const row = Math.floor(index / CONFIG.BOOKS_PER_ROW); 
    const col = index % CONFIG.BOOKS_PER_ROW; 
    const section = Math.floor(col / 5);
    const baseOffset = (col - 7) * CONFIG.SPACING;
    const gapOffset = (section - 1) * CONFIG.SECTION_GAP;
    const x = baseOffset + gapOffset;
    const y = CONFIG.ROW_HEIGHTS[row] || 0;
    return [x, y, CONFIG.SHELF_DEPTH];
  };

  return (
    // MASTER GROUP: Moves the whole unit (Books + Shelf) together
    <group position={position} rotation={rotation}>
      
      {/* LIGHTING */}
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={2.0} 
        color="#fff5e6" 
        castShadow={false} 
      />

      {/* 
         THE SHELF MODEL 
         Added rotation={[0, Math.PI, 0]} to flip it 180 degrees.
         This rotates only the mesh, leaving the books in place.
      */}
      <primitive 
        object={scene} 
        position={[0, -6, -10]} 
        rotation={[0, Math.PI, 0]} 
        scale={[2, 2, 2]} 
      />

      {/* NAVIGATION UI */}
      <ShelfNavigation 
        page={page} 
        totalPages={totalPages} 
        setPage={setPage} 
        isAnyBookSelected={isAnyBookSelected}
      />
      
      {/* BOOKS */}
      {visibleBooks.map((book, index) => (
        <Book 
          key={book.id}
          position={getBookPosition(index)} 
          data={book}
          mode="view" 
          controlsRef={controlsRef}
          defaultCam={defaultCam}
          defaultTarget={defaultTarget}
          isActive={activeBookId === book.id}
          isAnyBookSelected={isAnyBookSelected}
          busyRef={busyRef}
          onSelectionChange={(id) => setActiveBookId(id)}
          onOpenChange={(opened) => setIsOpened(opened)}
        />
      ))}
      
      {isLoggedIn && (
        <Book 
          key="placeholder-fixed"
          position={getBookPosition(29)} 
          data={{
              id: "new-entry", title: "Thêm sách mới", author: "",
              genre: "placeholder", coverUrl: null, rating: 0, is_completed: false
          }}
          mode="create" 
          controlsRef={controlsRef}
          defaultCam={defaultCam}
          defaultTarget={defaultTarget}
          isActive={activeBookId === "new-entry"}
          isAnyBookSelected={isAnyBookSelected}
          busyRef={busyRef}
          onSelectionChange={(id) => setActiveBookId(id)}
          onOpenChange={(opened) => setIsOpened(opened)}
          onAddBook={onAddBook}
        />
      )}
    </group>
  );
}

useGLTF.preload('/bookshelf.glb');