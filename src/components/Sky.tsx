"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function Sky() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Slow rotation for the "swirling" effect
            meshRef.current.rotation.z += 0.0005;
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, -150]} scale={[100, 100, 100]}>
            <sphereGeometry args={[1, 32, 32]} />
            {/* 
                Simple gradient shader material or just a basic material for now.
                To get the "Red Storm" look, we really want a custom shader or a noisy texture.
                For this MVP step, we'll use a basic material with a red color and some emissive glow.
            */}
            <meshBasicMaterial
                color="#000000"
                side={THREE.BackSide}
            />
            {/* We can add a second inner sphere for the "Portal" glow */}
            <mesh position={[0, 10, -50]} scale={[0.5, 0.5, 0.5]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial color="#E50914" transparent opacity={0.1} side={THREE.BackSide} />
            </mesh>
        </mesh>
    );
}
