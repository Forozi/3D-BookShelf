/* BookModel.jsx */
import React, { useMemo, useState } from 'react';
import { Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import ArchivePage from './ArchivePage';
import JournalPage from './JournalPage';
import CreationFormPage from './CreationFormPage'; 
import ImageUploadPage from './ImageUploadPage';
import { materialTrigger } from './SharedMaterials';
import { useSafeTexture } from '../utils/useSafeTexture';
import '../styles/BookModel.css'; 

const triggerGeo = new THREE.BoxGeometry(2.1, 3.1, 0.1);
const capturePlaneGeo = new THREE.PlaneGeometry(100, 100);
const decalGeo = new THREE.PlaneGeometry(2, 3); 

// --- GLOBAL MATERIAL CACHE ---
const MAT_CACHE = {
    pages: null,     
    metal: null,     
    spines: new Map() 
};

// --- HELPER ---
const getGenreColor = (genre) => {
  if (genre === "placeholder") return "white";

  const g = genre?.toLowerCase() || "";

  if (g.includes("thơ sử thi")) return "#3f51b5"; 
  if (g.includes("thơ")) return "#7b4bc4";     

  if (g.includes("hiện thực")) return "#8d6e63";
  if (g.includes("trào phúng")) return "#c62828";
  if (g.includes("kinh dị")) return "#212121";
  if (g.includes("phiêu lưu")) return "#43d854";
  if (g.includes("tuổi thơ")) return "#f06292";
  if (g.includes("truyện ngắn")) return "#607d8b";
  if (g.includes("tùy bút")) return "#ff9800";

  return "#ffffff";
};


export default function BookModel({ 
  data, isActive, viewState, manualRotateRef, hingeRef, 
  onOpen, onClose, onPointerDown, onPointerUp, onPointerMove, showContent,
  mode = 'view', onAddBook 
}) {
  const [formData, setFormData] = useState({
      title: "", author: "", genre: "Hiện thực", publishDate: "", notes: "", coverUrl: null
  });
  // Hide details when on shelf
  const isHighDetail = isActive || viewState !== 'shelf';

  // Only load the texture in inspect mode
  const targetCoverUrl = (mode === 'create' && formData.coverUrl) 
      ? formData.coverUrl 
      : (data.coverUrl || '/loadingcover.jpg');

  const coverTexture = useSafeTexture(isHighDetail ? targetCoverUrl : null);
  
  const { nodes, materials } = useGLTF('/book.glb');
  
  const handleFormChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateConfirm = () => {
      if (!formData.title) return alert("Please enter a title");
      const newBookEntry = {
          ...formData,
          id: `B-${Date.now()}`,
          coverUrl: formData.coverUrl || "", 
          rating: 0, 
          is_completed: false
      };
      if(onAddBook) onAddBook(newBookEntry);
      onClose(); 
  };

  // --- MATERIAL OPTIMIZATION ---
  const genreColor = useMemo(() => getGenreColor(data.genre), [data.genre]);

  const baseAtlasTexture = useMemo(() => {
     const mat = materials['default'] || materials.SpineMaterial || Object.values(materials)[0];
     return mat.map; 
  }, [materials]);

  if (!MAT_CACHE.pages && baseAtlasTexture) {
      // eslint-disable-next-line react-hooks/immutability
      MAT_CACHE.pages = new THREE.MeshStandardMaterial({
        color: "#ffffff",
        map: baseAtlasTexture,
        roughness: 1,
        roughnessMap: baseAtlasTexture,
      });
      // eslint-disable-next-line react-hooks/immutability
      MAT_CACHE.metal = new THREE.MeshStandardMaterial({
        color: "#ffffff",
        map: baseAtlasTexture,
        roughness: 0.2,
        roughnessMap: baseAtlasTexture,
      });
  }

  const colorOverlayMaterial = useMemo(() => {
    const cacheKey = `${data.genre}-${data.is_completed}`;
    if (MAT_CACHE.spines.has(cacheKey)) return MAT_CACHE.spines.get(cacheKey);

    const original = materials.SpineMaterial || nodes.Spine.material;
    const baseColor = new THREE.Color(genreColor);
    if (!data.is_completed && data.genre !== "placeholder") baseColor.multiplyScalar(0.7); 
    
    const newMat = new THREE.MeshStandardMaterial({
      color: baseColor,
      map: original.map,
      normalMap: original.normalMap,
      roughnessMap: original.roughnessMap, 
      roughness: 1,
    });

    MAT_CACHE.spines.set(cacheKey, newMat);
    return newMat;
  }, [materials, nodes, genreColor, data.is_completed, data.genre]);


  return (
    <group>
      {isActive && (
        <mesh 
          geometry={capturePlaneGeo} 
          onPointerDown={onPointerDown} 
          onPointerUp={onPointerUp} 
          onPointerMove={onPointerMove} 
          visible={false} 
        />
      )}

      <group ref={manualRotateRef}>
        {viewState === 'focused' && (
          <mesh 
            onClick={onOpen} 
            position={[0, 0, 0.22]} 
            geometry={triggerGeo} 
            material={materialTrigger}
          />
        )}

        {/* --- A. SPINE --- */}
        <mesh 
          position={[0, 0, 0]} 
          geometry={nodes.Spine.geometry} 
          material={colorOverlayMaterial} 
          rotation={[Math.PI / 2, Math.PI / 2, 0]} 
          scale={[2,2,2]} 
          visible={viewState !== 'opened'}
        />

        {/* --- B. BACK COVER --- */}
        <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
            {/* The Leather Back Cover */}
            <mesh geometry={nodes.BackCover.geometry} material={colorOverlayMaterial} rotation={[Math.PI / 2, Math.PI / 2, 0]} scale={[2,2,2]} />
            
            {/* OPTIMIZATION: Hide Marble Frame*/}
            {isHighDetail && (
              <mesh geometry={nodes.MarbleFrame.geometry} material={MAT_CACHE.metal || materials.SpineMaterial} position={[0, 0, -0.52]} rotation={[Math.PI / 2, Math.PI / 2, 0]} scale={[2,2,2]} />
            )}
            
            <group position={[0, 0, 0]}> 
              <mesh geometry={nodes.PagesBottom.geometry} material={MAT_CACHE.pages || materials.SpineMaterial} rotation={[Math.PI / 2, Math.PI / 2, 0]} scale={[2,2,2]} />
              
              {showContent && isActive && (
                <Html distanceFactor={1.4} position={[-0.4,0.6, 0.2]} onPointerDown={(e) => e.stopPropagation()}>
                  {mode === 'create' ? (
                     <ImageUploadPage 
                        className="book-html-container"
                        coverUrl={formData.coverUrl}
                        onUpload={(url) => handleFormChange('coverUrl', url)}
                        onConfirm={handleCreateConfirm}
                        onClose={onClose} 
                     />
                  ) : (
                     <JournalPage data={data} className="book-html-container" onSave={() => alert("Saved!")} onClose={onClose} />
                  )}
                </Html>
              )}
            </group>
        </group>

       {/* --- D. FRONT COVER --- */}
        <group ref={hingeRef} position={[-1, 0, 0.22]} rotation={[0, 0, 0]}>
            {/* The Front Cover */}
            <mesh geometry={nodes.FrontCover.geometry} material={colorOverlayMaterial} position={[1, 0, -0.22]} rotation={[Math.PI / 2, Math.PI / 2, 0]} scale={[2,2,2]} />
            
            {/* OPTIMIZATION: Hide Frame on Shelf */}
            {isHighDetail && (
              <mesh geometry={nodes.MarbleFrame.geometry} material={MAT_CACHE.metal || materials.SpineMaterial} position={[1, 0, -0.22]} rotation={[Math.PI / 2, Math.PI / 2, 0]} scale={[2,2,2]} />
            )}

            {/* OPTIMIZATION: Hide Decal (Cover Image) */}
            {isHighDetail && (
              <mesh position={[0.9, 0, 0.36]} rotation={[0, 0, Math.PI]} scale={[-0.75, 0.72, 1]} geometry={decalGeo}>
                <meshStandardMaterial map={coverTexture} transparent />
              </mesh>
            )}

            <group position={[1, 0, -0.22]}> 
              <mesh geometry={nodes.PagesTop.geometry} material={MAT_CACHE.pages || materials.SpineMaterial} rotation={[Math.PI / 2, Math.PI / 2, 0]} scale={[2,2,2]} />
              
              {showContent && isActive && (
                  <Html distanceFactor={1.4} position={[0.3,0.4, 0.2]} rotation={[0, Math.PI, 0]} onPointerDown={(e) => e.stopPropagation()}>
                    {mode === 'create' ? (
                        <CreationFormPage 
                           className="book-html-container"
                           formData={formData} 
                           onChange={handleFormChange} 
                        />
                    ) : (
                        <ArchivePage data={data} className="book-html-container" />
                    )}
                  </Html>
              )}
            </group>
        </group>
      </group> 
    </group>
  );
}