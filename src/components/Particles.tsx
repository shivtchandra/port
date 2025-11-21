"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Particles() {
    const count = 500;
    const mesh = useRef<THREE.InstancedMesh>(null);
    const dummy = new THREE.Object3D();

    // Initial positions
    const particles = useRef(new Array(count).fill(0).map(() => ({
        position: new THREE.Vector3(
            (Math.random() - 0.5) * 40,
            Math.random() * 20,
            -Math.random() * 100
        ),
        velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02
        )
    })));

    useFrame(() => {
        if (!mesh.current) return;

        particles.current.forEach((particle, i) => {
            particle.position.add(particle.velocity);

            // Reset if out of bounds
            if (Math.abs(particle.position.x) > 20) particle.position.x *= -1;
            if (particle.position.y > 20 || particle.position.y < 0) particle.position.y = Math.random() * 20;
            if (particle.position.z > 5) particle.position.z = -100;

            dummy.position.copy(particle.position);
            dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
            dummy.updateMatrix();
            mesh.current!.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.05, 0]} />
            <meshBasicMaterial color="#E3E3E3" transparent opacity={0.6} />
        </instancedMesh>
    );
}
