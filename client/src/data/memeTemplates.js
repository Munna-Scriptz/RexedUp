import megumiBackground from "../assets/megumiBackground.png";
import erenSea from "../assets/memeBg/erenSea.png";
import tojowhats from "../assets/memeBg/jogoWhatsTs.png";
import kenjakuAndYuki from "../assets/memeBg/kenjakuAndYuki.png";
import imNextKashimo from "../assets/memeBg/imNextKashimo.png";
import isagiBg from "../assets/memeBg/isagi.png";
import todoCry from "../assets/memeBg/todo-cry.png";
import yuji from "../assets/memeBg/yuji.png";
import gojoIdwin from "../assets/memeBg/gojo-idWin.png";
import meAndMy from "../assets/memeBg/meAndMy.png";
import coveringMouth from "../assets/memeBg/coveringMouth.png";
import anIqCrow from "../assets/memeBg/anIqCrow.png";

/* ---------- data ---------- */
export const FONTS = [
    ["Roboto", 400], ["Poppins", 400], ["Open Sans", 400], ["Inter", 400], ["Anton", 400], ["Bebas Neue", 400],
    ["Bangers", 400], ["Comic Neue", 700], ["Tinos", 200], ["Permanent Marker", 400],
    ["Orbitron", 900], ["Press Start 2P", 400], ["Russo One", 400], ["Black Ops One", 400],
    ["Creepster", 400], ["Pacifico", 400], ["Oswald", 700], ["Archivo Black", 400], ["Impact", 400],
];
export const FONT_W = {};
FONTS.forEach((f) => { FONT_W[f[0]] = f[1]; });
export const STYLES = [
    ["plain", "Plain"], ["manga", "Manga"], ["comic", "Comic"], ["classic", "Classic"], ["emboss", "Emboss"],
    ["fire", "Fire"], ["gradient", "Gradient"], ["glow", "Glow"],
    ["neon", "Neon"], ["glitch", "Glitch"],
    ["impact", "Impact Meme"], ["threeD", "3D Text"],
    ["retro", "Retro Arcade"], ["sticker", "Sticker"], ["outline", "Outline"],
];
export const PHRASES = ["HELL YEAH", "sybau", "Did you say potential", "wtf...\nis this?", "Nah, I'd win", "BRUH", "Absolute Cinema 🖐️🗿🤚", "With this treasure...", "What a\n larp"];
export const GLOWS = ["#06b6d4", "#38bdf8", "#3b82f6", "#a855f7", "#ff2d95", "#ff4d4d", "#ffb020", "#a3e635", "#ffffff"];
export const DEFAULT_TEXT_POSITIONS = [{ x: .05, y: .18 }];
export const WATERMARK_ENABLED = true;
export const WATERMARK_TEXT = "RexedUp";


// Add meme images and their default text positions here.
export const TEMPLATES = [
    {
        id: "shadow",
        name: "Shadow Domain",
        tags: ["megumi", "shadow", "dark", "cyan", "hell yeah"],
        text: "Did you say\npotential",
        size: 14,
        look: { style: "gradient", glow: "#3b82f6", color: "#ffffff", font: "Anton" },
        allCaps: true,
        shrinkAbove: true,
        textAlignment: "left",
        image: megumiBackground,
        textPositions: [{ x: 0.0572, y: 0.8534 }],
    },
    {
        id: "erenSea",
        name: "Eren",
        tags: ["anime", "eren", "sea", "pain", "sad"],
        text: "fuck",
        size: 32,
        look: { style: "plain", color: "#000000", font: "Tinos" },
        allCaps: false,
        shrinkAbove: true,
        textAlignment: "center",
        image: erenSea,
        textPositions: [{ x: 0.7428, y: 0.3346 }],
    },
    {
        id: "jogoCry",
        name: "jogo",
        tags: ["jogo", "jjk", "manga", "whats this", "light novel"],
        text: "wtf...\nis this?",
        size: 10,
        look: { style: "plain", color: "#000000", font: "Comic Neue" },
        allCaps: false,
        shrinkAbove: false,
        textAlignment: "center",
        image: tojowhats,
        textPositions: [{ x: 0.6405, y: 0.2099 }],
    },
    {
        id: "pain",
        name: "What a Pain",
        tags: ["Kenjaku", "pain", "manga", "what a pain", "domain"],
        text: "What\na\nlarp!!",
        size: 14,
        look: { style: "manga", color: "#ffffff", font: "Bangers" },
        allCaps: true,
        shrinkAbove: false,
        textAlignment: "center",
        image: kenjakuAndYuki,
        textPositions: [{ x: 0.5136, y: 0.5184 }],
    },
    {
        id: "imNext",
        name: "Im up next",
        tags: ["Kashimo", "jjk", "manga", "im next", "cullingGame"],
        text: "i'm up\nnext if\nhe cums.",
        size: 8,
        look: { style: "plain", color: "#000000", font: "Bangers" },
        allCaps: true,
        shrinkAbove: false,
        textAlignment: "center",
        image: imNextKashimo,
        textPositions: [{ x: 0.8262, y: 0.3603 }],
    },
    {
        id: "id_win",
        name: "nah I'd win",
        tags: ["gojo", "jjk", "manga", "id win", "domain"],
        text: "Nah,\nI'd\nwin.",
        size: 14,
        look: { style: "plain", color: "#000000", font: "Bangers" },
        allCaps: true,
        shrinkAbove: false,
        textAlignment: "center",
        image: gojoIdwin,
        textPositions: [{ x: 0.8519, y: 0.3865 }],
    },
    {
        id: "isagi",
        name: "Are you willing",
        tags: ["isagi", "bluelock", "meme", "manga", "black", "manga"],
        texts: ["Are you\nwilling", "to\nlarp?!"],
        size: 6,
        look: { style: "plain", color: "#000000", font: "Bangers" },
        allCaps: true,
        shrinkAbove: false,
        textAlignment: "center",
        image: isagiBg,
        textPositions: [{ x: 0.38, y: 0.29 }, { x: 0.1685, y: 0.4587 }],
    },
    {
        id: "todo",
        name: "Tears of joy",
        tags: ["anime", "todo", "tears", "pain", "joy"],
        text: "Tears of joy",
        size: 20,
        look: { style: "manga", color: "#ffffff", font: "Bangers", highlightLast: "#facc15" },
        allCaps: true,
        shrinkAbove: true,
        textAlignment: "center",
        image: todoCry,
        textPositions: [{ x: 0.4957, y: 0.9048 }],
    },
    {
        id: "yuji",
        name: "yuji",
        tags: ["jjk", "yuji", "anime", "serious", "empty"],
        text: "Fuck",
        size: 12,
        look: { style: "plain", color: "#ffffff", font: "Inter" },
        allCaps: false,
        shrinkAbove: false,
        textAlignment: "center",
        image: yuji,
        textPositions: [{ x: 0.1965, y: 0.5440 }],
    },
    {
        id: "meAndMy",
        name: "Me and my",
        tags: ["tiktok", "stickers", "meme", "real", "funny"],
        text: "Just me\nand my\nlikes",
        size: 16,
        look: { style: "plain", color: "#ffffff", font: "Oswald" },
        allCaps: true,
        shrinkAbove: false,
        textAlignment: "left",
        image: meAndMy,
        strokeWidth: 2,
        textPositions: [{ x: 0.0851, y: 0.4343 }],
    },
    {
        id: "coveringMouth",
        name: "This might be",
        tags: ["tiktok", "stickers", "meme", "covering", "mouth"],
        text: "this might be the worst \n \n video of all time 😭",
        size: 8,
        look: { style: "manga", color: "#facc15", font: "Oswald" },
        allCaps: false,
        shrinkAbove: false,
        textAlignment: "left",
        image: coveringMouth,
        textPositions: [{ x: 0.0361, y: 0.1507 }],
    },
    {
        id: "anIq",
        name: "An iq",
        tags: ["tiktok", "stickers", "meme", "crow", "iq"],
        texts: [
            { text: "An iq\n", size: 12, color: "#ffffff" },
            { text: "too low?", size: 13, color: "#facc15" },
        ],
        size: 12,
        look: { style: "manga", color: "#ffffff", font: "Oswald" },
        allCaps: true,
        shrinkAbove: false,
        textAlignment: "left",
        image: anIqCrow,
        textPositions: [{ x: 0.0327, y: 0.8145 }, { x: 0.0327, y: 0.8952 }],
    },
];
