import { useState, useEffect } from 'react';
import { INITIAL_PORTFOLIO_DATA } from './presets';
import { PortfolioData } from './types';
import AvatarCanvas from './components/AvatarCanvas';
import PortfolioView from './components/PortfolioView';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, ArrowRight, Sparkles } from 'lucide-react';

export default function App() {
  // Directly load your precise customized portfolio data
  const [data, setData] = useState<PortfolioData>(INITIAL_PORTFOLIO_DATA);

  // Clear any stale local storage from construction phase so it resets for everyone
  useEffect(() => {
    localStorage.removeItem('avatar_portfolio_data');
  }, []);

  const [animations, setAnimations] = useState<string[]>([]);
  const [loadStatus, setLoadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [loadProgress, setLoadProgress] = useState(0);

  // Control full-screen preloader state
  const [showPreloader, setShowPreloader] = useState(true);
  const [showSkip, setShowSkip] = useState(false);

  // Trigger skip capability after a short delay so users are never stuck
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkip(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  // Gracefully transition out of preloader on load success
  useEffect(() => {
    if (loadStatus === 'success') {
      const timer = setTimeout(() => {
        setShowPreloader(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [loadStatus]);

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
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans" id="application-root">
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
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 select-none overflow-hidden"
            id="app-global-preloader"
          >
            {/* Ambient luxury radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06)_0%,rgba(2,6,23,1)_70%)] pointer-events-none" />

            {/* Micro horizontal grid lines or details */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_16px] pointer-events-none opacity-40" />

            {/* Core Loading Content Card */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-mono text-[10px] tracking-widest uppercase font-medium mb-4">
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
                className="text-slate-400 text-sm font-mono tracking-wider uppercase"
              >
                {data.role}
              </motion.p>

              {/* Progress and control space */}
              <div className="mt-12 h-16 flex flex-col items-center justify-center w-64">
                {loadStatus === 'error' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <span className="text-rose-400 text-xs font-mono font-medium">Avatar Loading Bypassed</span>
                    <button
                      onClick={() => setShowPreloader(false)}
                      className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-sans text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-lg active:scale-95 cursor-pointer"
                    >
                      <span>Enter Standard Portfolio</span>
                      <ArrowRight size={13} />
                    </button>
                  </motion.div>
                ) : (
                  <div className="w-full flex flex-col items-center">
                    {/* Linear thin high-precision progress bar */}
                    <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${loadProgress}%` }}
                      />
                    </div>

                    <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-500 mt-3 tracking-wider uppercase">
                      <span className="flex items-center gap-1">
                        <Loader2 size={10} className="animate-spin text-emerald-400/80" />
                        {loadProgress < 100 ? 'Syncing 3D Scene' : 'Initializing Avatar'}
                      </span>
                      <span className="font-semibold text-slate-300">{loadProgress}%</span>
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
                className="absolute bottom-8 text-[11px] font-mono text-slate-500 hover:text-emerald-400 underline underline-offset-4 cursor-pointer transition-colors"
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
