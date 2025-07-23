import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface MilitaryHeroSceneProps {
  className?: string;
}

// Heat Haze Shader Material
const HeatHazeMaterial = class extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        time: { value: 0.0 },
        tDiffuse: { value: null },
        amount: { value: 0.005 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float amount;
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        
        void main() {
          vec2 distortion = vec2(
            sin(vUv.y * 20.0 + time * 2.0) * amount,
            cos(vUv.x * 15.0 + time * 1.5) * amount * 0.6
          );
          
          vec4 color = texture2D(tDiffuse, vUv + distortion);
          
          // Add heat shimmer effect
          float shimmer = sin(vUv.y * 30.0 + time * 4.0) * 0.1;
          color.rgb += shimmer * vec3(1.0, 0.8, 0.6) * 0.1;
          
          gl_FragColor = color;
        }
      `,
      transparent: true
    });
  }
};

// Dust Storm Shader
const DustStormMaterial = class extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        time: { value: 0.0 },
        windDirection: { value: new THREE.Vector2(1.0, 0.5) },
        intensity: { value: 0.3 }
      },
      vertexShader: `
        uniform float time;
        uniform vec2 windDirection;
        attribute float size;
        attribute float phase;
        varying float vAlpha;
        
        void main() {
          vAlpha = 1.0 - (position.y / 20.0);
          
          vec3 pos = position;
          pos.x += sin(time * 0.5 + phase) * 2.0 + windDirection.x * time * 0.5;
          pos.z += cos(time * 0.3 + phase) * 1.5 + windDirection.y * time * 0.3;
          pos.y += sin(time * 0.2 + phase) * 0.5;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float intensity;
        varying float vAlpha;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          if (distanceToCenter > 0.5) discard;
          
          float alpha = (1.0 - distanceToCenter * 2.0) * vAlpha * intensity;
          gl_FragColor = vec4(0.83, 0.45, 0.29, alpha * 0.6);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }
};

// Volumetric Light Shaft Material
const VolumetricLightMaterial = class extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        time: { value: 0.0 },
        lightPosition: { value: new THREE.Vector3() },
        lightColor: { value: new THREE.Color(0x00FF41) },
        intensity: { value: 1.0 },
        rayStrength: { value: 0.3 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        varying vec3 vNormal;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 lightPosition;
        uniform vec3 lightColor;
        uniform float intensity;
        uniform float rayStrength;
        varying vec3 vWorldPosition;
        varying vec3 vNormal;
        
        void main() {
          vec3 lightDir = normalize(lightPosition - vWorldPosition);
          float lightDistance = distance(lightPosition, vWorldPosition);
          
          float volumetric = 1.0 / (1.0 + lightDistance * 0.1);
          volumetric *= max(0.0, dot(vNormal, lightDir));
          
          // Add animated noise for dust in light
          float noise = sin(vWorldPosition.x * 0.1 + time) * 
                       cos(vWorldPosition.z * 0.1 + time * 0.7) * 0.5 + 0.5;
          volumetric *= (0.7 + noise * 0.3);
          
          vec3 color = lightColor * volumetric * intensity * rayStrength;
          gl_FragColor = vec4(color, volumetric * 0.2);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
  }
};

export default function MilitaryHeroScene({ className = '' }: MilitaryHeroSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const composerRef = useRef<any>(null);
  const animationIdRef = useRef<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

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

    // Create advanced dust storm system with 10,000 particles
    const particleCount = 10000;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(particleCount * 3);
    const dustSizes = new Float32Array(particleCount);
    const dustPhases = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Distribute particles in layers for depth
      const layer = Math.floor(i / (particleCount / 3));
      const radius = 50 + layer * 20;
      const angle = (i / particleCount) * Math.PI * 2;
      
      dustPositions[i3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 40;
      dustPositions[i3 + 1] = Math.random() * 25 + layer * 5;
      dustPositions[i3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 40;
      
      dustSizes[i] = Math.random() * 3 + 1;
      dustPhases[i] = Math.random() * Math.PI * 2;
    }
    
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute('size', new THREE.BufferAttribute(dustSizes, 1));
    dustGeometry.setAttribute('phase', new THREE.BufferAttribute(dustPhases, 1));
    
    const dustMaterial = new DustStormMaterial();
    const dustStorm = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustStorm);

    // Create detailed tactical vest with PBR materials and fabric simulation
    const vestGroup = new THREE.Group();
    
    // Load textures (we'll create procedural ones)
    const createFabricTexture = (color: number) => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      
      // Create fabric-like texture
      const imageData = ctx.createImageData(512, 512);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 0.3 + 0.7;
        const r = ((color >> 16) & 255) / 255 * noise;
        const g = ((color >> 8) & 255) / 255 * noise;
        const b = (color & 255) / 255 * noise;
        
        data[i] = r * 255;
        data[i + 1] = g * 255;
        data[i + 2] = b * 255;
        data[i + 3] = 255;
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4);
      return texture;
    };
    
    // Advanced materials with proper PBR workflow
    const vestFabricTexture = createFabricTexture(0x2A2A2A);
    const vestMaterial = new THREE.MeshStandardMaterial({
      map: vestFabricTexture,
      roughness: 0.9,
      metalness: 0.05,
      normalScale: new THREE.Vector2(0.5, 0.5)
    });
    
    // Main vest with more detailed geometry
    const vestGeometry = new THREE.BoxGeometry(2.2, 3.2, 0.4);
    // Add subtle vertex displacement for fabric feel
    const vestPositions = vestGeometry.attributes.position.array as Float32Array;
    for (let i = 0; i < vestPositions.length; i += 3) {
      vestPositions[i + 2] += (Math.random() - 0.5) * 0.02; // Add subtle variation
    }
    vestGeometry.computeVertexNormals();
    
    const vestMesh = new THREE.Mesh(vestGeometry, vestMaterial);
    vestMesh.castShadow = true;
    vestMesh.receiveShadow = true;
    vestGroup.add(vestMesh);
    
    // Enhanced tactical components with emissive glow
    const componentTexture = createFabricTexture(0x00FF41);
    const componentMaterial = new THREE.MeshStandardMaterial({
      map: componentTexture,
      roughness: 0.7,
      metalness: 0.3,
      emissive: new THREE.Color(0x003311),
      emissiveIntensity: 0.2
    });
    
    // Left tactical pouch
    const leftPouch = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.25), componentMaterial);
    leftPouch.position.set(-0.9, 0.5, 0.1);
    leftPouch.castShadow = true;
    vestGroup.add(leftPouch);
    
    // Right tactical pouch
    const rightPouch = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.25), componentMaterial);
    rightPouch.position.set(0.9, 0.5, 0.1);
    rightPouch.castShadow = true;
    vestGroup.add(rightPouch);
    
    // Utility belt with metal buckles
    const beltMaterial = new THREE.MeshStandardMaterial({
      color: 0x1A1A1A,
      roughness: 0.2,
      metalness: 0.8,
    });
    const belt = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.5, 0.3), beltMaterial);
    belt.position.set(0, -1.3, 0);
    belt.castShadow = true;
    vestGroup.add(belt);
    
    // Add metal buckles and details
    const buckleMaterial = new THREE.MeshStandardMaterial({
      color: 0x666666,
      roughness: 0.1,
      metalness: 0.9,
    });
    
    for (let i = 0; i < 3; i++) {
      const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.05), buckleMaterial);
      buckle.position.set(-0.6 + i * 0.6, -1.3, 0.2);
      buckle.castShadow = true;
      vestGroup.add(buckle);
    }
    
    vestGroup.position.set(0, 2, 0);
    scene.add(vestGroup);

    // Create advanced searchlights with volumetric effects and lens flares
    const createAdvancedSearchlight = (position: [number, number, number], color = 0x00FF41) => {
      // Main spotlight
      const spotLight = new THREE.SpotLight(color, 3, 120, 0.4, 0.6);
      spotLight.position.set(...position);
      spotLight.castShadow = true;
      spotLight.shadow.mapSize.width = 2048;
      spotLight.shadow.mapSize.height = 2048;
      spotLight.shadow.bias = -0.0001;
      
      // Volumetric light shaft
      const shaftGeometry = new THREE.ConeGeometry(12, 25, 12, 1, true);
      const volumetricMaterial = new VolumetricLightMaterial();
      volumetricMaterial.uniforms.lightPosition.value.copy(spotLight.position);
      volumetricMaterial.uniforms.lightColor.value.setHex(color);
      
      const lightShaft = new THREE.Mesh(shaftGeometry, volumetricMaterial);
      lightShaft.position.copy(spotLight.position);
      lightShaft.position.y -= 2;
      lightShaft.lookAt(0, -5, 0);
      
      // Lens flare effect
      const flareGeometry = new THREE.SphereGeometry(0.5, 8, 8);
      const flareMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });
      const flare = new THREE.Mesh(flareGeometry, flareMaterial);
      flare.position.copy(spotLight.position);
      
      // Outer glow ring
      const ringGeometry = new THREE.RingGeometry(1, 2, 16);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(spotLight.position);
      ring.lookAt(camera.position);
      
      scene.add(spotLight);
      scene.add(lightShaft);
      scene.add(flare);
      scene.add(ring);
      
      return { 
        light: spotLight, 
        shaft: lightShaft, 
        flare: flare, 
        ring: ring,
        volumetricMaterial: volumetricMaterial
      };
    };
    
    const searchlights = [
      createAdvancedSearchlight([25, 18, 12], 0x00FF41),   // Night vision green
      createAdvancedSearchlight([-30, 22, -18], 0xFF4500), // Orange tactical
      createAdvancedSearchlight([18, 25, -25], 0x00FFFF),  // Cyan sweep
      createAdvancedSearchlight([-15, 20, 30], 0xFF0080)   // Magenta search
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
      
      // Animate advanced dust storm
      dustMaterial.uniforms.time.value = time;
      dustMaterial.uniforms.windDirection.value.set(
        Math.sin(time * 0.1) * 0.5 + 0.5,
        Math.cos(time * 0.15) * 0.3 + 0.7
      );
      dustMaterial.uniforms.intensity.value = 0.2 + Math.sin(time * 0.5) * 0.1;
      
      // Animate vest with mouse parallax and floating
      vestGroup.rotation.y = mousePosition.x * 0.1;
      vestGroup.rotation.x = mousePosition.y * 0.05;
      vestGroup.position.y = 2 + Math.sin(time * 0.5) * 0.2;
      
      // Animate exploded view based on scroll
      const exploded = scrollProgress > 0.3;
      leftPouch.position.x = exploded ? -1.5 : -0.9;
      rightPouch.position.x = exploded ? 1.5 : 0.9;
      belt.position.y = exploded ? -2 : -1.3;
      
      // Animate advanced searchlights with complex patterns
      searchlights.forEach((searchlight, index) => {
        const offset = index * Math.PI * 0.5;
        const speed = 0.3 + index * 0.1;
        
        // Dynamic angle adjustment
        searchlight.light.angle = 0.4 + Math.sin(time * 0.8 + offset) * 0.15;
        searchlight.light.intensity = 2.5 + Math.sin(time * 1.2 + offset) * 0.8;
        
        // Complex sweep patterns
        const sweep1 = Math.sin(time * speed + offset) * 25;
        const sweep2 = Math.cos(time * speed * 0.7 + offset) * 15;
        const targetX = sweep1 + Math.sin(time * 2 + offset) * 5;
        const targetZ = sweep2 + Math.cos(time * 1.5 + offset) * 8;
        
        searchlight.light.target.position.set(targetX, -5, targetZ);
        searchlight.light.target.updateMatrixWorld();
        
        // Update volumetric effects
        searchlight.shaft.lookAt(targetX, -5, targetZ);
        searchlight.volumetricMaterial.uniforms.time.value = time;
        searchlight.volumetricMaterial.uniforms.intensity.value = 
          searchlight.light.intensity * 0.3;
        
        // Animate lens flare
        const flareMaterial = searchlight.flare.material as THREE.MeshBasicMaterial;
        const ringMaterial = searchlight.ring.material as THREE.MeshBasicMaterial;
        flareMaterial.opacity = 0.6 + Math.sin(time * 3 + offset) * 0.2;
        ringMaterial.opacity = 0.2 + Math.sin(time * 4 + offset) * 0.1;
        searchlight.ring.lookAt(camera.position);
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