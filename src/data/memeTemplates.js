import megumiBackground from "../assets/megumiBackground.png";

/* ---------- data ---------- */
export const FONTS = [
    ["Anton", 400], ["Bebas Neue", 400], ["Bangers", 400], ["Permanent Marker", 400],
    ["Orbitron", 900], ["Press Start 2P", 400], ["Russo One", 400], ["Black Ops One", 400],
    ["Creepster", 400], ["Pacifico", 400], ["Oswald", 700], ["Archivo Black", 400], ["Impact", 400],
];
export const FONT_W = {};
FONTS.forEach((f) => { FONT_W[f[0]] = f[1]; });
export const STYLES = [["glow", "Glow"], ["neon", "Neon"], ["classic", "Classic"], ["manga", "Manga"], ["outline", "Outline"], ["gradient", "Gradient"], ["glitch", "Glitch"]];
export const PHRASES = ["HELL YEAH", "Did you say potential?", "Nah, I'd win", "BRUH 💀", "Absolute Cinema 🖐️🗿🤚", "With this treasure..."];
export const GLOWS = ["#06b6d4", "#38bdf8", "#3b82f6", "#a855f7", "#ff2d95", "#ff4d4d", "#ffb020", "#a3e635", "#ffffff"];
export const DEFAULT_TEXT_POSITIONS = [{ x: .05, y: .18 }, { x: .05, y: .82 }, { x: .05, y: .5 }];
const TEMPLATE_IMAGES = new Map();

export function loadTemplateImage(src) {
    if (!TEMPLATE_IMAGES.has(src)) {
        TEMPLATE_IMAGES.set(src, new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error("Template image failed to load"));
            image.src = src;
            if (image.complete && image.naturalWidth) resolve(image);
        }));
    }
    return TEMPLATE_IMAGES.get(src);
}

// Add meme images and their default text positions here.
export const TEMPLATES = [
    {
        id: "shadow",
        name: "Shadow Domain",
        tags: ["megumi", "shadow", "dark", "cyan", "hell yeah"],
        text: "DID YOU SAY\nPOTENTIAL?",
        look: { style: "gradient", glow: "#3b82f6", color: "#ffffff", font: "Anton" },
        image: megumiBackground,
        textPositions: [{ x: 0.0572, y: 0.8534 }, { x: 0.2871, y: .82 }, { x: .05, y: .5 }],
    },
    {
        id: "void",
        name: "Infinite Void",
        tags: ["gojo", "void", "blue", "nah id win", "domain"],
        text: "NAH, I'D WIN",
        look: { style: "neon", glow: "#3b82f6", color: "#ffffff", font: "Bebas Neue" },
        image: megumiBackground,
        textPositions: [{ x: .05, y: .18 }, { x: .05, y: .82 }, { x: .05, y: .5 }],
    },
    {
        id: "black",
        name: "Pitch Black",
        tags: ["gigachad", "chad", "meme", "classic", "black", "plain"],
        text: "AVERAGE CODE ENTHUSIAST",
        look: { style: "classic", glow: "#ffffff", color: "#ffffff", font: "Anton" },
        image: megumiBackground,
        textPositions: [{ x: .05, y: .18 }, { x: .05, y: .82 }, { x: .05, y: .5 }],
    },
    {
        id: "manga",
        name: "Manga Burst",
        tags: ["manga", "losers", "comic", "panel", "potential"],
        text: "DID YOU SAY POTENTIAL?",
        look: { style: "manga", glow: "#ff2d2d", color: "#ffffff", font: "Bangers" },
        image: megumiBackground,
        textPositions: [{ x: .05, y: .18 }, { x: .05, y: .82 }, { x: .05, y: .5 }],
    },
    {
        id: "city",
        name: "Neon City",
        tags: ["cyberpunk", "neon", "futuristic", "city", "override"],
        text: "SYSTEM OVERRIDE",
        look: { style: "neon", glow: "#06b6d4", color: "#ffffff", font: "Orbitron" },
        image: megumiBackground,
        textPositions: [{ x: .05, y: .18 }, { x: .05, y: .82 }, { x: .05, y: .5 }],
    },
    {
        id: "synth",
        name: "Synth Sunset",
        tags: ["synthwave", "retro", "sunset", "grid", "80s"],
        text: "ABSOLUTE CINEMA",
        look: { style: "gradient", glow: "#ff2d95", color: "#ffe066", font: "Russo One" },
        image: megumiBackground,
        textPositions: [{ x: .05, y: .18 }, { x: .05, y: .82 }, { x: .05, y: .5 }],
    },
    {
        id: "storm",
        name: "Storm Bolt",
        tags: ["lightning", "storm", "electric", "dark"],
        text: "WITH THIS TREASURE...",
        look: { style: "glow", glow: "#a78bfa", color: "#ffffff", font: "Black Ops One" },
        image: megumiBackground,
        textPositions: [{ x: .05, y: .18 }, { x: .05, y: .82 }, { x: .05, y: .5 }],
    },
    {
        id: "aurora",
        name: "Aurora Mesh",
        tags: ["gradient", "aurora", "soft", "colorful"],
        text: "Main character energy",
        look: { style: "gradient", glow: "#ff7ad9", color: "#ffffff", font: "Pacifico" },
        image: megumiBackground,
        textPositions: [{ x: .05, y: .18 }, { x: .05, y: .82 }, { x: .05, y: .5 }],
    },
    {
        id: "paper",
        name: "Paper White",
        tags: ["plain", "white", "clean", "classic"],
        text: "WHEN THE BUILD PASSES",
        look: { style: "classic", glow: "#000000", color: "#ffffff", font: "Anton" },
        image: megumiBackground,
        textPositions: [{ x: .05, y: .18 }, { x: .05, y: .82 }, { x: .05, y: .5 }],
    },
    {
        id: "crimson",
        name: "Crimson Eclipse",
        tags: ["red", "eclipse", "sukuna", "curse", "moon", "bruh"],
        text: "BRUH 💀",
        look: { style: "glitch", glow: "#ff4d4d", color: "#ffffff", font: "Bangers" },
        image: megumiBackground,
        textPositions: [{ x: .05, y: .18 }, { x: .05, y: .82 }, { x: .05, y: .5 }],
    },
];
