
// Shared defaults for the Christmas Tree experience
// These values act as the single source of truth for both 
// the initial component rendering and the Developer Panel state.

export const SCENE_DEFAULTS = {
    snowSize: 11.0,
    snowCount: 400,
    foliageSize: 15.0,
    foliageCount: 6000,
    photoScale: 2.5,
    // New controls for Ball (specifically ball.glb custom model context)
    ballScale: 0.7, 
    ballVariance: 0.2,
    // Control for Top Star
    starScale: 11.0,
    titleText: "Easy Christmas",
    titleFont: "font-luxury" // Default font class
};

// Default images displayed before user uploads their own.
// Using local project assets located in public/defaultImg/
// Updated to relative paths (no leading slash) to support base-path deployments better
export const DEFAULT_IMAGES = [
    'defaultImg/1.jpg',
    'defaultImg/2.jpg',
    'defaultImg/3.jpg',
    'defaultImg/4.jpg',
    'defaultImg/5.jpg',
    'defaultImg/6.jpg',
    'defaultImg/7.jpg',
    'defaultImg/8.jpg'
];
