import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LightingPreset, PedestalStyle } from '../types';
import { Loader2, AlertCircle, Sparkles, RotateCcw, Video } from 'lucide-react';

interface AvatarCanvasProps {
  modelUrl: string;
  scale: number;
  positionY: number;
  rotationY: number;
  rotationSpeed: number;
  autoRotate: boolean;
  lighting: LightingPreset;
  pedestal: PedestalStyle;
  activeAnimation: string;
  posture?: 'standing' | 'typing';
  tablePosX?: number;
  tablePosY?: number;
  tablePosZ?: number;
  keyboardPosX?: number;
  keyboardPosY?: number;
  keyboardPosZ?: number;
  mousePosX?: number;
  mousePosY?: number;
  mousePosZ?: number;
  chairPosX?: number;
  chairPosY?: number;
  chairPosZ?: number;
  onAnimationsLoaded?: (animations: string[]) => void;
  onLoadStatusChange?: (status: 'idle' | 'loading' | 'success' | 'error', progress?: number, errorMsg?: string) => void;
}

export default function AvatarCanvas({
  modelUrl,
  scale,
  positionY,
  rotationY,
  rotationSpeed,
  autoRotate,
  lighting,
  pedestal,
  activeAnimation,
  posture = 'standing',
  tablePosX = 0,
  tablePosY = 0,
  tablePosZ = 0,
  keyboardPosX = 0,
  keyboardPosY = 0,
  keyboardPosZ = 0,
  mousePosX = 0,
  mousePosY = 0,
  mousePosZ = 0,
  chairPosX = 0,
  chairPosY = 0,
  chairPosZ = 0,
  onAnimationsLoaded,
  onLoadStatusChange,
}: AvatarCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keep refs of Three.js objects to update them on prop changes
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const animationActionsRef = useRef<{ [key: string]: THREE.AnimationAction }>({});
  const animationClipsRef = useRef<THREE.AnimationClip[]>([]);
  const currentActionRef = useRef<THREE.AnimationAction | null>(null);

  // Lighting refs
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const dirLight1Ref = useRef<THREE.DirectionalLight | null>(null);
  const dirLight2Ref = useRef<THREE.DirectionalLight | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);

  // Pedestal ref
  const pedestalMeshRef = useRef<THREE.Group | null>(null);

  // Desk Setup ref
  const deskSetupMeshRef = useRef<THREE.Group | null>(null);
  const tableSubGroupRef = useRef<THREE.Group | null>(null);
  const chairGroupRef = useRef<THREE.Group | null>(null);
  const keyboardMeshRef = useRef<THREE.Group | null>(null);
  const mouseMeshRef = useRef<THREE.Group | null>(null);
  // Bones mapping for posture
  const bonesRef = useRef<{ [key: string]: THREE.Object3D }>({});
  // Monitor Canvas Texture and Canvas for scrolling code
  const monitorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const monitorTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const monitorTextureBackRef = useRef<THREE.CanvasTexture | null>(null);

  // Sync posture to a ref to prevent stale closure inside animate loop
  const postureRef = useRef(posture);
  useEffect(() => {
    postureRef.current = posture;
  }, [posture]);

  // Sync scale, positionY, rotationY, and activeAnimation to refs to prevent stale closures
  const scaleRef = useRef(scale);
  const positionYRef = useRef(positionY);
  const rotationYRef = useRef(rotationY);
  const activeAnimationRef = useRef(activeAnimation);

  const tablePosXRef = useRef(tablePosX);
  const tablePosYRef = useRef(tablePosY);
  const tablePosZRef = useRef(tablePosZ);
  const keyboardPosXRef = useRef(keyboardPosX);
  const keyboardPosYRef = useRef(keyboardPosY);
  const keyboardPosZRef = useRef(keyboardPosZ);
  const mousePosXRef = useRef(mousePosX);
  const mousePosYRef = useRef(mousePosY);
  const mousePosZRef = useRef(mousePosZ);
  const chairPosXRef = useRef(chairPosX);
  const chairPosYRef = useRef(chairPosY);
  const chairPosZRef = useRef(chairPosZ);

  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { positionYRef.current = positionY; }, [positionY]);
  useEffect(() => { rotationYRef.current = rotationY; }, [rotationY]);
  useEffect(() => { activeAnimationRef.current = activeAnimation; }, [activeAnimation]);

  useEffect(() => { tablePosXRef.current = tablePosX; }, [tablePosX]);
  useEffect(() => { tablePosYRef.current = tablePosY; }, [tablePosY]);
  useEffect(() => { tablePosZRef.current = tablePosZ; }, [tablePosZ]);
  useEffect(() => { keyboardPosXRef.current = keyboardPosX; }, [keyboardPosX]);
  useEffect(() => { keyboardPosYRef.current = keyboardPosY; }, [keyboardPosY]);
  useEffect(() => { keyboardPosZRef.current = keyboardPosZ; }, [keyboardPosZ]);
  useEffect(() => { mousePosXRef.current = mousePosX; }, [mousePosX]);
  useEffect(() => { mousePosYRef.current = mousePosY; }, [mousePosY]);
  useEffect(() => { mousePosZRef.current = mousePosZ; }, [mousePosZ]);
  useEffect(() => { chairPosXRef.current = chairPosX; }, [chairPosX]);
  useEffect(() => { chairPosYRef.current = chairPosY; }, [chairPosY]);
  useEffect(() => { chairPosZRef.current = chairPosZ; }, [chairPosZ]);

  // UI state for error and loading
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [usingFallback, setUsingFallback] = useState(false);

  // 1. Initial Setup
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Create scene with fog for atmospheric effect
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.04);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1.4, 3.2);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't go below ground level
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controls.target.set(0, 0.9, 0);
    controlsRef.current = controls;

    // Resize observer
    const handleResize = (entries: ResizeObserverEntry[]) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      
      requestAnimationFrame(() => {
        if (cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = width / height;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(width, height, false);
        }
      });
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    // Initial size
    const rect = containerRef.current.getBoundingClientRect();
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    renderer.setSize(rect.width, rect.height);

    // Animation loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const deltaTime = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Update controls
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      // Update mixer for animations
      if (mixerRef.current) {
        mixerRef.current.update(deltaTime);
      }

      // Procedural animations if NO active actions are running, or to add micro-movements
      if (modelRef.current) {
        const model = modelRef.current;

        // Auto rotation
        if (autoRotate && postureRef.current !== 'typing') {
          model.rotation.y += rotationSpeed * deltaTime;
        }

        if (postureRef.current === 'typing') {
          // Check if it has a baked typing/sitting animation playing (e.g. from the custom my-avatar.glb)
          const activeAnimName = activeAnimationRef.current;
          const isBakedSittingAnim = activeAnimName && (
            activeAnimName.toLowerCase().includes('mixamo') ||
            activeAnimName.toLowerCase().includes('layer0') ||
            activeAnimName.toLowerCase().includes('retarget') ||
            activeAnimName.toLowerCase().includes('type') ||
            activeAnimName.toLowerCase().includes('sit')
          );

          if (isBakedSittingAnim) {
            // Place the model centered on the chair cushion
            model.position.set(0, positionYRef.current, -0.05);
            model.rotation.set(0, rotationYRef.current, 0);
            
            // Lock hips X and Z to 0 so the character doesn't slide beside the desk/chair setup.
            const b = bonesRef.current;
            if (b['hips']) {
              b['hips'].position.x = 0;
              b['hips'].position.z = 0;
            }
          } else {
            // 1. Move model down and forward to seat on chair cushion
            if (model.name === 'procedural-fallback-avatar') {
              model.position.set(0, -0.18, -0.05);
            } else {
              model.position.set(0, -0.46, -0.05);
            }
            model.rotation.set(0, 0, 0);

            if (model.name === 'procedural-fallback-avatar') {
              // Animate fallback rings
              const hudRing1 = model.getObjectByName('hudRing1');
              const hudRing2 = model.getObjectByName('hudRing2');
              if (hudRing1) hudRing1.rotation.z += 0.5 * deltaTime;
              if (hudRing2) hudRing2.rotation.z -= 0.3 * deltaTime;

              // Positioning fallback thighs & shins to look seated
              const thighL = model.getObjectByName('thighL');
              const shinL = model.getObjectByName('shinL');
              const thighR = model.getObjectByName('thighR');
              const shinR = model.getObjectByName('shinR');

              if (thighL) { thighL.rotation.set(-Math.PI / 2.2, 0, 0); thighL.position.set(-0.1, 0.32, 0.16); }
              if (shinL) { shinL.rotation.set(0.1, 0, 0); shinL.position.set(-0.1, 0.15, 0.32); }
              if (thighR) { thighR.rotation.set(-Math.PI / 2.2, 0, 0); thighR.position.set(0.1, 0.32, 0.16); }
              if (shinR) { shinR.rotation.set(0.1, 0, 0); shinR.position.set(0.1, 0.15, 0.32); }

              // Animate typing hands/arms
              const upperArmL = model.getObjectByName('upperArmL');
              const lowerArmL = model.getObjectByName('lowerArmL');
              const upperArmR = model.getObjectByName('upperArmR');
              const lowerArmR = model.getObjectByName('lowerArmR');

              if (upperArmL) { upperArmL.rotation.set(-0.8, -0.1, -0.1); upperArmL.position.set(-0.24, 0.82, 0.12); }
              if (upperArmR) { upperArmR.rotation.set(-0.8, 0.1, 0.1); upperArmR.position.set(0.24, 0.82, 0.12); }

              const tapL = Math.sin(elapsedTime * 14.0) * 0.015;
              const tapR = Math.cos(elapsedTime * 16.0) * 0.015;

              if (lowerArmL) { lowerArmL.rotation.set(-1.0, -0.2, 0); lowerArmL.position.set(-0.21, 0.69 + tapL, 0.28); }
              if (lowerArmR) { lowerArmR.rotation.set(-1.0, 0.2, 0); lowerArmR.position.set(0.21, 0.69 + tapR, 0.28); }

              // Gently bob head
              const head = model.getObjectByName('headGroup');
              if (head) {
                head.rotation.x = 0.2;
                head.rotation.y = Math.sin(elapsedTime * 1.5) * 0.05;
              }
            } else {
              // Apply skeletal poses to bones
              const b = bonesRef.current;
              const isRobot = b['leftUpLeg']?.name?.startsWith('Bone') || false;

              if (isRobot) {
                // Apply RobotExpressive specific skeletal poses
                // Bend thighs forward
                if (b['leftUpLeg']) b['leftUpLeg'].rotation.set(-1.45 + Math.sin(elapsedTime * 2.0) * 0.02, 0.1, 0);
                if (b['rightUpLeg']) b['rightUpLeg'].rotation.set(-1.45 + Math.cos(elapsedTime * 2.0) * 0.02, -0.1, 0);

                // Bend shins backward
                if (b['leftLeg']) b['leftLeg'].rotation.set(1.5, 0, 0);
                if (b['rightLeg']) b['rightLeg'].rotation.set(1.5, 0, 0);

                // Lean spine forward slightly
                if (b['spine']) b['spine'].rotation.set(0.12 + Math.sin(elapsedTime * 1.5) * 0.012, 0, 0);

                // Turn head down to screen/keys
                if (b['head']) {
                  b['head'].rotation.set(0.25, Math.sin(elapsedTime * 1.0) * 0.05, 0);
                }

                // Bring arms forward to typing height
                if (b['leftArm']) b['leftArm'].rotation.set(-0.7, -0.2, -0.15);
                if (b['rightArm']) b['rightArm'].rotation.set(-0.7, 0.2, 0.15);

                if (b['leftForeArm']) b['leftForeArm'].rotation.set(-0.5, -0.3, 0);
                if (b['rightForeArm']) b['rightForeArm'].rotation.set(-0.5, 0.3, 0);

                // Simulate hyper-active finger tap movements on keyboard!
                if (b['leftHand']) {
                  b['leftHand'].rotation.set(
                    -0.25 + Math.sin(elapsedTime * 14.0) * 0.22,
                    -0.1 + Math.sin(elapsedTime * 8.0) * 0.05,
                    0
                  );
                }
                if (b['rightHand']) {
                  b['rightHand'].rotation.set(
                    -0.25 + Math.cos(elapsedTime * 16.0) * 0.22,
                    0.1 + Math.sin(elapsedTime * 9.0) * 0.05,
                    0
                  );
                }
              } else {
                // Standard Humanoid / Ready Player Me posing!
                // 1. Reset hips rotation to prevent frozen animation tilts
                if (b['hips']) {
                  b['hips'].rotation.set(0, 0, 0);
                }

                // 2. Lean spine forward slightly
                if (b['spine']) {
                  b['spine'].rotation.set(0.12 + Math.sin(elapsedTime * 1.5) * 0.01, 0, 0);
                }

                // 3. Turn head down to screen/keys
                if (b['head']) {
                  b['head'].rotation.set(0.24, Math.sin(elapsedTime * 1.0) * 0.03, 0);
                }

                // 4. Bend thighs forward to horizontal (positive rotation around local X)
                if (b['leftUpLeg']) b['leftUpLeg'].rotation.set(1.4 + Math.sin(elapsedTime * 1.5) * 0.01, 0.0, 0);
                if (b['rightUpLeg']) b['rightUpLeg'].rotation.set(1.4 + Math.cos(elapsedTime * 1.5) * 0.01, 0.0, 0);

                // 5. Bend knees backward to point shins straight down
                if (b['leftLeg']) b['leftLeg'].rotation.set(1.4, 0, 0);
                if (b['rightLeg']) b['rightLeg'].rotation.set(1.4, 0, 0);

                // 6. Keep feet flat on floor (dorsiflexion)
                if (b['leftFoot']) b['leftFoot'].rotation.set(-0.25, 0, 0);
                if (b['rightFoot']) b['rightFoot'].rotation.set(-0.25, 0, 0);

                // 7. Swing arms forward and down to keyboard level
                // LeftArm: swing forward and slightly down
                if (b['leftArm']) b['leftArm'].rotation.set(0.4, 0.6, -0.8);
                // RightArm: swing forward and slightly down
                if (b['rightArm']) b['rightArm'].rotation.set(-0.4, -0.6, 0.8);

                // 8. Bend elbows inward/forward towards keyboard
                if (b['leftForeArm']) b['leftForeArm'].rotation.set(0, 0, -1.1);
                if (b['rightForeArm']) b['rightForeArm'].rotation.set(0, 0, 1.1);

                // 9. Simulate typing wiggles on the hands resting on keyboard with slight inward angle
                const tapL = Math.sin(elapsedTime * 14.0) * 0.12;
                const tapR = Math.cos(elapsedTime * 16.0) * 0.12;

                if (b['leftHand']) {
                  b['leftHand'].rotation.set(0.1 + tapL, -0.2, -0.1);
                }
                if (b['rightHand']) {
                  b['rightHand'].rotation.set(0.1 + tapR, 0.2, 0.1);
                }
              }
            }

            // Synchronize model's world matrix one last time so skinning vertices are up-to-date
            model.updateMatrixWorld(true);
          }
        } else {
          // Standing default behavior
          model.position.set(0, positionYRef.current, 0);

          if (model.name === 'procedural-fallback-avatar') {
            // Animated Rings for procedural fallback
            const hudRing1 = model.getObjectByName('hudRing1');
            const hudRing2 = model.getObjectByName('hudRing2');
            if (hudRing1) hudRing1.rotation.z += 0.5 * deltaTime;
            if (hudRing2) hudRing2.rotation.z -= 0.3 * deltaTime;

            // Reset limbs
            const thighL = model.getObjectByName('thighL');
            const shinL = model.getObjectByName('shinL');
            const thighR = model.getObjectByName('thighR');
            const shinR = model.getObjectByName('shinR');

            if (thighL) { thighL.rotation.set(0, 0, 0); thighL.position.set(-0.1, 0.4, 0); }
            if (shinL) { shinL.rotation.set(0, 0, 0); shinL.position.set(-0.1, 0.05, 0); }
            if (thighR) { thighR.rotation.set(0, 0, 0); thighR.position.set(0.1, 0.4, 0); }
            if (shinR) { shinR.rotation.set(0, 0, 0); shinR.position.set(0.1, 0.05, 0); }

            const upperArmL = model.getObjectByName('upperArmL');
            const lowerArmL = model.getObjectByName('lowerArmL');
            const upperArmR = model.getObjectByName('upperArmR');
            const lowerArmR = model.getObjectByName('lowerArmR');

            if (upperArmL) { upperArmL.rotation.set(0, 0, 0.1); upperArmL.position.set(-0.28, 1.1, 0); }
            if (lowerArmL) { lowerArmL.rotation.set(-0.2, 0, 0); lowerArmL.position.set(-0.3, 0.85, 0.05); }
            if (upperArmR) { upperArmR.rotation.set(0, 0, -0.1); upperArmR.position.set(0.28, 1.1, 0); }
            if (lowerArmR) { lowerArmR.rotation.set(-0.2, 0, 0); lowerArmR.position.set(0.3, 0.85, 0.05); }

            // Subtle float / hover movement
            model.position.y = positionY + Math.sin(elapsedTime * 2.0) * 0.04;

            // Gently rotate the head group
            const head = model.getObjectByName('headGroup');
            if (head) {
              head.rotation.y = Math.sin(elapsedTime * 1.0) * 0.08;
              head.rotation.z = Math.sin(elapsedTime * 0.5) * 0.03;
            }
          } else {
            // Breathing / floating movement if model has no skeletal animations playing
            const hasActiveSkeletalAnimation = 
              currentActionRef.current && currentActionRef.current.isRunning();

            if (!hasActiveSkeletalAnimation) {
              // Subtle breathing sway and rise
              model.position.y = positionY + Math.sin(elapsedTime * 1.5) * 0.025;
              // Very gentle yaw/roll oscillation
              model.rotation.z = Math.sin(elapsedTime * 0.8) * 0.015;
              model.rotation.x = Math.sin(elapsedTime * 0.5) * 0.01;
            } else {
              // Maintain static positions when animations control skeletal joints
              model.position.y = positionY;
              model.rotation.z = 0;
              model.rotation.x = 0;
            }
          }
        }
      }

      // Rotate PC fans in Desk setup (continuous and realistic)
      if (deskSetupMeshRef.current) {
        deskSetupMeshRef.current.traverse((child) => {
          if (child.name && child.name.startsWith('pcFan')) {
            // Apply slight speed differences to side, top, and back exhaust fans for realistic behavior
            const speedMultiplier = child.name.includes('Back') ? 9.5 : child.name.includes('Top') ? 7.5 : 8.5;
            child.rotation.z += speedMultiplier * deltaTime;
          }
        });
      }

      // Apply Table / Desk subgroup offsets
      if (tableSubGroupRef.current) {
        tableSubGroupRef.current.position.set(
          tablePosXRef.current,
          tablePosYRef.current,
          tablePosZRef.current
        );
      }

      // Apply Chair position offsets
      if (chairGroupRef.current) {
        chairGroupRef.current.position.set(
          chairPosXRef.current,
          chairPosYRef.current,
          -0.05 + chairPosZRef.current
        );
      }

      // Redraw dynamic code on monitor screen
      if (postureRef.current === 'typing') {
        updateMonitorCanvas(elapsedTime);
      }

      // Lock Keyboard and Mouse to stick perfectly to the table top, relative to tableSubGroup!
      if (keyboardMeshRef.current) {
        keyboardMeshRef.current.position.set(
          -0.02 + keyboardPosXRef.current,
          0.595, // Anchored exactly on the desk top surface
          0.26 + keyboardPosZRef.current
        );
        keyboardMeshRef.current.rotation.set(0, 0, 0);
      }

      if (mouseMeshRef.current) {
        mouseMeshRef.current.position.set(
          0.24 + mousePosXRef.current,
          0.595, // Anchored exactly on the desk top surface
          0.26 + mousePosZRef.current
        );
        mouseMeshRef.current.rotation.set(0, 0, 0);
      }

      // Pedestal pulsing glow if cyber
      if (pedestalMeshRef.current && pedestal === 'cyber' && postureRef.current !== 'typing') {
        const glowRing = pedestalMeshRef.current.getObjectByName('glowRing') as THREE.Mesh;
        if (glowRing && glowRing.material) {
          const mat = glowRing.material as THREE.MeshBasicMaterial;
          mat.opacity = 0.4 + Math.sin(elapsedTime * 3) * 0.25;
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
    };
  }, []);

  // 2. Load Model when modelUrl changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Update status
    setStatus('loading');
    setProgress(0);
    setErrorMsg('');
    setUsingFallback(false);
    if (onLoadStatusChange) onLoadStatusChange('loading', 0);

    // Clear previous model & animations
    if (modelRef.current) {
      scene.remove(modelRef.current);
      modelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      modelRef.current = null;
    }

    if (mixerRef.current) {
      mixerRef.current.stopAllAction();
      mixerRef.current = null;
    }
    animationActionsRef.current = {};
    animationClipsRef.current = [];
    currentActionRef.current = null;

    const loader = new GLTFLoader();

    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;

        // Apply scale, position, rotation
        model.scale.setScalar(scale);
        model.position.set(0, positionY, 0);
        model.rotation.set(0, rotationY, 0);

        // Traverse to adjust materials and enable shadows
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            // Enhance materials for modern lighting
            if (child.material) {
              const mat = child.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.max(mat.roughness, 0.15);
              mat.envMapIntensity = 1.2;

              // Fix glass transparencies if needed
              if (child.name.toLowerCase().includes('glass') || (mat.opacity !== undefined && mat.opacity < 1)) {
                mat.transparent = true;
                mat.depthWrite = true;
              }
            }
          }
        });

        scene.add(model);

        // Map bones for posing
        const bones: { [key: string]: THREE.Object3D } = {};
        model.traverse((node) => {
          if (node.type === 'Bone' || node instanceof THREE.Bone) {
            const name = node.name;
            const lowerName = name.toLowerCase();

            // 1. Check for standard humanoid names
            if (lowerName === 'hips' || lowerName === 'pelvis' || lowerName === 'root') {
              bones['hips'] = node;
            } else if (
              lowerName.includes('leftupleg') || 
              lowerName.includes('leftupperleg') || 
              (lowerName.includes('left') && lowerName.includes('thigh')) || 
              lowerName.includes('l_thigh') || 
              lowerName.includes('l_upleg')
            ) {
              bones['leftUpLeg'] = node;
            } else if (
              lowerName.includes('rightupleg') || 
              lowerName.includes('rightupperleg') || 
              (lowerName.includes('right') && lowerName.includes('thigh')) || 
              lowerName.includes('r_thigh') || 
              lowerName.includes('r_upleg')
            ) {
              bones['rightUpLeg'] = node;
            } else if (
              lowerName.includes('leftleg') || 
              lowerName.includes('leftlowerleg') ||
              lowerName.includes('leftshin') ||
              (lowerName.includes('left') && lowerName.includes('shin')) || 
              lowerName.includes('l_calf') || 
              lowerName.includes('l_shin') || 
              lowerName.includes('l_leg')
            ) {
              // Ensure we don't accidentally match UpLeg as Leg if we are too loose
              if (!lowerName.includes('up') && !lowerName.includes('thigh')) {
                bones['leftLeg'] = node;
              }
            } else if (
              lowerName.includes('rightleg') || 
              lowerName.includes('rightlowerleg') ||
              lowerName.includes('rightshin') ||
              (lowerName.includes('right') && lowerName.includes('shin')) || 
              lowerName.includes('r_calf') || 
              lowerName.includes('r_shin') || 
              lowerName.includes('r_leg')
            ) {
              if (!lowerName.includes('up') && !lowerName.includes('thigh')) {
                bones['rightLeg'] = node;
              }
            } else if (
              lowerName.includes('leftfoot') || 
              lowerName.includes('l_foot') || 
              lowerName.includes('l_ankle') || 
              lowerName.includes('leftankle')
            ) {
              bones['leftFoot'] = node;
            } else if (
              lowerName.includes('rightfoot') || 
              lowerName.includes('r_foot') || 
              lowerName.includes('r_ankle') || 
              lowerName.includes('rightankle')
            ) {
              bones['rightFoot'] = node;
            } else if (
              // Upper arm
              (lowerName.includes('leftarm') && !lowerName.includes('fore')) || 
              lowerName.includes('leftuparm') || 
              lowerName.includes('leftupperarm') ||
              (lowerName.includes('left') && lowerName.includes('uparm')) || 
              lowerName.includes('l_uparm') ||
              (lowerName.includes('l_arm') && !lowerName.includes('fore'))
            ) {
              // Strictly ignore shoulder/collar/clavicle bones here!
              if (!lowerName.includes('shoulder') && !lowerName.includes('clavicle') && !lowerName.includes('collar')) {
                bones['leftArm'] = node;
              }
            } else if (
              // Upper arm
              (lowerName.includes('rightarm') && !lowerName.includes('fore')) || 
              lowerName.includes('rightuparm') || 
              lowerName.includes('rightupperarm') ||
              (lowerName.includes('right') && lowerName.includes('uparm')) || 
              lowerName.includes('r_uparm') ||
              (lowerName.includes('r_arm') && !lowerName.includes('fore'))
            ) {
              if (!lowerName.includes('shoulder') && !lowerName.includes('clavicle') && !lowerName.includes('collar')) {
                bones['rightArm'] = node;
              }
            } else if (
              lowerName.includes('leftforearm') || 
              lowerName.includes('l_forearm') || 
              (lowerName.includes('left') && lowerName.includes('forearm')) ||
              lowerName.includes('leftlowerarm') ||
              lowerName.includes('l_lowerarm')
            ) {
              bones['leftForeArm'] = node;
            } else if (
              lowerName.includes('rightforearm') || 
              lowerName.includes('r_forearm') || 
              (lowerName.includes('right') && lowerName.includes('forearm')) ||
              lowerName.includes('rightlowerarm') ||
              lowerName.includes('r_lowerarm')
            ) {
              bones['rightForeArm'] = node;
            } else if (lowerName.includes('lefthand') || lowerName.includes('l_hand')) {
              bones['leftHand'] = node;
            } else if (lowerName.includes('righthand') || lowerName.includes('r_hand')) {
              bones['rightHand'] = node;
            } else if (lowerName === 'spine' || lowerName.includes('spine1') || lowerName.includes('spine_01') || lowerName.includes('spine01') || lowerName === 'spine_02' || lowerName === 'spine02') {
              bones['spine'] = node;
            } else if (lowerName === 'head' || lowerName.includes('head_01') || lowerName.includes('head01')) {
              bones['head'] = node;
            }
            
            // 2. Check for RobotExpressive specific bone names
            if (name === 'Bone') bones['hips'] = node;
            else if (name === 'Bone.001') bones['spine'] = node;
            else if (name === 'Bone.002') bones['head'] = node;
            else if (name === 'Bone.003') bones['leftArm'] = node;
            else if (name === 'Bone.004') bones['leftForeArm'] = node;
            else if (name === 'Bone.005') bones['leftHand'] = node;
            else if (name === 'Bone.008') bones['rightArm'] = node;
            else if (name === 'Bone.009') bones['rightForeArm'] = node;
            else if (name === 'Bone.010') bones['rightHand'] = node;
            else if (name === 'Bone.013') bones['leftUpLeg'] = node;
            else if (name === 'Bone.014') bones['leftLeg'] = node;
            else if (name === 'Bone.015') bones['leftFoot'] = node;
            else if (name === 'Bone.017') bones['rightUpLeg'] = node;
            else if (name === 'Bone.018') bones['rightLeg'] = node;
            else if (name === 'Bone.019') bones['rightFoot'] = node;
          }
        });

        // Dynamic fallback to find feet bones if not found by name
        if (!bones['leftFoot'] && bones['leftLeg']) {
          bones['leftLeg'].traverse((child) => {
            if (!bones['leftFoot'] && child !== bones['leftLeg'] && (child.type === 'Bone' || child instanceof THREE.Bone)) {
              bones['leftFoot'] = child;
            }
          });
        }
        if (!bones['rightFoot'] && bones['rightLeg']) {
          bones['rightLeg'].traverse((child) => {
            if (!bones['rightFoot'] && child !== bones['rightLeg'] && (child.type === 'Bone' || child instanceof THREE.Bone)) {
              bones['rightFoot'] = child;
            }
          });
        }

        bonesRef.current = bones;

        // Setup AnimationMixer
        const mixer = new THREE.AnimationMixer(model);
        mixerRef.current = mixer;
        animationClipsRef.current = gltf.animations;

        const animationNames = gltf.animations.map((clip) => clip.name);
        if (onAnimationsLoaded) {
          onAnimationsLoaded(animationNames);
        }

        // Pre-create all animation actions
        gltf.animations.forEach((clip) => {
          animationActionsRef.current[clip.name] = mixer.clipAction(clip);
        });

        // Play active animation if it exists, or play first one, or trigger local callback
        if (animationNames.length > 0) {
          const defaultAnim = animationNames.includes(activeAnimation) 
            ? activeAnimation 
            : animationNames[0];
          
          playAnimation(defaultAnim);
        }

        setStatus('success');
        if (onLoadStatusChange) onLoadStatusChange('success', 100);

        // Adjust camera controls target dynamically based on model bounding box
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        if (controlsRef.current) {
          controlsRef.current.target.set(0, center.y || 0.9, 0);
          controlsRef.current.update();
        }
      },
      (xhr) => {
        if (xhr.total > 0) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          setProgress(percent);
          if (onLoadStatusChange) onLoadStatusChange('loading', percent);
        }
      },
      (error) => {
        console.warn('Error loading GLB, building procedural fallback:', error);
        
        // Define theme-colored hologram glow
        let themeColorHex = 0x9d81ff; // Default violet
        if (lighting === 'cyberpunk') {
          themeColorHex = 0xff00aa; // Neon Pink
        } else if (lighting === 'warm') {
          themeColorHex = 0xf59e0b; // Warm Gold
        } else if (lighting === 'studio') {
          themeColorHex = 0x10b981; // Emerald Green
        }

        const fallbackGroup = new THREE.Group();
        fallbackGroup.name = 'procedural-fallback-avatar';

        // Holographic physical material
        const holographicMaterial = new THREE.MeshPhysicalMaterial({
          color: themeColorHex,
          emissive: themeColorHex,
          emissiveIntensity: 0.6,
          transparent: true,
          opacity: 0.75,
          roughness: 0.1,
          metalness: 0.9,
          transmission: 0.6,
          thickness: 1.2,
        });

        // 1. Torso capsule
        const torsoGeom = new THREE.CylinderGeometry(0.2, 0.12, 0.6, 16);
        const torso = new THREE.Mesh(torsoGeom, holographicMaterial);
        torso.position.y = 1.0;
        torso.castShadow = true;
        torso.receiveShadow = true;
        fallbackGroup.add(torso);

        // 2. Head Group
        const headGroup = new THREE.Group();
        headGroup.name = 'headGroup';
        headGroup.position.set(0, 1.45, 0);
        
        const headGeom = new THREE.SphereGeometry(0.14, 32, 32);
        const head = new THREE.Mesh(headGeom, holographicMaterial);
        headGroup.add(head);

        // Visor/Screen (Glowing neon)
        const visorGeom = new THREE.BoxGeometry(0.18, 0.05, 0.16);
        const visorMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.9,
        });
        const visor = new THREE.Mesh(visorGeom, visorMat);
        visor.position.set(0, 0.02, 0.09);
        headGroup.add(visor);
        fallbackGroup.add(headGroup);

        // 3. Pelvis
        const pelvisGeom = new THREE.CylinderGeometry(0.12, 0.08, 0.15, 16);
        const pelvis = new THREE.Mesh(pelvisGeom, holographicMaterial);
        pelvis.position.y = 0.65;
        fallbackGroup.add(pelvis);

        // 4. Joints and limbs
        const joints = [
          { x: -0.24, y: 1.25, z: 0 }, // L Shoulder
          { x: 0.24, y: 1.25, z: 0 },  // R Shoulder
          { x: -0.1, y: 0.55, z: 0 },  // L Hip
          { x: 0.1, y: 0.55, z: 0 },   // R Hip
        ];

        const jointGeom = new THREE.SphereGeometry(0.045, 16, 16);
        joints.forEach(j => {
          const jointMesh = new THREE.Mesh(jointGeom, holographicMaterial);
          jointMesh.position.set(j.x, j.y, j.z);
          fallbackGroup.add(jointMesh);
        });

        // Left Arm (upper & lower)
        const upperArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.3, 8), holographicMaterial);
        upperArmL.position.set(-0.28, 1.1, 0);
        upperArmL.rotation.z = 0.1;
        upperArmL.name = 'upperArmL';
        fallbackGroup.add(upperArmL);

        const lowerArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.025, 0.28, 8), holographicMaterial);
        lowerArmL.position.set(-0.3, 0.85, 0.05);
        lowerArmL.rotation.x = -0.2;
        lowerArmL.name = 'lowerArmL';
        fallbackGroup.add(lowerArmL);

        // Right Arm (upper & lower)
        const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.3, 8), holographicMaterial);
        upperArmR.position.set(0.28, 1.1, 0);
        upperArmR.rotation.z = -0.1;
        upperArmR.name = 'upperArmR';
        fallbackGroup.add(upperArmR);

        const lowerArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.025, 0.28, 8), holographicMaterial);
        lowerArmR.position.set(0.3, 0.85, 0.05);
        lowerArmR.rotation.x = -0.2;
        lowerArmR.name = 'lowerArmR';
        fallbackGroup.add(lowerArmR);

        // Left Leg
        const thighL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.35, 8), holographicMaterial);
        thighL.position.set(-0.1, 0.4, 0);
        thighL.name = 'thighL';
        fallbackGroup.add(thighL);

        const shinL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.35, 8), holographicMaterial);
        shinL.position.set(-0.1, 0.05, 0);
        shinL.name = 'shinL';
        fallbackGroup.add(shinL);

        // Right Leg
        const thighR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.35, 8), holographicMaterial);
        thighR.position.set(0.1, 0.4, 0);
        thighR.name = 'thighR';
        fallbackGroup.add(thighR);

        const shinR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.35, 8), holographicMaterial);
        shinR.position.set(0.1, 0.05, 0);
        shinR.name = 'shinR';
        fallbackGroup.add(shinR);

        // 5. Sci-Fi Floating Rings
        const ringGeom1 = new THREE.RingGeometry(0.35, 0.36, 32);
        const ringMat1 = new THREE.MeshBasicMaterial({ color: themeColorHex, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
        const ring1 = new THREE.Mesh(ringGeom1, ringMat1);
        ring1.position.y = 1.0;
        ring1.rotation.x = Math.PI / 2;
        ring1.name = 'hudRing1';
        fallbackGroup.add(ring1);

        const ringGeom2 = new THREE.RingGeometry(0.42, 0.43, 32);
        const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
        const ring2 = new THREE.Mesh(ringGeom2, ringMat2);
        ring2.position.y = 1.2;
        ring2.rotation.x = Math.PI / 2.3;
        ring2.name = 'hudRing2';
        fallbackGroup.add(ring2);

        // Apply scales
        fallbackGroup.scale.setScalar(scale);
        fallbackGroup.position.set(0, positionY, 0);
        fallbackGroup.rotation.set(0, rotationY, 0);

        scene.add(fallbackGroup);
        modelRef.current = fallbackGroup;

        // Map limbs to bonesRef so dynamic typing alignments function identically
        const fallbackBones: { [key: string]: THREE.Object3D } = {};
        if (lowerArmL) fallbackBones['leftHand'] = lowerArmL;
        if (lowerArmR) fallbackBones['rightHand'] = lowerArmR;
        bonesRef.current = fallbackBones;

        // Reset camera targets to fit the new fallback model
        if (controlsRef.current) {
          controlsRef.current.target.set(0, 1.0, 0);
          controlsRef.current.update();
        }

        // Mock animation modes so the animation tabs are interactive
        if (onAnimationsLoaded) {
          onAnimationsLoaded(['Hover', 'Activate']);
        }

        setUsingFallback(true);
        setStatus('success');
        if (onLoadStatusChange) onLoadStatusChange('success', 100);
      }
    );
  }, [modelUrl]);

  const updateMonitorCanvas = (elapsedTime: number) => {
    const canvas = monitorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#05050c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines / scanlines
    ctx.strokeStyle = 'rgba(0, 255, 128, 0.05)';
    ctx.lineWidth = 1;
    for (let y = 0; y < canvas.height; y += 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Scrolling text code lines
    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = '#10b981'; // Emerald/Green

    // We can draw code blocks that scroll based on time
    const codeLines = [
      'import { useEffect, useState } from "react";',
      'import * as THREE from "three";',
      ' ',
      'const scene = new THREE.Scene();',
      'const camera = new THREE.PerspectiveCamera(45, w/h);',
      'const avatar = await loadModel(modelUrl);',
      ' ',
      'function animate() {',
      '  requestAnimationFrame(animate);',
      '  avatar.bones.hands.typeOnKeyboard();',
      '  monitorTexture.needsUpdate = true;',
      '  renderer.render(scene, camera);',
      '}',
      ' ',
      '// Compile successful. Ready to run.',
      'const PORT = 3000;',
      'server.listen(PORT, "0.0.0.0", () => {',
      '  console.log(`Server live on port ${PORT}`);',
      '});'
    ];

    const totalHeight = codeLines.length * 15;
    const scrollY = (elapsedTime * 30) % (totalHeight + 100) - 50;

    codeLines.forEach((line, i) => {
      const lineY = 30 + i * 15 - scrollY;
      if (lineY > 0 && lineY < canvas.height) {
        // Draw indent syntax highlighting
        if (line.includes('import') || line.includes('const') || line.includes('function')) {
          ctx.fillStyle = '#ff00aa'; // Pink keywords
        } else if (line.includes('//') || line.includes('`')) {
          ctx.fillStyle = '#eab308'; // Amber comments / templates
        } else if (line.includes('(') || line.includes('{')) {
          ctx.fillStyle = '#38bdf8'; // Blue braces / calls
        } else {
          ctx.fillStyle = '#10b981'; // Green standard
        }
        ctx.fillText(line, 15, lineY);
      }
    });

    // Glowing title bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, 22);
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 21, canvas.width, 1);
    
    // Windows control circles
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(15, 11, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(27, 11, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.arc(39, 11, 4, 0, Math.PI * 2); ctx.fill();

    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('AvatarWorkspace.ts - VS Code', 60, 14);

    if (monitorTextureRef.current) {
      monitorTextureRef.current.needsUpdate = true;
    }
    if (monitorTextureBackRef.current) {
      monitorTextureBackRef.current.needsUpdate = true;
    }
  };

  // Reset all bones to their default bind pose
  const resetBonesToDefault = () => {
    const bones = bonesRef.current;
    if (bones) {
      Object.keys(bones).forEach((key) => {
        const bone = bones[key];
        if (bone) {
          bone.rotation.set(0, 0, 0);
          bone.quaternion.set(0, 0, 0, 1);
        }
      });
    }
  };

  // Helper function to handle animation fade transitions
  const playAnimation = (name: string) => {
    if (!mixerRef.current || !animationActionsRef.current[name]) return;

    const action = animationActionsRef.current[name];
    const prevAction = currentActionRef.current;

    if (prevAction === action) {
      if (!action.isRunning()) {
        action.play();
      }
      return;
    }

    if (prevAction) {
      prevAction.fadeOut(0.3);
    }

    action
      .reset()
      .setEffectiveWeight(1)
      .fadeIn(0.3)
      .play();

    currentActionRef.current = action;
  };

  // 3. Play selected animation when prop changes or posture changes
  useEffect(() => {
    if (status === 'success') {
      resetBonesToDefault();
      if (activeAnimation) {
        playAnimation(activeAnimation);
      }
    }
  }, [activeAnimation, status, posture]);

  // 4. Update scale, positionY, rotationY on the loaded model
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.scale.setScalar(scale);
      modelRef.current.position.y = positionY;
      modelRef.current.rotation.y = rotationY;
    }
  }, [scale, positionY, rotationY]);

  // 5. Update Lighting Preset
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clear old lights if any
    if (ambientLightRef.current) scene.remove(ambientLightRef.current);
    if (dirLight1Ref.current) scene.remove(dirLight1Ref.current);
    if (dirLight2Ref.current) scene.remove(dirLight2Ref.current);
    if (pointLightRef.current) scene.remove(pointLightRef.current);

    // Default parameters
    let ambientColor = 0xffffff;
    let ambientIntensity = 0.5;
    
    let dir1Color = 0xffffff;
    let dir1Intensity = 1.0;
    let dir1Pos = new THREE.Vector3(5, 8, 5);

    let dir2Color = 0x8899ff;
    let dir2Intensity = 0.4;
    let dir2Pos = new THREE.Vector3(-5, 4, -5);

    let pointColor = 0x00ffff;
    let pointIntensity = 0.0;
    let pointPos = new THREE.Vector3(0, 1, 1);

    switch (lighting) {
      case 'studio':
        // Professional white photo studio lighting
        scene.background = null;
        ambientColor = 0xddeeff;
        ambientIntensity = 0.6;
        
        dir1Color = 0xffffff;
        dir1Intensity = 1.2;
        dir1Pos.set(4, 10, 5);
        
        dir2Color = 0xaabbcc;
        dir2Intensity = 0.5;
        dir2Pos.set(-4, 5, -3);
        break;

      case 'neon':
        // Warm synthwave sunset orange & hot pink
        ambientColor = 0x221133;
        ambientIntensity = 0.8;

        dir1Color = 0xff33aa; // Hot pink
        dir1Intensity = 2.0;
        dir1Pos.set(5, 5, 4);

        dir2Color = 0x22eeff; // Cyber cyan
        dir2Intensity = 1.5;
        dir2Pos.set(-5, 3, 2);

        pointColor = 0xffaa00; // Neon orange accent
        pointIntensity = 1.2;
        pointPos.set(0, 0.5, 1.5);
        break;

      case 'cyberpunk':
        // Vivid futuristic techno blue and purple
        ambientColor = 0x050515;
        ambientIntensity = 0.4;

        dir1Color = 0x00aaff; // Neon Blue
        dir1Intensity = 2.5;
        dir1Pos.set(-4, 6, 4);

        dir2Color = 0x9900ff; // Neon Purple
        dir2Intensity = 2.0;
        dir2Pos.set(4, 3, -2);

        pointColor = 0xff0055; // Pink back fill
        pointIntensity = 1.5;
        pointPos.set(0, 2, -1.5);
        break;

      case 'warm':
        // Sunset golden hour glow
        ambientColor = 0x3d3025;
        ambientIntensity = 0.7;

        dir1Color = 0xffaa44; // Deep golden orange
        dir1Intensity = 2.2;
        dir1Pos.set(6, 6, 4);

        dir2Color = 0x4488ff; // Deep blue shadow fill
        dir2Intensity = 0.6;
        dir2Pos.set(-5, 2, -3);

        pointColor = 0xffeedd; // Soft warm accent
        pointIntensity = 0.8;
        pointPos.set(1, 1.5, 1);
        break;
    }

    // Create & add ambient
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // Create & add primary directional light with shadows
    const dirLight1 = new THREE.DirectionalLight(dir1Color, dir1Intensity);
    dirLight1.position.copy(dir1Pos);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    dirLight1.shadow.camera.near = 0.5;
    dirLight1.shadow.camera.far = 25;
    dirLight1.shadow.camera.left = -2;
    dirLight1.shadow.camera.right = 2;
    dirLight1.shadow.camera.top = 2;
    dirLight1.shadow.camera.bottom = -2;
    dirLight1.shadow.bias = -0.0005;
    scene.add(dirLight1);
    dirLight1Ref.current = dirLight1;

    // Create & add secondary directional light
    const dirLight2 = new THREE.DirectionalLight(dir2Color, dir2Intensity);
    dirLight2.position.copy(dir2Pos);
    scene.add(dirLight2);
    dirLight2Ref.current = dirLight2;

    // Create point light for dramatic glow
    if (pointIntensity > 0) {
      const pointLight = new THREE.PointLight(pointColor, pointIntensity, 6);
      pointLight.position.copy(pointPos);
      scene.add(pointLight);
      pointLightRef.current = pointLight;
    }
  }, [lighting]);

  // 6. Update Pedestal Style
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove old pedestal
    if (pedestalMeshRef.current) {
      scene.remove(pedestalMeshRef.current);
      pedestalMeshRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      pedestalMeshRef.current = null;
    }

    if (pedestal === 'none' || posture === 'typing') return;

    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, -0.01, 0); // Keep just below floor level

    // Build based on style
    if (pedestal === 'glass') {
      // Sleek Glass Pedestal
      const cylGeo = new THREE.CylinderGeometry(0.7, 0.75, 0.15, 32);
      const cylMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.25,
        transmission: 0.6, // Gives glass look in standard materials
        thickness: 0.5,
      });
      const cyl = new THREE.Mesh(cylGeo, cylMat);
      cyl.receiveShadow = true;
      cyl.position.y = 0.075;
      pedestalGroup.add(cyl);

      // Add a metallic chrome ring
      const ringGeo = new THREE.TorusGeometry(0.7, 0.02, 16, 64);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.9,
        roughness: 0.1,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.15;
      pedestalGroup.add(ring);
    } 
    else if (pedestal === 'cyber') {
      // Cyber Sci-Fi Pedestal with glowing ring
      const baseGeo = new THREE.CylinderGeometry(0.8, 0.85, 0.12, 8); // Octagonal
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x111625,
        roughness: 0.4,
        metalness: 0.8,
      });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.receiveShadow = true;
      base.position.y = 0.06;
      pedestalGroup.add(base);

      // Glowing radial disc
      const glowGeo = new THREE.TorusGeometry(0.75, 0.015, 8, 32);
      const glowMat = new THREE.MeshBasicMaterial({
        color: lighting === 'cyberpunk' ? 0xff0055 : lighting === 'neon' ? 0x22eeff : 0x00ffcc,
        transparent: true,
        opacity: 0.6,
      });
      const glowRing = new THREE.Mesh(glowGeo, glowMat);
      glowRing.name = 'glowRing';
      glowRing.rotation.x = Math.PI / 2;
      glowRing.position.y = 0.12;
      pedestalGroup.add(glowRing);

      // Grid helper inside
      const grid = new THREE.GridHelper(1.3, 8, 0x445588, 0x223355);
      grid.position.y = 0.121;
      pedestalGroup.add(grid);
    } 
    else if (pedestal === 'stone') {
      // Heavy solid brutalist dark basalt/granite rock pedestal
      const stoneGeo = new THREE.CylinderGeometry(0.65, 0.75, 0.2, 24);
      const stoneMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.85,
        metalness: 0.1,
        bumpScale: 0.05,
      });
      const stone = new THREE.Mesh(stoneGeo, stoneMat);
      stone.receiveShadow = true;
      stone.position.y = 0.1;
      pedestalGroup.add(stone);
    }

    scene.add(pedestalGroup);
    pedestalMeshRef.current = pedestalGroup;
  }, [pedestal, lighting, posture]);

  // 7. Update Desk & PC Setup Style based on posture
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove old desk setup
    if (deskSetupMeshRef.current) {
      scene.remove(deskSetupMeshRef.current);
      deskSetupMeshRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      deskSetupMeshRef.current = null;
    }

    if (posture !== 'typing') {
      if (monitorTextureRef.current) {
        monitorTextureRef.current.dispose();
        monitorTextureRef.current = null;
      }
      if (monitorTextureBackRef.current) {
        monitorTextureBackRef.current.dispose();
        monitorTextureBackRef.current = null;
      }
      monitorCanvasRef.current = null;
      return;
    }

    // Build the Desk & PC Setup
    const deskGroup = new THREE.Group();
    deskGroup.name = 'desk-pc-keyboard-setup';

    let themeColorHex = 0x10b981; // emerald
    if (lighting === 'cyberpunk') themeColorHex = 0xff00aa;
    else if (lighting === 'neon') themeColorHex = 0x22eeff;
    else if (lighting === 'warm') themeColorHex = 0xf59e0b;

    const themeMaterial = new THREE.MeshStandardMaterial({
      color: themeColorHex,
      emissive: themeColorHex,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.8,
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      transmission: 0.9,
      roughness: 0.1,
      metalness: 0.1,
      thickness: 0.2,
    });

    const matteDarkMaterial = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      roughness: 0.6,
      metalness: 0.3,
    });

    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x2e323e,
      roughness: 0.2,
      metalness: 0.9,
    });

    // --- 1. CHAIR ---
    const chairGroup = new THREE.Group();
    chairGroup.name = 'chair';
    chairGroupRef.current = chairGroup;
    chairGroup.position.set(0, 0, -0.05); // slightly behind center

    // Center shaft
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8), metalMaterial);
    shaft.position.y = 0.15;
    chairGroup.add(shaft);

    // Star Base Legs
    const starBase = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const baseLeg = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.02, 0.04), metalMaterial);
      baseLeg.position.set(Math.cos(angle) * 0.14, 0.01, Math.sin(angle) * 0.14);
      baseLeg.rotation.y = -angle;
      starBase.add(baseLeg);
    }
    chairGroup.add(starBase);

    // Seat Cushion
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.42), matteDarkMaterial);
    cushion.position.y = 0.33;
    cushion.castShadow = true;
    cushion.receiveShadow = true;
    chairGroup.add(cushion);

    // Red/Neon Accent Trim on Cushion
    const cushionTrim = new THREE.Mesh(new THREE.BoxGeometry(0.43, 0.015, 0.43), themeMaterial);
    cushionTrim.position.y = 0.33;
    chairGroup.add(cushionTrim);

    // Chair Back support bar
    const backBar = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.4, 0.03), metalMaterial);
    backBar.position.set(0, 0.5, -0.19);
    backBar.rotation.x = 0.05;
    chairGroup.add(backBar);

    // Backrest
    const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.48, 0.05), matteDarkMaterial);
    backrest.position.set(0, 0.72, -0.2);
    backrest.rotation.x = 0.05;
    backrest.castShadow = true;
    chairGroup.add(backrest);

    // Backrest Accent center bar
    const backrestAccent = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.46, 0.06), themeMaterial);
    backrestAccent.position.set(0, 0.72, -0.2);
    backrestAccent.rotation.x = 0.05;
    chairGroup.add(backrestAccent);

    // Armrests
    const armrestL = new THREE.Group();
    armrestL.position.set(-0.23, 0.45, 0);
    const armSupportL = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.15, 8), metalMaterial);
    armSupportL.position.y = 0.075;
    const armPadL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.02, 0.22), matteDarkMaterial);
    armPadL.position.set(0, 0.15, 0.04);
    armrestL.add(armSupportL, armPadL);
    chairGroup.add(armrestL);

    const armrestR = new THREE.Group();
    armrestR.position.set(0.23, 0.45, 0);
    const armSupportR = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.15, 8), metalMaterial);
    armSupportR.position.y = 0.075;
    const armPadR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.02, 0.22), matteDarkMaterial);
    armPadR.position.set(0, 0.15, 0.04);
    armrestR.add(armSupportR, armPadR);
    chairGroup.add(armrestR);

    deskGroup.add(chairGroup);


    // Create Table/Desk subgroup to allow independent translation alignment
    const tableSubGroup = new THREE.Group();
    tableSubGroup.name = 'table-subgroup';
    tableSubGroupRef.current = tableSubGroup;

    // --- 2. THE DESK ---
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.03, 0.65), matteDarkMaterial);
    deskTop.position.set(0, 0.58, 0.35); // offset forward
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    tableSubGroup.add(deskTop);

    // LED desk back light strip
    const deskLed = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.01, 0.01), themeMaterial);
    deskLed.position.set(0, 0.59, 0.66);
    tableSubGroup.add(deskLed);

    // Left and Right Solid desk legs
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.58, 0.6), metalMaterial);
    legL.position.set(-0.62, 0.29, 0.35);
    legL.castShadow = true;
    legL.receiveShadow = true;
    tableSubGroup.add(legL);

    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.58, 0.6), metalMaterial);
    legR.position.set(0.62, 0.29, 0.35);
    legR.castShadow = true;
    legR.receiveShadow = true;
    tableSubGroup.add(legR);


    // --- 3. MONITOR ---
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(0, 0.595, 0.55); // centered at back of desk

    // Monitor base stand
    const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.012, 16), metalMaterial);
    standBase.position.y = 0.006;
    monitorGroup.add(standBase);

    const standPole = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.22, 0.03), metalMaterial);
    standPole.position.set(0, 0.11, 0.02);
    standPole.rotation.x = -0.1;
    monitorGroup.add(standPole);

    // Create the HTML canvas for dynamic code typing
    const monitorCanvas = document.createElement('canvas');
    monitorCanvas.width = 512;
    monitorCanvas.height = 256;
    monitorCanvasRef.current = monitorCanvas;

    // Create texture
    const monitorTexture = new THREE.CanvasTexture(monitorCanvas);
    monitorTextureRef.current = monitorTexture;

    // Create back texture (mirrored horizontally so when plane is rotated, text reads left-to-right normally)
    const monitorTextureBack = monitorTexture.clone();
    monitorTextureBack.wrapS = THREE.RepeatWrapping;
    monitorTextureBack.repeat.x = -1;
    monitorTextureBackRef.current = monitorTextureBack;

    const screenMaterial = new THREE.MeshBasicMaterial({
      map: monitorTexture,
    });

    const screenMaterialBack = new THREE.MeshBasicMaterial({
      map: monitorTextureBack,
    });

    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x0c0d12,
      roughness: 0.4,
      metalness: 0.8,
    });

    // Monitor frame (Outer bezel)
    const monitorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.32, 0.02), frameMaterial);
    monitorFrame.position.set(0, 0.26, 0.02);
    monitorFrame.castShadow = true;
    monitorGroup.add(monitorFrame);

    // Front monitor screen mesh (facing user/camera)
    const monitorScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.70, 0.30), screenMaterial);
    monitorScreen.position.set(0, 0.26, 0.031); // slightly out on front face
    monitorGroup.add(monitorScreen);

    // Back monitor screen mesh (facing avatar, rotated 180 degrees)
    const monitorScreenBack = new THREE.Mesh(new THREE.PlaneGeometry(0.70, 0.30), screenMaterialBack);
    monitorScreenBack.position.set(0, 0.26, 0.009); // slightly out on back face
    monitorScreenBack.rotation.y = Math.PI; // Face the avatar (-Z)
    monitorGroup.add(monitorScreenBack);

    // Emissive logo relocated to the monitor stand pole
    const standLogo = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.01), themeMaterial);
    standLogo.position.set(0, 0.12, 0.036);
    monitorGroup.add(standLogo);

    tableSubGroup.add(monitorGroup);


    // --- 4. KEYBOARD ---
    const keyboardGroup = new THREE.Group();
    keyboardGroup.name = 'keyboard';
    keyboardGroup.position.set(-0.02, 0.595, 0.26); // in front of user

    const kbBase = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.012, 0.12), metalMaterial);
    kbBase.position.y = 0.006;
    kbBase.castShadow = true;
    keyboardGroup.add(kbBase);

    // Glowing keyboard backlight plate
    const kbLight = new THREE.Mesh(new THREE.BoxGeometry(0.352, 0.004, 0.122), themeMaterial);
    kbLight.position.y = 0.008;
    keyboardGroup.add(kbLight);

    // Simplistic rows of keys for detailed visual look
    const keyRowHeight = 0.008;
    for (let r = 0; r < 5; r++) {
      const zPos = -0.045 + r * 0.022;
      const rowMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, keyRowHeight, 0.014),
        new THREE.MeshStandardMaterial({ color: 0x0f1118, roughness: 0.7 })
      );
      rowMesh.position.set(0, 0.012, zPos);
      keyboardGroup.add(rowMesh);
    }
    tableSubGroup.add(keyboardGroup);
    keyboardMeshRef.current = keyboardGroup;


    // --- 5. MOUSE ---
    const mouseGroup = new THREE.Group();
    mouseGroup.name = 'mouse-group';
    mouseGroup.position.set(0.24, 0.595, 0.26);

    const mouseMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.038, 0.015, 0.065),
      new THREE.MeshStandardMaterial({ color: 0x0f111a, roughness: 0.5 })
    );
    mouseMesh.position.y = 0.0075;
    mouseMesh.castShadow = true;
    mouseGroup.add(mouseMesh);

    const mouseLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.004, 0.005, 0.02),
      themeMaterial
    );
    mouseLed.position.set(0, 0.015, -0.01);
    mouseGroup.add(mouseLed);

    tableSubGroup.add(mouseGroup);
    mouseMeshRef.current = mouseGroup;


    // --- 6. PC TOWER: TECHNOZONE C270 ARGB STYLE (AQUARIUM DUAL-CHAMBER CASE) ---
    const pcGroup = new THREE.Group();
    pcGroup.position.set(0.48, 0.595, 0.44); // right side of desk
    pcGroup.rotation.y = -Math.PI / 6; // angled nicely!

    // Case Dimensions: Width = 0.22, Height = 0.36, Depth = 0.36
    const caseW = 0.22;
    const caseH = 0.36;
    const caseD = 0.36;

    // Materials
    const chassisMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0b0e,
      roughness: 0.5,
      metalness: 0.8,
    });
    
    const internalPlateMaterial = new THREE.MeshStandardMaterial({
      color: 0x12141c,
      roughness: 0.6,
      metalness: 0.7,
    });

    // 1. Bottom Base
    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(caseW, 0.02, caseD), chassisMaterial);
    baseMesh.position.y = 0.01;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    pcGroup.add(baseMesh);

    // 2. Case Feet (four small cylinders at the bottom corners)
    const footGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.015, 8);
    const footMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
    const footOffsets = [
      [-0.09, 0.15], [-0.09, -0.15], [0.09, 0.15], [0.09, -0.15]
    ];
    footOffsets.forEach(([fx, fz]) => {
      const foot = new THREE.Mesh(footGeo, footMat);
      foot.position.set(fx, 0.0075, fz);
      pcGroup.add(foot);
    });

    // 3. Top Panel (slotted style for exhaust)
    const topPanel = new THREE.Mesh(new THREE.BoxGeometry(caseW, 0.015, caseD), chassisMaterial);
    topPanel.position.y = caseH - 0.0075;
    topPanel.castShadow = true;
    pcGroup.add(topPanel);

    // 4. Right Side Panel (Solid metal panel of the dual-chamber layout)
    const rightPanel = new THREE.Mesh(new THREE.BoxGeometry(0.015, caseH - 0.035, caseD - 0.002), chassisMaterial);
    rightPanel.position.set(caseW / 2 - 0.0075, caseH / 2, 0);
    rightPanel.castShadow = true;
    pcGroup.add(rightPanel);

    // 5. Back Panel (Exhaust panel, cutouts modeled subtly)
    const backPanel = new THREE.Mesh(new THREE.BoxGeometry(caseW - 0.015, caseH - 0.035, 0.015), chassisMaterial);
    backPanel.position.set(-0.0075, caseH / 2, -caseD / 2 + 0.0075);
    backPanel.castShadow = true;
    pcGroup.add(backPanel);

    // 6. Motherboard Divider Partition Plate (Separating left aquarium compartment from right PSU chamber)
    const dividerPlate = new THREE.Mesh(new THREE.BoxGeometry(0.01, caseH - 0.035, caseD - 0.03), internalPlateMaterial);
    // Positioned slightly right of center to leave room for motherboard and GPU on the left
    dividerPlate.position.set(0.03, caseH / 2, 0.01);
    pcGroup.add(dividerPlate);

    // 7. Panoramic Seamless Glass Panels (No metal pillar at front-left corner!)
    // Left Glass Panel
    const leftGlass = new THREE.Mesh(new THREE.PlaneGeometry(caseD - 0.01, caseH - 0.035), glassMaterial);
    leftGlass.position.set(-caseW / 2 + 0.002, caseH / 2, 0);
    leftGlass.rotation.y = -Math.PI / 2;
    pcGroup.add(leftGlass);

    // Front Glass Panel
    const frontGlass = new THREE.Mesh(new THREE.PlaneGeometry(caseW - 0.01, caseH - 0.035), glassMaterial);
    frontGlass.position.set(0, caseH / 2, caseD / 2 - 0.002);
    pcGroup.add(frontGlass);

    // 8. Motherboard details inside
    const mobo = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.22, 0.22), new THREE.MeshStandardMaterial({ color: 0x15161c, roughness: 0.8 }));
    mobo.position.set(0.021, 0.17, -0.03);
    pcGroup.add(mobo);

    // RAM sticks (glowing theme RGB/neon!)
    const ramGeo = new THREE.BoxGeometry(0.006, 0.03, 0.004);
    for (let r = 0; r < 4; r++) {
      const ram = new THREE.Mesh(ramGeo, themeMaterial);
      ram.position.set(0.018, 0.22, 0.01 + r * 0.008);
      pcGroup.add(ram);
    }

    // AIO CPU Water Cooler Block (Circle with glowing logo/ring)
    const coolerPump = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.012, 16), new THREE.MeshStandardMaterial({ color: 0x1f222e, roughness: 0.3 }));
    coolerPump.position.set(0.015, 0.17, -0.04);
    coolerPump.rotation.z = Math.PI / 2;
    pcGroup.add(coolerPump);

    const coolerGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.014, 16), themeMaterial);
    coolerGlow.position.set(0.015, 0.17, -0.04);
    coolerGlow.rotation.z = Math.PI / 2;
    pcGroup.add(coolerGlow);

    // Tubes from Cooler to top/side
    const tubeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.015, 0.17, -0.04),
      new THREE.Vector3(-0.02, 0.20, -0.02),
      new THREE.Vector3(0.01, 0.28, 0.05)
    ]);
    const tubeGeo = new THREE.TubeGeometry(tubeCurve, 10, 0.005, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.8 });
    const tubes = new THREE.Mesh(tubeGeo, tubeMat);
    pcGroup.add(tubes);

    // Vertical/Horizontal High-End GPU (RTX 4090/5090 style)
    const gpuBody = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.07, 0.22), new THREE.MeshStandardMaterial({ color: 0x1a1c23, roughness: 0.4 }));
    gpuBody.position.set(-0.02, 0.11, -0.02);
    gpuBody.castShadow = true;
    pcGroup.add(gpuBody);

    // Glowing GPU ARGB strip
    const gpuLed = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.006, 0.21), themeMaterial);
    gpuLed.position.set(-0.02, 0.135, -0.02);
    pcGroup.add(gpuLed);

    // Helper to create a highly detailed ARGB fan (glowing ring + rotating blades)
    const createDetailedFan = (name: string, pos: THREE.Vector3, rot: THREE.Euler) => {
      const fanGroup = new THREE.Group();
      fanGroup.position.copy(pos);
      fanGroup.rotation.copy(rot);

      // Outer glowing ring
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.004, 8, 24), themeMaterial);
      fanGroup.add(ring);

      // Simple frame struts
      const strutMat = new THREE.MeshStandardMaterial({ color: 0x101115, roughness: 0.8 });
      const strut1 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.004, 0.004), strutMat);
      const strut2 = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.07, 0.004), strutMat);
      fanGroup.add(strut1, strut2);

      // Central spinning hub + blades
      const rotatingPart = new THREE.Group();
      rotatingPart.name = name; // matches the startsWith('pcFan') condition

      // Fan hub
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.008, 12), strutMat);
      hub.rotation.x = Math.PI / 2;
      rotatingPart.add(hub);

      // Semi-transparent or matte blades
      const bladeGeo = new THREE.BoxGeometry(0.024, 0.008, 0.002);
      const bladeMat = new THREE.MeshStandardMaterial({
        color: 0x222530,
        roughness: 0.6,
        transparent: true,
        opacity: 0.8
      });
      for (let i = 0; i < 7; i++) {
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.set(0, 0, 0.002);
        // Angled to look like aerodynamic propeller blades
        blade.rotation.z = (i * Math.PI * 2) / 7;
        blade.rotation.x = 0.3; // pitch
        rotatingPart.add(blade);
      }

      fanGroup.add(rotatingPart);
      return fanGroup;
    };

    // 9. Side Intake ARGB Fans (Stack of 2, visible on the vertical divider partition)
    // Mounted facing left (-X), so their rotation.y is -Math.PI / 2
    const sideFanEuler = new THREE.Euler(0, -Math.PI / 2, 0);
    const sideFan1 = createDetailedFan('pcFanSide1', new THREE.Vector3(0.024, 0.12, 0.06), sideFanEuler);
    const sideFan2 = createDetailedFan('pcFanSide2', new THREE.Vector3(0.024, 0.24, 0.06), sideFanEuler);
    pcGroup.add(sideFan1, sideFan2);

    // 10. Rear Exhaust ARGB Fan
    // Mounted facing forward/backward (+Z/-Z) on the backplate, rotation.y is 0
    const rearFanEuler = new THREE.Euler(0, 0, 0);
    const rearFan = createDetailedFan('pcFanBack', new THREE.Vector3(-0.02, 0.24, -0.14), rearFanEuler);
    pcGroup.add(rearFan);

    // 11. Top Exhaust ARGB Fans (Stack of 2 under the top mesh)
    // Mounted facing down/up, rotation.x is Math.PI / 2
    const topFanEuler = new THREE.Euler(Math.PI / 2, 0, 0);
    const topFan1 = createDetailedFan('pcFanTop1', new THREE.Vector3(-0.02, 0.32, -0.04), topFanEuler);
    const topFan2 = createDetailedFan('pcFanTop2', new THREE.Vector3(-0.02, 0.32, 0.08), topFanEuler);
    pcGroup.add(topFan1, topFan2);

    tableSubGroup.add(pcGroup);

    // Add tableSubGroup to deskGroup
    deskGroup.add(tableSubGroup);

    scene.add(deskGroup);
    deskSetupMeshRef.current = deskGroup;
  }, [posture, lighting]);

  // 8. Update Camera & Controls target based on posture
  useEffect(() => {
    if (controlsRef.current) {
      if (posture === 'typing') {
        controlsRef.current.target.set(0, 0.78, 0.15);
      } else {
        controlsRef.current.target.set(0, 0.9, 0);
      }
      controlsRef.current.update();
    }
  }, [posture]);

  const resetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 1.4, 3.2);
      controlsRef.current.target.set(0, 0.9, 0);
      controlsRef.current.update();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full select-none" id="avatar-viewport-container">
      {/* ThreeJS Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing outline-none" id="avatar-canvas-element" />

      {/* Fallback Active floating badge */}
      {usingFallback && (
        <div className="absolute top-4 left-4 z-20 bg-amber-500/10 backdrop-blur-md border border-amber-500/20 px-3 py-2 rounded-xl flex items-center gap-2 text-xs text-amber-400 select-none shadow-lg animate-pulse" id="fallback-badge">
          <AlertCircle size={14} className="shrink-0" />
          <div className="text-left">
            <span className="font-bold block">Holographic Fallback Active</span>
            <span className="text-[10px] text-slate-400 font-sans block">Remote GLB fetch failed (CORS/Offline). Loaded procedural avatar.</span>
          </div>
        </div>
      )}

      {/* Grid Floor Visual Overlay for depth when there is no pedestal */}
      {pedestal === 'none' && (
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(10,15,29,0.85))] -z-10" />
      )}

      {/* Orbit Help Indicator */}
      <div className="absolute bottom-4 left-4 pointer-events-none flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-slate-800 text-xs text-slate-400 select-none shadow-md">
        <Sparkles size={13} className="text-emerald-400 animate-pulse" />
        <span>Left-click & Drag to rotate • Scroll to zoom</span>
      </div>

      {/* Reset Camera button */}
      <button
        onClick={resetCamera}
        className="absolute bottom-4 right-4 bg-slate-900/85 hover:bg-slate-800 hover:text-white border border-slate-800 p-2 rounded-full text-slate-400 transition-all shadow-md active:scale-95 group"
        title="Reset Camera View"
        id="btn-reset-camera"
      >
        <RotateCcw size={15} className="group-hover:rotate-45 transition-transform" />
      </button>

      {/* Loader UI overlay */}
      {status === 'loading' && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 transition-all duration-300">
          <div className="relative flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
            <span className="absolute font-mono text-xs font-semibold text-emerald-400 select-none">
              {progress}%
            </span>
          </div>
          <div className="text-center">
            <h3 className="text-slate-200 font-medium tracking-wide">Loading 3D Avatar GLB</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs px-4">Downloading and compiling meshes, materials, and skeletal textures...</p>
          </div>
        </div>
      )}

      {/* Error UI overlay */}
      {status === 'error' && (
        <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center gap-4 p-6 text-center transition-all duration-300">
          <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-full text-rose-400">
            <AlertCircle size={28} />
          </div>
          <div className="max-w-md">
            <h3 className="text-rose-400 font-medium text-lg">Load Error</h3>
            <p className="text-sm text-slate-400 mt-2 line-clamp-4 bg-slate-900/50 p-3 rounded-lg border border-slate-800 font-mono text-xs text-left select-text">
              {errorMsg || 'Failed to download the model asset. Verify CORS header setup on the model server.'}
            </p>
            <div className="mt-4 flex flex-col gap-2 text-xs text-left bg-slate-900/30 p-3 rounded border border-slate-800 text-slate-400">
              <span className="font-semibold text-slate-300">Supported Formats:</span>
              <span>• Complete `.glb` or `.gltf` single file bundles</span>
              <span>• Ensure model uses a secure HTTPS URL</span>
              <span>• Recommended: Try a Ready Player Me avatar link!</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
