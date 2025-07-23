import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface RealisticMilitaryHeroProps {
  className?: string;
}

// Simple dust particle system for realism
const createDustParticles = (scene: THREE.Scene) => {
  const particleCount = 2000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // Distribute in realistic space around scene
    positions[i3] = (Math.random() - 0.5) * 60;
    positions[i3 + 1] = Math.random() * 15;
    positions[i3 + 2] = (Math.random() - 0.5) * 60;
    
    // Subtle movement velocities
    velocities[i3] = (Math.random() - 0.5) * 0.01;
    velocities[i3 + 1] = Math.random() * 0.005;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
    
    sizes[i] = Math.random() * 2 + 0.5;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    color: 0x8B7355, // Realistic dust color
    size: 0.02,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.3,
    blending: THREE.NormalBlending
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  return { particles, velocities };
};

// Create realistic military fabric texture
const createMilitaryFabricTexture = (color: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Base color
    ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    ctx.fillRect(0, 0, 512, 512);
    
    // Create realistic fabric weave pattern
    const imageData = ctx.createImageData(512, 512);
    const data = imageData.data;
    
    for (let x = 0; x < 512; x++) {
      for (let y = 0; y < 512; y++) {
        const i = (y * 512 + x) * 4;
        
        // Create fabric weave pattern
        const weaveX = Math.sin(x * 0.3) * 0.1;
        const weaveY = Math.sin(y * 0.3) * 0.1;
        const weave = (weaveX + weaveY + 1) * 0.5;
        
        // Add random noise for fabric texture
        const noise = (Math.random() - 0.5) * 0.2;
        const variation = weave + noise;
        
        const r = ((color >> 16) & 255) * (0.8 + variation * 0.4);
        const g = ((color >> 8) & 255) * (0.8 + variation * 0.4);
        const b = (color & 255) * (0.8 + variation * 0.4);
        
        data[i] = Math.max(0, Math.min(255, r));
        data[i + 1] = Math.max(0, Math.min(255, g));
        data[i + 2] = Math.max(0, Math.min(255, b));
        data[i + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    return texture;
};

// Create concrete texture for military base aesthetic
const createConcreteTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Base concrete color
    ctx.fillStyle = '#4A4A4A';
    ctx.fillRect(0, 0, 512, 512);
    
    const imageData = ctx.createImageData(512, 512);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      // Create concrete-like noise pattern
      const noise1 = Math.random() * 0.6 + 0.7;
      const noise2 = Math.random() * 0.3;
      const concrete = noise1 + noise2;
      
      const baseColor = 0x4A4A4A;
      const r = ((baseColor >> 16) & 255) * concrete;
      const g = ((baseColor >> 8) & 255) * concrete;
      const b = (baseColor & 255) * concrete;
      
      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
      data[i + 3] = 255;
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
};

// Create realistic tactical vest
const createTacticalVest = (scene: THREE.Scene) => {
  const vestGroup = new THREE.Group();

  // Main vest body - realistic military colors
  const vestFabric = createMilitaryFabricTexture(0x3C3530); // Dark olive drab
  const vestMaterial = new THREE.MeshStandardMaterial({
    map: vestFabric,
    roughness: 0.95,
    metalness: 0.05,
    color: 0x3C3530
  });

  const vestGeometry = new THREE.BoxGeometry(2.0, 2.8, 0.3);
  const vestMesh = new THREE.Mesh(vestGeometry, vestMaterial);
  vestMesh.castShadow = true;
  vestMesh.receiveShadow = true;
  vestGroup.add(vestMesh);

  // MOLLE webbing system
  const molleMaterial = new THREE.MeshStandardMaterial({
    color: 0x2A2A2A,
    roughness: 0.8,
    metalness: 0.1
  });

  // Add MOLLE straps
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 3; col++) {
      const strap = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.4, 0.02),
        molleMaterial
      );
      strap.position.set(
        -0.6 + col * 0.6,
        0.8 - row * 0.4,
        0.16
      );
      strap.castShadow = true;
      vestGroup.add(strap);
    }
  }

  // Side pouches - realistic tactical green
  const pouchMaterial = new THREE.MeshStandardMaterial({
    color: 0x4A5D23, // Military green
    roughness: 0.9,
    metalness: 0.05
  });

  const leftPouch = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.6, 0.2),
    pouchMaterial
  );
  leftPouch.position.set(-1.1, 0.3, 0.1);
  leftPouch.castShadow = true;
  vestGroup.add(leftPouch);

  const rightPouch = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.6, 0.2),
    pouchMaterial
  );
  rightPouch.position.set(1.1, 0.3, 0.1);
  rightPouch.castShadow = true;
  vestGroup.add(rightPouch);

  // Tactical belt with metal hardware
  const beltMaterial = new THREE.MeshStandardMaterial({
    color: 0x2C2C2C,
    roughness: 0.3,
    metalness: 0.7
  });

  const belt = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.15, 0.05),
    beltMaterial
  );
  belt.position.set(0, -1.2, 0.05);
  belt.castShadow = true;
  vestGroup.add(belt);

  // Metal buckle
  const buckleMaterial = new THREE.MeshStandardMaterial({
    color: 0x666666,
    roughness: 0.2,
    metalness: 0.8
  });

  const buckle = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.1, 0.03),
    buckleMaterial
  );
  buckle.position.set(0, -1.2, 0.08);
  buckle.castShadow = true;
  vestGroup.add(buckle);

  vestGroup.position.set(0, 1.5, 0);
  scene.add(vestGroup);

  return { vestGroup, leftPouch, rightPouch, belt };
};

// HUD Crosshair Component
const CrosshairHUD = ({ mousePosition }: { mousePosition: { x: number, y: number } }) => (
  <div 
    className="fixed pointer-events-none z-20 text-green-400"
    style={{
      left: `${(mousePosition.x + 1) * 50}%`,
      top: `${(-mousePosition.y + 1) * 50}%`,
      transform: 'translate(-50%, -50%)'
    }}
  >
    <div className="relative w-8 h-8">
      <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-green-400 transform -translate-x-1/2"></div>
      <div className="absolute bottom-0 left-1/2 w-0.5 h-2 bg-green-400 transform -translate-x-1/2"></div>
      <div className="absolute left-0 top-1/2 w-2 h-0.5 bg-green-400 transform -translate-y-1/2"></div>
      <div className="absolute right-0 top-1/2 w-2 h-0.5 bg-green-400 transform -translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-1 h-1 border border-green-400 transform -translate-x-1/2 -translate-y-1/2"></div>
    </div>
  </div>
);

// Corner Brackets HUD
const CornerBrackets = () => (
  <>
    {/* Top Left */}
    <div className="fixed top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-green-400 z-20"></div>
    {/* Top Right */}
    <div className="fixed top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-green-400 z-20"></div>
    {/* Bottom Left */}
    <div className="fixed bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-green-400 z-20"></div>
    {/* Bottom Right */}
    <div className="fixed bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-green-400 z-20"></div>
  </>
);

// Military Data Readouts
const MilitaryDataHUD = () => (
  <div className="fixed top-4 left-20 z-20 text-green-400 font-mono text-xs">
    <div className="bg-black bg-opacity-60 p-2 border border-green-400 border-opacity-30">
      <div>TACTICAL GEAR SYSTEM</div>
      <div>STATUS: OPERATIONAL</div>
      <div>PROTECTION LEVEL: IIIA</div>
      <div>WEIGHT: 2.3 KG</div>
      <div>CONDITION: EXCELLENT</div>
    </div>
  </div>
);

export default function RealisticMilitaryHero({ className = '' }: RealisticMilitaryHeroProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 8);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting - harsh military sunlight
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Subtle green accent light
    const accentLight = new THREE.PointLight(0x00FF41, 0.5, 10);
    accentLight.position.set(-5, 3, 3);
    scene.add(accentLight);

    // Military base concrete ground
    const concreteTexture = createConcreteTexture();
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
      map: concreteTexture,
      color: 0x5A5A5A,
      roughness: 0.9,
      metalness: 0.05,
      transparent: true,
      opacity: 0.4
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Create realistic elements
    const { particles, velocities } = createDustParticles(scene);
    const vest = createTacticalVest(scene);

    // Animation clock
    const clock = new THREE.Clock();
    let time = 0;

    const animate = () => {
      const delta = clock.getDelta();
      time += delta;

      // Animate dust particles
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i] + Math.sin(time + i) * 0.0005;
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];

        // Reset particles that drift too far
        if (positions[i + 1] > 15) {
          positions[i + 1] = 0;
          positions[i] = (Math.random() - 0.5) * 60;
          positions[i + 2] = (Math.random() - 0.5) * 60;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Animate vest with subtle floating and mouse parallax
      vest.vestGroup.rotation.y = mousePosition.x * 0.05 + time * 0.1;
      vest.vestGroup.rotation.x = mousePosition.y * 0.02;
      vest.vestGroup.position.y = 1.5 + Math.sin(time * 0.8) * 0.1;

      // Subtle component animation on scroll
      const exploded = scrollProgress > 0.3;
      vest.leftPouch.position.x = exploded ? -1.4 : -1.1;
      vest.rightPouch.position.x = exploded ? 1.4 : 1.1;
      vest.belt.position.y = exploded ? -1.5 : -1.2;

      // Camera movement based on scroll
      camera.position.z = 8 - scrollProgress * 3;
      camera.position.y = 2 + scrollProgress * 1;
      camera.lookAt(vest.vestGroup.position);

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Event listeners
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
    <div className={`relative w-full h-screen overflow-hidden ${className}`}>
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: 'contrast(1.2) brightness(0.8) sepia(0.2)',
        }}
        autoPlay
        muted
        loop
        playsInline
      >
        {/* Military training footage */}
        <source src="/assets/videos/military-training.mp4" type="video/mp4" />
        <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
      </video>

      {/* Dark vignette overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.6) 100%)'
        }}
      />

      {/* Scan lines effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.1) 3px, rgba(0,255,65,0.1) 4px)'
        }}
      />

      {/* WebGL 3D Scene Overlay */}
      <div ref={mountRef} className="absolute inset-0 pointer-events-none" />

      {/* HUD Elements */}
      <CrosshairHUD mousePosition={mousePosition} />
      <CornerBrackets />
      <MilitaryDataHUD />

      {/* Hero Content */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center text-center text-white z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="max-w-4xl px-4">
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6 tracking-wider"
            style={{ 
              fontFamily: 'monospace',
              textShadow: '0 0 20px rgba(0,255,65,0.5)',
              color: '#00FF41'
            }}
          >
            TACTICAL ELITE
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 opacity-90"
            style={{ fontFamily: 'monospace' }}
          >
            PROFESSIONAL GRADE TACTICAL EQUIPMENT
          </motion.p>
          <motion.button
            className="bg-green-500 hover:bg-green-400 text-black font-bold py-4 px-8 text-lg tracking-wider border-2 border-green-400"
            style={{ fontFamily: 'monospace' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            DEPLOY GEAR
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}