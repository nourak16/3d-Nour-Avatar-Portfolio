import React, { useState, useEffect } from 'react';
import { INITIAL_PORTFOLIO_DATA } from './presets';
import { PortfolioData } from './types';
import AvatarCanvas from './components/AvatarCanvas';
import PortfolioView from './components/PortfolioView';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, ArrowRight, Sparkles } from 'lucide-react';

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

export default function App() {
  // Directly load your precise customized portfolio data
  const [data, setData] = useState<PortfolioData>(INITIAL_PORTFOLIO_DATA);

  const rgbVal = getThemeColorRgb(data.themeColor);
  const hexVal = getThemeColorHex(data.themeColor);

  // Clear any stale local storage from construction phase so it resets for everyone
  useEffect(() => {
    localStorage.removeItem('avatar_portfolio_data');
  }, []);

  const [animations, setAnimations] = useState<string[]>([]);
  const [loadStatus, setLoadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [loadProgress, setLoadProgress] = useState(0);
  const [displayedProgress, setDisplayedProgress] = useState(0);
  const [isTimeMinMet, setIsTimeMinMet] = useState(false);

  // Control full-screen preloader state
  const [showPreloader, setShowPreloader] = useState(true);
  const [showSkip, setShowSkip] = useState(false);

  // Enforce a minimum of 10 seconds of loading screen
  useEffect(() => {
    const minTime = 10000; // 10000 milliseconds = 10 seconds minimum loading time
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      // Calculate smooth simulated progress towards 99%
      const percentage = Math.min(99, Math.floor((elapsed / minTime) * 100));
      setDisplayedProgress(prev => Math.max(prev, percentage));

      if (elapsed >= minTime) {
        setIsTimeMinMet(true);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Trigger skip capability after 12 seconds so users are never stuck if a loading issue occurs
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkip(true);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  // Gracefully transition out of preloader ONLY after BOTH the 10s minimum is met AND avatar loading has completed
  useEffect(() => {
    if (isTimeMinMet && (loadStatus === 'success' || loadStatus === 'error')) {
      setDisplayedProgress(100);
      const timer = setTimeout(() => {
        setShowPreloader(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isTimeMinMet, loadStatus]);

  // Stable rendering of the 3D Canvas to pass as a prop to PortfolioView
  // This keeps the DOM canvas structure and orbits intact
  const canvasElement = (
    <AvatarCanvas
      modelUrl={data.avatarConfig.modelUrl}
      scale={data.avatarConfig.scale}
      positionY={data.avatarConfig.positionY}
      rotationY={data.avatarConfig.rotationY}
      rotationSpeed={data.avatarConfig.rotationSpeed}
      autoRotate={data.avatarConfig.autoRotate}
      lighting={data.avatarConfig.lighting}
      pedestal={data.avatarConfig.pedestal}
      activeAnimation={data.avatarConfig.activeAnimation}
      posture={data.avatarConfig.posture || 'standing'}
      themeColor={data.themeColor}
      tablePosX={data.avatarConfig.tablePosX ?? 0}
      tablePosY={data.avatarConfig.tablePosY ?? 0}
      tablePosZ={data.avatarConfig.tablePosZ ?? 0}
      keyboardPosX={data.avatarConfig.keyboardPosX ?? 0}
      keyboardPosY={data.avatarConfig.keyboardPosY ?? 0}
      keyboardPosZ={data.avatarConfig.keyboardPosZ ?? 0}
      mousePosX={data.avatarConfig.mousePosX ?? 0}
      mousePosY={data.avatarConfig.mousePosY ?? 0}
      mousePosZ={data.avatarConfig.mousePosZ ?? 0}
      chairPosX={data.avatarConfig.chairPosX ?? 0}
      chairPosY={data.avatarConfig.chairPosY ?? 0}
      chairPosZ={data.avatarConfig.chairPosZ ?? 0}
      onAnimationsLoaded={(anims) => setAnimations(anims)}
      onLoadStatusChange={(status, progress) => {
        setLoadStatus(status);
        if (progress !== undefined) setLoadProgress(progress);
      }}
    />
  );

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white flex flex-col overflow-hidden font-sans relative" id="application-root" style={{
      '--theme-accent-color': hexVal,
      '--theme-color-rgb': rgbVal,
    } as React.CSSProperties}>
      
      {/* Persistent App-wide Ambient radial glow */}
      <div 
         className="absolute inset-0 pointer-events-none z-0" 
         style={{ background: `radial-gradient(circle at center, rgba(${rgbVal}, 0.05) 0%, #0f172a 80%)` }}
      />
      {/* Persistent App-wide Micro horizontal grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100%_16px] pointer-events-none z-0 opacity-50" />

      {/* Portfolio View animated entrance once preloader is done */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={!showPreloader ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="w-full min-h-screen flex flex-col"
      >
        <PortfolioView data={data} canvasElement={canvasElement} />
      </motion.div>

      {/* Full-screen preloader cover: blocks portfolio interaction until 3D avatar has fully loaded */}
      <AnimatePresence>
        {showPreloader && (
          <motion.div
            key="preloader-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1b211f] select-none overflow-hidden"
            id="app-global-preloader"
            style={{
              '--theme-accent-color': hexVal,
              '--theme-color-rgb': rgbVal,
            } as React.CSSProperties}
          >
            {/* Ambient luxury radial glow matching the dynamic theme color and true black edges */}
            <div 
              className="absolute inset-0 pointer-events-none" 
              style={{ background: `radial-gradient(circle at center, rgba(${rgbVal}, 0.08) 0%, #1b211f 70%)` }}
            />

            {/* Micro horizontal grid lines or details */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_16px] pointer-events-none opacity-40" />

            {/* Core Loading Content Card */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <div 
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] tracking-widest uppercase font-medium mb-4"
                  style={{
                    backgroundColor: `rgba(${rgbVal}, 0.1)`,
                    borderColor: `rgba(${rgbVal}, 0.2)`,
                    color: hexVal
                  }}
                >
                  <Sparkles size={11} className="animate-pulse" />
                  <span>Interactive Experience</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                className="text-3xl sm:text-4xl font-sans tracking-tight text-white font-medium mb-1.5"
              >
                {data.name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-slate-400 text-sm font-mono tracking-wider uppercase mb-8"
              >
                {data.role}
              </motion.p>

              {/* Progress and control space */}
              <div className="h-48 flex flex-col items-center justify-center">
                {loadStatus === 'error' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <span className="text-rose-400 text-xs font-mono font-medium">Avatar Loading Bypassed</span>
                    <button
                      onClick={() => setShowPreloader(false)}
                      className="inline-flex items-center gap-1.5 text-black font-sans text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-lg active:scale-95 cursor-pointer"
                      style={{
                        backgroundColor: hexVal,
                        boxShadow: `0 0 15px rgba(${rgbVal}, 0.35)`
                      }}
                    >
                      <span>Enter Standard Portfolio</span>
                      <ArrowRight size={13} />
                    </button>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center">
                    {/* Terminal Loader (From Uiverse.io by jeremyssocial) */}
                    <div className="terminal-loader">
                      <div className="terminal-header">
                        <div className="terminal-title">Status</div>
                        <div className="terminal-controls">
                          <div className="control close"></div>
                          <div className="control minimize"></div>
                          <div className="control maximize"></div>
                        </div>
                      </div>
                      <div className="terminal-text-animated">Loading...</div>
                    </div>

                    {/* Linear thin high-precision progress bar */}
                    <div className="w-64 h-[3px] bg-white/5 rounded-full overflow-hidden relative border border-white/5 mt-6">
                      <div
                        className="h-full rounded-full transition-all duration-300 ease-out"
                        style={{ 
                          width: `${displayedProgress}%`,
                          backgroundColor: hexVal
                        }}
                      />
                    </div>

                    <div className="w-64 flex items-center justify-between text-[10px] font-mono text-slate-500 mt-3 tracking-wider uppercase">
                      <span className="flex items-center gap-1">
                        <Loader2 size={10} className="animate-spin" style={{ color: hexVal }} />
                        {displayedProgress < 100 ? 'Syncing 3D Scene' : 'Initializing Avatar'}
                      </span>
                      <span className="font-semibold text-slate-300">{displayedProgress}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Skip Option at the bottom */}
            {showSkip && loadStatus !== 'success' && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => setShowPreloader(false)}
                className="absolute bottom-8 text-[11px] font-mono text-slate-500 hover:text-[var(--theme-accent-color)] underline underline-offset-4 cursor-pointer transition-colors"
              >
                Skip 3D setup & view static portfolio
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
