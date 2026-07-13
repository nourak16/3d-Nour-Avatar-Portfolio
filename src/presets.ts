import { AvatarModelPreset, PortfolioData } from './types';

export const AVATAR_PRESETS: AvatarModelPreset[] = [
  {
    id: 'my-avatar',
    name: 'My Custom Avatar',
    url: './my-avatar.glb',
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
  name: "Nour Abou El Rouss",
  role: "Full-Stack Web Developer",
  tagline: "Crafting pixel-perfect React applications, elegant user interfaces, and secure full-stack database solutions.",
  bio: "I build fast, responsive, and pixel-perfect websites. I specialize in crafting elegant user interfaces with HTML, CSS, JavaScript, and React, combined with secure relational backends using MySQL and Supabase.",
  about: "I am a Full-Stack Web Developer dedicated to building highly performant and responsive websites. I specialize in frontend development using HTML, CSS, JavaScript, and React to construct modular, clean, and engaging user experiences. On the backend, I leverage the power of MySQL and Supabase to design scalable database structures, manage user authentication, and ensure reliable data persistence. I focus on clean code, responsive design, and seamless user experiences across all devices.",
  skills: [
    {
      id: "sk-1782872109023",
      name: "HTML5",
      proficiency: 90,
      category: "Frontend"
    },
    {
      id: "sk-1782872120555",
      name: "CSS3",
      proficiency: 85,
      category: "Frontend"
    },
    {
      id: "sk-1782872135159",
      name: "JavaScript",
      proficiency: 90,
      category: "Frontend"
    },
    {
      id: "sk-1782872195960",
      name: "React",
      proficiency: 80,
      category: "Frontend"
    },
    {
      id: "sk-1782872218487",
      name: "Supabase",
      proficiency: 75,
      category: "Backend"
    },
    {
      id: "sk-1782872235530",
      name: "MySQL",
      proficiency: 85,
      category: "Backend"
    },
    {
      id: "sk-1782872264967",
      name: "Responsive Design",
      proficiency: 90,
      category: "Design"
    }
  ],
  projects: [
    {
      id: "proj-1782872638671",
      title: "Floraison de Lynn – Flower Store",
      description: "A premium, fully responsive floral e-commerce platform designed from scratch. **Problem:** Legacy templates caused high initial page load times and sluggish mobile navigation, leading to early drop-offs. **Approach:** Built custom layout structures using vanilla web standards to bypass third-party library weight, and developed an intuitive navigation drawer with CSS-hardware accelerated triggers. **Impact:** Reduced initial paint load time to under 1.2 seconds, boosting retention and smoothing out the multi-stage checkout experience.",
      category: "Online Store",
      tags: [
        "HTML5",
        "CSS3",
        "JavaScript"
      ],
      demoUrl: "https://www.floraisondelynn.com/"
    },
    {
      id: "proj-1782872638672",
      title: "ClothStore – Apparel E-commerce",
      description: "A modern, responsive e-commerce platform for apparel, focused on clean design and efficient product browsing. **Problem:** Needed a streamlined shopping experience that emphasizes visual appeal while maintaining fast performance across devices. **Approach:** Implemented a component-based architecture to manage dynamic product catalogs, integrated responsive grid layouts for seamless mobile and desktop viewing, and ensured optimized asset delivery for high-quality product images. **Impact:** Improved product discovery and user engagement through a intuitive, performance-focused interface.",
      category: "Online Store",
      tags: [
        "React",
        "CSS3",
        "JavaScript"
      ],
      demoUrl: "https://nourak16.github.io/ClothStore/"
    }
  ],
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    email: "nourdika098@gmail.com"
  },
  themeColor: "emerald",
  layoutStyle: "classic",
  avatarConfig: {
    modelUrl: "./my-avatar.glb",
    scale: 0.9,
    positionY: -0.25,
    rotationY: 0,
    rotationSpeed: 2,
    autoRotate: false,
    lighting: "studio",
    pedestal: "glass",
    activeAnimation: "Armature.001|mixamo.com|Layer0 Retarget",
    posture: "typing",
    tablePosX: 0.01,
    tablePosY: -0.18,
    keyboardPosX: 0.05,
    keyboardPosZ: -0.05,
    tablePosZ: 0.32,
    keyboardPosY: 0.02,
    mousePosX: -0.5,
    chairPosY: -0.26,
    chairPosX: 0,
    mousePosZ: -0.06
  }
};
