import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import VideoItem from './VideoItem';
import ConnectionLines from './ConnectionLines';
import Logo from './Logo';
import { mediaData } from '../mediaData';

// Positions for focused video (adapt as needed for desired visual)
const FOCUSED_POSITION_DESKTOP = new THREE.Vector3(0, 0, 5);
const FOCUSED_POSITION_MOBILE = new THREE.Vector3(0, 0, 8);

// Default scale for non-focused videos (this will be applied AFTER aspect ratio scaling in VideoItem)
// Adjust this to control the general size of scattered videos.
const DEFAULT_VIDEO_MASTER_SCALE = new THREE.Vector3(2.5, 2.5, 2.5);

const LAYOUT_CONFIG = {
  SCATTER_RADIUS: 300,
  REARRANGE_RADIUS: 10,
  REARRANGE_Z_POS: -3,
  SCATTER_RADIUS_MOBILE: 12,
  REARRANGE_RADIUS_MOBILE: 8,
  REARRANGE_Z_POS_MOBILE: -2,
};

// NEW: Scroll influence constants - Adjusted for more noticeable effect
const SCROLL_SENSITIVITY = 0.01; // Increased sensitivity
const SCROLL_DECAY_FACTOR = 0.05;  // Slower decay for a longer 'slide' effect


export default function VideoScene({ layoutSeed, onVideoFocusStateChange, onRearrangeRequest, onInteraction }) {
  const [focusedIndex, setFocusedIndex] = useState(null);
  const videoRefs = useRef([]);
  const [livePositions, setLivePositions] = useState([]);
  const { viewport, camera } = useThree();
  const [mousePosition, setMousePosition] = useState(new THREE.Vector2(0, 0));
  const [scrollInfluence, setScrollInfluence] = useState(new THREE.Vector2(0, 0)); // State for scroll influence

  const isSceneFocused = focusedIndex !== null;
  const prevIsSceneFocused = useRef(isSceneFocused); // Track previous state for rearrange on exit focus

  useEffect(() => {
    onVideoFocusStateChange(isSceneFocused);

    // Request rearrange when transitioning from focused to non-focused state
    if (prevIsSceneFocused.current === true && isSceneFocused === false) {
      if (onRearrangeRequest) {
        onRearrangeRequest();
      }
    }
    // Update prevIsSceneFocused for the next render cycle
    prevIsSceneFocused.current = isSceneFocused;
  }, [isSceneFocused, onVideoFocusStateChange, onRearrangeRequest]);

  // Mouse/Touch Move Handler for Parallax
  const handlePointerMove = useCallback((event) => {
    // Normalize mouse coordinates to -1 to 1 range relative to viewport
    const x = (event.clientX / viewport.width) * 2 - 1;
    const y = -(event.clientY / viewport.height) * 2 + 1;
    setMousePosition(new THREE.Vector2(x, y));
  }, [viewport.width, viewport.height]);

  // NEW: Wheel/Scroll Handler for Parallax
  const handleWheel = useCallback((event) => {
    event.preventDefault(); // Prevent page scroll when interacting with the canvas
    setScrollInfluence(prev => {
      const newInfluence = prev.clone();
      // Adjust sensitivity based on deltaMode if needed for consistency across browsers
      newInfluence.x += event.deltaX * SCROLL_SENSITIVITY;
      newInfluence.y += event.deltaY * SCROLL_SENSITIVITY;
      // Increase clamping range to allow more extreme movement before it stops accumulating
      newInfluence.x = THREE.MathUtils.clamp(newInfluence.x, -5, 5); // Increased from -2, 2
      newInfluence.y = THREE.MathUtils.clamp(newInfluence.y, -5, 5);
      return newInfluence;
    });
  }, []); // SCROLL_SENSITIVITY is a constant, no need for dependency

  useEffect(() => {
    // Add event listeners on the canvas element for accurate mouse/touch/wheel tracking
    const canvas = document.querySelector('#canvas-container canvas');
    if (canvas) {
      canvas.addEventListener('mousemove', handlePointerMove);
      canvas.addEventListener('touchmove', handlePointerMove, { passive: true });
      canvas.addEventListener('wheel', handleWheel, { passive: false }); // Use passive: false to allow preventDefault
    }
    // Clean up event listeners when component unmounts
    return () => {
      if (canvas) {
        canvas.removeEventListener('mousemove', handlePointerMove);
        canvas.removeEventListener('touchmove', handlePointerMove);
        canvas.removeEventListener('wheel', handleWheel);
      }
    };
  }, [handlePointerMove, handleWheel]); // Add handleWheel to dependencies

  const getLayoutConfig = useMemo(() => {
    if (viewport.width < 768) {
      return {
        SCATTER_RADIUS: LAYOUT_CONFIG.SCATTER_RADIUS_MOBILE,
        REARRANGE_RADIUS: LAYOUT_CONFIG.REARRANGE_RADIUS_MOBILE,
        REARRANGE_Z_POS: LAYOUT_CONFIG.REARRANGE_Z_POS_MOBILE,
        FOCUSED_POSITION: FOCUSED_POSITION_MOBILE,
      };
    }
    return {
      SCATTER_RADIUS: LAYOUT_CONFIG.SCATTER_RADIUS,
      REARRANGE_RADIUS: LAYOUT_CONFIG.REARRANGE_RADIUS,
      REARRANGE_Z_POS: LAYOUT_CONFIG.REARRANGE_Z_POS,
      FOCUSED_POSITION: FOCUSED_POSITION_DESKTOP,
    };
  }, [viewport.width]);

  // Calculates the scale for the focused video to take up 60% of the viewport,
  // while maintaining its aspect ratio.
  const calculateFocusedScale = useCallback((videoWidth, videoHeight) => {
    if (!videoWidth || !videoHeight) {
      return new THREE.Vector3(2, 2, 2); // Fallback scale
    }

    const videoAspectRatio = videoWidth / videoHeight;
    const viewportAspectRatio = viewport.width / viewport.height;

    const fovRad = THREE.MathUtils.degToRad(camera.fov);
    const distanceToFocused = getLayoutConfig.FOCUSED_POSITION.z;

    const visibleHeightAtDepth = 2 * Math.tan(fovRad / 2) * distanceToFocused;
    const visibleWidthAtDepth = visibleHeightAtDepth * viewportAspectRatio;

    let scaleFactor;
    const targetPercentage = 0.6; // Target 60% of the screen

    if (videoAspectRatio > viewportAspectRatio) {
      // Video is wider than viewport, scale to fit width
      scaleFactor = (visibleWidthAtDepth * targetPercentage) / videoAspectRatio;
    } else {
      // Video is taller than viewport, scale to fit height
      scaleFactor = (visibleHeightAtDepth * targetPercentage) / 1;
    }

    return new THREE.Vector3(scaleFactor, scaleFactor, scaleFactor);
  }, [viewport.width, viewport.height, getLayoutConfig.FOCUSED_POSITION.z, camera.fov]);

  // Generates initial scattered positions for all media items
  const mediaItems = useMemo(() => {
    const numPoints = mediaData.length;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle for even distribution

    return mediaData.map((item, i) => {
      const y = 1 - (i / (numPoints - 1)) * 2; // Y from -1 to 1
      const radiusAtY = Math.sqrt(1 - y * y); // Radius of circle at this Y
      const theta = phi * i + layoutSeed; // Angle based on golden angle and layout seed

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Multiply by SCATTER_RADIUS for final scattered position scale
      const finalPos = new THREE.Vector3(x, y * 0.8, z).multiplyScalar(getLayoutConfig.SCATTER_RADIUS);

      return { ...item, initialPos: [finalPos.x, finalPos.y, finalPos.z] };
    });
  }, [layoutSeed, getLayoutConfig]);

  // Calculates target positions and scales for each video item based on focus state
  const targets = useMemo(() => {
    const newTargets = {};
    mediaItems.forEach((item, index) => {
      if (index === focusedIndex) {
        // Focused video target
        const focusedScale = calculateFocusedScale(item.width, item.height);
        newTargets[item.id] = { position: getLayoutConfig.FOCUSED_POSITION, scale: focusedScale };
      } else if (isSceneFocused) {
        // Rearrange other videos when one is focused
        const others = mediaItems.filter((_, i) => i !== focusedIndex);
        const arcIndex = others.findIndex(other => other.id === item.id);
        const angle = (arcIndex / (others.length - 1) - 0.5) * Math.PI * 1.2; // Arc distribution
        const radius = getLayoutConfig.REARRANGE_RADIUS + (Math.random() - 0.5); // Add some randomness
        const x = Math.sin(angle) * radius;
        const y = (Math.cos(angle) * radius) / 3; // Compress Y for flatter arc
        const z = getLayoutConfig.REARRANGE_Z_POS + Math.cos(angle) * 3; // Bring Z forward, add depth variation
        newTargets[item.id] = { position: new THREE.Vector3(x, y, z), scale: DEFAULT_VIDEO_MASTER_SCALE.clone().multiplyScalar(0.5) }; // Smaller when rearranged
      } else {
        // Default scattered layout
        newTargets[item.id] = { position: new THREE.Vector3(...item.initialPos), scale: DEFAULT_VIDEO_MASTER_SCALE };
      }
    });
    return newTargets;
  }, [focusedIndex, mediaItems, isSceneFocused, getLayoutConfig, calculateFocusedScale]);

  // Handles click on a specific video item to toggle focus
  const handleItemClick = useCallback((index) => {
    if (onInteraction) onInteraction(); // Trigger flash on video click
    setFocusedIndex(focusedIndex === index ? null : index); // Toggle focus
  }, [focusedIndex, onInteraction]);

  // Handles click on the background plane to defocus
  const handleBackgroundClick = () => {
    if (focusedIndex !== null) {
      if (onInteraction) onInteraction(); // Trigger flash on background click if it causes defocus
      setFocusedIndex(null); // Defocus the video (this will trigger the useEffect to rearrange)
    }
  };

  useFrame(() => {
    // Decay scroll influence over time
    setScrollInfluence(prev => {
      const current = prev.clone();
      // Only decay if magnitude is above a small threshold to prevent tiny oscillations
      if (current.lengthSq() > 0.0001) {
        return current.lerp(new THREE.Vector2(0, 0), SCROLL_DECAY_FACTOR);
      }
      return new THREE.Vector2(0,0); // Snap to zero if very small
    });

    // Collect live positions of video items for connection lines
    const newPositions = videoRefs.current.map(ref => ref.current ? ref.current.position : null).filter(Boolean);
    setLivePositions(newPositions);
  });

  return (
    <>
      {/* Invisible background plane to capture clicks for defocusing */}
      <mesh onClick={handleBackgroundClick} position={[0, 0, -10]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Logo is positioned independently and does not move with parallax */}
      <Logo />

      {/* Render each VideoItem */}
      {mediaItems.map((item, index) => {
        if (!videoRefs.current[index]) videoRefs.current[index] = React.createRef();
        return (
          <VideoItem
            key={item.id}
            ref={videoRefs.current[index]}
            url={item.url}
            title={item.title}
            description={item.description}
            target={targets[item.id]}
            isFocused={focusedIndex === index}
            isSceneFocused={isSceneFocused}
            onClick={() => handleItemClick(index)}
            videoDims={[item.width, item.height]}
            mousePosition={mousePosition} // Pass mouse position for individual parallax
            scrollInfluence={scrollInfluence} // Pass scroll influence
          />
        );
      })}

      {/* ConnectionLines follow the video items' live positions */}
      <ConnectionLines positions={livePositions} threshold={16} />
    </>
  );
}