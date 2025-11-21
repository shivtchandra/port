"use client";

import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function Road() {
    // Procedural asphalt material
    return (
        <group>
            {/* Main Road Surface */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -100]} receiveShadow>
                <planeGeometry args={[10, 400]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    roughness={0.8}
                    metalness={0.2}
                />
            </mesh>

            {/* Road Markings (Center Lines) */}
            {Array.from({ length: 40 }).map((_, i) => (
                <mesh
                    key={i}
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, 0.01, -i * 10 + 5]}
                >
                    <planeGeometry args={[0.15, 3]} />
                    <meshBasicMaterial color="#aa8800" opacity={0.4} transparent />
                </mesh>
            ))}

            {/* Side Lines */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4.8, 0.01, -100]}>
                <planeGeometry args={[0.2, 400]} />
                <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4.8, 0.01, -100]}>
                <planeGeometry args={[0.2, 400]} />
                <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
            </mesh>
        </group>
    );
}
