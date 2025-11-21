"use client";

import { Instance, Instances } from "@react-three/drei";

export function Silhouettes() {
    return (
        <group>
            {/* Telephone Poles - Left Side */}
            <Instances range={20}>
                <cylinderGeometry args={[0.1, 0.1, 8]} />
                <meshStandardMaterial color="#050505" />
                {Array.from({ length: 20 }).map((_, i) => (
                    <group key={`pole-left-${i}`} position={[-8, 4, -i * 15]}>
                        <Instance />
                        {/* Crossbar */}
                        <mesh position={[0, 3, 0]} rotation={[0, 0, Math.PI / 2]}>
                            <boxGeometry args={[0.15, 3, 0.15]} />
                            <meshStandardMaterial color="#050505" />
                        </mesh>
                    </group>
                ))}
            </Instances>

            {/* Telephone Poles - Right Side */}
            <Instances range={20}>
                <cylinderGeometry args={[0.1, 0.1, 8]} />
                <meshStandardMaterial color="#050505" />
                {Array.from({ length: 20 }).map((_, i) => (
                    <group key={`pole-right-${i}`} position={[8, 4, -i * 15]}>
                        <Instance />
                        <mesh position={[0, 3, 0]} rotation={[0, 0, Math.PI / 2]}>
                            <boxGeometry args={[0.15, 3, 0.15]} />
                            <meshStandardMaterial color="#050505" />
                        </mesh>
                    </group>
                ))}
            </Instances>

            {/* Distant Trees - Randomly placed at edges */}
            {Array.from({ length: 50 }).map((_, i) => {
                const x = (Math.random() > 0.5 ? 1 : -1) * (12 + Math.random() * 10);
                const z = -Math.random() * 200;
                const scale = 5 + Math.random() * 10;
                return (
                    <mesh key={`tree-${i}`} position={[x, scale / 2, z]}>
                        <planeGeometry args={[scale, scale]} />
                        <meshBasicMaterial color="#020202" transparent opacity={0.95} />
                    </mesh>
                );
            })}
        </group>
    );
}
