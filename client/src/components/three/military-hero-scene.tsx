import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface MilitaryHeroSceneProps {
  className?: string;
}

export default function MilitaryHeroScene({ className = '' }: MilitaryHeroSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x8B7355, 0.01);
    scene.background = new THREE.Color(0x0A0A0A);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 15);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    mountRef.current.appendChild(renderer.domElement);
    
    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x4A90E2, 0.3);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xFFA500, 0.8);
    directionalLight.position.set(10, 20, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    scene.add(directionalLight);

    // Create terrain
    const terrainGeometry = new THREE.PlaneGeometry(200, 200, 128, 128);
    const positions = terrainGeometry.attributes.position.array as Float32Array;
    
    // Generate height map
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 1];
      const noise = 
        Math.sin(x * 0.01) * 3 + 
        Math.cos(z * 0.015) * 2 + 
        Math.random() * 0.5;
      positions[i + 2] = noise;
    }
    terrainGeometry.computeVertexNormals();
    
    const terrainMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B7355,
      roughness: 0.9,
      metalness: 0.1,
    });
    
    const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -5;
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Create dust particles
    const particleCount = 5000; // Reduced for performance
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 100;
      particlePositions[i3 + 1] = Math.random() * 20;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 100;
      
      particleVelocities[i3] = (Math.random() - 0.5) * 0.02;
      particleVelocities[i3 + 1] = Math.random() * 0.01;
      particleVelocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xD4A574,
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Create tactical vest (hero product)
    const vestGroup = new THREE.Group();
    
    // Main vest body
    const vestGeometry = new THREE.BoxGeometry(2, 3, 0.3);
    const vestMaterial = new THREE.MeshStandardMaterial({
      color: 0x2A2A2A,
      roughness: 0.8,
      metalness: 0.2,
    });
    const vestMesh = new THREE.Mesh(vestGeometry, vestMaterial);
    vestMesh.castShadow = true;
    vestMesh.receiveShadow = true;
    vestGroup.add(vestMesh);
    
    // Vest components
    const componentMaterial = new THREE.MeshStandardMaterial({
      color: 0x00FF41,
      roughness: 0.7,
      metalness: 0.3,
      emissive: 0x001100
    });
    
    const leftPouch = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.2), componentMaterial);
    leftPouch.position.set(-0.8, 0.5, 0);
    leftPouch.castShadow = true;
    vestGroup.add(leftPouch);
    
    const rightPouch = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.2), componentMaterial);
    rightPouch.position.set(0.8, 0.5, 0);
    rightPouch.castShadow = true;
    vestGroup.add(rightPouch);
    
    const beltGeometry = new THREE.BoxGeometry(1.8, 0.4, 0.25);
    const beltMaterial = new THREE.MeshStandardMaterial({
      color: 0x1A1A1A,
      roughness: 0.9,
      metalness: 0.1,
    });
    const belt = new THREE.Mesh(beltGeometry, beltMaterial);
    belt.position.set(0, -1.2, 0);
    belt.castShadow = true;
    vestGroup.add(belt);
    
    vestGroup.position.set(0, 2, 0);
    scene.add(vestGroup);

    // Create searchlights
    const createSearchlight = (position: [number, number, number]) => {
      const spotLight = new THREE.SpotLight(0x00FF41, 2, 100, 0.3, 0.5);
      spotLight.position.set(...position);
      spotLight.castShadow = true;
      spotLight.shadow.mapSize.width = 1024;
      spotLight.shadow.mapSize.height = 1024;
      
      // Create volumetric cone
      const coneGeometry = new THREE.ConeGeometry(8, 20, 8, 1, true);
      const coneMaterial = new THREE.MeshBasicMaterial({
        color: 0x00FF41,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      const cone = new THREE.Mesh(coneGeometry, coneMaterial);
      cone.position.copy(spotLight.position);
      cone.position.y -= 1;
      
      scene.add(spotLight);
      scene.add(cone);
      
      return { light: spotLight, cone };
    };
    
    const searchlights = [
      createSearchlight([20, 15, 10]),
      createSearchlight([-25, 18, -15]),
      createSearchlight([15, 20, -20])
    ];

    // Create military vehicles
    const createVehicle = (position: [number, number, number]) => {
      const vehicleGroup = new THREE.Group();
      
      const bodyGeometry = new THREE.BoxGeometry(4, 1, 2);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x4A5D23,
        roughness: 0.8,
        metalness: 0.2,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.5;
      body.castShadow = true;
      vehicleGroup.add(body);
      
      // Wheels
      const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3);
      const wheelMaterial = new THREE.MeshStandardMaterial({
        color: 0x1A1A1A,
        roughness: 0.9,
      });
      
      const wheelPositions = [
        [-1.5, -0.3, 1], [1.5, -0.3, 1],
        [-1.5, -0.3, -1], [1.5, -0.3, -1]
      ];
      
      wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos[0], pos[1], pos[2]);
        wheel.castShadow = true;
        vehicleGroup.add(wheel);
      });
      
      vehicleGroup.position.set(...position);
      scene.add(vehicleGroup);
      
      return vehicleGroup;
    };
    
    const vehicles = [
      createVehicle([-30, -4, 20]),
      createVehicle([35, -4, -25]),
      createVehicle([-20, -4, -30])
    ];

    // Animation loop
    const clock = new THREE.Clock();
    let time = 0;
    
    const animate = () => {
      const delta = clock.getDelta();
      time += delta;
      
      // Animate particles
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += particleVelocities[i3] + Math.sin(time + i) * 0.001;
        positions[i3 + 1] += particleVelocities[i3 + 1];
        positions[i3 + 2] += particleVelocities[i3 + 2];
        
        if (positions[i3 + 1] > 20) {
          positions[i3 + 1] = 0;
          positions[i3] = (Math.random() - 0.5) * 100;
          positions[i3 + 2] = (Math.random() - 0.5) * 100;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;
      
      // Animate vest with mouse parallax and floating
      vestGroup.rotation.y = mousePosition.x * 0.1;
      vestGroup.rotation.x = mousePosition.y * 0.05;
      vestGroup.position.y = 2 + Math.sin(time * 0.5) * 0.2;
      
      // Animate exploded view based on scroll
      const exploded = scrollProgress > 0.3;
      leftPouch.position.x = exploded ? -1.5 : -0.8;
      rightPouch.position.x = exploded ? 1.5 : 0.8;
      belt.position.y = exploded ? -2 : -1.2;
      
      // Animate searchlights
      searchlights.forEach((searchlight, index) => {
        const offset = index * Math.PI * 0.7;
        searchlight.light.angle = 0.3 + Math.sin(time * 0.5 + offset) * 0.1;
        
        const targetX = Math.sin(time * 0.3 + offset) * 20;
        const targetZ = Math.cos(time * 0.3 + offset) * 20;
        searchlight.light.target.position.set(targetX, -5, targetZ);
        searchlight.light.target.updateMatrixWorld();
        
        searchlight.cone.lookAt(targetX, -5, targetZ);
      });
      
      // Camera dolly based on scroll
      camera.position.z = 15 - scrollProgress * 10;
      camera.position.y = 5 - scrollProgress * 3;
      camera.lookAt(0, 0, 0);
      
      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    // Event handlers
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };
    
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / (window.innerHeight * 2), 1);
      setScrollProgress(progress);
    };
    
    const handleResize = () => {
      if (!camera || !renderer) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Cleanup Three.js resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();
    };
  }, [mousePosition.x, mousePosition.y, scrollProgress]);

  return (
    <div className={`relative w-full h-screen ${className}`}>
      <div ref={mountRef} className="absolute inset-0" />
      
      {/* Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="text-center z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 glitch-text" data-text="MISSION READY">
            MISSION READY
          </h1>
          <p className="text-xl text-steel-gray max-w-2xl mx-auto px-6">
            Professional-grade tactical equipment for military, law enforcement, and security professionals.
          </p>
          
          <motion.div 
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
          >
            <motion.button 
              className="bg-night-vision text-ops-black px-8 py-4 font-mono font-bold hover:bg-white transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/products'}
            >
              BROWSE EQUIPMENT
            </motion.button>
            <motion.button 
              className="hud-border px-8 py-4 text-night-vision font-mono hover:bg-night-vision hover:text-ops-black transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/products'}
            >
              VIEW CATALOG
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* HUD Elements */}
      <motion.div 
        className="absolute top-20 left-6 font-mono text-xs text-night-vision z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 2.5 }}
      >
        <div className="hud-border p-3 bg-ops-black bg-opacity-60">
          STATUS: OPERATIONAL<br/>
          SECURITY: CLASSIFIED<br/>
          USERS: 2,847 ACTIVE
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-20 right-6 font-mono text-xs text-night-vision z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 3 }}
      >
        <div className="hud-border p-3 bg-ops-black bg-opacity-60">
          LOCATION: SECURED<br/>
          CONNECTION: ENCRYPTED<br/>
          THREAT LEVEL: GREEN
        </div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-night-vision font-mono text-xs z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.5 }}
      >
        <div className="text-center animate-pulse">
          SCROLL TO EXPLORE<br/>
          ↓
        </div>
      </motion.div>
    </div>
  );
}