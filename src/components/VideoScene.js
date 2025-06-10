import React, { useRef, useState, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber'; // Import useThree
import * as THREE from 'three';
import VideoItem from './VideoItem';
import ConnectionLines from './ConnectionLines';
import Logo from './Logo';
import { mediaData } from '../mediaData';

const FOCUSED_POSITION = new THREE.Vector3(0, 0, 8);
const FOCUSED_SCALE = new THREE.Vector3(1.5, 1.5, 1.5);

const LAYOUT_CONFIG = {
  SCATTER_RADIUS: 9,
  REARRANGE_RADIUS: 9,
  REARRANGE_Z_POS: -2,
  // Add mobile-specific adjustments
  SCATTER_RADIUS_MOBILE: 6, // Smaller radius for mobile
  REARRANGE_RADIUS_MOBILE: 6,
  REARRANGE_Z_POS_MOBILE: -1,
};

export default function VideoScene() {
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [layoutSeed, setLayoutSeed] = useState(0);
  const videoRefs = useRef([]);
  const [livePositions, setLivePositions] = useState([]);
  const { viewport } = useThree(); // Get viewport dimensions

  const isSceneFocused = focusedIndex !== null;

  const getLayoutConfig = useMemo(() => {
    // Adjust layout config based on viewport width
    if (viewport.width < 768) { // Assuming 768px as a common mobile breakpoint
      return {
        SCATTER_RADIUS: LAYOUT_CONFIG.SCATTER_RADIUS_MOBILE,
        REARRANGE_RADIUS: LAYOUT_CONFIG.REARRANGE_RADIUS_MOBILE,
        REARRANGE_Z_POS: LAYOUT_CONFIG.REARRANGE_Z_POS_MOBILE,
      };
    }
    return LAYOUT_CONFIG;
  }, [viewport.width]);

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
        newTargets[item.id] = { position: FOCUSED_POSITION, scale: FOCUSED_SCALE };
      } else if (isSceneFocused) {
        const others = mediaItems.filter((_, i) => i !== focusedIndex);
        const arcIndex = others.findIndex(other => other.id === item.id);
        const angle = (arcIndex / (others.length - 1) - 0.5) * Math.PI * 1.2;
        const radius = getLayoutConfig.REARRANGE_RADIUS + (Math.random() - 0.5);
        const x = Math.sin(angle) * radius;
        const y = (Math.cos(angle) * radius) / 3;
        const z = getLayoutConfig.REARRANGE_Z_POS + Math.cos(angle) * 3;
        newTargets[item.id] = { position: new THREE.Vector3(x, y, z), scale: new THREE.Vector3(1, 1, 1) };
      } else {
        newTargets[item.id] = { position: new THREE.Vector3(...item.initialPos), scale: new THREE.Vector3(1, 1, 1) };
      }
    });
    return newTargets;
  }, [focusedIndex, mediaItems, isSceneFocused, getLayoutConfig]);

  const handleItemClick = useCallback((index) => setFocusedIndex(index), []);

  const handleBackgroundClick = () => {
    setFocusedIndex(null);
    setLayoutSeed(s => s + Math.random() * 0.1 + 0.1); 
  };

  useFrame(() => {
    const newPositions = videoRefs.current.map(ref => ref.current ? ref.current.position : null).filter(Boolean);
    setLivePositions(newPositions);
  });

  return (
    <>
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
            isFocused={focusedIndex === index}
            isSceneFocused={isSceneFocused}
            onClick={() => handleItemClick(index)}
          />
        );
      })}
      
      <ConnectionLines positions={livePositions} threshold={16} />
    </>
  );
}