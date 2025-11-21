"use client";

import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CameraControllerProps {
    onTeleport?: (shouldTeleport: boolean) => void;
}

export function CameraController({ onTeleport }: CameraControllerProps) {
    const scroll = useScroll();

    useFrame((state) => {
        const offset = scroll.offset; // 0 to 1

        // Phase 1: Move down the road (0 - 0.5)
        // Phase 2: Zoom into portal (0.5 - 0.7)
        // Phase 3: Inside portal / transition (0.7 - 1.0)

        if (offset < 0.5) {
            // Moving down the road
            const targetZ = 5 - offset * 200;
            state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.1);
            state.camera.position.y = 1.6 + Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
            state.camera.position.x = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.05;
            state.camera.lookAt(0, 2, -200);
        } else if (offset < 0.7) {
            // Zooming into portal
            const portalProgress = (offset - 0.5) / 0.2; // 0 to 1
            const targetZ = -95 - portalProgress * 50;
            const targetY = 2 + portalProgress * 8;

            state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.15);
            state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.15);
            state.camera.lookAt(0, 10, -150);

            // Rotate camera slightly for dramatic effect
            state.camera.rotation.z = Math.sin(state.clock.getElapsedTime() * 3) * 0.02;
        } else {
            // Inside portal - trigger teleport
            onTeleport?.(true);

            // Extreme zoom and rotation
            const teleportProgress = (offset - 0.7) / 0.3;
            state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, -200, 0.2);
            state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 15, 0.2);
            state.camera.rotation.z = teleportProgress * Math.PI * 2;
        }
    });

    return null;
}
