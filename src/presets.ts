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
  name: "Nour Khalaf Abou El Rouss",
  role: "Full stack web developer",
  tagline: "Designing elegant digital experiences where creativity meets performance.",
  bio: "Hi! I'm Nour, a Full-Stack Web Developer focused on building modern websites and e-commerce experiences. I combine clean design, thoughtful user experiences, and scalable development to create fast, responsive, and engaging products. Whether it's a business website, portfolio, or online store, I enjoy turning ideas into polished digital experiences that people love to use.",
  about: "I specialize in building modern, responsive websites and web applications using HTML, CSS, JavaScript, and React. On the backend, I work with MySQL and Supabase to create secure, scalable, and data-driven applications. I focus on writing clean, maintainable code while delivering intuitive user experiences and visually polished interfaces.",
  skills: [
    {
      id: "sk-1782872109023",
      name: "HTML5",
      proficiency: 80,
      category: "Frontend"
    },
    {
      id: "sk-1782872120555",
      name: "CSS3",
      proficiency: 80,
      category: "Frontend"
    },
    {
      id: "sk-1782872135159",
      name: "JavaScript",
      proficiency: 80,
      category: "Frontend"
    },
    {
      id: "sk-1782872195960",
      name: "React",
      proficiency: 50,
      category: "Frontend"
    },
    {
      id: "sk-1782872218487",
      name: "Supabase",
      proficiency: 60,
      category: "Backend"
    },
    {
      id: "sk-1782872235530",
      name: "MySQL",
      proficiency: 80,
      category: "Backend"
    },
    {
      id: "sk-1782872264967",
      name: "Responsive Web Design",
      proficiency: 60,
      category: "Design"
    }
  ],
  projects: [
    {
      id: "proj-1782872638671",
      title: "Floraison de Lynn – Flower Store",
      description: "A modern and responsive flower store website designed to showcase elegant floral collections with a premium shopping experience. Built with HTML ,CSS ,JAVASCRIPT, the project emphasizes clean UI/UX, smooth interactions, and a mobile-friendly layout while providing an intuitive browsing experience for customers.",
      category: "Online Store",
      tags: [
        "HTML",
        "CSS",
        "JavaScript"
      ],
      demoUrl: "https://www.floraisondelynn.com/"
    }
  ],
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "nourabouelrouss@gmail.com",
    website: "https://marcusvance.dev"
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
