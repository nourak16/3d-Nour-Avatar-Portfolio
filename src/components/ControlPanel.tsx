import React, { useState } from 'react';
import { PortfolioData, LightingPreset, PedestalStyle, LayoutStyle, Skill, Project } from '../types';
import { AVATAR_PRESETS } from '../presets';
import { 
  Sliders, 
  User, 
  Code, 
  Briefcase, 
  Compass, 
  Plus, 
  Trash2, 
  Link, 
  Mail, 
  Info,
  Palette,
  Eye,
  Settings,
  HelpCircle,
  Play,
  Upload,
  Keyboard,
  Mouse,
  RotateCcw,
  Armchair
} from 'lucide-react';

interface ControlPanelProps {
  data: PortfolioData;
  onChange: (newData: PortfolioData) => void;
  animations: string[];
  activeTab: 'visual' | 'content';
  setActiveTab: (tab: 'visual' | 'content') => void;
}

export default function ControlPanel({
  data,
  onChange,
  animations,
  activeTab,
  setActiveTab,
}: ControlPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'skills' | 'projects'>('profile');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState(80);
  const [newSkillCategory, setNewSkillCategory] = useState<'Frontend' | 'Backend' | 'Design' | 'Other'>('Frontend');

  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjCategory, setNewProjCategory] = useState('');
  const [newProjTags, setNewProjTags] = useState('');
  const [newProjDemo, setNewProjDemo] = useState('');
  const [newProjGithub, setNewProjGithub] = useState('');

  // Update specific fields helpers
  const updateAvatarConfig = (fields: Partial<PortfolioData['avatarConfig']>) => {
    onChange({
      ...data,
      avatarConfig: {
        ...data.avatarConfig,
        ...fields,
      },
    });
  };

  const updateProfileFields = (fields: Partial<PortfolioData>) => {
    onChange({
      ...data,
      ...fields,
    });
  };

  const updateSocialFields = (fields: Partial<PortfolioData['socials']>) => {
    onChange({
      ...data,
      socials: {
        ...data.socials,
        ...fields,
      },
    });
  };

  // Preset loading handler
  const handleLoadPreset = (presetId: string) => {
    const preset = AVATAR_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    onChange({
      ...data,
      avatarConfig: {
        ...data.avatarConfig,
        modelUrl: preset.url,
        scale: preset.scale,
        positionY: preset.positionY,
        rotationY: preset.rotationY,
        // Reset active animation default
        activeAnimation: preset.id === 'robot-expressive' ? 'Dance' : '',
      },
    });
  };

  const handleLocalModelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke previous URL if it was an object URL to prevent memory leaks
    if (data.avatarConfig.modelUrl.startsWith('blob:')) {
      URL.revokeObjectURL(data.avatarConfig.modelUrl);
    }

    const fileUrl = URL.createObjectURL(file);
    onChange({
      ...data,
      avatarConfig: {
        ...data.avatarConfig,
        modelUrl: fileUrl,
        scale: 1.0, // Default scale for imported models
        positionY: 0, // Default position
        rotationY: 0, // Default rotation
        activeAnimation: '', // Clear animations initially
      },
    });
  };

  // Skill Handlers
  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: Skill = {
      id: `sk-${Date.now()}`,
      name: newSkillName.trim(),
      proficiency: newSkillProficiency,
      category: newSkillCategory,
    };
    onChange({
      ...data,
      skills: [...data.skills, newSkill],
    });
    setNewSkillName('');
  };

  const handleRemoveSkill = (id: string) => {
    onChange({
      ...data,
      skills: data.skills.filter((s) => s.id !== id),
    });
  };

  // Project Handlers
  const handleAddProject = () => {
    if (!newProjTitle.trim() || !newProjDesc.trim()) return;
    const tagsArr = newProjTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: newProjTitle.trim(),
      description: newProjDesc.trim(),
      category: newProjCategory.trim() || 'General',
      tags: tagsArr.length > 0 ? tagsArr : ['Development'],
      demoUrl: newProjDemo.trim() || undefined,
      githubUrl: newProjGithub.trim() || undefined,
    };

    onChange({
      ...data,
      projects: [...data.projects, newProj],
    });

    setNewProjTitle('');
    setNewProjDesc('');
    setNewProjCategory('');
    setNewProjTags('');
    setNewProjDemo('');
    setNewProjGithub('');
  };

  const handleRemoveProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.filter((p) => p.id !== id),
    });
  };

  const themeColors = [
    { name: 'Emerald (Matrix Tech)', value: 'emerald', bg: 'bg-emerald-500', border: 'border-emerald-500' },
    { name: 'Indigo', value: 'indigo', bg: 'bg-indigo-500', border: 'border-indigo-500' },
    { name: 'Violet', value: 'violet', bg: 'bg-violet-500', border: 'border-violet-500' },
    { name: 'Amber', value: 'amber', bg: 'bg-amber-500', border: 'border-amber-500' },
    { name: 'Rose', value: 'rose', bg: 'bg-rose-500', border: 'border-rose-500' },
    { name: 'Sky', value: 'sky', bg: 'bg-sky-500', border: 'border-sky-500' },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 border-l border-slate-800" id="builder-control-panel">
      {/* Navigation tabs */}
      <div className="grid grid-cols-2 border-b border-slate-800 shrink-0 bg-slate-950/40 p-1.5 gap-1" id="panel-tab-navigation">
        <button
          onClick={() => setActiveTab('visual')}
          className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-md transition-all cursor-pointer ${
            activeTab === 'visual'
              ? 'bg-slate-800 text-emerald-400 border border-slate-700/80 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
          id="tab-visual-settings"
        >
          <Sliders size={14} />
          3D Canvas & Theme
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-md transition-all cursor-pointer ${
            activeTab === 'content'
              ? 'bg-slate-800 text-emerald-400 border border-slate-700/80 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
          id="tab-portfolio-content"
        >
          <User size={14} />
          Portfolio Content
        </button>
      </div>

      {/* Main Panel Body with scrolling */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-800" id="panel-scroll-container">
        {/* ==================== 1. VISUAL CUSTOMIZATION TAB ==================== */}
        {activeTab === 'visual' && (
          <div className="space-y-6" id="visual-customization-section">
            {/* Theme & Layout Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Palette size={13} className="text-slate-400" />
                Aesthetic & Layout Design
              </h3>
              
              <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-800 space-y-4">
                {/* Theme colors */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">Accent Theme Color</label>
                  <div className="flex flex-wrap gap-2.5">
                    {themeColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateProfileFields({ themeColor: color.value })}
                        className={`w-7 h-7 rounded-full ${color.bg} cursor-pointer transition-all hover:scale-110 relative flex items-center justify-center`}
                        title={color.name}
                        id={`btn-color-${color.value}`}
                      >
                        {data.themeColor === color.value && (
                          <span className="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-25" />
                        )}
                        {data.themeColor === color.value && (
                          <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layout selection */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">Portfolio View Layout</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['split', 'classic', 'fullscreen'] as LayoutStyle[]).map((layout) => (
                      <button
                        key={layout}
                        onClick={() => updateProfileFields({ layoutStyle: layout })}
                        className={`py-2 px-1 text-[10px] font-semibold rounded-md border text-center uppercase tracking-wider transition-all cursor-pointer ${
                          data.layoutStyle === layout
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                        id={`btn-layout-${layout}`}
                      >
                        {layout === 'split' ? 'Split Stage' : layout === 'classic' ? 'Standard' : 'Immersive'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>



            {/* Model Animation */}
            {animations.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Play size={13} className="text-slate-400" />
                  Model Animations
                </h3>
                <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-800">
                  <div className="flex flex-wrap gap-1.5">
                    {animations.map((anim) => (
                      <button
                        key={anim}
                        onClick={() => updateAvatarConfig({ activeAnimation: anim })}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                          data.avatarConfig.activeAnimation === anim
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                        id={`btn-anim-${anim}`}
                      >
                        {anim}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Lighting & Pedestal Stage */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Settings size={13} className="text-slate-400" />
                Lighting & Platform Stage
              </h3>
              <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-800 space-y-4">
                {/* Lighting Presets */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">Atmospheric Light Preset</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['studio', 'neon', 'cyberpunk', 'warm'] as LightingPreset[]).map((preset) => (
                      <button
                        key={preset}
                        onClick={() => updateAvatarConfig({ lighting: preset })}
                        className={`py-2 px-3 text-xs font-semibold rounded-md border text-center capitalize transition-all cursor-pointer ${
                          data.avatarConfig.lighting === preset
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-sm'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                        id={`btn-light-${preset}`}
                      >
                        {preset === 'studio' ? 'Studio Clean' : preset === 'neon' ? 'Neon Sunset' : preset === 'cyberpunk' ? 'Cyberpunk Blue' : 'Golden Hour'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pedestal style */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">Base Pedestal Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['none', 'glass', 'cyber', 'stone'] as PedestalStyle[]).map((pedestal) => (
                      <button
                        key={pedestal}
                        onClick={() => updateAvatarConfig({ pedestal })}
                        className={`py-2 px-3 text-xs font-semibold rounded-md border text-center capitalize transition-all cursor-pointer ${
                          data.avatarConfig.pedestal === pedestal
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-sm'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                        id={`btn-pedestal-${pedestal}`}
                      >
                        {pedestal === 'none' ? 'Floating (No Base)' : pedestal === 'glass' ? 'Glass Frosted' : pedestal === 'cyber' ? 'Cyber Octagon' : 'Heavy Stone'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avatar Posture / Environment Scene */}
                <div className="space-y-2 pt-3 border-t border-slate-800/60">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-300">Avatar Pose & Environment</label>
                    <span className="text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">3D Interactive Setup</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateAvatarConfig({ posture: 'standing' })}
                      className={`py-2 px-3 text-xs font-semibold rounded-md border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        (data.avatarConfig.posture || 'standing') === 'standing'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                      id="btn-posture-standing"
                    >
                      <User size={14} className="mb-0.5" />
                      <span>Standing Tall</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateAvatarConfig({ posture: 'typing' })}
                      className={`py-2 px-3 text-xs font-semibold rounded-md border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        data.avatarConfig.posture === 'typing'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                      id="btn-posture-typing"
                    >
                      <Code size={14} className="mb-0.5" />
                      <span>Sitting & Typing</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Manual transform controls */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Sliders size={13} className="text-slate-400" />
                Fine-tune Avatar Alignment
              </h3>
              <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-800 space-y-4">
                {/* Scale */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="scale-slider" className="text-slate-300">Avatar Relative Scale</label>
                    <span className="font-mono text-emerald-400 font-semibold">{data.avatarConfig.scale.toFixed(2)}x</span>
                  </div>
                  <input
                    id="scale-slider"
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.05"
                    value={data.avatarConfig.scale}
                    onChange={(e) => updateAvatarConfig({ scale: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Height positionY */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="height-slider" className="text-slate-300">Pedestal Y-Offset</label>
                    <span className="font-mono text-emerald-400 font-semibold">{data.avatarConfig.positionY.toFixed(2)}m</span>
                  </div>
                  <input
                    id="height-slider"
                    type="range"
                    min="-1.5"
                    max="1.5"
                    step="0.05"
                    value={data.avatarConfig.positionY}
                    onChange={(e) => updateAvatarConfig({ positionY: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Rotation speed */}
                <div className="space-y-3 pt-1 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <label htmlFor="auto-rotate-switch" className="text-xs font-medium text-slate-300 cursor-pointer">Auto Orbit Model Rotation</label>
                    <input
                      id="auto-rotate-switch"
                      type="checkbox"
                      checked={data.avatarConfig.autoRotate}
                      onChange={(e) => updateAvatarConfig({ autoRotate: e.target.checked })}
                      className="w-4 h-4 accent-emerald-500 cursor-pointer"
                    />
                  </div>
                  
                  {data.avatarConfig.autoRotate && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Rotation Angular Velocity</span>
                        <span className="font-mono text-emerald-400">{data.avatarConfig.rotationSpeed.toFixed(1)} rad/s</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="2.0"
                        step="0.05"
                        value={data.avatarConfig.rotationSpeed}
                        onChange={(e) => updateAvatarConfig({ rotationSpeed: parseFloat(e.target.value) })}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {/* Desk Setup Alignment Offsets */}
                {data.avatarConfig.posture === 'typing' ? (
                  <div className="pt-4 border-t border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sliders size={12} className="text-emerald-500" />
                        Desk Alignment Offsets
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          updateAvatarConfig({
                            tablePosX: 0,
                            tablePosY: 0,
                            tablePosZ: 0,
                            keyboardPosX: 0,
                            keyboardPosY: 0,
                            keyboardPosZ: 0,
                            mousePosX: 0,
                            mousePosY: 0,
                            mousePosZ: 0,
                            chairPosX: 0,
                            chairPosY: 0,
                            chairPosZ: 0,
                          });
                        }}
                        className="text-[10px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 bg-slate-900 border border-slate-800 hover:border-emerald-500/20 px-2 py-1 rounded transition-all cursor-pointer"
                        title="Reset all desk position adjustments"
                      >
                        <RotateCcw size={10} />
                        Reset Setup
                      </button>
                    </div>

                    {/* Table Offset */}
                    <div className="space-y-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800/40">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        Table / Desk Position
                      </div>
                      
                      <div className="space-y-2">
                        {/* Table X */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Horizontal (Left/Right)</span>
                            <span className="font-mono text-emerald-400">{(data.avatarConfig.tablePosX ?? 0).toFixed(2)}m</span>
                          </div>
                          <input
                            type="range"
                            min="-1.0"
                            max="1.0"
                            step="0.01"
                            value={data.avatarConfig.tablePosX ?? 0}
                            onChange={(e) => updateAvatarConfig({ tablePosX: parseFloat(e.target.value) })}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                        </div>

                        {/* Table Y */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Vertical (Up/Down)</span>
                            <span className="font-mono text-emerald-400">{(data.avatarConfig.tablePosY ?? 0).toFixed(2)}m</span>
                          </div>
                          <input
                            type="range"
                            min="-1.0"
                            max="1.0"
                            step="0.01"
                            value={data.avatarConfig.tablePosY ?? 0}
                            onChange={(e) => updateAvatarConfig({ tablePosY: parseFloat(e.target.value) })}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                        </div>

                        {/* Table Z */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Depth (Forward/Backward)</span>
                            <span className="font-mono text-emerald-400">{(data.avatarConfig.tablePosZ ?? 0).toFixed(2)}m</span>
                          </div>
                          <input
                            type="range"
                            min="-1.0"
                            max="1.0"
                            step="0.01"
                            value={data.avatarConfig.tablePosZ ?? 0}
                            onChange={(e) => updateAvatarConfig({ tablePosZ: parseFloat(e.target.value) })}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Keyboard Offset */}
                    <div className="space-y-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800/40">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                        <Keyboard size={12} className="text-emerald-500" />
                        Keyboard Position
                      </div>
                      
                      <div className="space-y-2">
                        {/* Keyboard X */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Horizontal (Left/Right)</span>
                            <span className="font-mono text-emerald-400">{(data.avatarConfig.keyboardPosX ?? 0).toFixed(2)}m</span>
                          </div>
                          <input
                            type="range"
                            min="-0.5"
                            max="0.5"
                            step="0.01"
                            value={data.avatarConfig.keyboardPosX ?? 0}
                            onChange={(e) => updateAvatarConfig({ keyboardPosX: parseFloat(e.target.value) })}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                        </div>

                        {/* Keyboard Z */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Depth (Forward/Backward)</span>
                            <span className="font-mono text-emerald-400">{(data.avatarConfig.keyboardPosZ ?? 0).toFixed(2)}m</span>
                          </div>
                          <input
                            type="range"
                            min="-0.5"
                            max="0.5"
                            step="0.01"
                            value={data.avatarConfig.keyboardPosZ ?? 0}
                            onChange={(e) => updateAvatarConfig({ keyboardPosZ: parseFloat(e.target.value) })}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mouse Offset */}
                    <div className="space-y-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800/40">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                        <Mouse size={12} className="text-emerald-500" />
                        Mouse Position
                      </div>
                      
                      <div className="space-y-2">
                        {/* Mouse X */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Horizontal (Left/Right)</span>
                            <span className="font-mono text-emerald-400">{(data.avatarConfig.mousePosX ?? 0).toFixed(2)}m</span>
                          </div>
                          <input
                            type="range"
                            min="-0.5"
                            max="0.5"
                            step="0.01"
                            value={data.avatarConfig.mousePosX ?? 0}
                            onChange={(e) => updateAvatarConfig({ mousePosX: parseFloat(e.target.value) })}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                        </div>

                        {/* Mouse Z */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Depth (Forward/Backward)</span>
                            <span className="font-mono text-emerald-400">{(data.avatarConfig.mousePosZ ?? 0).toFixed(2)}m</span>
                          </div>
                          <input
                            type="range"
                            min="-0.5"
                            max="0.5"
                            step="0.01"
                            value={data.avatarConfig.mousePosZ ?? 0}
                            onChange={(e) => updateAvatarConfig({ mousePosZ: parseFloat(e.target.value) })}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Chair Offset */}
                    <div className="space-y-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800/40">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                        <Armchair size={12} className="text-emerald-500" />
                        Chair Position
                      </div>
                      
                      <div className="space-y-2">
                        {/* Chair X */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Horizontal (Left/Right)</span>
                            <span className="font-mono text-emerald-400">{(data.avatarConfig.chairPosX ?? 0).toFixed(2)}m</span>
                          </div>
                          <input
                            type="range"
                            min="-0.5"
                            max="0.5"
                            step="0.01"
                            value={data.avatarConfig.chairPosX ?? 0}
                            onChange={(e) => updateAvatarConfig({ chairPosX: parseFloat(e.target.value) })}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                        </div>

                        {/* Chair Y */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Vertical (Up/Down)</span>
                            <span className="font-mono text-emerald-400">{(data.avatarConfig.chairPosY ?? 0).toFixed(2)}m</span>
                          </div>
                          <input
                            type="range"
                            min="-0.5"
                            max="0.5"
                            step="0.01"
                            value={data.avatarConfig.chairPosY ?? 0}
                            onChange={(e) => updateAvatarConfig({ chairPosY: parseFloat(e.target.value) })}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                        </div>

                        {/* Chair Z */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Depth (Forward/Backward)</span>
                            <span className="font-mono text-emerald-400">{(data.avatarConfig.chairPosZ ?? 0).toFixed(2)}m</span>
                          </div>
                          <input
                            type="range"
                            min="-0.5"
                            max="0.5"
                            step="0.01"
                            value={data.avatarConfig.chairPosZ ?? 0}
                            onChange={(e) => updateAvatarConfig({ chairPosZ: parseFloat(e.target.value) })}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block leading-relaxed">
                      💡 Tip: Choose the <strong>Sitting & Typing</strong> pose below to unlock table, keyboard, and mouse position adjustments.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. PORTFOLIO CONTENT TAB ==================== */}
        {activeTab === 'content' && (
          <div className="space-y-6" id="portfolio-content-section">
            {/* Quick Content SubTabs */}
            <div className="flex border-b border-slate-800 shrink-0 gap-1 pb-1" id="content-sub-navigation">
              <button
                onClick={() => setActiveSubTab('profile')}
                className={`flex-1 py-1.5 text-center text-[10px] font-bold tracking-wider uppercase rounded transition-all cursor-pointer ${
                  activeSubTab === 'profile'
                    ? 'bg-slate-800/80 text-emerald-400'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
                }`}
                id="btn-subtab-profile"
              >
                Profile & Bio
              </button>
              <button
                onClick={() => setActiveSubTab('skills')}
                className={`flex-1 py-1.5 text-center text-[10px] font-bold tracking-wider uppercase rounded transition-all cursor-pointer ${
                  activeSubTab === 'skills'
                    ? 'bg-slate-800/80 text-emerald-400'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
                }`}
                id="btn-subtab-skills"
              >
                My Skills
              </button>
              <button
                onClick={() => setActiveSubTab('projects')}
                className={`flex-1 py-1.5 text-center text-[10px] font-bold tracking-wider uppercase rounded transition-all cursor-pointer ${
                  activeSubTab === 'projects'
                    ? 'bg-slate-800/80 text-emerald-400'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
                }`}
                id="btn-subtab-projects"
              >
                Projects
              </button>
            </div>

            {/* Profile fields */}
            {activeSubTab === 'profile' && (
              <div className="space-y-4" id="subtab-profile-fields">
                <div className="space-y-1.5">
                  <label htmlFor="input-profile-name" className="text-xs font-medium text-slate-300">Full Name</label>
                  <input
                    id="input-profile-name"
                    type="text"
                    value={data.name}
                    onChange={(e) => updateProfileFields({ name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="input-profile-role" className="text-xs font-medium text-slate-300">Professional Role / Title</label>
                  <input
                    id="input-profile-role"
                    type="text"
                    value={data.role}
                    onChange={(e) => updateProfileFields({ role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="input-profile-tagline" className="text-xs font-medium text-slate-300">Tagline (One-liner)</label>
                  <textarea
                    id="input-profile-tagline"
                    rows={2}
                    value={data.tagline}
                    onChange={(e) => updateProfileFields({ tagline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="input-profile-bio" className="text-xs font-medium text-slate-300">Short Bio</label>
                  <textarea
                    id="input-profile-bio"
                    rows={3}
                    value={data.bio}
                    onChange={(e) => updateProfileFields({ bio: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="input-profile-about" className="text-xs font-medium text-slate-300">Detailed About Me Story</label>
                  <textarea
                    id="input-profile-about"
                    rows={4}
                    value={data.about}
                    onChange={(e) => updateProfileFields({ about: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Social Links Sub-box */}
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Social Identifiers</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="input-social-github" className="text-[10px] text-slate-400">GitHub Link</label>
                      <input
                        id="input-social-github"
                        type="url"
                        value={data.socials.github || ''}
                        onChange={(e) => updateSocialFields({ github: e.target.value })}
                        placeholder="https://github.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="input-social-linkedin" className="text-[10px] text-slate-400">LinkedIn Link</label>
                      <input
                        id="input-social-linkedin"
                        type="url"
                        value={data.socials.linkedin || ''}
                        onChange={(e) => updateSocialFields({ linkedin: e.target.value })}
                        placeholder="https://linkedin.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="input-social-instagram" className="text-[10px] text-slate-400">Instagram Link</label>
                      <input
                        id="input-social-instagram"
                        type="url"
                        value={data.socials.instagram || ''}
                        onChange={(e) => updateSocialFields({ instagram: e.target.value })}
                        placeholder="https://instagram.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="input-social-twitter" className="text-[10px] text-slate-400">Twitter X Link</label>
                      <input
                        id="input-social-twitter"
                        type="url"
                        value={data.socials.twitter || ''}
                        onChange={(e) => updateSocialFields({ twitter: e.target.value })}
                        placeholder="https://x.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="input-social-email" className="text-[10px] text-slate-400">Email Address</label>
                      <input
                        id="input-social-email"
                        type="email"
                        value={data.socials.email || ''}
                        onChange={(e) => updateSocialFields({ email: e.target.value })}
                        placeholder="hello@example.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skills manager */}
            {activeSubTab === 'skills' && (
              <div className="space-y-4" id="subtab-skills-manager">
                {/* Add skill form */}
                <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Add Technical Skill</span>
                    <span className="text-[9px] text-slate-500 font-mono">Custom tags</span>
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label htmlFor="input-skill-name" className="text-[10px] text-slate-400">Skill Name</label>
                      <input
                        id="input-skill-name"
                        type="text"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        placeholder="e.g. WebGL"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="select-skill-category" className="text-[10px] text-slate-400">Category</label>
                      <select
                        id="select-skill-category"
                        value={newSkillCategory}
                        onChange={(e) => setNewSkillCategory(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Design">Design</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <label htmlFor="skill-proficiency-slider">Proficiency Level</label>
                      <span className="font-mono text-emerald-400">{newSkillProficiency}%</span>
                    </div>
                    <input
                      id="skill-proficiency-slider"
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={newSkillProficiency}
                      onChange={(e) => setNewSkillProficiency(parseInt(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={handleAddSkill}
                    disabled={!newSkillName.trim()}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-xs py-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                    id="btn-add-skill"
                  >
                    <Plus size={13} />
                    Insert Skill Card
                  </button>
                </div>

                {/* List skills */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1" id="skills-scrolling-list">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Skills ({data.skills.length})</h4>
                  
                  {data.skills.length === 0 ? (
                    <p className="text-xs text-slate-500 italic text-center py-6 border border-dashed border-slate-800 rounded-xl">No skills added yet. Add some skills to populate your portfolio grids.</p>
                  ) : (
                    <div className="space-y-2">
                      {data.skills.map((skill) => (
                        <div
                          key={skill.id}
                          className="flex items-center justify-between bg-slate-950/20 hover:bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60 transition-colors group"
                        >
                          <div className="flex-1 min-w-0 pr-3">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xs font-semibold text-slate-200 truncate">{skill.name}</span>
                              <span className="text-[8px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-1 rounded uppercase tracking-wider">
                                {skill.category}
                              </span>
                            </div>
                            <div className="w-full bg-slate-800/80 h-1 rounded-full mt-2 overflow-hidden">
                              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${skill.proficiency}%` }} />
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveSkill(skill.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded-md hover:bg-rose-500/10 transition-all cursor-pointer shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Remove Skill"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Projects manager */}
            {activeSubTab === 'projects' && (
              <div className="space-y-4" id="subtab-projects-manager">
                {/* Add project form */}
                <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300">Add Portfolio Project</h4>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="input-project-title" className="text-[10px] text-slate-400">Project Title</label>
                    <input
                      id="input-project-title"
                      type="text"
                      value={newProjTitle}
                      onChange={(e) => setNewProjTitle(e.target.value)}
                      placeholder="e.g. Genesis Physics Shader"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="input-project-desc" className="text-[10px] text-slate-400">Short Description</label>
                    <textarea
                      id="input-project-desc"
                      rows={2}
                      value={newProjDesc}
                      onChange={(e) => setNewProjDesc(e.target.value)}
                      placeholder="Give a brief summary of what you engineered..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label htmlFor="input-project-category" className="text-[10px] text-slate-400">Category Name</label>
                      <input
                        id="input-project-category"
                        type="text"
                        value={newProjCategory}
                        onChange={(e) => setNewProjCategory(e.target.value)}
                        placeholder="e.g. Creative Tech"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="input-project-tags" className="text-[10px] text-slate-400">Tags (Comma-separated)</label>
                      <input
                        id="input-project-tags"
                        type="text"
                        value={newProjTags}
                        onChange={(e) => setNewProjTags(e.target.value)}
                        placeholder="WebGL, shaders, glsl"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono text-[10px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label htmlFor="input-project-demo" className="text-[10px] text-slate-400">Live Demo URL</label>
                      <input
                        id="input-project-demo"
                        type="url"
                        value={newProjDemo}
                        onChange={(e) => setNewProjDemo(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono text-[10px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="input-project-github" className="text-[10px] text-slate-400">GitHub Repository URL</label>
                      <input
                        id="input-project-github"
                        type="url"
                        value={newProjGithub}
                        onChange={(e) => setNewProjGithub(e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono text-[10px]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleAddProject}
                    disabled={!newProjTitle.trim() || !newProjDesc.trim()}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-xs py-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                    id="btn-add-project"
                  >
                    <Plus size={13} />
                    Insert Project Card
                  </button>
                </div>

                {/* List projects */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1" id="projects-scrolling-list">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Projects ({data.projects.length})</h4>
                  
                  {data.projects.length === 0 ? (
                    <p className="text-xs text-slate-500 italic text-center py-6 border border-dashed border-slate-800 rounded-xl">No projects in grid. Add some to build your visual portfolio cards.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {data.projects.map((proj) => (
                        <div
                          key={proj.id}
                          className="bg-slate-950/20 hover:bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 transition-colors group flex items-start gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-bold text-slate-200 truncate">{proj.title}</h5>
                              <span className="text-[8px] font-mono font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase">
                                {proj.category}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{proj.description}</p>
                            {proj.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {proj.tags.map((tag) => (
                                  <span key={tag} className="text-[9px] font-mono text-slate-500 bg-slate-900/60 border border-slate-800 px-1 py-0.2 rounded">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveProject(proj.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded-md hover:bg-rose-500/10 transition-all cursor-pointer shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 mt-0.5"
                            title="Remove Project"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Export & template help footer */}
      <div className="p-4 border-t border-slate-800 shrink-0 bg-slate-950/20 space-y-2" id="panel-footer-export">
        <div className="flex items-start gap-2 text-[10px] text-slate-400">
          <Info size={14} className="text-emerald-400 shrink-0 mt-0.5" />
          <span>
            You can export your configured 3D Portfolio builder configuration data by copying the code configuration state in preview.
          </span>
        </div>
      </div>
    </div>
  );
}
