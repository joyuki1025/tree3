
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Experience from './components/Experience';
import GestureController from './components/GestureController';
import DeveloperPanel from './components/DeveloperPanel';
import { TreeColors, HandGesture } from './types';
import { SCENE_DEFAULTS, DEFAULT_IMAGES } from './utils/defaults';

const App: React.FC = () => {
  // 1 = Formed, 0 = Chaos.
  const [targetMix, setTargetMix] = useState(1); 
  // Default colors kept, UI control removed
  const [colors] = useState<TreeColors>({ bottom: '#022b1c', top: '#217a46' });
  
  // inputRef now tracks detection state for physics switching
  const inputRef = useRef({ x: 0, y: 0, isDetected: false });
  
  // Image Upload State - Initialize with Default Images
  const [userImages, setUserImages] = useState<string[]>(DEFAULT_IMAGES);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Signature Modal State
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);
  const [signatureText, setSignatureText] = useState("");
  const [activePhotoUrl, setActivePhotoUrl] = useState<string | null>(null);

  // Camera Gui Visibility
  const [showCamera, setShowCamera] = useState(true);

  // Developer Mode State (Default: Closed)
  const [showDevPanel, setShowDevPanel] = useState(false);
  
  // Initialize config with smart defaults based on device capability
  const [devConfig, setDevConfig] = useState(() => {
      // Simple mobile detection based on screen width
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      
      if (isMobile) {
          return {
              ...SCENE_DEFAULTS,
              // Optimize for mobile: Reduce particle counts significantly
              snowCount: 200,      // Default is 400
              foliageCount: 2500,  // Default is 6000
              // Adjust font size or text if needed, but CSS handles layout mostly
          };
      }
      return SCENE_DEFAULTS;
  });

  // Wrap in useCallback to prevent new function creation on every render
  const handleGesture = useCallback((data: HandGesture) => {
    if (data.isDetected) {
        const newTarget = data.isOpen ? 0 : 1;
        setTargetMix(prev => {
            if (prev !== newTarget) return newTarget;
            return prev;
        });
        
        inputRef.current = { 
            x: data.position.x * 1.2, 
            y: data.position.y,
            isDetected: true
        };
    } else {
        // Mark as not detected, keep last position to avoid jumps before fade out
        inputRef.current.isDetected = false;
    }
  }, []);

  const toggleState = () => {
      setTargetMix(prev => prev === 1 ? 0 : 1);
  };

  const handleUploadClick = () => {
      fileInputRef.current?.click();
  };

  const handleSignatureClick = () => {
      // Pick a random photo if available, else null (placeholder)
      if (userImages.length > 0) {
          const randomImg = userImages[Math.floor(Math.random() * userImages.length)];
          setActivePhotoUrl(randomImg);
      } else {
          setActivePhotoUrl(null);
      }
      setIsSignatureOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = e.target.files;
      if (fileList && fileList.length > 0) {
          setIsProcessing(true);
          
          // 1. Immediately disperse the tree (Chaos State) behind the loading screen
          setTargetMix(0);
          
          // Defer processing to next tick to allow React to render the loading screen first
          setTimeout(() => {
              const files = Array.from(fileList).slice(0, 30); // Limit to 30
              const urls = files.map(file => URL.createObjectURL(file as Blob));
              
              setUserImages(prev => {
                  // Revoke old URLs to prevent memory leaks, but ONLY if they are blob URLs
                  // We don't want to revoke static default image paths.
                  prev.forEach(url => {
                      if (url.startsWith('blob:')) {
                          URL.revokeObjectURL(url);
                      }
                  });
                  return urls;
              });

              // Reset input
              if (fileInputRef.current) fileInputRef.current.value = '';

              // Keep loader visible for a moment to cover the texture upload stutter
              setTimeout(() => {
                  setIsProcessing(false);
                  
                  // 2. Trigger the "Ritual" Assembly Animation
                  // Wait a brief moment after loader vanishes so user sees the scattered photos,
                  // then fly them into position.
                  setTimeout(() => {
                      setTargetMix(1);
                  }, 800);

              }, 1200); 
          }, 50);
      }
  };

  // Unified Icon Button Style - Premium Silver Glassmorphism (Circular)
  const iconButtonClass = `
    group relative 
    w-10 h-10 md:w-11 md:h-11
    rounded-full 
    bg-black/30 backdrop-blur-md 
    border border-white/20 
    text-slate-300 
    transition-all duration-500 ease-out 
    hover:border-white/60 hover:text-white hover:bg-white/10 
    hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] 
    active:scale-90 active:bg-white/20
    flex justify-center items-center cursor-pointer
  `;

  // Standard Text Button for Modal
  const textButtonClass = `
    group relative 
    w-auto px-8 h-10
    overflow-hidden rounded-sm 
    bg-black/80 backdrop-blur-md 
    border border-white/40 
    text-slate-300 font-luxury text-[11px] uppercase tracking-[0.25em] 
    transition-all duration-500 ease-out 
    hover:border-white/80 hover:text-black hover:bg-white 
    hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] 
    active:scale-95
    flex justify-center items-center cursor-pointer
  `;

  return (
    // Outer Stage: Handles the dark background on PC and centering
    <div className="w-full h-screen bg-[#020202] flex items-center justify-center overflow-hidden">
      
      {/* Device Frame: 
          On Mobile: Full width/height.
          On PC (md): Constrained to 9:20 aspect ratio, centered, with border/radius to simulate phone.
      */}
      <div className="relative w-full h-full md:w-auto md:aspect-[9/20] md:h-[92vh] md:rounded-[3rem] md:border-[8px] md:border-[#1a1a1a] md:shadow-[0_0_60px_rgba(0,0,0,0.6)] bg-black overflow-hidden transform-gpu ring-1 ring-white/5">
      
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />

          {/* LOADING OVERLAY */}
          {isProcessing && (
              <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md transition-all duration-500 animate-in fade-in">
                  <div className="relative w-16 h-16 mb-6">
                      {/* Outer Ring */}
                      <div className="absolute inset-0 border-2 border-t-[#d4af37] border-r-transparent border-b-[#d4af37] border-l-transparent rounded-full animate-spin"></div>
                      {/* Inner Ring */}
                      <div className="absolute inset-2 border-2 border-t-transparent border-r-white/30 border-b-transparent border-l-white/30 rounded-full animate-spin-reverse"></div>
                      {/* Center Star */}
                      <div className="absolute inset-0 flex items-center justify-center text-[#d4af37] text-xl animate-pulse">✦</div>
                  </div>
                  <div className="text-[#d4af37] font-luxury tracking-[0.25em] text-xs uppercase animate-pulse">
                      圣诞树装饰中...
                  </div>
                  <style>{`
                    @keyframes spin-reverse {
                        from { transform: rotate(360deg); }
                        to { transform: rotate(0deg); }
                    }
                    .animate-spin-reverse {
                        animation: spin-reverse 2s linear infinite;
                    }
                  `}</style>
              </div>
          )}

          {/* CENTER TITLE - Ethereal Silver Script */}
          {/* Layer: z-0. Adjusted sizes for 9:20 aspect ratio consistency */}
          <div className={`absolute top-[5%] left-0 w-full flex justify-center pointer-events-none z-0 transition-opacity duration-700 ${isSignatureOpen ? 'opacity-0' : 'opacity-100'}`}>
            <h1 
                className={`${devConfig.titleFont} text-6xl md:text-7xl text-center leading-[1.5] py-10`}
                style={{
                    // Silver Metallic Gradient
                    background: 'linear-gradient(to bottom, #ffffff 20%, #e8e8e8 50%, #b0b0b0 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    // 3D Depth Shadows + Glow
                    filter: 'drop-shadow(0px 5px 5px rgba(0,0,0,0.8)) drop-shadow(0px 0px 20px rgba(255,255,255,0.4))'
                }}
            >
                {devConfig.titleText}
            </h1>
          </div>

          {/* 3D Scene */}
          {/* The Experience component will automatically detect the 9:20 aspect ratio via useThree and adjust camera */}
          <div className={`absolute inset-0 z-10 transition-all duration-700 ${isSignatureOpen ? 'blur-sm scale-95 opacity-50' : 'blur-0 scale-100 opacity-100'}`}>
            <Experience 
                mixFactor={targetMix}
                colors={colors} 
                inputRef={inputRef} 
                userImages={userImages}
                signatureText={signatureText}
                devConfig={devConfig}
            />
          </div>

          {/* SIGNATURE MODAL OVERLAY */}
          {isSignatureOpen && (
              <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity duration-500 animate-in fade-in">
                  <div 
                    className="relative bg-[#f8f8f8] p-4 pb-12 shadow-[0_0_50px_rgba(255,255,255,0.2)] transform transition-transform duration-700 scale-100 rotate-[-2deg]"
                    style={{ width: 'min(80vw, 320px)', aspectRatio: '3.5/4.2' }}
                  >
                      {/* Close Button */}
                      <button 
                        onClick={() => setIsSignatureOpen(false)}
                        className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-black border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors z-50"
                      >
                          ×
                      </button>

                      {/* Photo Area */}
                      <div className="w-full h-[75%] bg-[#1a1a1a] overflow-hidden relative shadow-inner">
                          {activePhotoUrl ? (
                              <img src={activePhotoUrl} alt="Memory" className="w-full h-full object-cover" />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/40 font-body text-lg italic tracking-widest text-center px-4">
                                  我~一直都想对你说~
                              </div>
                          )}
                          {/* Gloss Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 pointer-events-none" />
                      </div>

                      {/* Signature Input Area */}
                      <div className="absolute bottom-0 left-0 w-full h-[25%] flex items-center justify-center px-4">
                          <input
                            autoFocus
                            type="text"
                            placeholder="Sign here..."
                            value={signatureText}
                            onChange={(e) => setSignatureText(e.target.value)}
                            className="w-full text-center bg-transparent border-none outline-none font-script text-3xl md:text-4xl text-[#1a1a1a] placeholder:text-gray-300/50"
                            style={{ transform: 'translateY(-5px) rotate(-1deg)' }}
                            maxLength={20}
                          />
                      </div>
                  </div>
                  
                  {/* Confirm Button (Floating below) */}
                  <div className="absolute bottom-10 left-0 w-full flex justify-center">
                      <button 
                        onClick={() => setIsSignatureOpen(false)}
                        className={textButtonClass}
                      >
                          完成签名
                      </button>
                  </div>
              </div>
          )}

          {/* DEVELOPER PANEL */}
          {showDevPanel && (
              <DeveloperPanel 
                config={devConfig}
                setConfig={setDevConfig}
                onClose={() => setShowDevPanel(false)}
              />
          )}

          {/* TOP RIGHT - CONTROLS */}
          {/* Force vertical column on both mobile and PC since PC is now narrow frame */}
          <div className={`absolute top-6 right-6 z-30 pointer-events-auto flex flex-col items-end gap-4 transition-opacity duration-500 ${isSignatureOpen || isProcessing ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              
              {/* 0. Developer Mode Toggle (Launch/Close) */}
              <button 
                onClick={() => setShowDevPanel(prev => !prev)}
                className={`${iconButtonClass} ${showDevPanel ? 'text-white border-white/60 bg-white/10' : 'text-slate-300'}`}
                title={showDevPanel ? "关闭开发者模式" : "启动开发者模式"}
              >
                  {/* SOLID Wrench/Screwdriver Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                    <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725 7.38l.108.537a.75.75 0 01-.829.89h-4.59a.75.75 0 00-.75.75v1.25a.75.75 0 00.75.75h2.474a.75.75 0 01.75.75v1.118a.75.75 0 01-.75.75h-.84a.75.75 0 00-.75.75v1.118a.75.75 0 00.75.75h2.218a.75.75 0 01.749.888l-.062.304a9.753 9.753 0 01-5.922 7.17.75.75 0 01-.796-1.212l.349-.234a.75.75 0 00.33-.64v-1.25a.75.75 0 00-.75-.75h-1.107a.75.75 0 01-.75-.75V19.5a.75.75 0 01.75-.75h1.107a.75.75 0 00.75-.75v-1.25a.75.75 0 00-.75-.75h-1.107a.75.75 0 01-.75-.75v-1.25a.75.75 0 01.75-.75h1.107a.75.75 0 00.75-.75v-1.275l-.106-.526a.75.75 0 00-1.471.296v1.504a.75.75 0 01-.75.75h-2.474a.75.75 0 01-.75-.75V10.5a.75.75 0 01.75-.75h4.59a.75.75 0 00.75-.75v-1.25a.75.75 0 00-.75-.75h-2.218a.75.75 0 01-.75-.75V5.5a.75.75 0 01.75-.75h.84a.75.75 0 00.75-.75V2.999a.75.75 0 00-.75-.75h-1.338zM4.5 4.5a.75.75 0 00-.75.75v1.25a.75.75 0 00.75.75h1.107a.75.75 0 01.75.75v1.25a.75.75 0 01-.75.75h-1.107a.75.75 0 00-.75.75v1.25a.75.75 0 00.75.75h1.107a.75.75 0 01.75.75v1.25a.75.75 0 01-.75.75h-1.107a.75.75 0 00-.75.75v1.25a.75.75 0 00.75.75h1.107a.75.75 0 01.75.75V19.5a.75.75 0 01-.75.75h-1.107a.75.75 0 00-.75.75v1.25a.75.75 0 00.75.75h2.218a.75.75 0 01.75.75v1.118a.75.75 0 01-.75.75h-.84a.75.75 0 00-.75.75v1.118a.75.75 0 00.75.75h2.474a.75.75 0 01.75.75v1.25a.75.75 0 01-.75.75h-4.59a.75.75 0 00-.75.75v1.25a.75.75 0 00.75.75h1.838a9.753 9.753 0 01-6.725-7.38L2.25 13.5a.75.75 0 01.829-.89h4.59a.75.75 0 00.75-.75v-1.25a.75.75 0 00-.75-.75H5.195a.75.75 0 01-.75-.75V8.992a.75.75 0 01.75-.75h.84a.75.75 0 00.75-.75V6.374a.75.75 0 00-.75-.75H3.067a.75.75 0 01-.749-.888l.062-.304A9.753 9.753 0 018.302 2.25H4.5z" clipRule="evenodd" />
                  </svg>
              </button>

              {/* 1. Camera Toggle */}
              <button 
                onClick={() => setShowCamera(prev => !prev)}
                className={`${iconButtonClass} ${showCamera ? 'text-white border-white/60 bg-white/10' : 'text-slate-300'}`}
                title={showCamera ? "隐藏摄像头" : "显示摄像头"}
              >
                  {showCamera ? (
                      // Camera On Icon (Solid)
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                        <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
                      </svg>
                  ) : (
                      // Camera Off Icon (Solid Slash)
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                        <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM6.032 6.032l.623.622a2.992 2.992 0 00-.655 1.846v9a3 3 0 003 3h9c.75 0 1.442-.236 2.015-.638l.966.967c-.832.74-1.91 1.171-3.081 1.171h-9a4.5 4.5 0 01-4.5-4.5v-9c0-1.063.36-2.046.966-2.828zM19.5 7.125v7.268l2.94 2.94c.61-.536 1.06-1.278 1.06-2.158V6.31c0-1.336-1.616-2.005-2.56-1.06l-2.032 2.032.592.592zM8.25 4.5H12c.901 0 1.702.41 2.235 1.062l-2.26 2.26a.75.75 0 001.06 1.06l2.26-2.26A2.99 2.99 0 0115.75 7.5v2.368l1.5 1.5V7.5a4.5 4.5 0 00-4.5-4.5H8.25c-1.027 0-1.97.346-2.732.926l1.09 1.09c.433-.323.966-.516 1.542-.516z" />
                      </svg>
                  )}
              </button>

              {/* 2. Upload Photos */}
              <button 
                onClick={handleUploadClick}
                className={iconButtonClass}
                title="上传照片"
              >
                  {/* SOLID Arrow Up on Square */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                    <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                  </svg>
              </button>

              {/* 3. Polaroid Signature */}
              <button 
                onClick={handleSignatureClick}
                className={iconButtonClass}
                title="拍立得签名"
              >
                  {/* SOLID Pencil Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                  </svg>
              </button>

              {/* 4. Disperse/Assemble Toggle */}
              <button 
                onClick={toggleState}
                className={iconButtonClass}
                title={targetMix === 1 ? "散开" : "聚拢"}
              >
                {targetMix === 1 ? (
                    // Icon: Disperse (Explosion out) - SOLID Arrows Pointing Out
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                        <path fillRule="evenodd" d="M3.75 3.75a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0V5.56l3.97 3.97a.75.75 0 11-1.06 1.06L2 6.62v3.38a.75.75 0 01-1.5 0V3.75a.75.75 0 01.75-.75h6.25a.75.75 0 010 1.5H3.75zM15 3.75a.75.75 0 01.75-.75h6.25a.75.75 0 01.75.75v6.25a.75.75 0 01-1.5 0V6.62l-3.97 3.97a.75.75 0 11-1.06-1.06l3.97-3.97h-4.44a.75.75 0 01-.75-.75zM8.47 15.53a.75.75 0 010 1.06L4.56 20.5v-3.44a.75.75 0 01-1.5 0v4.5a.75.75 0 01.75.75h4.5a.75.75 0 010-1.5H4.12l4.35-4.35a.75.75 0 011.06 0zM15.53 15.53a.75.75 0 011.06 0l3.91 3.91v-3.38a.75.75 0 011.5 0v4.5a.75.75 0 01-.75.75h-4.5a.75.75 0 010-1.5h3.44l-3.97-3.97a.75.75 0 010-1.06z" clipRule="evenodd" />
                    </svg>
                ) : (
                    // Icon: Assemble (Implosion in) - SOLID Arrows Pointing In
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                        <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v5.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zM13.5 10.725a.75.75 0 01.75-.75h5.69l-3.22-3.22a.75.75 0 111.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 11-1.06-1.06l3.22-3.22H14.25a.75.75 0 01-.75-.75zM12 12.75a.75.75 0 01.75.75v5.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22v-5.69a.75.75 0 01.75-.75zM2.25 10.725a.75.75 0 01.75-.75h5.69l-3.22-3.22a.75.75 0 111.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 11-1.06-1.06l3.22-3.22H3a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                    </svg>
                )}
              </button>
          </div>
          
          {/* Footer Info (Bottom Left) - Commented Out */}
          {/* <div className={`absolute bottom-6 left-6 z-20 pointer-events-none transition-opacity duration-500 ${isSignatureOpen ? 'opacity-0' : 'opacity-100'}`}>
                <div className="text-white/20 text-[10px] uppercase tracking-widest font-luxury">
                    <div>一颗美丽的圣诞树</div>
                    <div className="text-slate-500">Made by Southpl</div>
                </div>
          </div> */}
          
          {/* Logic */}
          <GestureController onGesture={handleGesture} isGuiVisible={showCamera} />
      </div>
    </div>
  );
};

export default App;
