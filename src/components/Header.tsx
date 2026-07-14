import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  layoutStyle: 'split' | 'classic' | 'fullscreen';
  name: string;
  activeSection?: string;
  onNavigate?: (id: string) => void;
  socials?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export function Header({ layoutStyle, name, activeSection, onNavigate, socials }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Monitor scroll capturing of any container (necessary since scroll container varies with layout)
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.scrollTop > 20) {
        setScrolled(true);
      } else if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const links = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setOpen(false);
    
    // Smooth scroll to layout specific section
    const targetId = `${layoutStyle}-${id}`;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    
    if (onNavigate) {
      onNavigate(id);
    }
  };

  // Fullscreen layout has its own floating HUD navdeck at the bottom
  if (layoutStyle === 'fullscreen') {
    return null;
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 mx-auto w-full transition-all duration-300 ease-out border-b border-transparent',
        scrolled && !open
          ? 'bg-[#151b19]/80 backdrop-blur-md border-white/[0.06] md:top-4 md:max-w-4xl md:shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:rounded-full md:px-2'
          : 'bg-transparent',
        open && 'bg-[#151b19] border-white/5'
      )}
    >
      <nav
        className={cn(
          'flex h-16 w-full items-center justify-between px-6 transition-all duration-300 ease-out md:h-14',
          scrolled && 'md:px-4'
        )}
      >
        {/* Brand / Logo */}
        <a 
          href={`#${layoutStyle}-home`}
          onClick={(e) => handleLinkClick(e, 'home')}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="relative flex items-center justify-center w-9 h-9">
            {/* Ambient logo background glow */}
            <div className="absolute inset-0 bg-[var(--theme-accent-color,rgb(52,211,153))]/20 rounded-xl blur-md scale-75 group-hover:scale-110 group-hover:bg-[var(--theme-accent-color,rgb(52,211,153))]/30 transition-all duration-300" />
            
            {/* Outer Hexagonal Shield */}
            <svg 
              viewBox="0 0 100 100" 
              className="absolute inset-0 w-full h-full text-white/10 group-hover:text-white/20 transition-all duration-500 group-hover:rotate-12 transform-gpu"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="4"
            >
              <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="rgba(24, 30, 28, 0.6)" className="backdrop-blur-sm" />
            </svg>

            {/* Glowing Accent Hexagon outline */}
            <svg 
              viewBox="0 0 100 100" 
              className="absolute inset-0 w-full h-full text-[var(--theme-accent-color,rgb(52,211,153))] opacity-60 group-hover:opacity-100 transition-all duration-500 transform-gpu group-hover:-rotate-12"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="5"
              strokeDasharray="15 85"
              strokeDashoffset="0"
            >
              <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" />
            </svg>

            {/* Interactive Coding Mark inside */}
            <svg 
              viewBox="0 0 100 100" 
              className="w-5 h-5 z-10 text-[var(--theme-accent-color,rgb(52,211,153))] group-hover:text-white transition-colors duration-300"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="8.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="30,35 12,50 30,65" />
              <polyline points="70,35 88,50 70,65" />
              <line x1="58" y1="20" x2="42" y2="80" />
            </svg>
          </div>

          <div className="flex flex-col -space-y-1">
            <span className="text-lg font-black tracking-wider text-white group-hover:text-[var(--theme-accent-color,rgb(52,211,153))] transition-colors duration-300 font-sans">
              NAER
            </span>
            <span className="text-[8px] font-mono font-bold uppercase tracking-[0.25em] text-white/50 group-hover:text-[var(--theme-accent-color)] transition-colors duration-300">
              CODING
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1.5 bg-[#121715]/50 border border-white/[0.04] p-1 rounded-full relative">
          {links.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${layoutStyle}-${link.id}`}
                onClick={(e) => handleLinkClick(e, link.id)}
                onMouseEnter={() => setHoveredId(link.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={cn(
                  'relative text-xs font-semibold uppercase tracking-wider px-4.5 py-2 rounded-full transition-all duration-300 z-10 select-none border border-transparent',
                  isActive 
                    ? 'text-white font-extrabold'
                    : 'text-slate-400 hover:text-slate-100'
                )}
              >
                {/* Active Pill Glider */}
                {isActive && (
                  <motion.span
                    layoutId="activeNavBackground"
                    className="absolute inset-0 bg-white/[0.06] border border-white/10 rounded-full -z-10 shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Hover Pill Glider */}
                {hoveredId === link.id && !isActive && (
                  <motion.span
                    layoutId="hoverNavBackground"
                    className="absolute inset-0 bg-white/[0.03] border border-white/[0.02] rounded-full -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  />
                )}
                
                {link.label}
              </a>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={`#${layoutStyle}-contact`}
            onClick={(e) => handleLinkClick(e, 'contact')}
            className="inline-flex items-center gap-1 px-4 py-2 bg-[var(--theme-accent-color,rgb(52,211,153))] text-black font-semibold text-xs rounded-full hover:scale-105 active:scale-95 shadow-[0_4px_15px_rgba(52,211,153,0.25)] hover:shadow-[0_4px_20px_rgba(52,211,153,0.4)] transition-all cursor-pointer"
          >
            <span>Let's Talk</span>
            <ArrowUpRight size={13} />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex md:hidden items-center justify-center w-9 h-9 rounded-full bg-white/[0.03] border border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
          aria-label="Toggle menu"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden border-t border-white/5 bg-[#151b19]/95 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-1 px-6 py-6 border-b border-white/5">
              {links.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={`#${layoutStyle}-${link.id}`}
                    onClick={(e) => handleLinkClick(e, link.id)}
                    className={cn(
                      'flex items-center justify-between text-sm font-semibold uppercase tracking-wider py-3.5 px-4 rounded-xl transition-all',
                      isActive
                        ? 'text-[var(--theme-accent-color)] bg-emerald-500/5 border border-emerald-500/10 font-bold'
                        : 'text-slate-300 hover:bg-white/[0.02] hover:text-white'
                    )}
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight size={13} className={isActive ? 'opacity-100 text-[var(--theme-accent-color)]' : 'opacity-40 text-slate-500'} />
                  </a>
                );
              })}
            </div>
            
            <div className="px-10 py-6 flex flex-col gap-3">
              <a
                href={`#${layoutStyle}-contact`}
                onClick={(e) => handleLinkClick(e, 'contact')}
                className="w-full py-3 bg-[var(--theme-accent-color,rgb(52,211,153))] text-black font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(52,211,153,0.25)] cursor-pointer"
              >
                <span>Hire Me</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
