import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface MilitaryBaseHeroProps {
  className?: string;
}

// HUD Crosshair Component
const CrosshairHUD = ({ mousePosition }: { mousePosition: { x: number, y: number } }) => (
  <div 
    className="fixed pointer-events-none z-20 text-green-400 opacity-80"
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
    <div className="fixed top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-green-400 opacity-60 z-20"></div>
    {/* Top Right */}
    <div className="fixed top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-green-400 opacity-60 z-20"></div>
    {/* Bottom Left */}
    <div className="fixed bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-green-400 opacity-60 z-20"></div>
    {/* Bottom Right */}
    <div className="fixed bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-green-400 opacity-60 z-20"></div>
  </>
);

// Military Data Readouts
const MilitaryDataHUD = () => (
  <div className="fixed top-4 left-20 z-20 text-green-400 font-mono text-xs">
    <div className="bg-black bg-opacity-60 p-3 border border-green-400 border-opacity-30">
      <div className="text-green-400 mb-1">TACTICAL GEAR SYSTEM</div>
      <div className="text-green-300">STATUS: OPERATIONAL</div>
      <div className="text-green-300">PROTECTION LEVEL: IIIA</div>
      <div className="text-green-300">WEIGHT: 2.3 KG</div>
      <div className="text-green-300">CONDITION: EXCELLENT</div>
    </div>
  </div>
);

export default function MilitaryBaseHero({ className = '' }: MilitaryBaseHeroProps) {
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
    scene.fog = new THREE.Fog(0x444444, 20, 100);

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

    // Harsh military sunlight
    const directionalLight = new THREE.DirectionalLight(0xFFFFDD, 1.2);
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

    // Brighter ambient light for better visibility
    const ambientLight = new THREE.AmbientLight(0x606060, 0.6);
    scene.add(ambientLight);

    // Subtle green accent light
    const accentLight = new THREE.PointLight(0x00FF41, 0.5, 15);
    accentLight.position.set(-4, 4, 4);
    scene.add(accentLight);
    
    // Add strong rim lighting for the tactical vest
    const rimLight = new THREE.PointLight(0xFFFFFF, 1.2, 10);
    rimLight.position.set(6, 5, 3);
    scene.add(rimLight);
    
    // Secondary fill light
    const fillLight = new THREE.PointLight(0xFFFFFD, 0.8, 12);
    fillLight.position.set(-5, 3, 6);
    scene.add(fillLight);

    // Create realistic tactical vest
    const vestGroup = new THREE.Group();

    // Create procedural camouflage texture
    const createCamoTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      
      // Base olive drab
      ctx.fillStyle = '#3C3530';
      ctx.fillRect(0, 0, 512, 512);
      
      // Add camo pattern with better contrast
      const colors = ['#2D2A22', '#4A4935', '#5A5D23', '#6B7539'];
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.beginPath();
        ctx.ellipse(
          Math.random() * 512,
          Math.random() * 512,
          Math.random() * 50 + 25,
          Math.random() * 35 + 20,
          Math.random() * Math.PI * 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
      return texture;
    };

    // Main vest body with realistic military color and camouflage
    const vestGeometry = new THREE.BoxGeometry(2.0, 2.8, 0.3);
    const camoTexture = createCamoTexture();
    const vestMaterial = new THREE.MeshStandardMaterial({
      map: camoTexture,
      color: 0x6B7539, // Much brighter military green for visibility
      roughness: 0.7,
      metalness: 0.15,
      emissive: 0x113311,
      emissiveIntensity: 0.15
    });
    const vestMesh = new THREE.Mesh(vestGeometry, vestMaterial);
    vestMesh.castShadow = true;
    vestMesh.receiveShadow = true;
    vestGroup.add(vestMesh);

    // MOLLE webbing straps
    const molleMaterial = new THREE.MeshStandardMaterial({
      color: 0x2A2A2A,
      roughness: 0.8,
      metalness: 0.1
    });

    // Create realistic MOLLE grid
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        const strap = new THREE.Mesh(
          new THREE.BoxGeometry(0.05, 0.3, 0.02),
          molleMaterial
        );
        strap.position.set(
          -0.5 + col * 0.5,
          0.6 - row * 0.35,
          0.16
        );
        strap.castShadow = true;
        vestGroup.add(strap);
      }
    }

    // Side tactical pouches
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

    // Add a military tactical helmet above the vest
    const helmetGeometry = new THREE.SphereGeometry(0.8, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.7);
    const helmetMaterial = new THREE.MeshStandardMaterial({
      color: 0x3C3530, // Dark olive to match vest
      roughness: 0.6,
      metalness: 0.2,
      emissive: 0x001100,
      emissiveIntensity: 0.1
    });
    const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
    helmet.position.set(0, 2.5, 0);
    helmet.castShadow = true;
    helmet.receiveShadow = true;
    vestGroup.add(helmet);

    // Helmet accessories (NVG mount)
    const nvgMountGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.1);
    const nvgMountMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.3,
      metalness: 0.8
    });
    const nvgMount = new THREE.Mesh(nvgMountGeometry, nvgMountMaterial);
    nvgMount.position.set(0, 2.6, 0.6);
    nvgMount.castShadow = true;
    vestGroup.add(nvgMount);

    vestGroup.position.set(0, 1.5, 0);
    scene.add(vestGroup);

    // Military concrete ground
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x5A5A5A,
      roughness: 0.9,
      metalness: 0.05,
      transparent: true,
      opacity: 0.6
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Realistic dust particles
    const particleCount = 1500;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(particleCount * 3);
    const dustVelocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      dustPositions[i3] = (Math.random() - 0.5) * 40;
      dustPositions[i3 + 1] = Math.random() * 10;
      dustPositions[i3 + 2] = (Math.random() - 0.5) * 40;
      
      dustVelocities[i3] = (Math.random() - 0.5) * 0.01;
      dustVelocities[i3 + 1] = Math.random() * 0.005;
      dustVelocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

    const dustMaterial = new THREE.PointsMaterial({
      color: 0x8B7355, // Realistic dust color
      size: 0.02,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.NormalBlending
    });

    const dustParticles = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustParticles);

    // Animation
    const clock = new THREE.Clock();
    let time = 0;

    const animate = () => {
      const delta = clock.getDelta();
      time += delta;

      // Animate dust particles
      const positions = dustParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += dustVelocities[i] + Math.sin(time + i) * 0.0005;
        positions[i + 1] += dustVelocities[i + 1];
        positions[i + 2] += dustVelocities[i + 2];

        if (positions[i + 1] > 10) {
          positions[i + 1] = 0;
          positions[i] = (Math.random() - 0.5) * 40;
          positions[i + 2] = (Math.random() - 0.5) * 40;
        }
      }
      dustParticles.geometry.attributes.position.needsUpdate = true;

      // Vest animation - subtle floating and mouse parallax
      vestGroup.rotation.y = mousePosition.x * 0.03 + time * 0.1;
      vestGroup.rotation.x = mousePosition.y * 0.02;
      vestGroup.position.y = 1.5 + Math.sin(time * 0.8) * 0.08;

      // Component explosion on scroll
      const exploded = scrollProgress > 0.3;
      leftPouch.position.x = exploded ? -1.4 : -1.1;
      rightPouch.position.x = exploded ? 1.4 : 1.1;
      belt.position.y = exploded ? -1.5 : -1.2;

      // Camera movement
      camera.position.z = 8 - scrollProgress * 2;
      camera.position.y = 2 + scrollProgress * 0.5;
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
    <div className={`relative w-full h-screen overflow-hidden bg-gray-800 ${className}`}>
      {/* Military Base Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: 'contrast(1.2) brightness(0.7) sepia(0.2) saturate(0.8)',
        }}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/attached_assets/videos/military-training.mp4" type="video/mp4" />
        <source src="/attached_assets/videos/military-fallback.mp4" type="video/mp4" />
      </video>

      {/* Dark military vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.7) 100%)'
        }}
      />

      {/* Tactical scan lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.1) 3px, rgba(0,255,65,0.1) 4px)'
        }}
      />

      {/* WebGL 3D Tactical Vest Overlay */}
      <div ref={mountRef} className="absolute inset-0 pointer-events-none" />

      {/* Military HUD Elements */}
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
            className="text-5xl md:text-7xl font-bold mb-6 tracking-wider"
            style={{ 
              fontFamily: 'monospace',
              textShadow: '0 0 20px rgba(0,255,65,0.5)',
              color: '#00FF41'
            }}
          >
            TACTICAL ELITE
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl mb-8 opacity-90"
            style={{ fontFamily: 'monospace' }}
          >
            PROFESSIONAL GRADE TACTICAL EQUIPMENT
          </motion.p>
          <motion.button
            className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-6 text-lg tracking-wider border-2 border-green-400 font-mono"
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