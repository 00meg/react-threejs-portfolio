import React, { useRef, useState, useMemo, forwardRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVideoTexture } from '@react-three/drei';
import * as THREE from 'three';
import InfoText from './InfoText';

// Parallax constants for individual video item movement - Adjusted for stronger effect
const PARALLAX_STRENGTH_X = 0.1; // Increased from 0.05
const PARALLAX_STRENGTH_Y = 0.06; // Increased from 0.03
const PARALLAX_Z_RANGE = 600;    // Expected max range of Z in scattered view (e.g., if SCATTER_RADIUS is 300, Z can be from -300 to 300, so range is 600)
// PARALLAX_LERP_FACTOR was for internal smoothing of parallax offset, now directly integrated into target position lerp

// Animation speed constants
const FOCUS_SPEED_POSITION_LERP_FACTOR = 0.25; // Quicker move to center
const FOCUS_SPEED_SCALE_LERP_FACTOR = 0.25;    // Quicker scaling up
const FOCUS_SPEED_ROTATION_LERP_FACTOR = 0.25; // Quicker rotation to face camera
const FOCUS_SPEED_OPACITY_LERP_FACTOR = 0.25;  // Quicker for focused video to become opaque

const DEFAULT_SPEED_POSITION_LERP_FACTOR = 0.1; // Normal speed for unfocusing/rearranging
const DEFAULT_SPEED_SCALE_LERP_FACTOR = 0.1;    // Normal speed for unfocusing/rearranging
const DEFAULT_SPEED_ROTATION_LERP_FACTOR = 0.1; // Normal speed for unfocusing/rearranging
const DEFAULT_SPEED_OPACITY_LERP_FACTOR = 0.1;  // Normal speed for other videos dimming/all becoming opaque


const VideoItem = forwardRef(({ url, title, description, target, isFocused, isSceneFocused, onClick, videoDims, mousePosition, scrollInfluence }, ref) => {
  const meshRef = useRef();
  const materialRef = useRef();

  // useVideoTexture for robust video loading and playback
  const texture = useVideoTexture(url, {
    loop: true,
    muted: true,
    htmlVideoElement: true,
  });

  // Control video playback based on focus state
  useEffect(() => {
    if (texture && texture.image) {
      if (isFocused || !isSceneFocused) { // Play when focused or when scene is not focused (all playing)
        texture.image.play().catch(error => console.error("Video play failed:", error));
      } else { // Pause when scene is focused but this video is not (dimmed state)
        texture.image.pause();
      }
    }
  }, [isFocused, isSceneFocused, texture]);

  // Calculate the aspect ratio scale once per video item.
  // This scales a 1x1 plane to the video's correct proportions.
  const aspectRatioScale = useMemo(() => {
    if (!videoDims || videoDims[0] === 0 || videoDims[1] === 0) {
      return new THREE.Vector3(1, 1, 1); // Fallback for safety (renders as a square)
    }
    const aspectRatio = videoDims[0] / videoDims[1];
    return new THREE.Vector3(aspectRatio, 1, 1);
  }, [videoDims]);

  useFrame(() => {
    if (meshRef.current && target) {
      // Determine which lerp factor to use for position, scale, and rotation
      const currentPositionLerp = isFocused ? FOCUS_SPEED_POSITION_LERP_FACTOR : DEFAULT_SPEED_POSITION_LERP_FACTOR;
      const currentScaleLerp = isFocused ? FOCUS_SPEED_SCALE_LERP_FACTOR : DEFAULT_SPEED_SCALE_LERP_FACTOR;
      const currentRotationLerp = isFocused ? FOCUS_SPEED_ROTATION_LERP_FACTOR : DEFAULT_SPEED_ROTATION_LERP_FACTOR;

      // Start with the base target position
      const baseTargetPosition = target.position.clone();
      let finalTargetPosition = baseTargetPosition;

      // Apply individual parallax effect if not focused and scene is not focused
      if (!isFocused && !isSceneFocused) {
        const currentZ = meshRef.current.position.z;
        const normalizedZ = (currentZ + PARALLAX_Z_RANGE / 2) / PARALLAX_Z_RANGE;

        // Corrected Parallax Factor: Closer objects (more positive Z) should move MORE.
        // normalizedZ goes from 0 (furthest) to 1 (closest).
        const parallaxFactor = normalizedZ; // Use normalizedZ directly for standard parallax

        // NEW: Combine mouse position and scroll influence for parallax input
        const effectiveParallaxInputX = mousePosition.x + scrollInfluence.x;
        const effectiveParallaxInputY = mousePosition.y + scrollInfluence.y;

        const parallaxOffsetX = effectiveParallaxInputX * PARALLAX_STRENGTH_X * parallaxFactor;
        const parallaxOffsetY = effectiveParallaxInputY * PARALLAX_STRENGTH_Y * parallaxFactor;

        // Apply parallax offset to the target position
        finalTargetPosition = baseTargetPosition.clone().add(new THREE.Vector3(parallaxOffsetX, parallaxOffsetY, 0));
      }

      // 1. Lerp to final calculated target position (base + parallax offset)
      meshRef.current.position.lerp(finalTargetPosition, currentPositionLerp);

      // 3. Lerp to combined scale (aspectRatioScale * target.scale)
      const combinedScale = new THREE.Vector3().copy(aspectRatioScale).multiply(target.scale);
      meshRef.current.scale.lerp(combinedScale, currentScaleLerp);

      // 4. Lerp rotation to face camera when focused, or default otherwise
      if (isFocused) {
        const targetQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)); // No rotation
        meshRef.current.quaternion.slerp(targetQuaternion, currentRotationLerp);
      } else {
        const originalRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)); // Or your default rotation
        meshRef.current.quaternion.slerp(originalRotation, currentRotationLerp);
      }
    }

    // Apply opacity change for focused/dimmed states
    if (materialRef.current) {
      const targetOpacity = (isSceneFocused && !isFocused) ? 0.3 : 1;
      const currentOpacityLerp = (isFocused || !isSceneFocused) ? FOCUS_SPEED_OPACITY_LERP_FACTOR : DEFAULT_SPEED_OPACITY_LERP_FACTOR;
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, currentOpacityLerp);
    }
  });

  React.useImperativeHandle(ref, () => meshRef.current);

  return (
    <group ref={meshRef} onClick={onClick}>
      <mesh>
        {/* Use a fixed 1x1 plane geometry; its aspect ratio is handled by aspectRatioScale */}
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial ref={materialRef} map={texture} toneMapped={false} transparent={true} opacity={1} />
      </mesh>
      {/* Conditionally render InfoText component when focused */}
      {isFocused && (
        <InfoText title={title} description={description} videoDims={videoDims} visible={isFocused} />
      )}
    </group>
  );
});

export default VideoItem;