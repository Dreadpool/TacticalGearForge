import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Typewriter effect component
const TypewriterText = ({ text, speed = 100, delay = 0 }: { text: string; speed?: number; delay?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setHasStarted(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!hasStarted) return;
    
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed, hasStarted]);

  return <span>{displayText}<span className="animate-pulse">|</span></span>;
};

// Staggered letter animation component
const StaggeredText = ({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) => {
  const letters = text.split('');
  
  return (
    <div className={`flex ${className}`}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="inline-block hover:text-shadow-glitch cursor-default"
          initial={{ opacity: 0, y: 50, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.8,
            delay: delay + index * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          whileHover={{
            scale: 1.1,
            textShadow: "0 0 20px #00FF41, 0 0 40px #FFA500",
            transition: { duration: 0.2 }
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </div>
  );
};

// Scroll indicator component
const ScrollIndicator = () => (
  <motion.div
    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-30"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay: 4 }}
  >
    <div className="text-night-vision font-mono-terminal text-sm mb-4 tracking-wider">
      SCROLL TO EXPLORE
    </div>
    <motion.div
      className="w-6 h-10 border-2 border-night-vision rounded-full relative"
      animate={{ 
        boxShadow: [
          "0 0 0px #00FF41",
          "0 0 20px #00FF41",
          "0 0 0px #00FF41"
        ]
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <motion.div
        className="w-1 h-3 bg-night-vision rounded-full absolute left-1/2 top-2 transform -translate-x-1/2"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  </motion.div>
);

// Three.js WebGL component with helmet and particles
const WebGLBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number>();
  const helmetRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const noiseTextureRef = useRef<THREE.Texture | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    
    mountRef.current.appendChild(renderer.domElement);

    // Create noise texture for shader background
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.createImageData(256, 256);
    
    for (let i = 0; i < imageData.data.length; i += 4) {
      const noise = Math.random() * 255;
      imageData.data[i] = noise * 0.1; // R
      imageData.data[i + 1] = noise * 0.3; // G  
      imageData.data[i + 2] = noise * 0.05; // B
      imageData.data[i + 3] = 30; // A
    }
    
    ctx.putImageData(imageData, 0, 0);
    const noiseTexture = new THREE.CanvasTexture(canvas);
    noiseTexture.wrapS = THREE.RepeatWrapping;
    noiseTexture.wrapT = THREE.RepeatWrapping;
    noiseTextureRef.current = noiseTexture;

    // Background plane with shader
    const bgGeometry = new THREE.PlaneGeometry(20, 20);
    const bgMaterial = new THREE.MeshBasicMaterial({
      map: noiseTexture,
      transparent: true,
      opacity: 0.1
    });
    const bgPlane = new THREE.Mesh(bgGeometry, bgMaterial);
    bgPlane.position.z = -5;
    scene.add(bgPlane);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00ff41, 1.2);
    keyLight.position.set(5, 10, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffa500, 0.6);
    rimLight.position.set(-3, 3, -3);
    scene.add(rimLight);

    // Create tactical helmet
    const helmetGroup = new THREE.Group();
    
    // Main helmet body
    const helmetGeometry = new THREE.SphereGeometry(0.8, 24, 16);
    helmetGeometry.scale(1, 0.85, 1.1);
    
    const helmetMaterial = new THREE.MeshPhongMaterial({
      color: 0x1a1a1a,
      shininess: 60,
      specular: 0x00ff41
    });
    
    const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
    helmet.castShadow = true;
    helmet.receiveShadow = true;
    helmetGroup.add(helmet);

    // Visor
    const visorGeometry = new THREE.SphereGeometry(0.82, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const visorMaterial = new THREE.MeshPhongMaterial({
      color: 0x001100,
      opacity: 0.8,
      transparent: true,
      shininess: 100,
      reflectivity: 0.8
    });
    const visor = new THREE.Mesh(visorGeometry, visorMaterial);
    visor.position.z = 0.15;
    helmetGroup.add(visor);

    // Helmet details (straps, buckles)
    const strapGeometry = new THREE.BoxGeometry(0.05, 0.1, 0.8);
    const strapMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    
    const leftStrap = new THREE.Mesh(strapGeometry, strapMaterial);
    leftStrap.position.set(-0.6, 0, 0);
    helmetGroup.add(leftStrap);
    
    const rightStrap = new THREE.Mesh(strapGeometry, strapMaterial);
    rightStrap.position.set(0.6, 0, 0);
    helmetGroup.add(rightStrap);

    helmetGroup.position.set(3, -0.5, 1);
    helmetGroup.scale.setScalar(0.7);
    scene.add(helmetGroup);
    helmetRef.current = helmetGroup;

    // Create responsive particle system
    const particleCount = 1500;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

      // Green-amber gradient colors
      const t = Math.random();
      colors[i * 3] = t * 1.0; // R (amber)
      colors[i * 3 + 1] = 1.0; // G (green)
      colors[i * 3 + 2] = t * 0.2; // B
      
      sizes[i] = Math.random() * 3 + 1;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: false
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    particlesRef.current = particleSystem;

    camera.position.set(0, 0, 5);

    // Mouse movement handler
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;

      // Animate noise texture
      if (noiseTextureRef.current) {
        noiseTextureRef.current.offset.x += 0.001;
        noiseTextureRef.current.offset.y += 0.0005;
      }

      // Helmet follows mouse with smooth rotation
      if (helmetRef.current) {
        const targetRotationY = mouseRef.current.x * 0.5 + time * 0.1;
        const targetRotationX = mouseRef.current.y * 0.3;
        
        helmetRef.current.rotation.y += (targetRotationY - helmetRef.current.rotation.y) * 0.05;
        helmetRef.current.rotation.x += (targetRotationX - helmetRef.current.rotation.x) * 0.05;
        
        // Subtle floating animation
        helmetRef.current.position.y = -0.5 + Math.sin(time * 0.5) * 0.1;
      }

      // Responsive particle animation
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        
        for (let i = 0; i < positions.length; i += 3) {
          // Floating motion
          positions[i + 1] += Math.sin(time * 0.5 + i * 0.01) * 0.005;
          
          // Mouse influence
          const mouseInfluence = 0.02;
          positions[i] += mouseRef.current.x * mouseInfluence * Math.sin(time + i);
          positions[i + 2] += mouseRef.current.y * mouseInfluence * Math.cos(time + i);
          
          // Boundary wrapping
          if (positions[i] > 12) positions[i] = -12;
          if (positions[i] < -12) positions[i] = 12;
          if (positions[i + 1] > 12) positions[i + 1] = -12;
          if (positions[i + 1] < -12) positions[i + 1] = 12;
        }
        
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        particlesRef.current.rotation.y = time * 0.05;
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 z-10"
      style={{ 
        background: 'transparent',
        pointerEvents: 'none'
      }}
    />
  );
};

export default function ImmersiveHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-ops-black">
      {/* WebGL Background */}
      <WebGLBackground />
      
      {/* Parallax content layer */}
      <div 
        className="absolute inset-0 z-20 flex items-center justify-center"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`
        }}
      >
        <div className="text-center max-w-6xl px-8">
          {/* Main title with staggered animation */}
          <div className="mb-8">
            <StaggeredText
              text="PRECISION GEAR CO"
              className="text-6xl md:text-8xl font-military-header font-black tracking-wider"
              delay={0.5}
            />
          </div>
          

          
          <div className="gradient-text text-6xl md:text-8xl font-military-header font-black tracking-wider mb-12">
            <StaggeredText
              text="PRECISION GEAR CO"
              delay={0.5}
            />
          </div>
          
          {/* Tagline with typewriter effect */}
          <motion.div
            className="text-2xl md:text-3xl font-mono-terminal text-night-vision tracking-wide mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3 }}
          >
            <TypewriterText 
              text="GEAR LIKE THE PROS • TRAIN LIKE THE PROS"
              speed={80}
              delay={3000}
            />
          </motion.div>
          
          {/* Brand positioning statement */}
          <motion.div
            className="text-lg md:text-xl font-hud text-tactical-tan tracking-wide max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 5 }}
          >
            Every piece of equipment sold here has been battle-tested by professionals. 
            <br />
            <span className="text-night-vision">Real testimonials. Real references. Real performance.</span>
          </motion.div>
        </div>
      </div>
      
      {/* Tactical overlay elements */}
      <motion.div 
        className="absolute inset-0 z-30 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1 }}
      >
        {/* Corner brackets */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-night-vision opacity-40" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-night-vision opacity-40" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-night-vision opacity-40" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-night-vision opacity-40" />
        
        {/* Scan lines */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0, 255, 65, 0.1) 2px, rgba(0, 255, 65, 0.1) 4px)',
            animation: 'scanlines 4s linear infinite'
          }}
        />
      </motion.div>
      
      {/* Scroll indicator */}
      <ScrollIndicator />
    </div>
  );
}