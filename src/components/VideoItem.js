// src/components/VideoItem.js

import React, { useMemo, useRef, useState, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import InfoText from './InfoText';

// Wrap the component definition in React.memo
const VideoItem = React.memo(forwardRef(({ url, title, description, target, isFocused, isSceneFocused, onClick }, ref) => {
  const [dims, setDims] = useState([4, 2.25]);
  const materialRef = useRef();

  const videoTexture = useMemo(() => {
    const video = document.createElement('video');
    video.src = url;
    video.crossOrigin = 'Anonymous';
    video.loop = true;
    video.muted = true;
    
    video.onloadedmetadata = () => {
      video.play().catch(e => console.error("Video play failed:", e));
      const { videoWidth, videoHeight } = video;
      const aspectRatio = videoWidth / videoHeight;
      const planeHeight = 3.5;
      const planeWidth = planeHeight * aspectRatio;
      setDims([planeWidth, planeHeight]);
    };
    
    return new THREE.VideoTexture(video);
  }, [url]);
  
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  
  const parallaxFactor = useMemo(() => (target.position.z + 5) * 0.02, [target.position.z]);

  useFrame((state) => {
    if (!ref.current || !target || !materialRef.current) return;
    
    const targetOpacity = isFocused ? 1.0 : 0.87;
    materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, 0.1);

    const lerpFactor = 0.15; 
    const finalTargetPosition = new THREE.Vector3().copy(target.position);

    if (!isSceneFocused) {
      finalTargetPosition.x += state.mouse.x * parallaxFactor;
      finalTargetPosition.y += state.mouse.y * parallaxFactor;
      
      const time = state.clock.getElapsedTime();
      const breath = Math.sin(time * 0.5 + phase);
      finalTargetPosition.x += breath * 0.1;
      finalTargetPosition.y += breath * 0.1;
    }
    
    ref.current.position.lerp(finalTargetPosition, lerpFactor);
    ref.current.scale.lerp(target.scale, lerpFactor);
    ref.current.quaternion.copy(state.camera.quaternion);
  });

  return (
    <group ref={ref} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <mesh>
        <planeGeometry args={dims} />
        <meshBasicMaterial 
          ref={materialRef}
          map={videoTexture} 
          toneMapped={false} 
          transparent
        />
      </mesh>
      <InfoText title={title} description={description} videoDims={dims} visible={isFocused} />
    </group>
  );
})); // <-- Close the React.memo and forwardRef wrappers

export default VideoItem;