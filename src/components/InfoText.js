// src/components/InfoText.js

import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// This is the new, robust implementation of the text component.
function InfoText({ title, description, videoDims, visible }) {
  const [displayedText, setDisplayedText] = useState('');
  const materialRef = useRef();

  const { canvas, texture } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const texture = new THREE.CanvasTexture(canvas);
    return { canvas, texture };
  }, []);

  const fullText = useMemo(() => `${title}\n${description}`, [title, description]);

  // --- THIS IS THE CORRECTED EFFECT ---
  useEffect(() => {
    let interval;
    if (visible) {
      // Start with an empty string and a starting index of 0.
      let index = 0;
      setDisplayedText('');

      interval = setInterval(() => {
        // Increment the index first.
        index++;
        
        // Always calculate the substring from the original fullText.
        // This is robust and prevents scrambling if React skips a frame.
        setDisplayedText(fullText.substring(0, index));

        // If the index has reached the end of the text, stop the interval.
        if (index >= fullText.length) {
          clearInterval(interval);
        }
      }, 20); // The interval time remains the same.

    } else {
      // If not visible, clear the text immediately.
      setDisplayedText('');
    }

    // The cleanup function is crucial to prevent memory leaks.
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [visible, fullText]); // Dependencies are correct.


  // The rest of your component code remains exactly the same.
  // The drawing effect, the opacity animation, and the return statement
  // are all correct and do not need to be changed.

  useEffect(() => {
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    const lines = displayedText.split('\n');
    const titleLine = lines[0] || '';
    const descriptionLines = lines.slice(1).join(' ');

    ctx.font = '700 16px "Source Code Pro", monospace';
    ctx.fillText(titleLine, 10, 25);

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

    texture.needsUpdate = true;

  }, [displayedText, canvas, texture]);

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