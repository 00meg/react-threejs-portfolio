import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import VideoItem from './VideoItem'; // VideoItem will now contain InfoText
import ConnectionLines from './ConnectionLines';
import Logo from './Logo';
import { mediaData } from '../mediaData';

// Positions and scales for focused video (adapt as needed for desired visual)
const FOCUSED_POSITION_DESKTOP = new THREE.Vector3(0, 0, 8); // Closer for desktop
const FOCUSED_POSITION_MOBILE = new THREE.Vector3(0, 0, 12); // Further for mobile, to make room for text

const LAYOUT_CONFIG = {
  SCATTER_RADIUS: 280,
  REARRANGE_RADIUS: 9,
  REARRANGE_Z_POS: -2,
  SCATTER_RADIUS_MOBILE: 8,
  REARRANGE_RADIUS_MOBILE: 6,
  REARRANGE_Z_POS_MOBILE: -1,
};

const DEFAULT_VIDEO_SCALE = new THREE.Vector3(1.1, 1.1, 1.1);

export default function VideoScene({ layoutSeed, onVideoFocusStateChange }) { // Removed focusedVideoIndex prop
  // VideoScene manages its own focusedIndex internally
  const [focusedIndex, setFocusedIndex] = useState(null);
  const videoRefs = useRef([]);
  const [livePositions, setLivePositions] = useState([]);
  const { viewport } = useThree();

  const isSceneFocused = focusedIndex !== null;

  // Notify App.js when the focusedIndex changes for the blur effect
  useEffect(() => {
    onVideoFocusStateChange(isSceneFocused);
  }, [isSceneFocused, onVideoFocusStateChange]);

  // Determine layout configuration based on viewport width
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

  // Calculate focused video scale dynamically
  const calculateFocusedScale = useCallback((videoWidth, videoHeight) => {
    if (!videoWidth || !videoHeight) {
      // Fallback if dimensions are missing, use a default proportional scale
      return new THREE.Vector3(1.8, 1.8, 1.8); // Adjust this default if needed
    }

    const videoAspectRatio = videoWidth / videoHeight;
    const viewportAspectRatio = viewport.width / viewport.height;

    const fovRad = THREE.MathUtils.degToRad(45); // Assuming default FOV of 45 for PerspectiveCamera
    const distanceZ = getLayoutConfig.FOCUSED_POSITION.z;
    const visibleHeight = 2 * Math.tan(fovRad / 2) * distanceZ;
    const visibleWidth = visibleHeight * viewportAspectRatio;

    let scaleFactor;
    if (videoAspectRatio > viewportAspectRatio) {
      // Video is wider than viewport, scale to fit width
      scaleFactor = (visibleWidth / videoWidth) * 0.9; // 90% of visible width to leave some margin
    } else {
      // Video is taller than viewport, scale to fit height
      scaleFactor = (visibleHeight / videoHeight) * 0.9; // 90% of visible height to leave some margin
    }

    return new THREE.Vector3(scaleFactor, scaleFactor, scaleFactor);
  }, [viewport.width, viewport.height, getLayoutConfig.FOCUSED_POSITION.z]);


  const mediaItems = useMemo(() => {
    const numPoints = mediaData.length;
    const phi = Math.PI * (3 - Math.sqrt(5));

    return mediaData.map((item, i) => {
      const y = 1 - (i / (numPoints - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i + layoutSeed;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const finalPos = new THREE.Vector3(x, y * 0.8, z).multiplyScalar(getLayoutConfig.SCATTER_RADIUS);

      return { ...item, initialPos: [finalPos.x, finalPos.y, finalPos.z] };
    });
  }, [layoutSeed, getLayoutConfig]);

  const targets = useMemo(() => {
    const newTargets = {};
    mediaItems.forEach((item, index) => {
      if (index === focusedIndex) {
        // Use video's intrinsic dimensions for accurate scaling
        const focusedScale = calculateFocusedScale(item.width, item.height);
        newTargets[item.id] = { position: getLayoutConfig.FOCUSED_POSITION, scale: focusedScale };
      } else if (isSceneFocused) {
        // Rearrange other videos when one is focused
        const others = mediaItems.filter((_, i) => i !== focusedIndex);
        const arcIndex = others.findIndex(other => other.id === item.id);
        const angle = (arcIndex / (others.length - 1) - 0.5) * Math.PI * 1.2; // Adjust angle for arc
        const radius = getLayoutConfig.REARRANGE_RADIUS + (Math.random() - 0.5);
        const x = Math.sin(angle) * radius;
        const y = (Math.cos(angle) * radius) / 3;
        const z = getLayoutConfig.REARRANGE_Z_POS + Math.cos(angle) * 3;
        newTargets[item.id] = { position: new THREE.Vector3(x, y, z), scale: DEFAULT_VIDEO_SCALE };
      } else {
        // Default scattered layout
        newTargets[item.id] = { position: new THREE.Vector3(...item.initialPos), scale: DEFAULT_VIDEO_SCALE };
      }
    });
    return newTargets;
  }, [focusedIndex, mediaItems, isSceneFocused, getLayoutConfig, calculateFocusedScale]);

  // Handle click on a specific video item
  const handleItemClick = useCallback((index) => {
    setFocusedIndex(index); // Set internal focusedIndex
  }, []);

  // Handle click on the background plane
  const handleBackgroundClick = () => {
    if (focusedIndex !== null) {
      setFocusedIndex(null); // Defocus the video if one is focused
    }
  };

  useFrame(() => {
    const newPositions = videoRefs.current.map(ref => ref.current ? ref.current.position : null).filter(Boolean);
    setLivePositions(newPositions);
  });

  return (
    <>
      {/* Background plane to capture clicks for defocusing */}
      <mesh onClick={handleBackgroundClick} position={[0, 0, -10]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <Logo />

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
            isFocused={focusedIndex === index} // Pass internal focused state
            isSceneFocused={isSceneFocused} // Pass scene-wide focused state
            // The onClick below handles both focusing and de-focusing.
            // If it's already focused, clicking it again will defocus it.
            onClick={() => handleItemClick(focusedIndex === index ? null : index)}
            // Pass video dimensions for InfoText positioning
            videoDims={[item.width, item.height]}
          />
        );
      })}

      <ConnectionLines positions={livePositions} threshold={16} />
    </>
  );
}