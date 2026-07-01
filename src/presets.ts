import { AvatarModelPreset, PortfolioData } from './types';

export const AVATAR_PRESETS: AvatarModelPreset[] = [
  {
    id: 'my-avatar',
    name: 'My Custom Avatar',
    url: '/my-avatar.glb',
    scale: 1.0,
    positionY: -0.05,
    rotationY: 0,
    description: 'Your uploaded custom 3D avatar model located in the public folder.',
    credits: 'Local /public/my-avatar.glb'
  },
  {
    id: 'readyplayer-dev',
    name: 'Cyber Developer',
    url: 'https://models.readyplayerme.design/631d5b3d-7c25-45a8-8e6d-5d9c222956cf.glb',
    scale: 1.0,
    positionY: -0.05,
    rotationY: 0,
    description: 'A standard Ready Player Me stylized human developer avatar.',
    credits: 'Ready Player Me Standard Model'
  },
  {
    id: 'robot-expressive',
    name: 'Expressive Bot-X',
    url: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
    scale: 0.28,
    positionY: 0.1,
    rotationY: Math.PI,
    description: 'An expressive robot with fully functional embedded animations like walk, dance, wave, and jump!',
    credits: 'Three.js Examples (mrdoob)'
  },
  {
    id: 'astronaut',
    name: 'Cosmic Voyager',
    url: 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/Astronaut/glTF-Binary/Astronaut.glb',
    scale: 0.8,
    positionY: 0.05,
    rotationY: 0,
    description: 'An ultra-realistic futuristic astronaut space explorer suit model.',
    credits: 'Khronos Group glTF Sample'
  },
  {
    id: 'cesium-runner',
    name: 'Slick Sprinter',
    url: 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb',
    scale: 1.8,
    positionY: 0.1,
    rotationY: Math.PI / 2,
    description: 'Low-poly character model running, great for showcasing dynamic actions.',
    credits: 'Khronos Group glTF Sample'
  }
];

export const INITIAL_PORTFOLIO_DATA: PortfolioData = {
  name: "Marcus Vance",
  role: "Creative technologist & 3D Engineer",
  tagline: "Bridging the gap between cinematic storytelling and interactive full-stack web applications.",
  bio: "Hi there! I'm a developer and designer specializing in interactive 3D graphics, WebGL, and robust client-server architectures. My work focuses on creating sensory-rich digital interfaces that feel tactile and engaging.",
  about: "For the past five years, I have crafted bespoke visual experiences for clients across tech, art, and games. Utilizing tools like Three.js, shaders, and React, I transform concepts into performant, elegant, and interactive software. My process is highly iterative, focusing on visual precision and motion design.",
  skills: [
    { id: 'sk-1', name: 'TypeScript & React', proficiency: 95, category: 'Frontend' },
    { id: 'sk-2', name: 'Three.js & WebGL', proficiency: 90, category: 'Frontend' },
    { id: 'sk-3', name: 'GLSL / Shader Design', proficiency: 75, category: 'Design' },
    { id: 'sk-4', name: 'Tailwind CSS', proficiency: 95, category: 'Frontend' },
    { id: 'sk-5', name: 'Node.js & Express', proficiency: 85, category: 'Backend' },
    { id: 'sk-6', name: 'Drizzle / PostgreSQL', proficiency: 80, category: 'Backend' },
    { id: 'sk-7', name: 'Figma & UI Prototyping', proficiency: 88, category: 'Design' },
    { id: 'sk-8', name: 'Docker & Cloud Deployment', proficiency: 70, category: 'Other' },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Aether Engine',
      description: 'A custom hardware-accelerated fluid simulation canvas utilizing GPGPU fragment shaders, built as a React-Three-Fiber package.',
      category: 'Creative Tech',
      tags: ['WebGL', 'GLSL', 'React', 'Three.js'],
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com'
    },
    {
      id: 'proj-2',
      title: 'Helios Analytics Dashboard',
      description: 'A full-stack performance profiling dashboard mapping multi-region server latency in real-time with d3 coordinate projections.',
      category: 'Web Dev',
      tags: ['TypeScript', 'Express', 'D3.js', 'PostgreSQL'],
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com'
    },
    {
      id: 'proj-3',
      title: 'Quantum Portal Shader',
      description: 'An interactive interactive visualizer displaying deep space wormhole ripples reacting to real-time micro-microphone inputs.',
      category: 'Shaders',
      tags: ['GLSL', 'Vite', 'Three.js', 'Audio WebAPI'],
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com'
    }
  ],
  socials: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    email: 'marcus.vance@example.com',
    website: 'https://marcusvance.dev'
  },
  themeColor: 'emerald',
  layoutStyle: 'split',
  avatarConfig: {
    modelUrl: '/my-avatar.glb',
    scale: 1.0,
    positionY: -0.05,
    rotationY: 0,
    rotationSpeed: 0.3,
    autoRotate: false,
    lighting: 'cyberpunk',
    pedestal: 'cyber',
    activeAnimation: 'Idle',
    posture: 'standing',
    tablePosX: 0,
    tablePosY: 0,
    tablePosZ: 0,
    keyboardPosX: 0,
    keyboardPosY: 0,
    keyboardPosZ: 0,
    mousePosX: 0,
    mousePosY: 0,
    mousePosZ: 0,
    chairPosX: 0,
    chairPosY: 0,
    chairPosZ: 0
  }
};
