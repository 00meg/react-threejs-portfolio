import React, { useRef, useState, useMemo, forwardRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber'; // Import useThree
import { useVideoTexture } from '@react-three/drei';
import * as THREE from 'three';
import InfoText from './InfoText';

// Parallax constants for individual video item movement
// These are BASE strengths; the prop 'parallaxStrength' will modify them
const BASE_PARALLAX_STRENGTH_X = 0.05; // Base X movement
const BASE_PARALLAX_STRENGTH_Y = 0.03; // Base Y movement

// Animation speed constants
const FOCUS_SPEED_POSITION_LERP_FACTOR = 0.25; // Quicker move to center
const FOCUS_SPEED_SCALE_LERP_FACTOR = 0.25;    // Quicker scaling up
const FOCUS_SPEED_ROTATION_LERP_FACTOR = 0.25; // Quicker rotation to face camera
const FOCUS_SPEED_OPACITY_LERP_FACTOR = 0.25;  // Quicker for focused video to become opaque

const DEFAULT_SPEED_POSITION_LERP_FACTOR = 0.1; // Normal speed for unfocusing/rearranging
const DEFAULT_SPEED_SCALE_LERP_FACTOR = 0.1;    // Normal speed for unfocusing/rearranging
const DEFAULT_SPEED_ROTATION_LERP_FACTOR = 0.1; // Normal speed for unfocusing/rearranging
const DEFAULT_SPEED_OPACITY_LERP_FACTOR = 0.1;  // Normal speed for other videos dimming/all becoming opaque


const VideoItem = forwardRef(({
  url,
  title,
  description,
  target, // Contains { position, scale } for current target state
  isFocused,
  isSceneFocused,
  onClick,
  videoDims,
  mousePosition,
  scrollInfluence,
  parallaxStrength // NEW: This prop comes from VideoScene
}, ref) => {
  const meshRef = useRef();
  const materialRef = useRef();
  const { camera } = useThree(); // Use useThree to access camera for potential calculations

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

      // Start with the base target position from props
      const baseTargetPosition = target.position.clone();
      let finalTargetPosition = baseTargetPosition;

      // Apply individual parallax effect if not focused and scene is not focused
      // and only if mouse/scroll input is available
      if (!isFocused && !isSceneFocused && mousePosition && scrollInfluence) {
        // Calculate parallax factor based on its *current* distance to camera
        // Objects further away will move less (smaller parallax effect)
        // Ensure this calculation is stable and doesn't cause jitters.
        // A simple depth-based factor (0 to 1) for parallax intensity.
        // You'll need to know the max Z range of your scattered videos.
        // A rough estimate: cameraZ - (min video Z) for closer, cameraZ - (max video Z) for further.
        // Or simply use the target Z for parallax calculation if stable enough.

        // More stable parallax factor based on the target Z relative to the camera
        // assuming target.position.z is within a reasonable range (e.g. -300 to 300 for scatter)
        // We'll normalize the Z-position relative to a fixed depth range.
        const maxSceneDepth = 300; // Assuming SCATTER_RADIUS_DESKTOP is 300, Z ranges roughly -300 to 300
        const minSceneDepth = -300;
        const depthRange = maxSceneDepth - minSceneDepth;

        // Calculate a normalized Z for parallax (0 for furthest, 1 for closest within the range)
        // Adjust 0.5 to control sensitivity of parallax based on depth.
        const normalizedZ = (target.position.z - minSceneDepth) / depthRange;
        // Make objects further away move less with a slight exponential decay
        const parallaxDepthFactor = Math.pow(Math.max(0, normalizedZ), 0.7); // 0.7 gives a good curve

        // Combine mouse position and scroll influence for parallax input
        const effectiveParallaxInputX = (mousePosition.x * BASE_PARALLAX_STRENGTH_X) + (scrollInfluence.x * BASE_PARALLAX_STRENGTH_X);
        const effectiveParallaxInputY = (mousePosition.y * BASE_PARALLAX_STRENGTH_Y) + (scrollInfluence.y * BASE_PARALLAX_STRENGTH_Y);

        // Apply the overall parallaxStrength prop and the depth factor
        const parallaxOffsetX = effectiveParallaxInputX * parallaxStrength * parallaxDepthFactor;
        const parallaxOffsetY = effectiveParallaxInputY * parallaxStrength * parallaxDepthFactor;

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
        // Look at the camera's position (or slightly in front)
        const lookAtPosition = camera.position.clone();
        meshRef.current.lookAt(lookAtPosition);
        // If you want it perfectly upright, you might need to set X and Z rotation to 0 after lookAt
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, currentRotationLerp);
        meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, currentRotationLerp);
      } else {
        // Return to an arbitrary original rotation (e.g., identity or a slight tilt)
        const originalRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)); // No rotation
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