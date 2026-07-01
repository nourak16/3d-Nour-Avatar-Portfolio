import React, { useState } from 'react';
import { PortfolioData } from '../types';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Globe, 
  ExternalLink, 
  FolderGit2, 
  Terminal, 
  Send, 
  CheckCircle2, 
  Download, 
  Menu, 
  X,
  Sparkles,
  Info,
  Layers,
  FileCode2
} from 'lucide-react';

interface PortfolioViewProps {
  data: PortfolioData;
  canvasElement: React.ReactNode;
}

export default function PortfolioView({ data, canvasElement }: PortfolioViewProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'home' | 'about' | 'skills' | 'projects' | 'contact'>('home');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Theme helper
  const getThemeStyles = (color: string) => {
    switch (color) {
      case 'emerald':
        return {
          text: 'text-emerald-400',
          hoverText: 'hover:text-emerald-300',
          border: 'border-emerald-500/20',
          borderHover: 'hover:border-emerald-500/40',
          bg: 'bg-emerald-500/10',
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          accent: 'bg-emerald-500',
          accentHover: 'hover:bg-emerald-600',
          accentRing: 'focus:ring-emerald-500',
          gradientText: 'from-emerald-400 to-teal-400',
          shadow: 'shadow-emerald-500/10',
          glow: 'bg-emerald-500/5',
        };
      case 'indigo':
        return {
          text: 'text-indigo-400',
          hoverText: 'hover:text-indigo-300',
          border: 'border-indigo-500/20',
          borderHover: 'hover:border-indigo-500/40',
          bg: 'bg-indigo-500/10',
          badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
          accent: 'bg-indigo-500',
          accentHover: 'hover:bg-indigo-600',
          accentRing: 'focus:ring-indigo-500',
          gradientText: 'from-indigo-400 to-blue-400',
          shadow: 'shadow-indigo-500/10',
          glow: 'bg-indigo-500/5',
        };
      case 'violet':
        return {
          text: 'text-[#9d81ff]',
          hoverText: 'hover:text-[#b29eff]',
          border: 'border-[#9d81ff]/20',
          borderHover: 'hover:border-[#9d81ff]/40',
          bg: 'bg-[#9d81ff]/10',
          badge: 'bg-[#9d81ff]/10 text-[#9d81ff] border-[#9d81ff]/20',
          accent: 'bg-[#9d81ff]',
          accentHover: 'hover:bg-[#b29eff]',
          accentRing: 'focus:ring-[#9d81ff]',
          gradientText: 'from-[#9d81ff] to-purple-400',
          shadow: 'shadow-[#9d81ff]/10',
          glow: 'bg-[#9d81ff]/5',
        };
      case 'amber':
        return {
          text: 'text-amber-400',
          hoverText: 'hover:text-amber-300',
          border: 'border-amber-500/20',
          borderHover: 'hover:border-amber-500/40',
          bg: 'bg-amber-500/10',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          accent: 'bg-amber-500',
          accentHover: 'hover:bg-amber-600',
          accentRing: 'focus:ring-amber-500',
          gradientText: 'from-amber-400 to-orange-400',
          shadow: 'shadow-amber-500/10',
          glow: 'bg-amber-500/5',
        };
      case 'rose':
        return {
          text: 'text-rose-400',
          hoverText: 'hover:text-rose-300',
          border: 'border-rose-500/20',
          borderHover: 'hover:border-rose-500/40',
          bg: 'bg-rose-500/10',
          badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          accent: 'bg-rose-500',
          accentHover: 'hover:bg-rose-600',
          accentRing: 'focus:ring-rose-500',
          gradientText: 'from-rose-400 to-pink-400',
          shadow: 'shadow-rose-500/10',
          glow: 'bg-rose-500/5',
        };
      case 'sky':
      default:
        return {
          text: 'text-sky-400',
          hoverText: 'hover:text-sky-300',
          border: 'border-sky-500/20',
          borderHover: 'hover:border-sky-500/40',
          bg: 'bg-sky-500/10',
          badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
          accent: 'bg-sky-500',
          accentHover: 'hover:bg-sky-600',
          accentRing: 'focus:ring-sky-500',
          gradientText: 'from-sky-400 to-cyan-400',
          shadow: 'shadow-sky-500/10',
          glow: 'bg-sky-500/5',
        };
    }
  };

  const theme = getThemeStyles(data.themeColor);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setContactName('');
      setContactEmail('');
      setContactMsg('');
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
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
      <div className="min-h-screen frosted-bg text-slate-100 flex flex-col md:flex-row font-sans relative" id="portfolio-layout-split">
        {/* Fixed Left Canvas Column */}
        <div className="w-full md:w-[45%] h-[400px] md:h-screen md:sticky md:top-0 bg-white/[0.01] border-b md:border-b-0 md:border-r border-white/5 flex flex-col relative overflow-hidden" id="split-stage-column">
          {/* Avatar ambient space background */}
          <div className="avatar-space absolute inset-0 rounded-full scale-110 pointer-events-none z-0" />

          {/* Header overlay */}
          <div className="absolute top-4 left-6 z-10 pointer-events-none">
            <h1 className="text-sm font-mono tracking-widest font-bold uppercase text-slate-200 flex items-center gap-1.5">
              <Terminal size={14} className={theme.text} />
              {data.name.split(' ')[0]}.3D
            </h1>
          </div>



          {/* 3D Canvas element wrapper */}
          <div className="flex-1 w-full h-full relative z-10">
            {canvasElement}
          </div>

          {/* Footer visual metadata */}
          <div className="absolute bottom-4 left-6 pointer-events-none z-10 hidden md:block">
            <div className="flex flex-col gap-0.5 font-mono text-[9px] text-slate-500">
              <span>MODEL: GLTF_LOADER_PRO</span>
              <span>LIGHTING: {data.avatarConfig.lighting.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Scrolling Right Content Column */}
        <div className="flex-1 overflow-y-auto bg-transparent" id="split-content-column">
          <header className="sticky top-0 z-20 bg-[#050508]/40 backdrop-blur-md border-b border-white/[0.06] px-6 py-4 md:px-12 flex justify-between items-center" id="split-header">
            <span className="text-xs font-mono text-slate-400">{data.role}</span>
            <nav className="hidden sm:flex items-center gap-6">
              {navLinks.map(link => (
                <a
                  key={link.id}
                  href={`#split-${link.id}`}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors uppercase tracking-wider font-sans"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </header>

          <main className="px-6 py-12 md:p-16 space-y-24 max-w-4xl mx-auto" id="split-sections-container">
            {/* Section: Home / Intro */}
            <section id="split-home" className="space-y-6 pt-6">
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
                {data.socials.github && (
                  <a
                    href={data.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all hover:scale-105"
                  >
                    <Github size={18} />
                  </a>
                )}
                {data.socials.linkedin && (
                  <a
                    href={data.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all hover:scale-105"
                  >
                    <Linkedin size={18} />
                  </a>
                )}
                {data.socials.twitter && (
                  <a
                    href={data.socials.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all hover:scale-105"
                  >
                    <Twitter size={18} />
                  </a>
                )}
                {data.socials.email && (
                  <a
                    href={`mailto:${data.socials.email}`}
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all hover:scale-105"
                  >
                    <Mail size={18} />
                  </a>
                )}
              </div>
            </section>

            {/* Section: About Me */}
            <section id="split-about" className="space-y-6 pt-6 border-t border-white/5">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">01 / Profile Biography</span>
                <h3 className="text-2xl font-bold text-white">My Creative Origin</h3>
              </div>
              <div className="glass p-6 rounded-2xl relative overflow-hidden leading-relaxed text-slate-300 text-sm md:text-base space-y-4">
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${theme.glow} blur-3xl`} />
                <p>{data.about}</p>
              </div>
            </section>

            {/* Section: Technical Skills */}
            <section id="split-skills" className="space-y-8 pt-6 border-t border-white/5">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">02 / Technical Stack</span>
                <h3 className="text-2xl font-bold text-white">Engineering Capabilities</h3>
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
                          {cat} Engineering
                        </h4>
                        <div className="space-y-4">
                          {sks.map(skill => (
                            <div key={skill.id} className="space-y-1.5">
                              <div className="flex justify-between text-xs font-medium">
                                <span className="text-slate-200">{skill.name}</span>
                                <span className="font-mono text-slate-400">{skill.proficiency}%</span>
                              </div>
                              <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                                <div className={`${theme.accent} h-full rounded-full transition-all duration-1000`} style={{ width: `${skill.proficiency}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Section: Portfolio Projects */}
            <section id="split-projects" className="space-y-8 pt-6 border-t border-white/5">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">03 / Selected Works</span>
                <h3 className="text-2xl font-bold text-white">Engineered Systems</h3>
              </div>

              {data.projects.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No project cards configured yet.</p>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {data.projects.map(proj => (
                    <div
                      key={proj.id}
                      className="glass project-card p-6 rounded-2xl relative overflow-hidden group hover:shadow-xl"
                    >
                      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full ${theme.glow} blur-2xl group-hover:bg-opacity-20 transition-all`} />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">{proj.category}</span>
                          <h4 className="text-lg font-bold text-slate-100 mt-0.5 group-hover:text-white transition-colors">{proj.title}</h4>
                        </div>
                        <div className="flex gap-2">
                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-white/[0.05] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-colors border border-white/10"
                              title="View Code on Github"
                            >
                              <Github size={14} />
                            </a>
                          )}
                          {proj.demoUrl && (
                            <a
                              href={proj.demoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-white/[0.05] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-colors border border-white/10 flex items-center gap-1 text-[10px]"
                            >
                              <span>Demo</span>
                              <ExternalLink size={11} />
                            </a>
                          )}
                        </div>
                      </div>

                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">{proj.description}</p>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {proj.tags.map(tag => (
                          <span key={tag} className="text-[9px] font-mono text-slate-300 bg-white/[0.05] px-2 py-0.5 rounded border border-white/10">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Section: Contact Form */}
            <section id="split-contact" className="space-y-6 pt-6 border-t border-white/5 pb-16">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="contact-form-name" className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Your Name</label>
                        <input
                          id="contact-form-name"
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Alice Carter"
                          className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#9d81ff] focus:ring-1 focus:ring-[#9d81ff] transition-all"
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
                          className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#9d81ff] focus:ring-1 focus:ring-[#9d81ff] transition-all"
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
                        className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#9d81ff] focus:ring-1 focus:ring-[#9d81ff] transition-all"
                      />
                    </div>

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
            </section>
          </main>
        </div>
      </div>
    );
  }

  // ==================== LAYOUT B: STANDARD SCROLLING / CLASSIC VIEW ====================
  if (data.layoutStyle === 'classic') {
    return (
      <div className="min-h-screen frosted-bg text-slate-100 flex flex-col font-sans relative overflow-x-hidden" id="portfolio-layout-classic">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-30 bg-[#050508]/40 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center max-w-7xl w-full mx-auto" id="classic-header">
          <h1 className="text-sm font-mono font-extrabold uppercase tracking-widest flex items-center gap-1.5">
            <Terminal size={14} className={theme.text} />
            {data.name}
          </h1>
          <nav className="hidden sm:flex items-center gap-6">
            {navLinks.map(link => (
              <a
                key={link.id}
                href={`#classic-${link.id}`}
                className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-widest font-mono"
              >
                {link.label}
              </a>
            ))}

          </nav>
        </header>

        {/* Hero Section with Showcase Viewport inside */}
        <section id="classic-home" className="px-6 py-12 md:py-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
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
            <div className="w-full max-w-md aspect-[4/5] glass relative overflow-hidden shadow-2xl">
              {/* Avatar ambient space background */}
              <div className="avatar-space absolute inset-0 rounded-full scale-125 pointer-events-none z-0" />

              <div className="absolute inset-x-0 top-0 bg-white/[0.01] px-5 py-3 border-b border-white/5 z-10 flex items-center justify-between pointer-events-none">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider">3D Hologram stage</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-mono text-slate-400 font-semibold uppercase">Active render</span>
                </span>
              </div>
              <div className="w-full h-full relative z-10">
                {canvasElement}
              </div>
            </div>
          </div>
        </section>

        {/* Outer contents */}
        <div className="bg-transparent border-t border-white/5 py-20 w-full" id="classic-scrolling-content-wrapper">
          <div className="max-w-7xl mx-auto px-6 space-y-24">
            
            {/* About Section */}
            <section id="classic-about" className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
              <div className="md:col-span-4 space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">01 / Biography</span>
                <h3 className="text-2xl font-bold text-white leading-tight">About {data.name.split(' ')[0]}</h3>
              </div>
              <div className="md:col-span-8 glass p-8 rounded-2xl relative overflow-hidden text-slate-300 leading-relaxed text-sm md:text-base">
                <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full ${theme.glow} blur-3xl`} />
                <p>{data.about}</p>
              </div>
            </section>

            {/* Skills Section */}
            <section id="classic-skills" className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">02 / capabilities</span>
                  <h3 className="text-2xl font-bold text-white leading-tight">Expertise & Skillsets</h3>
                </div>
                <span className="text-xs text-slate-400 font-sans">Self-declared proficiency score mapping</span>
              </div>

              {data.skills.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No skills listed yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {data.skills.map(skill => (
                    <div
                      key={skill.id}
                      className="glass project-card p-5 rounded-2xl relative group"
                    >
                      <span className="text-[8px] font-mono text-slate-300 bg-white/[0.05] px-2 py-0.5 rounded border border-white/10 uppercase tracking-widest absolute top-5 right-5">
                        {skill.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-100 group-hover:text-white mt-1 pr-14 truncate">{skill.name}</h4>
                      
                      <div className="mt-4 space-y-1.5">
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Confidence Level</span>
                          <span className="font-mono">{skill.proficiency}%</span>
                        </div>
                        <div className="w-full bg-white/[0.05] h-1 rounded-full overflow-hidden">
                          <div className={`${theme.accent} h-full rounded-full transition-all`} style={{ width: `${skill.proficiency}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Projects Section */}
            <section id="classic-projects" className="space-y-8">
              <div className="space-y-1 border-b border-white/5 pb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">03 / Works Gallery</span>
                <h3 className="text-2xl font-bold text-white leading-tight">Featured Engineering Accomplishments</h3>
              </div>

              {data.projects.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No project cards configured.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {data.projects.map(proj => (
                    <div
                      key={proj.id}
                      className="glass project-card p-6 rounded-2xl flex flex-col justify-between h-72 hover:shadow-xl relative overflow-hidden group"
                    >
                      <div className={`absolute top-0 right-0 w-20 h-20 rounded-full ${theme.glow} blur-2xl group-hover:opacity-60 transition-all`} />
                      <div>
                        <div className="flex justify-between items-start gap-3">
                          <span className="text-[9px] font-mono text-slate-300 bg-white/[0.05] px-2 py-0.5 rounded border border-white/10 uppercase">
                            {proj.category}
                          </span>
                          <div className="flex gap-1.5 shrink-0">
                            {proj.githubUrl && (
                              <a
                                href={proj.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-400 hover:text-white transition-colors"
                              >
                                <Github size={14} />
                              </a>
                            )}
                            {proj.demoUrl && (
                              <a
                                href={proj.demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-400 hover:text-white transition-colors"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                          </div>
                        </div>
                        <h4 className="text-base font-bold text-slate-100 mt-3 group-hover:text-white transition-colors truncate">{proj.title}</h4>
                        <p className="text-slate-400 text-xs mt-2 line-clamp-4 leading-relaxed">{proj.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-4 border-t border-white/5 mt-4">
                        {proj.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[9px] font-mono text-slate-300 bg-white/[0.05] px-1.5 py-0.2 rounded border border-white/10">
                            #{tag}
                          </span>
                        ))}
                        {proj.tags.length > 3 && (
                          <span className="text-[9px] font-mono text-slate-300 bg-white/[0.05] px-1.5 py-0.2 rounded border border-white/10">
                            +{proj.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Contact Form */}
            <section id="classic-contact" className="space-y-8 max-w-2xl mx-auto w-full pt-12 pb-16">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </section>
          </div>
        </div>
      </div>
    );
  }

  // ==================== LAYOUT C: IMMERSIVE FULLSCREEN ====================
  // (Provides an interactive floating HUD overlay that users can toggle/collapse)
  if (data.layoutStyle === 'fullscreen') {
    return (
      <div className="min-h-screen frosted-bg text-slate-100 flex flex-col font-sans relative overflow-hidden" id="portfolio-layout-fullscreen">
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
                  {data.socials.github && (
                    <a href={data.socials.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                      <Github size={15} />
                    </a>
                  )}
                  {data.socials.linkedin && (
                    <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                      <Linkedin size={15} />
                    </a>
                  )}
                  {data.socials.twitter && (
                    <a href={data.socials.twitter} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                      <Twitter size={15} />
                    </a>
                  )}
                  {data.socials.email && (
                    <a href={`mailto:${data.socials.email}`} className="text-slate-400 hover:text-white transition-colors">
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
                  <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-850">
                    {data.skills.map(skill => (
                      <div key={skill.id} className="glass-panel p-2.5 rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-200 font-semibold truncate pr-1">{skill.name}</span>
                          <span className="font-mono text-[9px] text-slate-300 shrink-0">{skill.proficiency}%</span>
                        </div>
                        <div className="w-full bg-white/[0.05] h-1 rounded-full overflow-hidden">
                          <div className={`${theme.accent} h-full rounded-full`} style={{ width: `${skill.proficiency}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'projects' && (
              <div className="space-y-3" id="hud-projects">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">03 / Works List</span>
                <h3 className="text-lg font-bold text-white">Engineered Artifacts</h3>
                
                {data.projects.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No projects listed.</p>
                ) : (
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-850">
                    {data.projects.map(proj => (
                      <div key={proj.id} className="glass-panel p-3 rounded-xl flex items-start justify-between gap-3 group">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-white">{proj.title}</h4>
                            <span className="text-[8px] font-mono text-emerald-300 bg-emerald-500/10 px-1 py-0.2 rounded uppercase shrink-0">{proj.category}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{proj.description}</p>
                        </div>
                        <div className="flex gap-1 shrink-0 mt-0.5">
                          {proj.githubUrl && (
                            <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                              <Github size={13} />
                            </a>
                          )}
                          {proj.demoUrl && (
                            <a href={proj.demoUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                              <ExternalLink size={13} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
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
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Your Name"
                        className="bg-white/[0.02] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#9d81ff] focus:ring-1 focus:ring-[#9d81ff] transition-all"
                      />
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="Your Email"
                        className="bg-white/[0.02] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#9d81ff] focus:ring-1 focus:ring-[#9d81ff] transition-all"
                      />
                    </div>
                    <textarea
                      required
                      rows={2.5}
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      placeholder="Detail your request or general networking message..."
                      className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#9d81ff] focus:ring-1 focus:ring-[#9d81ff] transition-all resize-none"
                    />
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
