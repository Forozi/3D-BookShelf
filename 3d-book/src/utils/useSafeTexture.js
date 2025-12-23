import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

export function useSafeTexture(url, fallbackUrl = '/loadingcover.jpg') {
  const fallbackTexture = useTexture(fallbackUrl);
  const [texture, setTexture] = useState(fallbackTexture);

  useEffect(() => {
    if (!url) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTexture(fallbackTexture);
      return;
    }

    const loader = new THREE.TextureLoader();

    loader.load(
      url,
      (loadedTexture) => {
        loadedTexture.encoding = THREE.sRGBEncoding;
        loadedTexture.flipY = false;
        setTexture(loadedTexture);
      },
      undefined, // onProgress
      // eslint-disable-next-line no-unused-vars
      (err) => {
        console.warn(`Texture failed: ${url}. Using fallback.`);
        setTexture(fallbackTexture);
      }
    );
  }, [url, fallbackTexture]);

  return texture;
}