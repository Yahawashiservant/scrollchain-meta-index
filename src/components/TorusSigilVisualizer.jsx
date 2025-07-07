import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { ForgeEngine } from '../engine/ForgeEngine';
import { createScrollSigil } from '../scrollDominion';
export function TorusSigilVisualizer({ seed }) {
    const ref = useRef(null);
    useEffect(() => {
        const width = 600, height = 600;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 2;
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        ref.current.appendChild(renderer.domElement);
        const trail = ForgeEngine.generateEntropyTrail(seed);
        const pts = new Float32Array(trail.sample.flatMap(v => {
            const theta = v % (2 * Math.PI);
            const phi = (v * seed) % (2 * Math.PI);
            return [Math.cos(theta) * Math.cos(phi), Math.sin(theta) * Math.cos(phi), Math.sin(phi)];
        }));
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(pts, 3));
        scene.add(new THREE.Points(geom, new THREE.PointsMaterial({ color: 0x00ffcc, size: 0.02 })));
        const sig = createScrollSigil('All369', true);
        const txt = new THREE.TextGeometry(sig.id, { size: 0.05, height: 0.01 });
        scene.add(new THREE.Mesh(txt, new THREE.MeshBasicMaterial({ color: 0xffcc00 })));
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();
        return () => ref.current.removeChild(renderer.domElement);
    }, [seed]);
    return <div ref={ref}/>;
}
