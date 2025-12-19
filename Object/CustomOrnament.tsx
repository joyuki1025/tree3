
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { lerp } from '../utils/math';

interface OrnamentData {
  chaosPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  rotation: THREE.Euler;
  color: THREE.Color;
  targetScale: THREE.Vector3;
  chaosScale: THREE.Vector3;
  chaosTilt: number;
}

interface CustomOrnamentProps {
  item: OrnamentData;
  mixFactor: number;
}

const BALL_MODEL_PATH = `${import.meta.env.BASE_URL}models/ball.glb`;

const CustomOrnament: React.FC<CustomOrnamentProps> = ({ item, mixFactor }) => {
  const groupRef = useRef<THREE.Group>(null);
  const currentMixRef = useRef(1);
  
  const vecPos = useMemo(() => new THREE.Vector3(), []);
  const vecScale = useMemo(() => new THREE.Vector3(), []);

  // Load the external GLB model
  // Note: Path corresponds to public/models/ball.glb
  const { scene } = useGLTF(BALL_MODEL_PATH);
  
  // Clone the scene so each ornament instance is unique
  const clone = useMemo(() => scene.clone(), [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const speed = 2.0 * delta;
    currentMixRef.current = lerp(currentMixRef.current, mixFactor, speed);
    const t = currentMixRef.current;
    
    // Position Interpolation
    vecPos.lerpVectors(item.chaosPos, item.targetPos, t);
    groupRef.current.position.copy(vecPos);
    
    // Scale Interpolation
    vecScale.lerpVectors(item.chaosScale, item.targetScale, t);
    groupRef.current.scale.copy(vecScale);
    
    // Rotation Interpolation
    groupRef.current.rotation.copy(item.rotation);
    
    // Extra rotation in chaos mode
    if (t < 0.5) {
         groupRef.current.rotation.x += delta * 0.5;
         groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={clone} />
    </group>
  );
};

export default CustomOrnament;
