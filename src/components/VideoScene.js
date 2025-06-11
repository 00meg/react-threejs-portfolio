import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import VideoItem from './VideoItem';
import ConnectionLines from './ConnectionLines';
import Logo from './Logo';
import { mediaData } from '../mediaData';

// Positions for focused video (adapt as needed for desired visual)
// These define the Z-position when a video is focused. Lower Z means closer to camera, thus appears larger.
const FOCUSED_POSITION_DESKTOP = new THREE.Vector3(0, 0, 5);
const FOCUSED_POSITION_MOBILE = new THREE.Vector3(0, 0, 6); // Slightly pulled back for mobile compared to desktop

// Default scale for non-focused videos (this will be applied AFTER aspect ratio scaling in VideoItem)
// This is the base scale before any mobile specific modifiers.
const DEFAULT_VIDEO_MASTER_SCALE = new THREE.Vector3(2.5, 2.5, 2.5);

const LAYOUT_CONFIG = {
  // DESKTOP values - these should be large and expansive
  SCATTER_RADIUS_DESKTOP: 300,       // How far out scattered videos spread
  REARRANGE_RADIUS_DESKTOP: 10,      // Radius for videos when one is focused
  REARRANGE_Z_POS_DESKTOP: -3,       // Z-position for rearranged videos

  // MOBILE values - these should be more compact to fit smaller screens
  SCATTER_RADIUS_MOBILE: 12,        // Less spread out for mobile
  REARRANGE_RADIUS_MOBILE: 8,       // Tighter cluster for mobile
  REARRANGE_Z_POS_MOBILE: -2,       // Slightly more forward for mobile
};

// Scroll influence constants for the 'sliding' parallax effect
const SCROLL_SENSITIVITY = 0.01;
const SCROLL_DECAY_FACTOR = 0.05;

// Parallax intensity control - passed to VideoItem
const PARALLAX_STRENGTH_DESKTOP = 0.2; // Stronger parallax on desktop
const PARALLAX_STRENGTH_MOBILE = 0.05; // Reduced parallax on mobile to prevent videos from moving off-screen easily


export default function VideoScene({ layoutSeed, onVideoFocusStateChange, onRearrangeRequest, onInteraction }) {
  const [focusedIndex, setFocusedIndex] = useState(null);
  const videoRefs = useRef([]);
  const [livePositions, setLivePositions] = useState([]);
  const { viewport, camera } = useThree(); // `viewport` gives R3F canvas dimensions
  const [mousePosition, setMousePosition] = useState(new THREE.Vector2(0, 0));
  const [scrollInfluence, setScrollInfluence] = useState(new THREE.Vector2(0, 0));

  const isSceneFocused = focusedIndex !== null;
  const prevIsSceneFocused = useRef(isSceneFocused);

  useEffect(() => {
    onVideoFocusStateChange(isSceneFocused);

    if (prevIsSceneFocused.current === true && isSceneFocused === false) {
      if (onRearrangeRequest) {
        onRearrangeRequest();
      }
    }
    prevIsSceneFocused.current = isSceneFocused;
  }, [isSceneFocused, onVideoFocusStateChange, onRearrangeRequest]);

  // Mouse/Touch Move Handler for Parallax
  const handlePointerMove = useCallback((event) => {
    // Determine clientX/Y from mouse or first touch
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    // Normalize coordinates to -1 to 1 range relative to viewport
    const x = (clientX / viewport.width) * 2 - 1;
    const y = -(clientY / viewport.height) * 2 + 1;
    setMousePosition(new THREE.Vector2(x, y));
  }, [viewport.width, viewport.height]);

  // Wheel/Scroll Handler for Parallax
  const handleWheel = useCallback((event) => {
    event.preventDefault(); // Prevent page scroll when interacting with the canvas
    setScrollInfluence(prev => {
      const newInfluence = prev.clone();
      newInfluence.x += event.deltaX * SCROLL_SENSITIVITY;
      newInfluence.y += event.deltaY * SCROLL_SENSITIVITY;
      newInfluence.x = THREE.MathUtils.clamp(newInfluence.x, -5, 5); // Clamp influence to prevent extreme movement
      newInfluence.y = THREE.MathUtils.clamp(newInfluence.y, -5, 5);
      return newInfluence;
    });
  }, []);

  useEffect(() => {
    const canvas = document.querySelector('#canvas-container canvas');
    if (canvas) {
      canvas.addEventListener('mousemove', handlePointerMove);
      canvas.addEventListener('touchmove', handlePointerMove, { passive: true });
      canvas.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener('mousemove', handlePointerMove);
        canvas.removeEventListener('touchmove', handlePointerMove);
        canvas.removeEventListener('wheel', handleWheel);
      }
    };
  }, [handlePointerMove, handleWheel]);

  // Determines layout configuration based on R3F's viewport width
  const getLayoutConfig = useMemo(() => {
    // We use viewport.width here because it accurately reflects the canvas size,
    // which is what Three.js is rendering into.
    const isMobile = viewport.width < 768; // Define mobile breakpoint

    return {
      SCATTER_RADIUS: isMobile ? LAYOUT_CONFIG.SCATTER_RADIUS_MOBILE : LAYOUT_CONFIG.SCATTER_RADIUS_DESKTOP,
      REARRANGE_RADIUS: isMobile ? LAYOUT_CONFIG.REARRANGE_RADIUS_MOBILE : LAYOUT_CONFIG.REARRANGE_RADIUS_DESKTOP,
      REARRANGE_Z_POS: isMobile ? LAYOUT_CONFIG.REARRANGE_Z_POS_MOBILE : LAYOUT_CONFIG.REARRANGE_Z_POS_DESKTOP,
      FOCUSED_POSITION: isMobile ? FOCUSED_POSITION_MOBILE : FOCUSED_POSITION_DESKTOP,
      PARALLAX_STRENGTH: isMobile ? PARALLAX_STRENGTH_MOBILE : PARALLAX_STRENGTH_DESKTOP,
      // Modifiers to apply to DEFAULT_VIDEO_MASTER_SCALE.
      // E.g., 0.6 means 60% of DEFAULT_VIDEO_MASTER_SCALE.
      DEFAULT_VIDEO_MASTER_SCALE_MODIFIER: isMobile ? 0.6 : 1.0, // Smaller scattered videos on mobile
      REARRANGED_VIDEO_SCALE_MODIFIER: isMobile ? 0.3 : 0.5, // Even smaller rearranged videos on mobile
    };
  }, [viewport.width]);

  // Calculates the scale for the focused video to take up a percentage of the viewport
  const calculateFocusedScale = useCallback((videoWidth, videoHeight) => {
    if (!videoWidth || !videoHeight) {
      return new THREE.Vector3(2, 2, 2); // Fallback scale
    }

    const videoAspectRatio = videoWidth / videoHeight;
    const viewportAspectRatio = viewport.width / viewport.height; // Ratio of the R3F canvas

    const fovRad = THREE.MathUtils.degToRad(camera.fov);
    const distanceToFocused = getLayoutConfig.FOCUSED_POSITION.z;

    // Calculate the visible area at the focused Z-depth
    const visibleHeightAtDepth = 2 * Math.tan(fovRad / 2) * distanceToFocused;
    const visibleWidthAtDepth = visibleHeightAtDepth * viewportAspectRatio;

    let scaleFactor;
    // THIS IS WHERE YOU ADJUST FOCUSED VIDEO SIZE FOR DESKTOP AND MOBILE:
    // This value represents the percentage of the *visible viewport dimension*
    // (either width or height, depending on video aspect ratio) that the video should fill.
    const targetPercentage = viewport.width < 768 ? 0.8 : 0.6; // 80% for mobile, 60% for desktop

    if (videoAspectRatio > viewportAspectRatio) {
      // Video is wider than viewport, scale to fit width
      scaleFactor = (visibleWidthAtDepth * targetPercentage) / videoAspectRatio;
    } else {
      // Video is taller than viewport, scale to fit height
      scaleFactor = (visibleHeightAtDepth * targetPercentage) / 1;
    }

    // console.log("Calculated Focused Scale Factor:", scaleFactor, "at targetPercentage:", targetPercentage, "for viewport.width:", viewport.width);
    return new THREE.Vector3(scaleFactor, scaleFactor, scaleFactor);
  }, [viewport.width, viewport.height, getLayoutConfig.FOCUSED_POSITION.z, camera.fov]); // Dependencies for useCallback

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

      // Multiply by SCATTER_RADIUS from the layout config (desktop/mobile specific)
      const finalPos = new THREE.Vector3(x, y * 0.8, z).multiplyScalar(getLayoutConfig.SCATTER_RADIUS);

      return { ...item, initialPos: [finalPos.x, finalPos.y, finalPos.z] };
    });
  }, [layoutSeed, getLayoutConfig]); // Re-run if layoutSeed or layout config changes

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
        const angle = (arcIndex / (others.length - 1) - 0.5) * Math.PI * 1.2;
        const radius = getLayoutConfig.REARRANGE_RADIUS + (Math.random() - 0.5);
        const x = Math.sin(angle) * radius;
        const y = (Math.cos(angle) * radius) / 3;
        const z = getLayoutConfig.REARRANGE_Z_POS + Math.cos(angle) * 3;

        newTargets[item.id] = {
          position: new THREE.Vector3(x, y, z),
          // Apply a scale modifier for rearranged videos (e.g., smaller on mobile)
          scale: DEFAULT_VIDEO_MASTER_SCALE.clone().multiplyScalar(getLayoutConfig.REARRANGED_VIDEO_SCALE_MODIFIER)
        };
      } else {
        // Default scattered layout
        newTargets[item.id] = {
          position: new THREE.Vector3(...item.initialPos),
          // Apply a scale modifier for non-focused videos (e.g., smaller on mobile)
          scale: DEFAULT_VIDEO_MASTER_SCALE.clone().multiplyScalar(getLayoutConfig.DEFAULT_VIDEO_MASTER_SCALE_MODIFIER)
        };
      }
    });
    return newTargets;
  }, [focusedIndex, mediaItems, isSceneFocused, getLayoutConfig, calculateFocusedScale]);

  // Handles click on a specific video item to toggle focus
  const handleItemClick = useCallback((index) => {
    if (onInteraction) onInteraction();
    setFocusedIndex(focusedIndex === index ? null : index);
  }, [focusedIndex, onInteraction]);

  // Handles click on the background plane to defocus
  const handleBackgroundClick = () => {
    if (focusedIndex !== null) {
      if (onInteraction) onInteraction();
      setFocusedIndex(null);
    }
  };

  useFrame(() => {
    // Decay scroll influence over time
    setScrollInfluence(prev => {
      const current = prev.clone();
      if (current.lengthSq() > 0.0001) { // Only decay if magnitude is above a small threshold
        return current.lerp(new THREE.Vector2(0, 0), SCROLL_DECAY_FACTOR);
      }
      return new THREE.Vector2(0,0);
    });

    // Collect live positions of video items for connection lines
    const newPositions = videoRefs.current.map(ref => ref.current ? ref.current.position : null).filter(Boolean);
    setLivePositions(newPositions);
  });

  return (
    <>
      {/* Invisible background plane to capture clicks for defocusing */}
      {/* Pushed further back and larger to ensure it's easily tappable/clickable */}
      <mesh onClick={handleBackgroundClick} position={[0, 0, -20]}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

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
            target={targets[item.id]} // The target position and scale
            isFocused={focusedIndex === index}
            isSceneFocused={isSceneFocused}
            onClick={() => handleItemClick(index)}
            videoDims={[item.width, item.height]}
            mousePosition={mousePosition}
            scrollInfluence={scrollInfluence}
            parallaxStrength={getLayoutConfig.PARALLAX_STRENGTH} // Pass calculated parallax strength
          />
        );
      })}

      <ConnectionLines positions={livePositions} threshold={16} />
    </>
  );
}