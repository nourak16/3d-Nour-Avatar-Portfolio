import { useState, useEffect } from 'react';
import { INITIAL_PORTFOLIO_DATA } from './presets';
import { PortfolioData } from './types';
import AvatarCanvas from './components/AvatarCanvas';
import PortfolioView from './components/PortfolioView';

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
      {/* Portfolio View exactly as the final public user interacts with it */}
      <PortfolioView data={data} canvasElement={canvasElement} />
    </div>
  );
}
