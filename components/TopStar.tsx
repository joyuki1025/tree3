
import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { lerp } from '../utils/math';

interface TopStarProps {
  mixFactor: number;
  scale?: number;
}

const TopStar: React.FC<TopStarProps> = ({ mixFactor, scale = 11 }) => {
  const groupRef = useRef<THREE.Group>(null);
  const currentMixRef = useRef(1);
  
  // Load GLB Model
  const { scene } = useGLTF('/models/Star.glb');
  const clone = useMemo(() => scene.clone(), [scene]);

  // Apply Gold Material to match previous aesthetic
  useEffect(() => {
      clone.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
              const mesh = obj as THREE.Mesh;
              mesh.material = new THREE.MeshStandardMaterial({
                    color: "#FFD700", 
                    emissive: "#FFD700",
                    emissiveIntensity: 2.0, // High intensity glow
                    roughness: 0.1,
                    metalness: 0.9,
                    toneMapped: false 
              });
              mesh.castShadow = false;
          }
      })
  }, [clone]);

  useFrame((state, delta) => {
      if (!groupRef.current) return;

      const speed = 2.0 * delta;
      currentMixRef.current = lerp(currentMixRef.current, mixFactor, speed);
      const t = currentMixRef.current;

      // 1. Position Logic
      // Formed: Top of tree (y=9.2)
      // Chaos: Floating upwards (y=13)
      const targetY = 9.2;
      const chaosY = 13.0;
      const currentY = lerp(chaosY, targetY, t);
      
      groupRef.current.position.set(0, currentY, 0);

      // 2. Rotation Logic
      // Always slowly spin the model itself
      clone.rotation.y += delta * 0.5;
      
      // Apply chaos tilt to the main group
      if (t < 0.9) {
          const chaosTilt = (1 - t) * 0.5;
          groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * chaosTilt;
          groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.8) * chaosTilt;
      } else {
          groupRef.current.rotation.z = lerp(groupRef.current.rotation.z, 0, speed);
          groupRef.current.rotation.x = lerp(groupRef.current.rotation.x, 0, speed);
      }
  });

  return (
    <group ref={groupRef}>
        <primitive object={clone} scale={scale} />
        
        {/* Inner Light Source - Remains stable in scale */}
        <pointLight 
            color="#ffeebf" 
            intensity={3.0} 
            distance={15} 
            decay={2} 
        />
    </group>
  );
};

export default TopStar;
