import * as THREE from 'three';

// Black Leather (for Spine and Back Cover)
export const materialBlack = new THREE.MeshStandardMaterial({ 
  color: "#222", 
  roughness: 0.8 
});

// Paper (for Pages)
export const materialPage = new THREE.MeshStandardMaterial({ 
  color: "#fff", 
  roughness: 0.9 
});

// Off-White/Cream Paper (for inner pages)
export const materialPageCream = new THREE.MeshStandardMaterial({ 
  color: "#fdfdfd", 
  roughness: 0.9 
});

// Dark Grey (for Triggers/Invisible helpers if needed)
export const materialTrigger = new THREE.MeshBasicMaterial({ 
  color: "red", 
  transparent: true, 
  opacity: 0 
});