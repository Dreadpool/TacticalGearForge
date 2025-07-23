import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

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
        <div className="text-fde mb-2 font-hud font-semibold">TACTICAL EQUIPMENT STATUS</div>
        <div className="text-ranger-green">STATUS: OPERATIONAL</div>
        <div className="text-ranger-green">PROTECTION: LEVEL IIIA</div>
        <div className="text-ranger-green">WEIGHT: 2.3 KG</div>
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

    // Professional military lighting setup
    const directionalLight = new THREE.DirectionalLight(0xF5E6B3, 1.0); // Warm military base lighting
    directionalLight.position.set(12, 8, 6);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
    directionalLight.shadow.bias = -0.0005;
    scene.add(directionalLight);

    // Ambient lighting with authentic military color temperature
    const ambientLight = new THREE.AmbientLight(0x425439, 0.4); // Ranger green ambient
    scene.add(ambientLight);

    // Key fill light for tactical gear visibility
    const fillLight = new THREE.PointLight(0xC8A882, 0.6, 15); // FDE color
    fillLight.position.set(-8, 4, 8);
    scene.add(fillLight);

    // Rim light for gear definition
    const rimLight = new THREE.PointLight(0x4A4E54, 0.8, 12); // Wolf gray
    rimLight.position.set(8, 6, -4);
    scene.add(rimLight);

    // Create professional tactical vest with authentic textures
    const vestGroup = new THREE.Group();

    // Load authentic camouflage texture
    const textureLoader = new THREE.TextureLoader();
    
    // Create realistic military fabric material
    const createMilitaryFabricMaterial = (color: number) => {
      return new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.85,
        metalness: 0.05,
        normalScale: new THREE.Vector2(0.8, 0.8)
      });
    };

    // Main vest body with authentic olive drab
    const vestGeometry = new THREE.BoxGeometry(2.2, 3.0, 0.35);
    const vestMaterial = createMilitaryFabricMaterial(0x3C341F); // Authentic olive drab
    const vestMesh = new THREE.Mesh(vestGeometry, vestMaterial);
    vestMesh.castShadow = true;
    vestMesh.receiveShadow = true;
    vestGroup.add(vestMesh);

    // MOLLE webbing system with authentic ranger green
    const molleMaterial = createMilitaryFabricMaterial(0x425439); // Ranger green
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 4; col++) {
        const webbing = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 0.4, 0.025),
          molleMaterial
        );
        webbing.position.set(
          -0.7 + col * 0.47,
          0.8 - row * 0.4,
          0.19
        );
        webbing.castShadow = true;
        vestGroup.add(webbing);
      }
    }

    // Tactical pouches with coyote brown
    const pouchMaterial = createMilitaryFabricMaterial(0x81613C); // Coyote brown
    
    const leftPouch = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.7, 0.25),
      pouchMaterial
    );
    leftPouch.position.set(-1.2, 0.4, 0.15);
    leftPouch.castShadow = true;
    vestGroup.add(leftPouch);

    const rightPouch = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.7, 0.25),
      pouchMaterial
    );
    rightPouch.position.set(1.2, 0.4, 0.15);
    rightPouch.castShadow = true;
    vestGroup.add(rightPouch);

    // Tactical belt with authentic wolf gray hardware
    const beltMaterial = new THREE.MeshStandardMaterial({
      color: 0x4A4E54, // Wolf gray
      roughness: 0.4,
      metalness: 0.6
    });

    const belt = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.18, 0.06),
      beltMaterial
    );
    belt.position.set(0, -1.3, 0.05);
    belt.castShadow = true;
    vestGroup.add(belt);

    // Professional tactical helmet with authentic finish
    const helmetGeometry = new THREE.SphereGeometry(0.85, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.75);
    const helmetMaterial = createMilitaryFabricMaterial(0x3C341F); // Matching olive drab
    const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
    helmet.position.set(0, 2.7, 0);
    helmet.castShadow = true;
    helmet.receiveShadow = true;
    vestGroup.add(helmet);

    // NVG mount with wolf gray finish
    const nvgMountGeometry = new THREE.BoxGeometry(0.45, 0.12, 0.12);
    const nvgMountMaterial = new THREE.MeshStandardMaterial({
      color: 0x4A4E54, // Wolf gray
      roughness: 0.3,
      metalness: 0.8
    });
    const nvgMount = new THREE.Mesh(nvgMountGeometry, nvgMountMaterial);
    nvgMount.position.set(0, 2.8, 0.65);
    nvgMount.castShadow = true;
    vestGroup.add(nvgMount);

    vestGroup.position.set(0, 1.5, 0);
    scene.add(vestGroup);

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

      // Professional tactical vest animation
      vestGroup.rotation.y = mousePosition.x * 0.02 + time * 0.05;
      vestGroup.rotation.x = mousePosition.y * 0.015;
      vestGroup.position.y = 1.5 + Math.sin(time * 0.6) * 0.06;

      // Component separation on scroll (military inspection mode)
      const inspection = scrollProgress > 0.4;
      leftPouch.position.x = inspection ? -1.6 : -1.2;
      rightPouch.position.x = inspection ? 1.6 : 1.2;
      helmet.position.y = inspection ? 3.2 : 2.7;
      belt.position.y = inspection ? -1.7 : -1.3;

      // Camera positioning
      camera.position.z = 8 - scrollProgress * 1.5;
      camera.position.y = 2 + scrollProgress * 0.3;
      camera.lookAt(vestGroup.position);

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
      {/* Professional Military Base Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: 'contrast(1.1) brightness(0.6) saturate(0.7) sepia(0.15)',
        }}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/attached_assets/videos/military-training.mp4" type="video/mp4" />
        <source src="/attached_assets/videos/military-fallback.mp4" type="video/mp4" />
      </video>

      {/* Professional military vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 35%, rgba(60, 52, 31, 0.8) 100%)'
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
            TACTICAL ELITE
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-10 font-hud font-medium tracking-wide"
            style={{ color: 'var(--color-ranger-green)' }}
          >
            PROFESSIONAL GRADE MILITARY EQUIPMENT
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