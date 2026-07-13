import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PortfolioData } from '../types';
import { Header } from './Header';
import { HoverEffect } from './HoverEffect';
import { 
  Linkedin, 
  Twitter, 
  Mail, 
  Globe, 
  ExternalLink, 
  FolderGit2, 
  Terminal, 
  Send, 
  CheckCircle2, 
  Instagram, 
  Github, 
  Download, 
  Menu, 
  X,
  Sparkles,
  Info,
  Layers,
  FileCode2,
  AlertCircle,
  Cpu,
  TrendingUp,
  ArrowUpRight,
  ArrowRight
} from 'lucide-react';

interface PortfolioViewProps {
  data: PortfolioData;
  canvasElement: React.ReactNode;
}

const GlowingDivider = () => (
  <div className="relative py-6 my-2 flex items-center justify-center w-full overflow-hidden" id="glowing-section-divider">
    <div className="flex-1 h-[1px]" style={{ backgroundImage: 'linear-gradient(to right, transparent, rgba(var(--theme-color-rgb, 79, 70, 229), 0.15))' }} />
    <div className="relative mx-6 flex items-center justify-center shrink-0">
      <div className="absolute h-[2px] w-56 blur-[4px]" style={{ backgroundImage: 'linear-gradient(to right, transparent, rgba(var(--theme-color-rgb, 79, 70, 229), 0.2), transparent)' }} />
      <div className="absolute h-[1px] w-40" style={{ backgroundImage: 'linear-gradient(to right, transparent, rgba(var(--theme-color-rgb, 79, 70, 229), 0.4), transparent)' }} />
      <div className="absolute h-[1px] w-16 bg-gradient-to-r from-transparent via-white to-transparent" style={{ filter: 'drop-shadow(0 0 4px var(--theme-accent-color, #4f46e5))' }} />
      <div className="w-1.5 h-1.5 rounded-full animate-pulse z-10" style={{ borderColor: 'rgba(var(--theme-color-rgb, 79, 70, 229), 0.5)', borderWidth: '1px', boxShadow: '0 0 8px var(--theme-accent-color, #4f46e5)', backgroundColor: 'var(--theme-accent-color, #4f46e5)' }} />
    </div>
    <div className="flex-1 h-[1px]" style={{ backgroundImage: 'linear-gradient(to left, transparent, rgba(var(--theme-color-rgb, 79, 70, 229), 0.15))' }} />
  </div>
);

interface CaseStudySections {
  summary: string;
  problem?: string;
  approach?: string;
  impact?: string;
}

const parseCaseStudy = (desc: string): CaseStudySections => {
  const sections: CaseStudySections = {
    summary: '',
  };

  // Extract sections based on bold markers
  const problemRegex = /(?:\*\*Problem:\*\*|\*\*The Problem:\*\*|Problem:)\s*([^*]+?)(?=\s*(?:\*\*(?:Approach|Impact|Result):\*\*|Approach:|Impact:|Result:)|$)/i;
  const approachRegex = /(?:\*\*Approach:\*\*|\*\*The Approach:\*\*|Approach:)\s*([^*]+?)(?=\s*(?:\*\*(?:Problem|Impact|Result):\*\*|Problem:|Impact:|Result:)|$)/i;
  const impactRegex = /(?:\*\*Impact:\*\*|\*\*The Result:\*\*|\*\*Result:\*\*|Impact:|Result:)\s*([^*]+?)(?=\s*(?:\*\*(?:Problem|Approach):\*\*|Problem:|Approach:)|$)/i;

  const problemMatch = desc.match(problemRegex);
  const approachMatch = desc.match(approachRegex);
  const impactMatch = desc.match(impactRegex);

  if (problemMatch || approachMatch || impactMatch) {
    sections.problem = problemMatch?.[1]?.trim();
    sections.approach = approachMatch?.[1]?.trim();
    sections.impact = impactMatch?.[1]?.trim();
    
    // Find first occurrence of any marker to separate summary
    const markers = [
      desc.indexOf('**Problem:**'),
      desc.indexOf('Problem:'),
      desc.indexOf('**The Problem:**'),
      desc.indexOf('**Approach:**'),
      desc.indexOf('Approach:'),
      desc.indexOf('**The Approach:**'),
      desc.indexOf('**Impact:**'),
      desc.indexOf('Impact:'),
      desc.indexOf('**Result:**'),
      desc.indexOf('Result:')
    ].filter(idx => idx !== -1);
    
    const firstIndex = markers.length > 0 ? Math.min(...markers) : -1;
    
    if (firstIndex > 0) {
      sections.summary = desc.substring(0, firstIndex).trim();
    } else {
      sections.summary = '';
    }
  } else {
    sections.summary = desc;
  }

  return sections;
};

interface ProjectCaseStudyProps {
  description: string;
  compact?: boolean;
}

const ProjectCaseStudy = ({ description, compact = false }: ProjectCaseStudyProps) => {
  const sections = parseCaseStudy(description);
  const hasSections = sections.problem || sections.approach || sections.impact;

  if (!hasSections) {
    return <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">{description}</p>;
  }

  if (compact) {
    return (
      <div className="space-y-2 mb-3">
        {sections.summary && (
          <p className="text-slate-300 text-xs leading-relaxed">{sections.summary}</p>
        )}
        <div className="space-y-1.5 pt-1.5 text-[11px] border-t border-white/5">
          {sections.problem && (
            <div className="flex items-start gap-1.5 text-slate-400">
              <AlertCircle size={11} className="text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed"><strong className="text-slate-200">Problem:</strong> {sections.problem}</span>
            </div>
          )}
          {sections.approach && (
            <div className="flex items-start gap-1.5 text-slate-400">
              <Cpu size={11} className="text-sky-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed"><strong className="text-slate-200">Approach:</strong> {sections.approach}</span>
            </div>
          )}
          {sections.impact && (
            <div className="flex items-start gap-1.5 text-slate-400">
              <TrendingUp size={11} className="text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed"><strong className="text-slate-200">Impact:</strong> {sections.impact}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-4">
      {sections.summary && (
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{sections.summary}</p>
      )}
      
      <div className="grid grid-cols-1 gap-3 pt-1 border-t border-white/5">
        {sections.problem && (
          <div className="bg-white/[0.01] border border-white/5 hover:border-rose-500/10 p-3.5 rounded-xl transition-all group/case">
            <div className="flex items-center gap-1.5 text-slate-300 mb-1">
              <AlertCircle size={13} className="text-rose-400 group-hover/case:scale-110 transition-transform" />
              <span className="text-[11px] font-bold font-mono tracking-wider uppercase text-rose-300">The Problem</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">{sections.problem}</p>
          </div>
        )}
        
        {sections.approach && (
          <div className="bg-white/[0.01] border border-white/5 hover:border-sky-500/10 p-3.5 rounded-xl transition-all group/case">
            <div className="flex items-center gap-1.5 text-slate-300 mb-1">
              <Cpu size={13} className="text-sky-400 group-hover/case:scale-110 transition-transform" />
              <span className="text-[11px] font-bold font-mono tracking-wider uppercase text-sky-300">The Architecture</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">{sections.approach}</p>
          </div>
        )}
        
        {sections.impact && (
          <div className="bg-white/[0.01] border border-white/5 hover:border-emerald-500/10 p-3.5 rounded-xl transition-all group/case">
            <div className="flex items-center gap-1.5 text-slate-300 mb-1">
              <TrendingUp size={13} className="text-emerald-400 group-hover/case:scale-110 transition-transform" />
              <span className="text-[11px] font-bold font-mono tracking-wider uppercase text-emerald-300">The Result & Impact</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">{sections.impact}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function PortfolioView({ data, canvasElement }: PortfolioViewProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'home' | 'about' | 'skills' | 'projects' | 'contact'>('home');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Intersection Observer scrollspy to update active section on scroll
  useEffect(() => {
    if (data.layoutStyle === 'fullscreen') return;

    const sections = ['home', 'about', 'skills', 'projects', 'contact'];
    
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idParts = entry.target.id.split('-');
          const sectionId = idParts[idParts.length - 1];
          setActiveSection(sectionId as any);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    sections.forEach(sec => {
      const el = document.getElementById(`${data.layoutStyle}-${sec}`);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [data.layoutStyle]);

  // Web3Forms direct integration key for silent background transmission
  const web3FormsKey = 'b3f65a12-ef7d-4590-9362-21b4b375b5fb';

  // Theme helper
  const getThemeStyles = (color: string) => {
    switch (color) {
      case 'sky':
        return {
          text: 'text-sky-400',
          hoverText: 'hover:text-sky-300',
          border: 'border-sky-500/10',
          borderHover: 'hover:border-sky-500/25',
          bg: 'bg-sky-500/5',
          badge: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
          accent: 'bg-sky-500',
          accentHover: 'hover:bg-sky-400',
          accentRing: 'focus:ring-sky-500',
          gradientText: 'from-sky-400 to-cyan-300',
          shadow: 'shadow-sky-500/10',
          glow: 'bg-sky-500/5',
        };
      case 'indigo':
        return {
          text: 'text-indigo-400',
          hoverText: 'hover:text-indigo-300',
          border: 'border-indigo-500/10',
          borderHover: 'hover:border-indigo-500/25',
          bg: 'bg-indigo-500/5',
          badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
          accent: 'bg-indigo-500',
          accentHover: 'hover:bg-indigo-400',
          accentRing: 'focus:ring-indigo-500',
          gradientText: 'from-indigo-400 to-violet-300',
          shadow: 'shadow-indigo-500/10',
          glow: 'bg-indigo-500/5',
        };
      case 'violet':
        return {
          text: 'text-violet-400',
          hoverText: 'hover:text-violet-300',
          border: 'border-violet-500/10',
          borderHover: 'hover:border-violet-500/25',
          bg: 'bg-violet-500/5',
          badge: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
          accent: 'bg-violet-500',
          accentHover: 'hover:bg-violet-400',
          accentRing: 'focus:ring-violet-500',
          gradientText: 'from-violet-400 to-purple-300',
          shadow: 'shadow-violet-500/10',
          glow: 'bg-violet-500/5',
        };
      case 'amber':
        return {
          text: 'text-amber-400',
          hoverText: 'hover:text-amber-300',
          border: 'border-amber-500/10',
          borderHover: 'hover:border-amber-500/25',
          bg: 'bg-amber-500/5',
          badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
          accent: 'bg-amber-500',
          accentHover: 'hover:bg-amber-400',
          accentRing: 'focus:ring-amber-500',
          gradientText: 'from-amber-400 to-orange-300',
          shadow: 'shadow-amber-500/10',
          glow: 'bg-amber-500/5',
        };
      case 'rose':
        return {
          text: 'text-rose-400',
          hoverText: 'hover:text-rose-300',
          border: 'border-rose-500/10',
          borderHover: 'hover:border-rose-500/25',
          bg: 'bg-rose-500/5',
          badge: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
          accent: 'bg-rose-500',
          accentHover: 'hover:bg-rose-400',
          accentRing: 'focus:ring-rose-500',
          gradientText: 'from-rose-400 to-pink-300',
          shadow: 'shadow-rose-500/10',
          glow: 'bg-rose-500/5',
        };
      case 'emerald':
        return {
          text: 'text-emerald-400',
          hoverText: 'hover:text-emerald-300',
          border: 'border-emerald-500/10',
          borderHover: 'hover:border-emerald-500/25',
          bg: 'bg-emerald-500/5',
          badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
          accent: 'bg-emerald-500',
          accentHover: 'hover:bg-emerald-400',
          accentRing: 'focus:ring-emerald-500',
          gradientText: 'from-emerald-400 to-teal-300',
          shadow: 'shadow-emerald-500/10',
          glow: 'bg-emerald-500/5',
        };
      default:
        return {
          text: 'text-indigo-400',
          hoverText: 'hover:text-indigo-300',
          border: 'border-indigo-500/10',
          borderHover: 'hover:border-indigo-500/25',
          bg: 'bg-indigo-500/5',
          badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
          accent: 'bg-indigo-500',
          accentHover: 'hover:bg-indigo-400',
          accentRing: 'focus:ring-indigo-500',
          gradientText: 'from-indigo-400 to-violet-300',
          shadow: 'shadow-indigo-500/10',
          glow: 'bg-indigo-500/5',
        };
    }
  };

  const theme = getThemeStyles(data.themeColor);

  // Helper to map theme name to RGB triple
  const getThemeColorRgb = (color: string) => {
    switch (color) {
      case 'sky': return '56, 189, 248';
      case 'violet': return '167, 139, 250';
      case 'amber': return '251, 191, 36';
      case 'rose': return '251, 113, 133';
      case 'emerald': return '52, 211, 153';
      case 'indigo':
      default: return '129, 140, 248';
    }
  };

  // Helper to map theme name to hex color
  const getThemeColorHex = (color: string) => {
    switch (color) {
      case 'sky': return '#38bdf8';
      case 'violet': return '#a78bfa';
      case 'amber': return '#fbbf24';
      case 'rose': return '#fb7185';
      case 'emerald': return '#34d399';
      case 'indigo':
      default: return '#818cf8';
    }
  };

  // Helper to map theme name to background radial gradient
  const getThemeBackgroundStyles = (color: string) => {
    switch (color) {
      case 'sky':
        return 'radial-gradient(circle at 80% 20%, rgba(14, 165, 233, 0.15) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.1) 0%, transparent 60%)';
      case 'violet':
        return 'radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(167, 139, 250, 0.1) 0%, transparent 60%)';
      case 'amber':
        return 'radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.12) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(251, 191, 36, 0.08) 0%, transparent 60%)';
      case 'rose':
        return 'radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.15) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(251, 113, 133, 0.1) 0%, transparent 60%)';
      case 'emerald':
        return 'radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.12) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(52, 211, 153, 0.08) 0%, transparent 60%)';
      case 'indigo':
      default:
        return 'radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(129, 140, 248, 0.1) 0%, transparent 60%)';
    }
  };

  const rgbVal = getThemeColorRgb(data.themeColor);
  const hexVal = getThemeColorHex(data.themeColor);
  const glowVal = getThemeBackgroundStyles(data.themeColor);

  const cssVariables = {
    '--theme-color-rgb': rgbVal,
    '--theme-accent-color': hexVal,
    '--theme-bg-glow': glowVal,
  } as React.CSSProperties;

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: web3FormsKey,
          name: contactName,
          email: contactEmail,
          message: contactMsg,
          from_name: 'Portfolio Contact Form',
          subject: `New Portfolio Message from ${contactName}`
        })
      });
      const result = await response.json();
      if (result.success) {
        setIsSubmitted(true);
        setContactName('');
        setContactEmail('');
        setContactMsg('');
        setTimeout(() => {
          setIsSubmitted(false);
        }, 6000);
      } else {
        alert(result.message || 'Failed to dispatch message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Could not reach the dispatch server. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDeliverySettings = () => {
    return null;
  };

  const handleExportConfig = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonStr);
    alert('Portfolio JSON configuration successfully copied to clipboard!');
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  // Group skills by category
  const categorizedSkills = {
    Frontend: data.skills.filter(s => s.category === 'Frontend'),
    Backend: data.skills.filter(s => s.category === 'Backend'),
    Design: data.skills.filter(s => s.category === 'Design'),
    Other: data.skills.filter(s => s.category === 'Other'),
  };

  // Rendering Layouts
  
  // ==================== LAYOUT A: SPLIT SCREEN STAGE (DEFAULT) ====================
  if (data.layoutStyle === 'split') {
    return (
      <div className="min-h-screen frosted-bg text-white flex flex-col md:flex-row font-sans relative" id="portfolio-layout-split" style={cssVariables}>
        {/* Fixed Left Canvas Column */}
        <div className="w-full md:w-[45%] h-[400px] md:h-screen md:sticky md:top-0 bg-transparent border-b md:border-b-0 md:border-r border-white/5 flex flex-col relative overflow-hidden" id="split-stage-column">
          {/* Avatar ambient space background */}
          <div className="avatar-space absolute inset-0 rounded-full scale-110 pointer-events-none z-0" />

          {/* Header overlay */}
          <div className="absolute top-5 left-6 z-10">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold tracking-tight text-slate-200 font-sans">{data.name}</span>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${theme.accent} animate-pulse`} />
                <span className="text-[10px] text-slate-500 font-medium tracking-wide font-sans">Interactive Portrait</span>
              </div>
            </div>
          </div>



          {/* 3D Canvas element wrapper */}
          <div className="flex-1 w-full h-full relative z-10">
            {canvasElement}
          </div>

          {/* Footer visual metadata */}
          <div className="absolute bottom-5 left-6 pointer-events-none z-10 hidden md:block">
            <div className="flex flex-col gap-0.5 font-sans text-[10px] text-slate-400">
              <span className="font-semibold text-slate-400">3D Control</span>
              <span>Drag to rotate · Scroll to zoom</span>
            </div>
          </div>
        </div>

        {/* Scrolling Right Content Column */}
        <div className="flex-1 overflow-y-auto bg-transparent" id="split-content-column">
          <Header
            layoutStyle="split"
            name={data.name}
            activeSection={activeSection}
            onNavigate={setActiveSection}
            socials={data.socials}
          />

          <main className="px-6 py-12 md:p-16 space-y-24 max-w-4xl mx-auto" id="split-sections-container">
            {/* Section: Home / Intro */}
            <motion.section
              id="split-home"
              className="space-y-6 pt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="space-y-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${theme.badge} uppercase tracking-wider`}>
                  <Sparkles size={11} />
                  Interactive Portfolio
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
                  Hello, I'm <span className={`bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent`}>{data.name}</span>.
                </h2>
                <h3 className="text-lg md:text-xl font-medium text-slate-300 font-sans max-w-2xl leading-relaxed">
                  {data.tagline}
                </h3>
              </div>

              <p className="text-slate-400 leading-relaxed text-sm md:text-base max-w-2xl font-sans">
                {data.bio}
              </p>

              {/* Social row */}
              <div className="flex flex-wrap gap-3 pt-2">
                {data.socials.linkedin && (
                  <a
                    href={data.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg bg-transparent border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all hover:scale-105"
                  >
                    <Linkedin size={18} />
                  </a>
                )}
                {data.socials.twitter && (
                  <a
                    href={data.socials.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg bg-transparent border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all hover:scale-105"
                  >
                    <Twitter size={18} />
                  </a>
                )}
                {data.socials.email && (
                  <a
                    href={`mailto:${data.socials.email}`}
                    className="p-2.5 rounded-lg bg-transparent border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all hover:scale-105"
                  >
                    <Mail size={18} />
                  </a>
                )}
              </div>
            </motion.section>

            {/* Section: About Me */}
            <GlowingDivider />
            <motion.section
              id="split-about"
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">01 / Profile Biography</span>
                <h3 className="text-2xl font-bold text-white">My Creative Origin</h3>
              </div>
              <div className="glass p-6 rounded-2xl relative overflow-hidden leading-relaxed text-slate-300 text-sm md:text-base space-y-4">
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${theme.glow} blur-3xl`} />
                <p>{data.about}</p>
              </div>
            </motion.section>

            {/* Section: Technical Skills */}
            <GlowingDivider />
            <motion.section
              id="split-skills"
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">02 / Technical Stack</span>
                <h3 className="text-2xl font-bold text-white">Development Capabilities</h3>
              </div>

              {data.skills.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No skills specified in builder data.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {Object.entries(categorizedSkills).map(([cat, sks]) => {
                    if (sks.length === 0) return null;
                    return (
                      <div key={cat} className="space-y-4 glass p-5 rounded-2xl">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2 border-b border-white/5 pb-2">
                          <Layers size={13} className={theme.text} />
                          {cat} Development
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {sks.map(skill => (
                            <div
                              key={skill.id}
                              className="gradient-border-badge text-xs font-mono text-slate-200"
                            >
                              <div className="gradient-border-badge__content">
                                {skill.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.section>

            {/* Section: Portfolio Projects */}
            <GlowingDivider />
            <motion.section
              id="split-projects"
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">03 / Selected Works</span>
                <h3 className="text-2xl font-bold text-white">Featured Projects</h3>
              </div>

              {data.projects.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No project cards configured yet.</p>
              ) : (
                <HoverEffect
                  items={data.projects}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {(proj: any) => {
                    const sections = parseCaseStudy(proj.description);
                    const shortBrief = sections.summary || proj.description.split('**')[0].trim() || proj.description;
                    return (
                      <div className="flex flex-col h-full flex-grow">
                        {/* Thumbnail Container */}
                        <div className="h-44 w-full relative overflow-hidden bg-slate-800/40 border-b border-white/5 flex items-center justify-center">
                          {proj.image ? (
                            <div className="w-full h-full relative overflow-hidden">
                              <img 
                                src={proj.image} 
                                alt={proj.title} 
                                referrerPolicy="no-referrer" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-60" />
                            </div>
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-slate-950/80 via-slate-950/50 to-slate-950/30 relative overflow-hidden flex flex-col justify-between p-4 transition-all duration-700">
                              <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
                                <div className="flex gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500/40" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                                </div>
                                <span className="text-[9px] font-mono text-slate-500 border border-white/5 px-2 py-0.5 rounded-full max-w-[120px] truncate">
                                  {proj.category ? `${proj.category.toLowerCase().replace(/\s+/g, '-')}.io` : 'project.io'}
                                </span>
                                <div className="w-2" />
                              </div>
                              <div className="flex-1 flex flex-col items-center justify-center relative mt-1.5">
                                <div className={`absolute w-12 h-12 rounded-full ${theme.glow} blur-lg opacity-10`} />
                                <span className="text-[10px] font-extrabold tracking-[0.2em] text-slate-400 font-sans uppercase">
                                  {proj.title.split(' ').map((w: string) => w[0]).join('').slice(0, 3)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Card Content */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${theme.accent} animate-pulse`} />
                                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-semibold">
                                  {proj.category || 'Featured Work'}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {proj.tags.slice(0, 2).map((t: string) => (
                                  <span key={t} className="text-[8px] font-mono text-slate-300 bg-white/[0.05] px-1.5 py-0.5 rounded border border-white/[0.05]">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white tracking-tight truncate group-hover:text-[var(--theme-accent-color)] transition-colors">
                                {proj.title}
                              </h4>
                              <p className="text-slate-300 text-[11px] leading-relaxed font-sans font-light line-clamp-2 mt-1">
                                {shortBrief}
                              </p>
                            </div>
                          </div>

                          <div className="pt-4 mt-3 border-t border-white/5 flex items-center gap-2">
                            {proj.demoUrl && (
                              <a
                                href={proj.demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 inline-flex items-center justify-center gap-1 text-[10px] font-medium px-2 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white transition-all"
                              >
                                <span>Demo</span>
                                <ExternalLink size={11} />
                              </a>
                            )}
                            {proj.githubUrl && (
                              <a
                                href={proj.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 inline-flex items-center justify-center gap-1 text-[10px] font-medium px-2 py-1.5 rounded-lg border border-white/10 hover:bg-white/[0.05] text-slate-300 hover:text-white transition-all"
                              >
                                <Github size={11} />
                                <span>Code</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }}
                </HoverEffect>
              )}
            </motion.section>

            {/* Section: Contact Form */}
            <GlowingDivider />
            <motion.section
              id="split-contact"
              className="space-y-6 pb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">04 / Get In Touch</span>
                <h3 className="text-2xl font-bold text-white">Connect & Collaborate</h3>
              </div>

              <div className="glass p-6 md:p-8 rounded-2xl">
                {isSubmitted ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center gap-3">
                    <CheckCircle2 size={40} className={theme.text} />
                    <h4 className="text-lg font-bold text-white">Transmission Successful</h4>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Your query has been logged and dispatched to {data.name}. Expect a response shortly!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label htmlFor="contact-form-name" className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Your Name</label>
                        <input
                          id="contact-form-name"
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Alice Carter"
                          className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[var(--theme-accent-color)] focus:ring-1 focus:ring-[var(--theme-accent-color)] transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="contact-form-email" className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Your Email</label>
                        <input
                          id="contact-form-email"
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="alice@example.com"
                          className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[var(--theme-accent-color)] focus:ring-1 focus:ring-[var(--theme-accent-color)] transition-all"
                        />
                      </div>
                    </div>

                  <div className="space-y-1">
                    <label htmlFor="contact-form-msg" className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Message / Query</label>
                    <textarea
                      id="contact-form-msg"
                      required
                      rows={4}
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      placeholder="Describe your project, contract details, or consultation request..."
                      className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[var(--theme-accent-color)] focus:ring-1 focus:ring-[var(--theme-accent-color)] transition-all"
                    />
                  </div>

                  {renderDeliverySettings()}

                  <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full ${theme.accent} ${theme.accentHover} text-slate-950 font-bold py-2.5 rounded-lg transition-all text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md`}
                      id="btn-contact-submit-split"
                    >
                      <Send size={13} />
                      {isSubmitting ? 'Transmitting...' : 'Dispatch Message'}
                    </button>
                  </form>
                )}
              </div>
            </motion.section>
          </main>
          
          <div className="px-6 md:px-16 max-w-4xl mx-auto">
            <footer className="w-full border-t border-white/5 pt-12 pb-4 mt-4" id="portfolio-split-footer">
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="flex flex-col items-center text-center gap-1">
                  <span className="text-sm font-bold text-white tracking-tight">{data.name}</span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{data.role}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  {data.socials.linkedin && (
                    <a
                      href={data.socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 text-slate-400 hover:text-[var(--theme-accent-color)] hover:scale-110 active:scale-95 transition-all duration-300"
                      title="LinkedIn"
                    >
                      <Linkedin size={16} />
                    </a>
                  )}
                  {data.socials.instagram && (
                    <a
                      href={data.socials.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 text-slate-400 hover:text-[var(--theme-accent-color)] hover:scale-110 active:scale-95 transition-all duration-300"
                      title="Instagram"
                    >
                      <Instagram size={16} />
                    </a>
                  )}
                  {data.socials.github && (
                    <a
                      href={data.socials.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 text-slate-400 hover:text-[var(--theme-accent-color)] hover:scale-110 active:scale-95 transition-all duration-300"
                      title="GitHub"
                    >
                      <Github size={16} />
                    </a>
                  )}
                  {data.socials.twitter && (
                    <a
                      href={data.socials.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 text-slate-400 hover:text-[var(--theme-accent-color)] hover:scale-110 active:scale-95 transition-all duration-300"
                      title="Twitter"
                    >
                      <Twitter size={16} />
                    </a>
                  )}
                  {data.socials.email && (
                    <a
                      href={`mailto:${data.socials.email}`}
                      className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 text-slate-400 hover:text-[var(--theme-accent-color)] hover:scale-110 active:scale-95 transition-all duration-300"
                      title="Email"
                    >
                      <Mail size={16} />
                    </a>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center mt-4 pt-6 border-t border-white/[0.02] text-slate-500 text-[10px] sm:text-xs tracking-wide gap-3">
                <span>© 2026 Nour Abou El Rouss. All rights reserved.</span>
              </div>
            </footer>
          </div>
        </div>
      </div>
    );
  }

  // ==================== LAYOUT B: STANDARD SCROLLING / CLASSIC VIEW ====================
  if (data.layoutStyle === 'classic') {
    return (
      <div className="h-screen overflow-y-auto frosted-bg text-white flex flex-col font-sans relative overflow-x-hidden scroll-smooth" id="portfolio-layout-classic" style={cssVariables}>
        {/* Navigation Bar */}
        <Header
          layoutStyle="classic"
          name={data.name}
          activeSection={activeSection}
          onNavigate={setActiveSection}
          socials={data.socials}
        />

        {/* Hero Section with Showcase Viewport inside */}
        <motion.section
          id="classic-home"
          className="px-6 py-12 md:py-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Hero left text */}
          <div className="lg:col-span-6 space-y-6">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${theme.badge} uppercase tracking-wider`}>
              <Sparkles size={11} />
              Creative Showcase
            </span>
            <div className="space-y-3">
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-none">
                {data.name}
              </h2>
              <p className={`text-sm font-mono tracking-widest uppercase ${theme.text} font-bold`}>{data.role}</p>
            </div>
            <h3 className="text-lg text-slate-300 leading-relaxed font-sans font-light">
              {data.tagline}
            </h3>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base font-sans">
              {data.bio}
            </p>

            <div className="flex gap-4 pt-2">
            <a
              href="#classic-contact"
              className={`px-6 py-2.5 rounded-lg ${theme.accent} ${theme.accentHover} text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5`}
            >
              <Mail size={13} />
              Connect with me
            </a>
            </div>
          </div>

          {/* Hero Right 3D Showcase Container */}
          <div className="lg:col-span-6 flex justify-center w-full" id="classic-hero-stage-container">
            <div className="w-full max-w-md aspect-[4/5] relative">
              {/* Avatar ambient space background */}
              <div className="avatar-space absolute inset-0 rounded-full scale-125 pointer-events-none z-0 opacity-40" />

              <div className="w-full h-full relative z-10">
                {canvasElement}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Outer contents */}
        <div className="bg-transparent border-t border-white/5 py-20 w-full" id="classic-scrolling-content-wrapper">
          <div className="max-w-7xl mx-auto px-6 space-y-24">
            
            {/* About Section */}
            <motion.section
              id="classic-about"
              className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="md:col-span-4 space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">01 / Biography</span>
                <h3 className="text-2xl font-bold text-white leading-tight">About {data.name.split(' ')[0]}</h3>
              </div>
              <div className="md:col-span-8 glass p-8 rounded-2xl relative overflow-hidden text-slate-300 leading-relaxed text-sm md:text-base">
                <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full ${theme.glow} blur-3xl`} />
                <p>{data.about}</p>
              </div>
            </motion.section>

            {/* Skills Section */}
            <GlowingDivider />
            <motion.section
              id="classic-skills"
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">02 / capabilities</span>
                  <h3 className="text-2xl font-bold text-white leading-tight">Expertise & Skillsets</h3>
                </div>
                <span className="text-xs text-slate-400 font-sans">Core technological stack and frameworks</span>
              </div>

              {data.skills.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No skills listed yet.</p>
              ) : (
                <HoverEffect
                  items={Object.entries(categorizedSkills)
                    .filter(([_, sks]) => sks.length > 0)
                    .map(([cat, sks]) => ({
                      title: cat,
                      description: sks.map((s) => s.name).join(", "),
                    }))}
                />
              )}
            </motion.section>

            {/* Projects Section */}
            <GlowingDivider />
            <motion.section
              id="classic-projects"
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="space-y-1 border-b border-white/5 pb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">03 / Works Gallery</span>
                <h3 className="text-2xl font-bold text-white leading-tight">Featured Project Showcases</h3>
              </div>              {data.projects.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No project cards configured.</p>
              ) : (
                <HoverEffect
                  items={data.projects}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {(proj: any) => {
                    const sections = parseCaseStudy(proj.description);
                    const shortBrief = sections.summary || proj.description.split('**')[0].trim() || proj.description;
                    return (
                      <div className="flex flex-col h-full flex-grow">
                        {/* Thumbnail Container */}
                        <div className="h-44 w-full relative overflow-hidden bg-slate-800/40 border-b border-white/5 flex items-center justify-center">
                          {proj.image ? (
                            <div className="w-full h-full relative overflow-hidden">
                              <img 
                                src={proj.image} 
                                alt={proj.title} 
                                referrerPolicy="no-referrer" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-60" />
                            </div>
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-slate-950/80 via-slate-950/50 to-slate-950/30 relative overflow-hidden flex flex-col justify-between p-4 transition-all duration-700">
                              <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
                                <div className="flex gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500/40" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                                </div>
                                <span className="text-[9px] font-mono text-slate-500 border border-white/5 px-2 py-0.5 rounded-full max-w-[120px] truncate">
                                  {proj.category ? `${proj.category.toLowerCase().replace(/\s+/g, '-')}.io` : 'project.io'}
                                </span>
                                <div className="w-2" />
                              </div>
                              <div className="flex-1 flex flex-col items-center justify-center relative mt-1.5">
                                <div className={`absolute w-12 h-12 rounded-full ${theme.glow} blur-lg opacity-10`} />
                                <span className="text-[10px] font-extrabold tracking-[0.2em] text-slate-400 font-sans uppercase">
                                  {proj.title.split(' ').map((w: string) => w[0]).join('').slice(0, 3)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Card Content */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${theme.accent} animate-pulse`} />
                                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-semibold">
                                  {proj.category || 'Featured Work'}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {proj.tags.slice(0, 2).map((t: string) => (
                                  <span key={t} className="text-[8px] font-mono text-slate-300 bg-white/[0.05] px-1.5 py-0.5 rounded border border-white/[0.05]">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white tracking-tight truncate group-hover:text-[var(--theme-accent-color)] transition-colors">
                                {proj.title}
                              </h4>
                              <p className="text-slate-300 text-[11px] leading-relaxed font-sans font-light line-clamp-3 mt-1">
                                {shortBrief}
                              </p>
                            </div>
                          </div>

                          <div className="pt-4 mt-3 border-t border-white/5 flex items-center gap-2">
                            {proj.demoUrl && (
                              <a
                                href={proj.demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 inline-flex items-center justify-center gap-1 text-[10px] font-medium px-2 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white transition-all"
                              >
                                <span>Demo</span>
                                <ExternalLink size={11} />
                              </a>
                            )}
                            {proj.githubUrl && (
                              <a
                                href={proj.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 inline-flex items-center justify-center gap-1 text-[10px] font-medium px-2 py-1.5 rounded-lg border border-white/10 hover:bg-white/[0.05] text-slate-300 hover:text-white transition-all"
                              >
                                <Github size={11} />
                                <span>Code</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }}
                </HoverEffect>
              )}
            </motion.section>

            {/* Contact Form */}
            <GlowingDivider />
            <motion.section
              id="classic-contact"
              className="space-y-8 max-w-2xl mx-auto w-full pt-12 pb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="space-y-1 text-center">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">04 / Communication hub</span>
                <h3 className="text-2xl font-bold text-white leading-tight">Transmit a Query</h3>
              </div>

              <div className="glass p-6 sm:p-8 rounded-2xl shadow-xl">
                {isSubmitted ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
                    <CheckCircle2 size={44} className={theme.text} />
                    <h4 className="text-lg font-bold text-white">Transmission Successful</h4>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Your query has been recorded. {data.name} will respond shortly to your email address.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label htmlFor="contact-name-classic" className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Your Full Name</label>
                        <input
                          id="contact-name-classic"
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. Alice Carter"
                          className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#9d81ff] focus:ring-1 focus:ring-[#9d81ff] transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="contact-email-classic" className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Your Email Address</label>
                        <input
                          id="contact-email-classic"
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="e.g. alice@example.com"
                          className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#9d81ff] focus:ring-1 focus:ring-[#9d81ff] transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="contact-msg-classic" className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Message Content</label>
                      <textarea
                        id="contact-msg-classic"
                        required
                        rows={4}
                        value={contactMsg}
                        onChange={(e) => setContactMsg(e.target.value)}
                        placeholder="Detail your request, project, or general networking message..."
                        className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#9d81ff] focus:ring-1 focus:ring-[#9d81ff] transition-all"
                      />
                    </div>

                    {renderDeliverySettings()}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full ${theme.accent} ${theme.accentHover} text-slate-950 font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md`}
                    >
                      <Send size={13} />
                      {isSubmitting ? 'Transmitting...' : 'Dispatch Message'}
                    </button>
                  </form>
                )}
              </div>
            </motion.section>
            
            <footer className="w-full border-t border-white/5 pt-12 pb-16 mt-20" id="portfolio-classic-footer">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
                  <span className="text-sm font-bold text-white tracking-tight">{data.name}</span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{data.role}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  {data.socials.linkedin && (
                    <a
                      href={data.socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 text-slate-400 hover:text-[var(--theme-accent-color)] hover:scale-110 active:scale-95 transition-all duration-300"
                      title="LinkedIn"
                    >
                      <Linkedin size={16} />
                    </a>
                  )}
                  {data.socials.instagram && (
                    <a
                      href={data.socials.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 text-slate-400 hover:text-[var(--theme-accent-color)] hover:scale-110 active:scale-95 transition-all duration-300"
                      title="Instagram"
                    >
                      <Instagram size={16} />
                    </a>
                  )}
                  {data.socials.github && (
                    <a
                      href={data.socials.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 text-slate-400 hover:text-[var(--theme-accent-color)] hover:scale-110 active:scale-95 transition-all duration-300"
                      title="GitHub"
                    >
                      <Github size={16} />
                    </a>
                  )}
                  {data.socials.twitter && (
                    <a
                      href={data.socials.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 text-slate-400 hover:text-[var(--theme-accent-color)] hover:scale-110 active:scale-95 transition-all duration-300"
                      title="Twitter"
                    >
                      <Twitter size={16} />
                    </a>
                  )}
                  {data.socials.email && (
                    <a
                      href={`mailto:${data.socials.email}`}
                      className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 text-slate-400 hover:text-[var(--theme-accent-color)] hover:scale-110 active:scale-95 transition-all duration-300"
                      title="Email"
                    >
                      <Mail size={16} />
                    </a>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center mt-8 pt-6 border-t border-white/[0.02] text-slate-500 text-[10px] sm:text-xs tracking-wide gap-3">
                <span>© 2026 Nour Abou El Rouss. All rights reserved.</span>
              </div>
            </footer>
          </div>
        </div>
      </div>
    );
  }

  // ==================== LAYOUT C: IMMERSIVE FULLSCREEN ====================
  // (Provides an interactive floating HUD overlay that users can toggle/collapse)
  if (data.layoutStyle === 'fullscreen') {
    return (
      <div className="min-h-screen frosted-bg text-white flex flex-col font-sans relative overflow-hidden" id="portfolio-layout-fullscreen" style={cssVariables}>
        {/* Fullscreen Background 3D Canvas wrapper */}
        <div className="absolute inset-0 z-0">
          {canvasElement}
        </div>

        {/* Ambient Dark Overlay on canvas */}
        <div className="absolute inset-0 pointer-events-none bg-black/25 backdrop-blur-[2px] z-[1]" />

        {/* Floating HUD Top bar */}
        <header className="absolute top-4 inset-x-4 sm:inset-x-6 z-10 flex justify-between items-center" id="fullscreen-hud-header">
          <div className="glass px-4 py-2 flex items-center gap-2.5 shadow-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-200 truncate pr-2 border-r border-white/10">
              {data.name}
            </span>
            <span className="text-[10px] font-mono text-slate-400 hidden sm:block">{data.role}</span>
          </div>


        </header>

        {/* Dynamic Center Panel HUD (changes based on activeSection) */}
        <div className="flex-1 flex items-center justify-center p-6 relative z-10 select-none pointer-events-none" id="fullscreen-stage-center">
          <div className="w-full max-w-lg glass p-6 sm:p-8 shadow-2xl space-y-5 pointer-events-auto select-text relative transition-all duration-500">
            {/* Background glowing aura */}
            <div className={`absolute inset-0 -z-10 rounded-3xl ${theme.glow} blur-2xl`} />

            {/* Render HUD Card depending on selected section */}
            {activeSection === 'home' && (
              <div className="space-y-4" id="hud-home">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${theme.badge} uppercase tracking-wider`}>
                  <Sparkles size={10} />
                  Live Hologram
                </span>
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{data.name}</h2>
                  <p className={`text-xs font-mono font-bold tracking-wider uppercase ${theme.text}`}>{data.role}</p>
                </div>
                <h3 className="text-sm font-medium text-slate-200 leading-relaxed font-sans font-light">
                  "{data.tagline}"
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{data.bio}</p>

                {/* Social icons inside HUD */}
                <div className="flex gap-2.5 pt-1.5 border-t border-slate-900/60">
                  {data.socials.linkedin && (
                    <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" title="LinkedIn">
                      <Linkedin size={15} />
                    </a>
                  )}
                  {data.socials.instagram && (
                    <a href={data.socials.instagram} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" title="Instagram">
                      <Instagram size={15} />
                    </a>
                  )}
                  {data.socials.github && (
                    <a href={data.socials.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" title="GitHub">
                      <Github size={15} />
                    </a>
                  )}
                  {data.socials.twitter && (
                    <a href={data.socials.twitter} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" title="Twitter">
                      <Twitter size={15} />
                    </a>
                  )}
                  {data.socials.email && (
                    <a href={`mailto:${data.socials.email}`} className="text-slate-400 hover:text-white transition-colors" title="Email">
                      <Mail size={15} />
                    </a>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'about' && (
              <div className="space-y-3" id="hud-about">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">01 / Biography</span>
                <h3 className="text-lg font-bold text-white">Interactive Story</h3>
                <div className="text-xs text-slate-300 leading-relaxed max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                  <p className="whitespace-pre-wrap">{data.about}</p>
                </div>
              </div>
            )}

            {activeSection === 'skills' && (
              <div className="space-y-3" id="hud-skills">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">02 / capabilities</span>
                <h3 className="text-lg font-bold text-white">Technological Matrix</h3>
                
                {data.skills.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No skills listed.</p>
                ) : (
                  <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-850">
                    {data.skills.map(skill => (
                      <span
                        key={skill.id}
                        className="rotating-border-badge text-xs text-slate-200 flex items-center gap-1.5 font-mono"
                      >
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider">
                          {skill.category.substring(0, 3)}:
                        </span>
                        <span className="font-medium text-white">{skill.name}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'projects' && (
              <div className="space-y-3" id="hud-projects">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">03 / Works List</span>
                <h3 className="text-lg font-bold text-white">Developed Projects</h3>
                
                {data.projects.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No projects listed.</p>
                ) : (
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-850">
                    {data.projects.map((proj, index) => {
                      const sections = parseCaseStudy(proj.description);
                      const shortBrief = sections.summary || proj.description.split('**')[0].trim() || proj.description;
                      
                      return (
                        <motion.div
                          key={proj.id}
                          initial={{ opacity: 0, y: 15, scale: 0.98 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ 
                            duration: 0.5, 
                            delay: index * 0.08, 
                            ease: "easeOut" 
                          }}
                          className="glass-panel p-3.5 rounded-xl flex flex-col gap-3 group border border-white/5 relative overflow-hidden"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.015) 0%, rgba(255,255,255,0.005) 100%)',
                          }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white truncate">{proj.title}</h4>
                              <span className={`text-[8px] font-mono text-[var(--theme-accent-color)] ${theme.bg} px-2 py-0.5 rounded border border-white/[0.02] uppercase tracking-wider mt-1 inline-block`}>{proj.category || 'Work'}</span>
                            </div>
                          </div>

                          <p className="text-slate-300 text-[11px] leading-relaxed font-light">
                            {shortBrief}
                          </p>

                          <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <div className="flex flex-wrap gap-1">
                              {proj.tags.map(tag => (
                                <span key={tag} className={`text-[8px] font-mono text-[var(--theme-accent-color)] ${theme.bg} px-1.5 py-0.5 rounded border border-white/[0.01]`}>
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center gap-1.5">
                              {proj.githubUrl && (
                                <a
                                  href={proj.githubUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center justify-center w-6 h-6 rounded-full bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] hover:scale-105 active:scale-95 transition-all"
                                  title="View Repository"
                                >
                                  <Github size={11} />
                                </a>
                              )}
                              
                              {proj.demoUrl && (
                                <a
                                  href={proj.demoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`flex items-center justify-center w-6 h-6 rounded-full ${theme.accent} text-black hover:scale-105 active:scale-95 transition-all group/arrow`}
                                  title="Visit Project Website"
                                >
                                  <ArrowUpRight size={11} className="group-hover/arrow:translate-x-0.5 group-hover/arrow:-translate-y-0.5 transition-transform" />
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'contact' && (
              <div className="space-y-3" id="hud-contact">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">04 / Transmit</span>
                <h3 className="text-lg font-bold text-white">Establish Uplink</h3>
                
                {isSubmitted ? (
                  <div className="py-6 text-center space-y-2">
                    <CheckCircle2 size={32} className={`mx-auto ${theme.text}`} />
                    <p className="text-xs text-slate-300 font-bold">Query logged successfully.</p>
                    <p className="text-[10px] text-slate-400">Response will be dispatched to your email address.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-2.5 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Your Name</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. Alice Carter"
                          className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[var(--theme-accent-color)] focus:ring-1 focus:ring-[var(--theme-accent-color)] transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Your Email Address</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="e.g. alice@example.com"
                          className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[var(--theme-accent-color)] focus:ring-1 focus:ring-[var(--theme-accent-color)] transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Message Content</label>
                      <textarea
                        required
                        rows={3}
                        value={contactMsg}
                        onChange={(e) => setContactMsg(e.target.value)}
                        placeholder="Detail your request, project, or general networking message..."
                        className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[var(--theme-accent-color)] focus:ring-1 focus:ring-[var(--theme-accent-color)] transition-all resize-none"
                      />
                    </div>
                    
                    {renderDeliverySettings()}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full ${theme.accent} ${theme.accentHover} text-slate-950 font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md`}
                    >
                      <Send size={11} />
                      {isSubmitting ? 'Transmitting...' : 'Dispatch Message'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Floating Nav deck (styled like a control deck console) */}
        <footer className="absolute bottom-4 inset-x-4 sm:inset-x-6 z-10 flex justify-center pointer-events-none" id="fullscreen-hud-navdeck">
          <nav className="glass p-1 rounded-2xl flex gap-1 shadow-xl pointer-events-auto">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => setActiveSection(link.id as any)}
                className={`py-1.5 px-3.5 text-[10px] font-bold tracking-widest uppercase rounded-xl transition-all cursor-pointer ${
                  activeSection === link.id
                    ? 'glass-pill text-white border border-white/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                }`}
                id={`btn-hudnav-${link.id}`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </footer>
      </div>
    );
  }

  return null;
}
