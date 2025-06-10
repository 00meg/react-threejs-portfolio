// src/components/Logo.js

import React, { useState, useMemo } from 'react';
import * as THREE from 'three';

export default function Logo() {
  const [dims, setDims] = useState([0, 0, 0]); // [width, height, opacity]

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load('/logo.png', (loadedTexture) => {
      const { naturalWidth, naturalHeight } = loadedTexture.image;
      const aspectRatio = naturalWidth / naturalHeight;
      const logoHeight = 1.5;
      const logoWidth = logoHeight * aspectRatio;
      setDims([logoWidth, logoHeight, 0.7]);
    });
  }, []);

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[dims[0], dims[1]]} />
      <meshBasicMaterial
        map={texture}
        transparent
        toneMapped={false}
        opacity={dims[2]}
        // --- Updated Blending Properties ---
        blending={THREE.CustomBlending}
        blendEquation={THREE.AddEquation}
        blendSrc={THREE.OneMinusDstColorFactor}
        blendDst={THREE.OneMinusSrcColorFactor}
      />
    </mesh>
  );
}