import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import VideoBackground from '../video-background';

// Typewriter Text Component
interface TypewriterTextProps {
  text: string;
  speed?: number;
}

const TypewriterText = ({ text, speed = 50 }: TypewriterTextProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return <span>{displayText}</span>;
};

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

    // Minimal ambient lighting (much dimmer)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Simple ambient scene for hero background
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // Minimal ground for depth (very transparent)
    const groundGeometry = new THREE.PlaneGeometry(80, 80);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x4A4E54,
      roughness: 0.9,
      metalness: 0.1,
      transparent: true,
      opacity: 0.1 // Much more transparent
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.5;
    ground.receiveShadow = true;
    scene.add(ground);

    // Minimal dust particles (much fewer and more transparent)
    const particleCount = 200; // Reduced from 2000
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
      color: 0x81613C,
      size: 0.015, // Smaller particles
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.1, // Much more transparent
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

      // Simple camera animation
      camera.position.z = 5;
      camera.position.y = 0;
      camera.lookAt(0, 0, 0);

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
    <div className={`relative w-full h-screen overflow-hidden ${className}`}>
      {/* SWAT Training Video Background */}
      <VideoBackground />

      {/* Dark gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)',
          willChange: 'transform',
          zIndex: 2
        }}
      />

      {/* Scan lines animation */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0, 255, 65, 0.05) 2px, rgba(0, 255, 65, 0.05) 4px)',
          animation: 'scanlines 2s linear infinite',
          willChange: 'transform',
          zIndex: 3
        }}
      />

      {/* Corner brackets like weapon sights */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
        {/* Top left */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-night-vision opacity-70 animate-pulse" />
        {/* Top right */}
        <div className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-night-vision opacity-70 animate-pulse" />
        {/* Bottom left */}
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-night-vision opacity-70 animate-pulse" />
        {/* Bottom right */}
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-night-vision opacity-70 animate-pulse" />
      </div>

      {/* 3D Tactical Equipment Overlay - moved to back */}
      <div ref={mountRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: -2 }} />

      {/* Professional Military HUD */}
      <div style={{ zIndex: 15 }}>
        <MilitaryHUD mousePosition={mousePosition} />
      </div>

      {/* Hero Content with New Brand Messaging */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center text-center text-white"
        style={{ zIndex: 20 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <div className="max-w-5xl px-6">
          <motion.h1 
            className="text-5xl md:text-7xl font-military-header mb-8 tracking-wider"
            style={{ 
              background: 'linear-gradient(45deg, #00FF41 0%, #C8A882 50%, #FFA500 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(0, 255, 65, 0.3)'
            }}
          >
            PRECISION GEAR CO
          </motion.h1>
          
          <motion.div 
            className="text-2xl md:text-3xl text-white font-military-header font-bold mb-6 tracking-wide leading-relaxed"
            style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(0, 255, 65, 0.6)',
              filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <TypewriterText 
              text="Only battle-tested gear from the world's best operators, because your family deserves it." 
              speed={60}
            />
          </motion.div>
          
          <motion.p 
            className="text-2xl md:text-3xl text-night-vision mb-12 font-military-header tracking-wider"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.8 }}
          >
            GEAR LIKE THE PROS
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.1 }}
          >
            <motion.button
              className="bg-night-vision text-ops-black px-8 py-4 font-military-header text-lg tracking-wider hover:bg-tactical-tan transition-colors border-2 border-night-vision hover:border-tactical-tan"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              BROWSE GEAR
            </motion.button>
            
            <motion.button
              className="border-2 border-night-vision text-night-vision px-8 py-4 font-military-header text-lg tracking-wider hover:bg-night-vision hover:text-ops-black transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              LEARN MORE
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

    </div>
  );
}