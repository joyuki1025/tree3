
import React from 'react';

interface DeveloperPanelProps {
  config: {
    snowSize: number;
    snowCount: number;
    foliageSize: number;
    foliageCount: number;
    photoScale: number;
    ballScale: number;
    ballVariance: number;
    starScale: number;
    titleText: string;
    titleFont: string;
  };
  setConfig: React.Dispatch<React.SetStateAction<{
    snowSize: number;
    snowCount: number;
    foliageSize: number;
    foliageCount: number;
    photoScale: number;
    ballScale: number;
    ballVariance: number;
    starScale: number;
    titleText: string;
    titleFont: string;
  }>>;
  onClose: () => void;
}

const FONT_OPTIONS = [
    { label: "Monsieur Script", value: "font-script" },
    { label: "Great Vibes", value: "font-vibes" },
    { label: "Festive Mountain", value: "font-festive" },
    { label: "Cinzel Luxury", value: "font-luxury" },
    { label: "Playfair Display", value: "font-body" },
];

const DeveloperPanel: React.FC<DeveloperPanelProps> = ({ config, setConfig, onClose }) => {
  const handleChange = (key: keyof typeof config, value: number | string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="absolute top-20 right-6 md:right-24 z-50 w-64 p-5 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 text-slate-200 font-luxury animate-in fade-in slide-in-from-right-10 shadow-[0_0_40px_rgba(0,0,0,0.9)] max-h-[80vh] overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
            <span className="text-[#d4af37]">🛠</span>
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#d4af37]">Developer Mode</h3>
        </div>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors">×</button>
      </div>

      <div className="space-y-6">
        {/* Title Text Control */}
        <div className="group">
          <div className="flex justify-between text-[10px] mb-2 uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">
            <span>Page Title</span>
          </div>
          <input 
            type="text" 
            value={config.titleText}
            onChange={(e) => handleChange('titleText', e.target.value)}
            maxLength={25}
            className="w-full bg-white/5 border border-white/10 rounded-sm px-2 py-1 text-[11px] text-[#d4af37] font-script focus:outline-none focus:border-[#d4af37] transition-colors text-center"
          />
        </div>

        {/* Font Selection */}
        <div className="group">
          <div className="flex justify-between text-[10px] mb-2 uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">
            <span>Font Style</span>
          </div>
          <select 
            value={config.titleFont}
            onChange={(e) => handleChange('titleFont', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-sm px-2 py-1 text-[10px] text-slate-300 focus:outline-none focus:border-[#d4af37] transition-colors cursor-pointer"
          >
            {FONT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-black text-slate-200">{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="w-full h-px bg-white/10 my-4" />

        {/* Top Star Size */}
        <div className="group">
          <div className="flex justify-between text-[10px] mb-2 uppercase tracking-wider text-[#d4af37] group-hover:text-white transition-colors font-bold">
            <span>Top Star Size</span>
            <span className="font-mono">{config.starScale.toFixed(2)}</span>
          </div>
          <input 
            type="range" 
            min="1.0" max="20.0" step="0.5"
            value={config.starScale}
            onChange={(e) => handleChange('starScale', parseFloat(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#d4af37] hover:bg-white/20 transition-colors"
          />
        </div>

        {/* Ball Size (Moved to top for visibility) */}
        <div className="group">
          <div className="flex justify-between text-[10px] mb-2 uppercase tracking-wider text-[#d4af37] group-hover:text-white transition-colors font-bold">
            <span>Ball.glb Size</span>
            <span className="font-mono">{config.ballScale.toFixed(2)}</span>
          </div>
          <input 
            type="range" 
            min="0.1" max="3.0" step="0.1"
            value={config.ballScale}
            onChange={(e) => handleChange('ballScale', parseFloat(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#d4af37] hover:bg-white/20 transition-colors"
          />
        </div>

        {/* Ball Variance (Moved to top for visibility) */}
        <div className="group">
          <div className="flex justify-between text-[10px] mb-2 uppercase tracking-wider text-[#d4af37] group-hover:text-white transition-colors font-bold">
            <span>Ball.glb Variance</span>
            <span className="font-mono">{config.ballVariance.toFixed(2)}</span>
          </div>
          <input 
            type="range" 
            min="0.0" max="1.0" step="0.05"
            value={config.ballVariance}
            onChange={(e) => handleChange('ballVariance', parseFloat(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#d4af37] hover:bg-white/20 transition-colors"
          />
        </div>

        <div className="w-full h-px bg-white/10 my-4" />

        {/* Snow Size */}
        <div className="group">
          <div className="flex justify-between text-[10px] mb-2 uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">
            <span>Snow Size</span>
            <span className="font-mono text-[#d4af37]">{config.snowSize.toFixed(1)}</span>
          </div>
          <input 
            type="range" 
            min="0.5" max="20.0" step="0.1"
            value={config.snowSize}
            onChange={(e) => handleChange('snowSize', parseFloat(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#d4af37] hover:bg-white/20 transition-colors"
          />
        </div>

        {/* Snow Count */}
        <div className="group">
          <div className="flex justify-between text-[10px] mb-2 uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">
            <span>Snow Count</span>
            <span className="font-mono text-[#d4af37]">{config.snowCount.toLocaleString()}</span>
          </div>
          <input 
            type="range" 
            min="100" max="10000" step="100"
            value={config.snowCount}
            onChange={(e) => handleChange('snowCount', parseInt(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#d4af37] hover:bg-white/20 transition-colors"
          />
        </div>

        {/* Foliage Size */}
        <div className="group">
          <div className="flex justify-between text-[10px] mb-2 uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">
            <span>Foliage Size</span>
            <span className="font-mono text-[#d4af37]">{config.foliageSize.toFixed(1)}</span>
          </div>
          <input 
            type="range" 
            min="1.0" max="10.0" step="0.5"
            value={config.foliageSize}
            onChange={(e) => handleChange('foliageSize', parseFloat(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#d4af37] hover:bg-white/20 transition-colors"
          />
        </div>

        {/* Foliage Count */}
        <div className="group">
          <div className="flex justify-between text-[10px] mb-2 uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">
            <span>Leaf Count</span>
            <span className="font-mono text-[#d4af37]">{config.foliageCount.toLocaleString()}</span>
          </div>
          <input 
            type="range" 
            min="1000" max="150000" step="1000"
            value={config.foliageCount}
            onChange={(e) => handleChange('foliageCount', parseInt(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#d4af37] hover:bg-white/20 transition-colors"
          />
        </div>

        {/* Photo Scale */}
        <div className="group">
          <div className="flex justify-between text-[10px] mb-2 uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">
            <span>Photo Scale</span>
            <span className="font-mono text-[#d4af37]">{config.photoScale.toFixed(2)}</span>
          </div>
          <input 
            type="range" 
            min="0.5" max="2.5" step="0.1"
            value={config.photoScale}
            onChange={(e) => handleChange('photoScale', parseFloat(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#d4af37] hover:bg-white/20 transition-colors"
          />
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/5 space-y-4">
        <button 
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-200 text-[10px] uppercase tracking-[0.2em] transition-all rounded-sm group cursor-pointer"
        >
            <span>Restart App</span>
            <span className="group-hover:rotate-180 transition-transform duration-500">↻</span>
        </button>

        <div className="text-[9px] text-white/30 text-center leading-relaxed">
            Adjusting high particle counts may affect performance on mobile devices.
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(212,175,55,0.6); }
      `}</style>
    </div>
  );
};

export default DeveloperPanel;
