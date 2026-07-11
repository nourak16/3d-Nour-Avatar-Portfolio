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
          ? 'bg-slate-950/80 backdrop-blur-md border-white/10 md:top-4 md:max-w-4xl md:shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:rounded-full md:px-2'
          : 'bg-transparent',
        open && 'bg-slate-950 border-white/5'
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
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <WordmarkIcon className="h-4.5 text-[var(--theme-accent-color,rgb(52,211,153))] group-hover:scale-105 transition-transform duration-300" />
          <span className="hidden xs:inline-block text-[10px] font-mono font-bold uppercase tracking-widest bg-emerald-500/10 text-[var(--theme-accent-color)] border border-emerald-500/20 px-2 py-0.5 rounded">
            DEV
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${layoutStyle}-${link.id}`}
                onClick={(e) => handleLinkClick(e, link.id)}
                className={cn(
                  'relative text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full transition-all duration-300',
                  isActive 
                    ? 'text-white font-bold bg-white/[0.06] border border-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                )}
              >
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
            className="md:hidden border-t border-white/5 bg-slate-950/95 backdrop-blur-xl"
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

export const WordmarkIcon = (props: React.ComponentProps<'svg'>) => (
  <svg viewBox="0 0 84 24" fill="currentColor" {...props}>
    <path d="M45.035 23.984c-1.34-.062-2.566-.441-3.777-1.16-1.938-1.152-3.465-3.187-4.02-5.36-.199-.784-.238-1.128-.234-2.058 0-.691.008-.87.062-1.207.23-1.5.852-2.883 1.852-4.144.297-.371 1.023-1.09 1.41-1.387 1.399-1.082 2.84-1.68 4.406-1.816.536-.047 1.528-.02 2.047.054 1.227.184 2.227.543 3.106 1.121 1.277.84 2.5 2.184 3.367 3.7.098.168.172.308.172.312-.004 0-1.047.723-2.32 1.598l-2.711 1.867c-.61.422-2.91 2.008-2.993 2.062l-.074.047-1-1.574c-.55-.867-1.008-1.594-1.012-1.61-.007-.019.922-.648 2.188-1.476 1.215-.793 2.2-1.453 2.191-1.46-.02-.032-.508-.27-.691-.34a5 5 0 0 0-.465-.13c-.371-.09-1.105-.125-1.426-.07-1.285.219-2.336 1.3-2.777 2.852-.215.761-.242 1.636-.074 2.355.129.527.383 1.102.691 1.543.234.332.727.82 1.047 1.031.664.434 1.195.586 1.969.555.613-.023 1.027-.129 1.64-.426 1.184-.574 2.16-1.554 2.828-2.843.122-.235.208-.372.227-.368.082.032 3.77 1.938 3.79 1.961.034.032-.407.93-.696 1.414a12 12 0 0 1-1.051 1.477c-.36.422-1.102 1.14-1.492 1.445a9.9 9.9 0 0 1-3.23 1.684 9.2 9.2 0 0 1-2.95.351M74.441 23.996c-1.488-.043-2.8-.363-4.066-.992-1.687-.848-2.992-2.14-3.793-3.774-.605-1.234-.863-2.402-.863-3.894.004-1.149.176-2.156.527-3.11.14-.378.531-1.171.75-1.515 1.078-1.703 2.758-2.934 4.805-3.524.847-.242 1.465-.332 2.433-.351 1.032-.024 1.743.055 2.48.277l.31.09.007 2.48c.004 1.364 0 2.481-.008 2.481a1 1 0 0 1-.12-.055c-.688-.347-2.09-.488-2.962-.296-.754.167-1.296.453-1.785.945a3.7 3.7 0 0 0-1.043 2.11c-.047.382-.02 1.109.055 1.437a3.4 3.4 0 0 0 .941 1.738c.75.75 1.715 1.102 2.875 1.05.645-.03 1.118-.14 1.563-.366q1.721-.864 2.02-3.145c.035-.293.042-1.266.042-7.957V0H84l-.012 8.434c-.008 7.851-.011 8.457-.054 8.757-.196 1.274-.586 2.25-1.301 3.243-1.293 1.808-3.555 3.07-6.145 3.437-.664.098-1.43.14-2.047.125M9.848 23.574a14 14 0 0 1-1.137-.152c-2.352-.426-4.555-1.781-6.117-3.774-.27-.335-.75-1.05-.95-1.406-1.156-2.047-1.695-4.27-1.64-6.77.047-1.995.43-3.66 1.23-5.316.524-1.086 1.04-1.87 1.793-2.715C4.567 1.72 6.652.535 8.793.171 9.68.02 10.093 0 12.297 0h1.789v5.441l-.961.016c-2.36.04-3.441.215-4.441.719-.836.414-1.278.879-1.895 1.976-.219.399-.535 1.02-.535 1.063 0 .02 1.285.027 3.918.027h3.914v5.113h-3.914c-2.54 0-3.918.008-3.918.028 0 .05.254.597.441.953.344.656.649 1.086 1.051 1.48.668.657 1.356.985 2.445 1.16.645.106 1.274.145 2.61.16l1.285.016v5.442l-2.055-.004a120 120 0 0 1-2.183-.016M16.469 14.715c0-5.504.011-9.04.031-9.29a5.54 5.54 0 0 1 1.527-3.48c.778-.82 1.922-1.457 3.118-1.734C21.915.035 22.422 0 24.39 0h1.652v4.914h-1.426c-1.324 0-1.445.004-1.644.055-.739.191-1.059.699-1.106 1.754l-.015.355h4.191v4.914h-4.184v11.602h-5.39ZM27.023 14.727c0-5.223.012-9.04.028-9.278.129-1.98 1.234-3.68 3.012-4.62.87-.462 1.777-.716 2.851-.802A61 61 0 0 1 34.945 0h1.649v4.914h-1.426c-1.32 0-1.441.004-1.64.055-.739.191-1.063.699-1.106 1.754l-.02.355h4.192v4.914H32.41v11.602h-5.387ZM55.48 15.406V7.22h4.66v1.363c0 1.3.005 1.363.051 1.363.04 0 .075-.054.133-.203.38-.98.969-1.68 1.711-2.031.563-.266 1.422-.43 2.492-.48l.414-.02v4.914l-.414.035c-.738.063-1.597.195-2.058.313-.297.082-.688.28-.875.449-.324.289-.532.703-.625 1.254-.094.547-.098.879-.098 5.144v4.274h-5.39Zm0 0" />
  </svg>
);
