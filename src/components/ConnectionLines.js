// src/components/ConnectionLines.js

import React, { useMemo } from 'react';
import * as THREE from 'three';

export default function ConnectionLines({ positions, threshold = 36 }) {
  const geometry = useMemo(() => {
    const points = [];
    if (!positions || positions.length < 2) return null;

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const p1 = positions[i];
        const p2 = positions[j];
        if (p1.distanceTo(p2) < threshold) {
          points.push(p1.x, p1.y, p1.z);
          points.push(p2.x, p2.y, p2.z);
        }
      }
    }
    
    if (points.length === 0) return null;
    
    const bufferGeom = new THREE.BufferGeometry();
    bufferGeom.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return bufferGeom;
  }, [positions, threshold]);

  if (!geometry) return null;

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="white" transparent opacity={0.2} depthWrite={false} />
    </lineSegments>
  );
}