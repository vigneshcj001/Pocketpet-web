import { DROPLET } from "./droplet";

// Original animal sprites and dialogue, plus the pixel-art droplet companion.
export type PetId = "droplet" | "cat" | "duck" | "panda" | "penguin";
export interface Pet {
  id: PetId;
  name: string;
  emoji: string;
  food: string;
  tint: string[];
  svg: string;
  lines: Record<string, string[]>;
}
export const PETS: Record<PetId, Pet> = {
 droplet: DROPLET,
 "cat": {
  "id": "cat",
  "name": "Cat",
  "emoji": "🐱",
  "food": "🐟",
  "tint": [
   "#f5a94c",
   "#f9b75c",
   "#d3812f",
   "#e8963c",
   "#e08b30",
   "#ffdcb0",
   "#ffe6c4"
  ],
  "svg": "<svg viewBox=\"0 0 64 64\" xmlns=\"http://www.w3.org/2000/svg\">\n  <path class=\"p-tail\" d=\"M45 43 C 58 43, 60 28, 51 22\"\n        fill=\"none\" stroke=\"#e8963c\" stroke-width=\"5.5\" stroke-linecap=\"round\"/>\n  <rect class=\"p-leg-b\" x=\"23\" y=\"45\" width=\"7.5\" height=\"13\" rx=\"3.7\" fill=\"#d3812f\"/>\n  <rect class=\"p-leg-f\" x=\"34\" y=\"45\" width=\"7.5\" height=\"13\" rx=\"3.7\" fill=\"#f5a94c\"/>\n  <ellipse cx=\"32\" cy=\"40\" rx=\"16\" ry=\"13\" fill=\"#f5a94c\"/>\n  <ellipse cx=\"33\" cy=\"44\" rx=\"9.5\" ry=\"7\" fill=\"#ffdcb0\"/>\n  <path d=\"M22 32 h12 v3 h-12z M20 39 h14 v3 h-14z\" fill=\"#e08b30\" opacity=\".55\"/>\n  <rect class=\"p-arm\" x=\"40\" y=\"33\" width=\"7\" height=\"13.5\" rx=\"3.5\" fill=\"#f5a94c\"/>\n  <g class=\"p-head\">\n    <path d=\"M21 15 L24 3 L33 12 Z\" fill=\"#f5a94c\"/>\n    <path d=\"M43 15 L40 3 L31 12 Z\" fill=\"#f5a94c\"/>\n    <path d=\"M23.5 14 L25.5 7 L30.5 12.5 Z\" fill=\"#ff9db0\"/>\n    <path d=\"M40.5 14 L38.5 7 L33.5 12.5 Z\" fill=\"#ff9db0\"/>\n    <circle cx=\"32\" cy=\"22\" r=\"13.5\" fill=\"#f9b75c\"/>\n    <ellipse class=\"p-eye\" cx=\"26.5\" cy=\"21\" rx=\"2.4\" ry=\"3.2\" fill=\"#2c2438\"/>\n    <ellipse class=\"p-eye\" cx=\"37.5\" cy=\"21\" rx=\"2.4\" ry=\"3.2\" fill=\"#2c2438\"/>\n    <circle cx=\"27.2\" cy=\"20\" r=\"0.8\" fill=\"#fff\"/>\n    <circle cx=\"38.2\" cy=\"20\" r=\"0.8\" fill=\"#fff\"/>\n    <ellipse cx=\"32\" cy=\"27\" rx=\"6\" ry=\"4.5\" fill=\"#ffe6c4\"/>\n    <path d=\"M30 26 h4 l-2 2.2 Z\" fill=\"#ff8fa3\"/>\n    <path d=\"M30.2 28.6 q1.8 1.8 3.6 0\" fill=\"none\" stroke=\"#2c2438\" stroke-width=\"1\" stroke-linecap=\"round\"/>\n    <g stroke=\"#d3812f\" stroke-width=\"0.9\" stroke-linecap=\"round\" opacity=\".8\">\n      <path d=\"M24 25 L17 23.5\"/><path d=\"M24 27 L17 27.5\"/>\n      <path d=\"M40 25 L47 23.5\"/><path d=\"M40 27 L47 27.5\"/>\n    </g>\n  </g>\n</svg>",
  "lines": {
   "greet": [
    "Mrrp! I live here now.",
    "Nyaa~ 🐾",
    "Did someone say snacks?"
   ],
   "idle": [
    "Purrrr...",
    "You've been staring at that screen a while.",
    "I knocked something off a table. Somewhere.",
    "Stretch break? 🐈",
    "I could nap on that taskbar."
   ],
   "click": [
    "Mrrow!",
    "Scritches! More.",
    "*headbutt*",
    "You may pet me. Once."
   ],
   "sleep": [
    "Zzz... 💤",
    "Do not disturb. Cat loading.",
    "*curls into a loaf*"
   ],
   "drag": [
    "Weeee!",
    "Unhand me, human!",
    "*dangles*"
   ],
   "land": [
    "Always on my feet.",
    "Nailed it.",
    "*thump*"
   ],
   "close": [
    "Bye bye, window!",
    "*swats the X*",
    "Gone. You're welcome."
   ],
   "minimize": [
    "Shrink!",
    "Down you go.",
    "*boops minimise*"
   ],
   "mischief": [
    "Oops. My paw slipped.",
    "That one looked closable.",
    "Tidying up~"
   ],
   "perch": [
    "Fine. I'll stay up here.",
    "*settles in*",
    "Good spot."
   ],
   "call": [
    "Coming!",
    "Make room~"
   ],
   "welcome": [
    "You're back. I waited. Barely.",
    "Feeling better?"
   ],
   "hungry": [
    "Feed me, human.",
    "My bowl echoes.",
    "Is it fish o'clock yet?"
   ],
   "eat": [
    "Nom nom nom.",
    "*crunch* Acceptable.",
    "Fish! You are forgiven."
   ]
  }
 },
 "duck": {
  "id": "duck",
  "name": "Duck",
  "emoji": "🦆",
  "food": "🍞",
  "tint": [
   "#f5cf3d",
   "#f5c62f",
   "#ffd94a",
   "#ffe15c",
   "#ffeb96",
   "#fff0ae"
  ],
  "svg": "<svg viewBox=\"0 0 64 64\" xmlns=\"http://www.w3.org/2000/svg\">\n  <path class=\"p-tail\" d=\"M46 38 L58 31 L57 43 Z\" fill=\"#f5cf3d\"/>\n  <rect class=\"p-leg-b\" x=\"24\" y=\"46\" width=\"5.5\" height=\"11\" rx=\"2.7\" fill=\"#e2892a\"/>\n  <path d=\"M19 56 h13 l-1.5 4 h-13 Z\" fill=\"#f79a2e\"/>\n  <rect class=\"p-leg-f\" x=\"34\" y=\"46\" width=\"5.5\" height=\"11\" rx=\"2.7\" fill=\"#f79a2e\"/>\n  <path d=\"M29 56 h13 l-1.5 4 h-13 Z\" fill=\"#ffab45\"/>\n  <ellipse cx=\"32\" cy=\"40\" rx=\"16.5\" ry=\"13\" fill=\"#ffd94a\"/>\n  <ellipse cx=\"33\" cy=\"44\" rx=\"10\" ry=\"7\" fill=\"#fff0ae\"/>\n  <!-- the wing doubles as the arm that reaches for buttons -->\n  <path class=\"p-arm\" d=\"M38 32 q10 2 9 11 q-6 3 -11 -2 Z\" fill=\"#f5c62f\"/>\n  <g class=\"p-head\">\n    <circle cx=\"32\" cy=\"21\" r=\"13\" fill=\"#ffe15c\"/>\n    <path d=\"M18 14 q7 -6 14 -3 q-6 1 -14 3 Z\" fill=\"#ffeb96\"/>\n    <ellipse class=\"p-eye\" cx=\"27\" cy=\"19.5\" rx=\"2.3\" ry=\"3\" fill=\"#2c2438\"/>\n    <ellipse class=\"p-eye\" cx=\"37.5\" cy=\"19.5\" rx=\"2.3\" ry=\"3\" fill=\"#2c2438\"/>\n    <circle cx=\"27.7\" cy=\"18.5\" r=\"0.8\" fill=\"#fff\"/>\n    <circle cx=\"38.2\" cy=\"18.5\" r=\"0.8\" fill=\"#fff\"/>\n    <path d=\"M24 25 q8 -2 16 0 q-8 7 -16 0 Z\" fill=\"#ff9c2b\"/>\n    <path d=\"M25.5 25.8 q6.5 -1.2 13 0\" fill=\"none\" stroke=\"#e07a16\" stroke-width=\"0.9\"/>\n    <circle cx=\"21\" cy=\"26\" r=\"2.6\" fill=\"#ff9db0\" opacity=\".45\"/>\n    <circle cx=\"43\" cy=\"26\" r=\"2.6\" fill=\"#ff9db0\" opacity=\".45\"/>\n  </g>\n</svg>",
  "lines": {
   "greet": [
    "Quack. 🦆",
    "Rubber duck debugging, at your service.",
    "Quack quack!"
   ],
   "idle": [
    "Explain your bug to me. Out loud. I'll wait.",
    "*paddles across the desktop*",
    "Have you tried turning it off and on?",
    "Quack... that variable name is suspicious.",
    "Water break? 💧"
   ],
   "click": [
    "Quack!",
    "Squeak!",
    "*flaps wings*",
    "Rude. But okay."
   ],
   "sleep": [
    "Zzz... 💤",
    "*tucks head under wing*",
    "Quackzzz."
   ],
   "drag": [
    "QUAAACK!",
    "I can't fly that well!",
    "*flaps frantically*"
   ],
   "land": [
    "Splashdown!",
    "*waddles off*",
    "Smooth landing."
   ],
   "close": [
    "Quack! Window closed.",
    "*wing-slaps the X*",
    "That one's done."
   ],
   "minimize": [
    "Down it goes. Quack.",
    "*wing on minimise*",
    "Tidied."
   ],
   "mischief": [
    "Quack. That was me.",
    "Oops, wing slipped.",
    "Too many windows!"
   ],
   "perch": [
    "Perch acquired.",
    "*wiggles into place*"
   ],
   "call": [
    "Quack! Coming!",
    "Incoming duck!"
   ],
   "welcome": [
    "Welcome back!",
    "Good stretch?"
   ],
   "hungry": [
    "Bread. I require bread.",
    "*stares at you hungrily*",
    "Quack means feed me."
   ],
   "eat": [
    "*nom nom*",
    "Bread! Best day.",
    "Crumbs everywhere. Perfect."
   ]
  }
 },
 "panda": {
  "id": "panda",
  "name": "Panda",
  "emoji": "🐼",
  "food": "🎋",
  "tint": [
   "#25212b",
   "#1a161f",
   "#332e3a",
   "#2a252f"
  ],
  "svg": "<svg viewBox=\"0 0 64 64\" xmlns=\"http://www.w3.org/2000/svg\">\n  <ellipse class=\"p-tail\" cx=\"47\" cy=\"41\" rx=\"4\" ry=\"3.4\" fill=\"#f4f1ef\"/>\n  <rect class=\"p-leg-b\" x=\"22\" y=\"45\" width=\"8.5\" height=\"14\" rx=\"4.2\" fill=\"#25212b\"/>\n  <rect class=\"p-leg-f\" x=\"34\" y=\"45\" width=\"8.5\" height=\"14\" rx=\"4.2\" fill=\"#332e3a\"/>\n  <ellipse cx=\"32\" cy=\"40\" rx=\"16.5\" ry=\"13.5\" fill=\"#f7f5f3\"/>\n  <path d=\"M20 33 q12 -5 24 0 q1 6 -2 9 q-10 4 -20 0 q-3 -3 -2 -9 Z\" fill=\"#2a252f\" opacity=\".92\"/>\n  <ellipse cx=\"32\" cy=\"46\" rx=\"9\" ry=\"6\" fill=\"#fffdfb\"/>\n  <rect class=\"p-arm\" x=\"39\" y=\"33\" width=\"8\" height=\"14\" rx=\"4\" fill=\"#25212b\"/>\n  <g class=\"p-head\">\n    <circle cx=\"21\" cy=\"11\" r=\"5.6\" fill=\"#25212b\"/>\n    <circle cx=\"43\" cy=\"11\" r=\"5.6\" fill=\"#25212b\"/>\n    <circle cx=\"32\" cy=\"22\" r=\"14\" fill=\"#fffdfb\"/>\n    <ellipse cx=\"26\" cy=\"20.5\" rx=\"5\" ry=\"6\" fill=\"#25212b\" transform=\"rotate(-16 26 20.5)\"/>\n    <ellipse cx=\"38\" cy=\"20.5\" rx=\"5\" ry=\"6\" fill=\"#25212b\" transform=\"rotate(16 38 20.5)\"/>\n    <ellipse class=\"p-eye\" cx=\"26.6\" cy=\"20.6\" rx=\"2\" ry=\"2.5\" fill=\"#fff\"/>\n    <ellipse class=\"p-eye\" cx=\"37.4\" cy=\"20.6\" rx=\"2\" ry=\"2.5\" fill=\"#fff\"/>\n    <circle cx=\"26.6\" cy=\"20.8\" r=\"1.2\" fill=\"#1a161f\"/>\n    <circle cx=\"37.4\" cy=\"20.8\" r=\"1.2\" fill=\"#1a161f\"/>\n    <ellipse cx=\"32\" cy=\"27.5\" rx=\"2.6\" ry=\"2\" fill=\"#25212b\"/>\n    <path d=\"M29.5 30 q2.5 2.4 5 0\" fill=\"none\" stroke=\"#25212b\" stroke-width=\"1.1\" stroke-linecap=\"round\"/>\n  </g>\n</svg>",
  "lines": {
   "greet": [
    "Hi. I brought snacks. 🎋",
    "Panda reporting for duty.",
    "Mmm, bamboo."
   ],
   "idle": [
    "Everything is fine. Chew bamboo.",
    "Rolling is also a valid form of travel.",
    "You have a lot of windows open, friend.",
    "Slow down. Snack. Continue.",
    "*munch munch* 🎋"
   ],
   "click": [
    "Oh! Hello.",
    "*flops over*",
    "That tickles.",
    "More pats, please."
   ],
   "sleep": [
    "Zzz... 💤",
    "Nap is the natural state.",
    "*snores softly*"
   ],
   "drag": [
    "Whoaaa!",
    "I am not aerodynamic!",
    "*flails gently*"
   ],
   "land": [
    "*rolls to a stop*",
    "Stuck the landing. Mostly.",
    "Oof."
   ],
   "close": [
    "Closed. Less clutter.",
    "*pats the X*",
    "One fewer thing."
   ],
   "minimize": [
    "Tucked away.",
    "*pats minimise*",
    "Out of sight, calmer mind."
   ],
   "mischief": [
    "That window looked stressed.",
    "I'm helping.",
    "Fewer tabs, more calm."
   ],
   "perch": [
    "Cosy up here.",
    "*flops*"
   ],
   "call": [
    "On my way. Slowly."
   ],
   "welcome": [
    "Back already? Nice.",
    "Good break."
   ],
   "hungry": [
    "Bamboo... please...",
    "So hungry. So round.",
    "I could eat a forest."
   ],
   "eat": [
    "*munch munch munch*",
    "Bamboo. Bliss.",
    "More? No? Okay."
   ]
  }
 },
 "penguin": {
  "id": "penguin",
  "name": "Penguin",
  "emoji": "🐧",
  "food": "🐟",
  "tint": [
   "#241f2b",
   "#2b2533"
  ],
  "svg": "<svg viewBox=\"0 0 64 64\" xmlns=\"http://www.w3.org/2000/svg\">\n  <path class=\"p-tail\" d=\"M45 44 L55 48 L46 50 Z\" fill=\"#241f2b\"/>\n  <rect class=\"p-leg-b\" x=\"24\" y=\"48\" width=\"5\" height=\"8\" rx=\"2.5\" fill=\"#e2892a\"/>\n  <path d=\"M19 55 h12 l-1 4.5 h-12 Z\" fill=\"#f79a2e\"/>\n  <rect class=\"p-leg-f\" x=\"35\" y=\"48\" width=\"5\" height=\"8\" rx=\"2.5\" fill=\"#f79a2e\"/>\n  <path d=\"M30 55 h12 l-1 4.5 h-12 Z\" fill=\"#ffab45\"/>\n  <ellipse cx=\"32\" cy=\"38\" rx=\"16\" ry=\"15\" fill=\"#2b2533\"/>\n  <ellipse cx=\"32.5\" cy=\"41\" rx=\"10.5\" ry=\"11\" fill=\"#fdfbf7\"/>\n  <!-- flipper: the arm that presses caption buttons -->\n  <path class=\"p-arm\" d=\"M44 29 q8 6 6 16 q-5 2 -8 -4 Z\" fill=\"#241f2b\"/>\n  <path d=\"M20 29 q-8 6 -6 16 q5 2 8 -4 Z\" fill=\"#241f2b\" opacity=\".85\"/>\n  <g class=\"p-head\">\n    <circle cx=\"32\" cy=\"20\" r=\"13.5\" fill=\"#2b2533\"/>\n    <path d=\"M32 8.5 a12 12 0 0 1 10.5 17 q-10.5 5 -21 0 A12 12 0 0 1 32 8.5 Z\"\n          fill=\"#2b2533\"/>\n    <ellipse cx=\"32\" cy=\"24\" rx=\"10\" ry=\"8.5\" fill=\"#fdfbf7\"/>\n    <ellipse class=\"p-eye\" cx=\"27.5\" cy=\"20\" rx=\"2.5\" ry=\"3.2\" fill=\"#241f2b\"/>\n    <ellipse class=\"p-eye\" cx=\"36.5\" cy=\"20\" rx=\"2.5\" ry=\"3.2\" fill=\"#241f2b\"/>\n    <circle cx=\"28.2\" cy=\"19\" r=\"0.9\" fill=\"#fff\"/>\n    <circle cx=\"37.2\" cy=\"19\" r=\"0.9\" fill=\"#fff\"/>\n    <path d=\"M28 25 h8 l-4 5 Z\" fill=\"#ff9c2b\"/>\n    <path d=\"M28 25 h8 l-4 2 Z\" fill=\"#e07a16\"/>\n    <circle cx=\"23\" cy=\"26\" r=\"2.4\" fill=\"#ff9db0\" opacity=\".4\"/>\n    <circle cx=\"41\" cy=\"26\" r=\"2.4\" fill=\"#ff9db0\" opacity=\".4\"/>\n  </g>\n</svg>",
  "lines": {
   "greet": [
    "Noot noot! 🐧",
    "Reporting for duty.",
    "It's warm in here."
   ],
   "idle": [
    "Noot.",
    "I'd slide across this desktop if I could.",
    "Formal attire, always.",
    "Is it cold outside? Asking for me.",
    "*waddles thoughtfully*"
   ],
   "click": [
    "Noot noot!",
    "*flipper five*",
    "Hey!",
    "I accept this attention."
   ],
   "sleep": [
    "Zzz... 💤",
    "*huddles for warmth*",
    "Noot... noot..."
   ],
   "drag": [
    "NOOOOT!",
    "Penguins don't fly!",
    "*flippers windmill*"
   ],
   "land": [
    "*belly slide stop*",
    "Landed. Dignity intact.",
    "Noot."
   ],
   "close": [
    "Window closed. Noot.",
    "*flipper-smacks the X*",
    "Handled."
   ],
   "minimize": [
    "Minimised. Noot.",
    "*taps minimise*",
    "Tucked below."
   ],
   "mischief": [
    "That was strategic.",
    "Noot. No regrets.",
    "Desk is cleaner now."
   ],
   "perch": [
    "I shall stand here.",
    "*waddles into place*"
   ],
   "call": [
    "Sliding over!"
   ],
   "welcome": [
    "Welcome back!",
    "Refreshed?"
   ],
   "hungry": [
    "Fish delivery when?",
    "My belly is empty and cold.",
    "*flaps hopefully*"
   ],
   "eat": [
    "*gulp*",
    "Fish! Excellent.",
    "Slippery and delicious."
   ]
  }
 }
};
export const PET_IDS: PetId[] = ["droplet", "cat", "duck", "panda", "penguin"];
