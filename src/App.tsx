import { useState, useEffect } from 'react';
import { INITIAL_PORTFOLIO_DATA } from './presets';
import { PortfolioData } from './types';
import AvatarCanvas from './components/AvatarCanvas';
import PortfolioView from './components/PortfolioView';

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
