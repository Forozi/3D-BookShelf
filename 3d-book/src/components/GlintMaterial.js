/* GlintMaterial.js */
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

const GlintMaterial = shaderMaterial(
  {
    uTime: -1.0,
    uColor: new THREE.Color(1, 1, 1),
    uIsRainbow: false,
    uOpacity: 0.5,
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment Shader
  `
  varying vec2 vUv;
  uniform float uTime; // 0.0 (Start) to 1.0 (End)
  uniform vec3 uColor;
  uniform bool uIsRainbow;
  uniform float uOpacity;

  void main() {
    // 1. Create a diagonal gradient (0.0 to 2.0 range)
    // Matches the angle of your original 3.0x + 2.0y logic
    float pos = vUv.x + vUv.y * 0.6; 
    
    // 2. Animate the "Center" of the glint beam
    // We move it from -1.5 (Left of book) to 2.5 (Right of book)
    // This wide range guarantees it starts and ends completely invisible.
    float center = mix(-1.5, 2.5, uTime);
    
    // 3. Calculate glow based on distance from center
    float dist = abs(pos - center);
    
    // 4. Sharp beam with soft edges (Adjust 0.4 to make it wider/narrower)
    float glow = 1.0 - smoothstep(0.0, 0.4, dist);

    // 5. Hide completely if uTime is -1 (Cooldown)
    float alpha = (uTime < 0.0) ? 0.0 : (glow * uOpacity);

    vec3 finalColor = uColor;
    if(uIsRainbow) {
      finalColor = 0.5 + 0.5 * cos(uTime * 3.0 + vUv.xyx + vec3(0,2,4));
    }
    
    gl_FragColor = vec4(finalColor, alpha);
  }
  `
);

extend({ GlintMaterial });
export { GlintMaterial };