import React, { useRef, useState, useMemo, forwardRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import InfoText from './InfoText'; // Import InfoText

// ForwardRef allows us to attach a ref to the mesh from VideoScene
const VideoItem = forwardRef(({ url, title, description, target, isFocused, isSceneFocused, onClick, videoDims }, ref) => {
  const meshRef = useRef();
  const videoRef = useRef();
  const [video] = useState(() => {
    const vid = document.createElement('video');
    vid.src = url;
    vid.crossOrigin = 'Anonymous';
    vid.loop = true;
    vid.muted = true;
    vid.play().catch(error => console.error("Video play failed:", error));
    return vid;
  });

  const texture = useMemo(() => new THREE.VideoTexture(video), [video]);
  const materialRef = useRef(); // Ref for the mesh material

  useFrame(() => {
    if (meshRef.current && target) {
      // Lerp position
      meshRef.current.position.lerp(target.position, 0.1);
      // Lerp scale
      meshRef.current.scale.lerp(target.scale, 0.1);

      // Lerp rotation to face the camera when focused
      if (isFocused) {
        const targetQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)); // No rotation
        meshRef.current.quaternion.slerp(targetQuaternion, 0.1);
      } else {
        // Revert to original rotation (or a slight random rotation if desired)
        const originalRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)); // Or your default
        meshRef.current.quaternion.slerp(originalRotation, 0.1);
      }
    }

    // Apply blur/opacity to other videos when one is focused
    if (materialRef.current) {
      const targetOpacity = (isSceneFocused && !isFocused) ? 0.3 : 1; // Lower opacity for non-focused items
      const targetFilter = (isSceneFocused && !isFocused) ? 'blur(2px)' : 'none'; // Apply blur filter
      
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, 0.1);
      // Note: Filters on materials are not directly supported by Three.js standard materials
      // For actual blur on other video items in 3D, you might need a post-processing shader.
      // For now, we'll just adjust opacity, which gives a similar "dimming" effect.
      // If you really need blur on the other videos in the 3D scene, it's more complex.
      // The CSS blur on canvas-container IS the simple solution for blurring the whole background.
    }
  });

  // Attach the passed ref to the mesh
  React.useImperativeHandle(ref, () => meshRef.current);

  return (
    <group ref={meshRef} onClick={onClick}>
      <mesh>
        <planeGeometry args={[videoDims[0], videoDims[1]]} /> {/* Use dynamic videoDims */}
        <meshBasicMaterial ref={materialRef} map={texture} toneMapped={false} transparent={true} opacity={1} />
      </mesh>
      {/* Conditionally render InfoText component */}
      {isFocused && (
        <InfoText title={title} description={description} videoDims={videoDims} visible={isFocused} />
      )}
    </group>
  );
});

export default VideoItem;