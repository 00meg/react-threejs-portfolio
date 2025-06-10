import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// This is the new, robust implementation of the text component.
function InfoText({ title, description, videoDims, visible }) {
  const [displayedText, setDisplayedText] = useState('');
  const materialRef = useRef();

  // Step 1: Create the canvas and texture only ONCE using useMemo with an empty dependency array.
  const { canvas, texture } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const texture = new THREE.CanvasTexture(canvas);
    return { canvas, texture };
  }, []);

  // Step 2: The typewriter effect logic remains the same. It just updates the text state.
  const fullText = useMemo(() => `${title}\n${description}`, [title, description]);

  useEffect(() => {
    let interval;
    if (visible) {
      let index = 0;
      setDisplayedText(''); // Reset on visible
      interval = setInterval(() => {
        if (index < fullText.length) {
          setDisplayedText(prev => prev + fullText[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 20);
    } else {
      setDisplayedText(''); // Clear when not visible
    }
    return () => clearInterval(interval);
  }, [visible, fullText]);

  // Step 3: Use a new useEffect to RE-DRAW on the EXISTING canvas whenever the text changes.
  useEffect(() => {
    const ctx = canvas.getContext('2d');
    
    // Drawing logic from the old useMemo block is moved here
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    const lines = displayedText.split('\n');
    const titleLine = lines[0] || '';
    const descriptionLines = lines.slice(1).join(' ');

    // --- Draw Title (Bold) ---
    ctx.font = '700 16px "Source Code Pro", monospace';
    ctx.fillText(titleLine, 10, 25);

    // --- Draw Description (Regular) ---
    ctx.font = '400 14px "Source Code Pro", monospace';
    
    const words = descriptionLines.split(' ');
    let line = '';
    let y = 50;
    const lineHeight = 18;
    const maxWidth = canvas.width - 20;

    for(const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && line.length > 0) {
        ctx.fillText(line, 10, y);
        line = word + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 10, y);

    // Tell Three.js that the texture needs to be updated
    texture.needsUpdate = true;

  }, [displayedText, canvas, texture]); // This effect runs only when the text changes

  // Animate the opacity
  useFrame(() => {
    if (materialRef.current) {
        const targetOpacity = visible ? 1 : 0;
        materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, 0.1);
    }
  });

  const textPlaneWidth = 4;
  const position = [
    (-videoDims[0] / 2) + (textPlaneWidth / 2),
    -(videoDims[1] / 2) - 0.7,
    0.1
  ];

  return (
    <mesh position={position}>
      <planeGeometry args={[textPlaneWidth, 1]} />
      {/* The material now uses the single texture created in the useMemo hook */}
      <meshBasicMaterial 
        ref={materialRef}
        map={texture} 
        transparent 
        opacity={0} 
        toneMapped={false} 
      />
    </mesh>
  );
}

export default React.memo(InfoText);