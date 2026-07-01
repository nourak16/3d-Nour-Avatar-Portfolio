import { useState, useEffect } from 'react';
import { INITIAL_PORTFOLIO_DATA } from './presets';
import { PortfolioData } from './types';
import AvatarCanvas from './components/AvatarCanvas';
import ControlPanel from './components/ControlPanel';
import PortfolioView from './components/PortfolioView';
import { 
  Terminal, 
  Eye, 
  Settings, 
  Check, 
  Code, 
  Compass, 
  Layers, 
  Flame,
  Wand2,
  RefreshCw
} from 'lucide-react';

export default function App() {
  const [data, setData] = useState<PortfolioData>(() => {
    const saved = localStorage.getItem('avatar_portfolio_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Exclude ephemeral blob URLs from restoring
        if (parsed?.avatarConfig?.modelUrl?.startsWith('blob:')) {
          parsed.avatarConfig.modelUrl = INITIAL_PORTFOLIO_DATA.avatarConfig.modelUrl;
        }
        return parsed;
      } catch (e) {
        return INITIAL_PORTFOLIO_DATA;
      }
    }
    return INITIAL_PORTFOLIO_DATA;
  });

  const [animations, setAnimations] = useState<string[]>([]);
  const [mode, setMode] = useState<'builder' | 'showcase'>('builder');
  const [activeTab, setActiveTab] = useState<'visual' | 'content'>('visual');
  const [loadStatus, setLoadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [loadProgress, setLoadProgress] = useState(0);

  // Sync state to localStorage
  useEffect(() => {
    const toSave = { ...data };
    // If it's a blob url, replace it with the default modelUrl during save
    if (toSave.avatarConfig?.modelUrl?.startsWith('blob:')) {
      toSave.avatarConfig = {
        ...toSave.avatarConfig,
        modelUrl: INITIAL_PORTFOLIO_DATA.avatarConfig.modelUrl
      };
    }
    localStorage.setItem('avatar_portfolio_data', JSON.stringify(toSave));
  }, [data]);

  // Quick reset to default template
  const handleResetToDefault = () => {
    if (confirm('Are you sure you want to discard your changes and reset to the default portfolio template?')) {
      localStorage.removeItem('avatar_portfolio_data');
      setData(INITIAL_PORTFOLIO_DATA);
    }
  };

  // Instantly apply some cool preset styles for layout & theme
  const applyPresetLayoutTheme = (layout: 'split' | 'classic' | 'fullscreen', theme: string) => {
    setData(prev => ({
      ...prev,
      layoutStyle: layout,
      themeColor: theme,
      avatarConfig: {
        ...prev.avatarConfig,
        lighting: layout === 'fullscreen' ? 'cyberpunk' : 'warm',
        pedestal: layout === 'fullscreen' ? 'cyber' : 'glass',
      }
    }));
  };

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
      {/* Global Command Workspace Bar */}
      <header className="h-14 border-b border-white/5 bg-[#050508]/40 backdrop-blur-md shrink-0 px-5 flex items-center justify-between z-30 shadow-md" id="workspace-header">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#9d81ff]/10 border border-[#9d81ff]/30 p-1.5 rounded-lg text-[#9d81ff]">
            <Compass size={18} className="animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xs font-mono font-bold tracking-widest text-white uppercase flex items-center gap-1.5">
              3D Avatar Portfolio Studio
              <span className="text-[9px] font-mono text-[#9d81ff] bg-[#9d81ff]/10 border border-[#9d81ff]/20 px-1.5 py-0.2 rounded font-normal lowercase">v1.0.0</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-sans">WebGL GLB Asset Integrator & Preview Environment</p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          {/* Quick theme actions */}
          <div className="hidden lg:flex items-center gap-1 bg-white/[0.05] p-1 rounded-lg border border-white/10">
            <button
              onClick={() => applyPresetLayoutTheme('split', 'emerald')}
              className="px-2 py-1 text-[9px] font-mono font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Apply Split Screen Emerald theme"
              id="btn-quick-split"
            >
              Split
            </button>
            <span className="text-white/20 text-[10px] select-none">•</span>
            <button
              onClick={() => applyPresetLayoutTheme('classic', 'violet')}
              className="px-2 py-1 text-[9px] font-mono font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Apply Standard Violet theme"
              id="btn-quick-classic"
            >
              Standard
            </button>
            <span className="text-white/20 text-[10px] select-none">•</span>
            <button
              onClick={() => applyPresetLayoutTheme('fullscreen', 'amber')}
              className="px-2 py-1 text-[9px] font-mono font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Apply Immersive HUD theme"
              id="btn-quick-immersive"
            >
              Immersive
            </button>
          </div>

          {/* Reset template */}
          <button
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-slate-150 transition-all cursor-pointer shadow-sm"
            title="Reset to original developer profile template"
            id="btn-reset-workspace"
          >
            <RefreshCw size={12} />
            <span className="hidden sm:inline">Reset Template</span>
          </button>

          {/* Mode Switcher */}
          <div className="flex bg-white/[0.05] border border-white/10 rounded-lg p-0.5" id="mode-toggles">
            <button
              onClick={() => setMode('builder')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                mode === 'builder'
                  ? 'bg-white/[0.1] text-white font-bold border border-white/15 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id="btn-mode-builder"
            >
              <Settings size={13} />
              <span>Workspace</span>
            </button>
            <button
              onClick={() => setMode('showcase')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                mode === 'showcase'
                  ? 'bg-white/[0.1] text-white font-bold border border-white/15 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id="btn-mode-showcase"
            >
              <Eye size={13} />
              <span>Preview Live</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative" id="workspace-body-frame">
        {mode === 'builder' ? (
          // ==================== WORKSPACE BUILDER VIEW ====================
          // Left: Interactive Live Canvas + Responsive layout render inside a window box
          // Right: Control Sidebar
          <div className="flex-1 flex flex-col lg:flex-row min-h-0" id="builder-dual-viewport">
            <div className="flex-1 bg-[#030508] flex flex-col min-h-0 relative p-4 sm:p-6 space-y-3" id="live-stage-preview">
              {/* Stage Top Help indicators */}
              <div className="flex justify-between items-center text-xs text-slate-500 shrink-0 font-mono px-1">
                <span className="flex items-center gap-1.5">
                  <Terminal size={12} className="text-slate-500" />
                  WORKSPACE_LIVE_SANDBOX
                </span>
                <span className="flex items-center gap-1">
                  {loadStatus === 'loading' ? (
                    <span className="text-emerald-400 animate-pulse">Compiling meshes ({loadProgress}%)...</span>
                  ) : loadStatus === 'error' ? (
                    <span className="text-rose-400">Compilation error</span>
                  ) : (
                    <span className="text-slate-400">Active GLB • Double click to orbit</span>
                  )}
                </span>
              </div>

              {/* The Sandbox container simulating browser preview */}
              <div className="flex-1 rounded-2xl border border-white/5 bg-[#050508] overflow-hidden shadow-2xl relative" id="sandbox-preview-frame">
                {/* Embedded render preview of PortfolioView */}
                <PortfolioView data={data} canvasElement={canvasElement} />
              </div>
            </div>

            {/* Sidebar Control Panel Column */}
            <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 h-1/2 lg:h-full border-t lg:border-t-0 lg:border-l border-white/5 bg-[#050508]/20" id="sidebar-panel-column">
              <ControlPanel
                data={data}
                onChange={(newData) => setData(newData)}
                animations={animations}
                activeTab={activeTab}
                setActiveTab={(tab) => setActiveTab(tab)}
              />
            </div>
          </div>
        ) : (
          // ==================== FULLSCREEN SHOWCASE PREVIEW ====================
          <div className="flex-1 w-full h-full overflow-hidden" id="full-showcase-viewport">
            {/* Real portfolio view exactly as the final user would interact with it */}
            <PortfolioView data={data} canvasElement={canvasElement} />
            
            {/* Quick overlay HUD banner to let builder return */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none">
              <button
                onClick={() => setMode('builder')}
                className="glass hover:bg-white/[0.08] hover:text-white text-slate-200 font-semibold px-4 py-2 rounded-full border border-white/10 transition-all shadow-2xl active:scale-95 text-xs cursor-pointer group"
                id="btn-return-workspace"
              >
                <Settings size={13} className="group-hover:rotate-45 transition-transform" />
                Return to Workspace Builder
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
