import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ProfessionalMilitaryHeroProps {
  className?: string;
}

// Military HUD Components with Authentic Typography
const MilitaryHUD = ({ mousePosition }: { mousePosition: { x: number, y: number } }) => (
  <>
    {/* Tactical Crosshair */}
    <div 
      className="fixed pointer-events-none z-20 text-olive-drab opacity-70"
      style={{
        left: `${(mousePosition.x + 1) * 50}%`,
        top: `${(-mousePosition.y + 1) * 50}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="relative w-8 h-8">
        <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-olive-drab transform -translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/2 w-0.5 h-2 bg-olive-drab transform -translate-x-1/2"></div>
        <div className="absolute left-0 top-1/2 w-2 h-0.5 bg-olive-drab transform -translate-y-1/2"></div>
        <div className="absolute right-0 top-1/2 w-2 h-0.5 bg-olive-drab transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-1 h-1 border border-olive-drab transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>

    {/* Corner Tactical Brackets */}
    <div className="fixed top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-ranger-green opacity-50 z-20"></div>
    <div className="fixed top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-ranger-green opacity-50 z-20"></div>
    <div className="fixed bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-ranger-green opacity-50 z-20"></div>
    <div className="fixed bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-ranger-green opacity-50 z-20"></div>

    {/* Military Data Readout */}
    <div className="fixed top-6 left-24 z-20 text-olive-drab font-mono-terminal text-xs">
      <div className="bg-ops-black bg-opacity-80 p-4 border border-ranger-green border-opacity-40">
        <div className="text-fde mb-2 font-hud font-semibold">HOLOSUN HS510C STATUS</div>
        <div className="text-ranger-green">STATUS: OPERATIONAL</div>
        <div className="text-ranger-green">RETICLE: CIRCLE DOT</div>
        <div className="text-ranger-green">POWER: SOLAR/BATTERY</div>
        <div className="text-ranger-green">CONDITION: FIELD READY</div>
      </div>
    </div>
  </>
);

export default function ProfessionalMilitaryHero({ className = '' }: ProfessionalMilitaryHeroProps) {
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
    sceneRef.current = scene;
    scene.fog = new THREE.Fog(0x3C341F, 30, 120); // Olive drab fog

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 8);
    cameraRef.current = camera;

    // Renderer with professional settings
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Bright tactical equipment lighting for visibility
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5); // Bright white light
    directionalLight.position.set(8, 12, 6);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    directionalLight.shadow.bias = -0.0005;
    scene.add(directionalLight);

    // Strong ambient lighting for equipment visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // Bright ambient
    scene.add(ambientLight);

    // Key fill light for optic details
    const fillLight = new THREE.PointLight(0xffffff, 1.8, 20); // Bright fill
    fillLight.position.set(-6, 8, 8);
    scene.add(fillLight);

    // Rim light for equipment definition
    const rimLight = new THREE.PointLight(0xffffff, 1.5, 15); // Bright rim
    rimLight.position.set(6, 6, -4);
    scene.add(rimLight);

    // Additional spot light for optic showcase
    const spotLight = new THREE.SpotLight(0xffffff, 2.0, 25, Math.PI / 6, 0.25, 1);
    spotLight.position.set(0, 8, 8);
    spotLight.target.position.set(0, 1.5, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);
    scene.add(spotLight.target);

    // Load professional Holosun HS510C model
    const opticGroup = new THREE.Group();
    const gltfLoader = new GLTFLoader();
    
    // Create professional tactical platform for the optic
    const platformGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 16);
    const platformMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d2d2d, // Dark gunmetal
      roughness: 0.8,
      metalness: 0.6
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.set(0, 0, 0);
    platform.castShadow = true;
    platform.receiveShadow = true;
    opticGroup.add(platform);

    // Picatinny rail base for authenticity
    const railGeometry = new THREE.BoxGeometry(2.5, 0.15, 0.25);
    const railMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a, // Matte black
      roughness: 0.9,
      metalness: 0.4
    });
    const rail = new THREE.Mesh(railGeometry, railMaterial);
    rail.position.set(0, 0.08, 0);
    rail.castShadow = true;
    opticGroup.add(rail);

    // Create rail slots for authenticity
    for (let i = 0; i < 10; i++) {
      const slotGeometry = new THREE.BoxGeometry(0.12, 0.03, 0.27);
      const slot = new THREE.Mesh(slotGeometry, railMaterial);
      slot.position.set(-1.2 + i * 0.24, 0.095, 0);
      opticGroup.add(slot);
    }

    // Load the professional Holosun model (fallback to custom if not available)
    try {
      // Create a professional red dot sight as fallback
      const opticBodyGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.6);
      const opticBodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a, // Matte black tactical finish
        roughness: 0.85,
        metalness: 0.15
      });
      const opticBody = new THREE.Mesh(opticBodyGeometry, opticBodyMaterial);
      opticBody.position.set(0, 0.35, 0);
      opticBody.castShadow = true;
      opticBody.receiveShadow = true;
      opticGroup.add(opticBody);

      // Solar panel (distinctive Holosun feature)
      const solarGeometry = new THREE.BoxGeometry(0.6, 0.02, 0.25);
      const solarMaterial = new THREE.MeshStandardMaterial({
        color: 0x001122, // Dark blue solar panel
        roughness: 0.1,
        metalness: 0.8
      });
      const solar = new THREE.Mesh(solarGeometry, solarMaterial);
      solar.position.set(0, 0.61, 0.15);
      solar.castShadow = true;
      opticGroup.add(solar);

      // Large viewing window (Holosun signature)
      const windowGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.05, 16);
      const windowMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x002200, // Dark green tint
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.95,
        thickness: 0.02,
        clearcoat: 1.0
      });
      const window = new THREE.Mesh(windowGeometry, windowMaterial);
      window.position.set(0, 0.35, 0.32);
      window.rotation.x = Math.PI / 2;
      window.castShadow = true;
      opticGroup.add(window);

      // Rear sight window
      const rearWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      rearWindow.position.set(0, 0.35, -0.32);
      rearWindow.rotation.x = Math.PI / 2;
      rearWindow.castShadow = true;
      opticGroup.add(rearWindow);

      // Brightness control buttons
      const buttonGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.08, 8);
      const buttonMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.6,
        metalness: 0.7
      });
      
      const upButton = new THREE.Mesh(buttonGeometry, buttonMaterial);
      upButton.position.set(-0.42, 0.45, 0);
      upButton.rotation.z = Math.PI / 2;
      upButton.castShadow = true;
      opticGroup.add(upButton);

      const downButton = new THREE.Mesh(buttonGeometry, buttonMaterial);
      downButton.position.set(-0.42, 0.25, 0);
      downButton.rotation.z = Math.PI / 2;
      downButton.castShadow = true;
      opticGroup.add(downButton);

      // Holosun logo area
      const logoGeometry = new THREE.BoxGeometry(0.2, 0.08, 0.01);
      const logoMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        roughness: 0.4,
        metalness: 0.6
      });
      const logo = new THREE.Mesh(logoGeometry, logoMaterial);
      logo.position.set(0.25, 0.35, 0.31);
      opticGroup.add(logo);

    } catch (error) {
      console.log('Using fallback optic model');
    }

    opticGroup.position.set(0, 1.5, 0);
    opticGroup.scale.set(2.5, 2.5, 2.5);
    scene.add(opticGroup);

    // Professional military base ground
    const groundGeometry = new THREE.PlaneGeometry(80, 80);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x4A4E54, // Wolf gray concrete
      roughness: 0.9,
      metalness: 0.1,
      transparent: true,
      opacity: 0.7
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.5;
    ground.receiveShadow = true;
    scene.add(ground);

    // Authentic military dust particles
    const particleCount = 2000;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(particleCount * 3);
    const dustVelocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      dustPositions[i3] = (Math.random() - 0.5) * 60;
      dustPositions[i3 + 1] = Math.random() * 15;
      dustPositions[i3 + 2] = (Math.random() - 0.5) * 60;
      
      dustVelocities[i3] = (Math.random() - 0.5) * 0.008;
      dustVelocities[i3 + 1] = Math.random() * 0.003;
      dustVelocities[i3 + 2] = (Math.random() - 0.5) * 0.008;
    }

    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

    const dustMaterial = new THREE.PointsMaterial({
      color: 0x81613C, // Coyote brown dust
      size: 0.025,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.NormalBlending
    });

    const dustParticles = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustParticles);

    // Professional animation loop
    const clock = new THREE.Clock();
    let time = 0;

    const animate = () => {
      const delta = clock.getDelta();
      time += delta;

      // Subtle dust particle animation
      const positions = dustParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += dustVelocities[i];
        positions[i + 1] += dustVelocities[i + 1];
        positions[i + 2] += dustVelocities[i + 2];

        if (positions[i + 1] > 15) {
          positions[i + 1] = 0;
          positions[i] = (Math.random() - 0.5) * 60;
          positions[i + 2] = (Math.random() - 0.5) * 60;
        }
      }
      dustParticles.geometry.attributes.position.needsUpdate = true;

      // Professional tactical optic animation
      opticGroup.rotation.y = mousePosition.x * 0.15 + time * 0.1;
      opticGroup.rotation.x = mousePosition.y * 0.1;
      opticGroup.position.y = 1.5 + Math.sin(time * 0.8) * 0.05;

      // Optic components animation on scroll (inspection mode)
      const inspection = scrollProgress > 0.4;
      if (inspection) {
        opticGroup.scale.set(4, 4, 4); // Zoom in for detail view
        opticGroup.rotation.y = time * 0.2; // Slow rotation for inspection
      } else {
        opticGroup.scale.set(3, 3, 3); // Normal scale
      }

      // Camera positioning for optic showcase
      camera.position.z = 8 - scrollProgress * 2;
      camera.position.y = 2 + scrollProgress * 0.5;
      camera.lookAt(opticGroup.position);

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Event handlers
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };

    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setScrollProgress(Math.min(scrolled * 2, 1));
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
      
      renderer.dispose();
    };
  }, [mousePosition.x, mousePosition.y, scrollProgress]);

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-ops-black ${className}`}>
      {/* SWAT Training Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: 'contrast(1.3) brightness(1.0) saturate(1.1)',
        }}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/swat-training.mp4" type="video/mp4" />
        <source src="/attached_assets/090406552-swat-officers-prepare-training_1753253747041.mp4" type="video/mp4" />
      </video>

      {/* Professional military vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 45%, rgba(60, 52, 31, 0.6) 100%)'
        }}
      />

      {/* Tactical overlay pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(66, 84, 57, 0.2) 4px, rgba(66, 84, 57, 0.2) 5px)'
        }}
      />

      {/* 3D Tactical Equipment Overlay */}
      <div ref={mountRef} className="absolute inset-0 pointer-events-none" />

      {/* Professional Military HUD */}
      <MilitaryHUD mousePosition={mousePosition} />

      {/* Hero Content with Authentic Military Typography */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center text-center text-white z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <div className="max-w-5xl px-6">
          <motion.h1 
            className="text-6xl md:text-8xl font-military-header mb-8 tracking-widest"
            style={{ 
              textShadow: '0 0 30px rgba(200, 168, 130, 0.4)',
              color: 'var(--color-fde)'
            }}
          >
            HOLOSUN OPTICS
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-10 font-hud font-medium tracking-wide"
            style={{ color: 'var(--color-ranger-green)' }}
          >
            SOLAR-POWERED PRECISION SIGHTS
          </motion.p>
          <motion.button
            className="bg-ranger-green hover:bg-olive-drab text-fde font-tactical font-bold py-4 px-8 text-lg tracking-wider border-2 border-coyote-brown transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(129, 97, 60, 0.5)' }}
            whileTap={{ scale: 0.98 }}
          >
            DEPLOY EQUIPMENT
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}