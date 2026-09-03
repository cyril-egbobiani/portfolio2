// src/data/projects.ts — Centralized Project Dataset & Data Layer
// Decouples static case study content from page templates and components.

export interface ArchitectureItem {
  num: string;
  name: string;
  desc: string;
}

export interface MediaItem {
  type: 'image' | 'video';
  src: string;
  poster?: string;
  alt: string;
  device?: 'phone' | 'desktop' | 'banner';
  caption?: string;
}

export interface DualMediaItem {
  device: 'dual';
  desktop: {
    type: 'image' | 'video';
    src: string;
    poster?: string;
    alt: string;
  };
  phone: {
    type: 'image' | 'video';
    src: string;
    poster?: string;
    alt: string;
  };
  caption?: string;
}

export type HeroMedia = MediaItem | DualMediaItem;

export interface ProjectData {
  slug: string;
  title: string;
  category: string;
  tone: 'a' | 'b' | 'c' | 'd';
  thumbnailImage?: string;
  shortBlurb?: string;
  year: string;
  role: string;
  stack: string[];
  description: string;
  problem: string;
  decided: string;
  architecture?: ArchitectureItem[];
  highlights: string[];
  heroMedia?: HeroMedia;
  mediaGallery?: MediaItem[];
  link?: string;
  prevSlug: string;
  prevTitle: string;
  nextSlug: string;
  nextTitle: string;
  nextTone: 'a' | 'b' | 'c' | 'd';
}

export const projects: ProjectData[] = [
  {
    slug: 'forge',
    title: 'Forge',
    category: 'Cross-Platform Ecosystem',
    thumbnailImage: '/projects/forge/bright-warm-editorial.webp',
    heroMedia: {
      type: 'image',
      src: '/projects/forge/bright-warm-editorial.webp',
      alt: 'Forge Mobile App Interface',
      device: 'phone',
    },
    tone: 'a',
    year: '2026',
    role: 'Product Design & Full-Stack Engineering',
    stack: [
      'Flutter (Dart)',
      'Riverpod',
      'React 19',
      'TypeScript',
      'Node.js',
      'Express',
      'MongoDB',
      'Socket.IO',
      'Figma Token API',
    ],
    shortBlurb: 'Cross-platform spiritual app & React admin portal for youth communities.',
    description:
      'A cross-platform spiritual ecosystem for youth — gamified scripture learning, background sermon audio streaming, Socket.IO live prayer wall, and a React admin control portal.',
    problem:
      'Most faith applications for young audiences suffer from static text walls, disconnected design-to-engineering handoffs, and fragmented admin tools. When churches request prayer, youth lack real-time context or engagement.',
    decided:
      'Architect an integrated 3-tier ecosystem: a Flutter mobile app driven by an automated Figma-to-code token script (`extract_tokens.py`), real-time Socket.IO prayer request websockets, background audio/video media player, and a React 19 admin control portal backed by a Node.js/Express/MongoDB REST API with JWT refresh token rotation.',
    architecture: [
      {
        num: '01',
        name: 'Mobile Client (Flutter / Dart)',
        desc: 'Built with Material 3, Riverpod state management, Lottie animations, Bento grid layouts, just_audio background player runtime, and Socket.IO real-time prayer websockets.',
      },
      {
        num: '02',
        name: 'Admin Web Portal (React 19 / Vite / Tailwind)',
        desc: 'React 19 admin dashboard with Tailwind CSS, React Hook Form, and Axios for managing devotionals, scheduling events, and moderating community prayer requests.',
      },
      {
        num: '03',
        name: 'Backend API & Database (Node.js / Express / MongoDB)',
        desc: 'RESTful API with JWT authentication, refresh token rotation, Role-Based Access Control (RBAC), and Multer media pipeline deployed on Render.',
      },
    ],
    highlights: [
      'Automated Figma-to-Code Pipeline: Python AST script (extract_tokens.py) parsing raw Figma JSON directly into Flutter AppSpacing, AppColors, and typography constants.',
      'Real-time Prayer Telemetry: Socket.IO websocket channels surfacing live church prayer counters and group request chats.',
      'High-Performance Media Engine: Background audio streaming (just_audio + audio_service) and video player integration (chewie) for sermons and devotions.',
      'Full-Stack JWT Auth & Security: End-to-end security pipeline with refresh token rotation and role-based permissions (Member / Leader / Admin).',
    ],
    mediaGallery: [
      {
        type: 'image',
        src: '/projects/forge/Onboarding-Screen 1.webp',
        alt: 'Forge Mobile App Onboarding Flow 1',
        device: 'phone',
        caption: 'Onboarding Flow',
      },
      {
        type: 'image',
        src: '/projects/forge/bright-warm-editorial.webp',
        alt: 'Forge Mobile App Onboarding Flow 1',
        device: 'phone',
        caption: 'Home Screen',
      },
      {
        type: 'image',
        src: '/projects/forge/prayer-section.webp',
        alt: 'Real-time Socket.IO Church Prayer Wall',
        device: 'phone',
        caption: 'Live Prayer Wall & Telemetry',
      },
      {
        type: 'image',
        src: '/projects/forge/teachings-archive.webp',
        alt: 'Forge Mobile App Teachings Archive',
        device: 'phone',
        caption: 'Teachings Archive',
      },
    ],
    link: '',
    prevSlug: 'model-portfolio',
    prevTitle: 'Dubem',
    nextSlug: '9to5er',
    nextTitle: '9to5er',
    nextTone: 'b',
  },
  {
    slug: '9to5er',
    title: '9to5er',
    category: 'Builds',
    tone: 'b',
    year: '2026',
    role: 'Full Stack Engineering & Design',
    stack: ['Astro', 'TypeScript', 'Postgres', 'TailwindCSS'],
    description: 'Deep-dives on agencies, for people about to join one.',
    problem:
      'Joining a new agency you are mostly guessing — what they really do, how they work, how organised they actually are. You can ask a general chatbot and get a confident summary of nothing.',
    decided:
      'Go narrow instead of general. Structured breakdowns of specific agencies — workflow, structure, how they actually operate. Being genuinely useful about a small thing beats being vague about everything.',
    highlights: [
      'Structured agency breakdowns covering workflow, hierarchy, and operational health.',
      'Deliberately narrow and accountable rather than a generic answer engine.',
      'Built for designers and engineers entering the field or moving between agencies.',
    ],
    link: '',
    prevSlug: 'forge',
    prevTitle: 'Forge',
    nextSlug: 'token-extractor',
    nextTitle: 'Token Extractor',
    nextTone: 'd',
  },
  {
    slug: 'token-extractor',
    title: 'Token Extractor',
    category: 'Builds',
    tone: 'd',
    year: '2024',
    role: 'Browser Extension & Tooling',
    stack: ['TypeScript', 'Browser Extension', 'Monorepo', 'CSS AST'],
    description: 'A browser extension that pulls the real design tokens off any page.',
    problem:
      'Rebuilding someone else’s design language usually means eyedropping it one hex code at a time and manually calculating font scales.',
    decided:
      'Automate token extraction directly from computed CSS styles. The extension parses a page in real time and extracts tokens — colours, shadows, typography, spacing — into clean JSON or CSS variables.',
    highlights: [
      'Extracts colours, shadows, fonts, and layout tokens directly from any live page DOM.',
      'First open-source build shipped, architected as a modular monorepo.',
      'Instant copy-paste tokens in CSS variables and Tailwind token formats.',
    ],
    link: '',
    prevSlug: '9to5er',
    prevTitle: '9to5er',
    nextSlug: 'model-portfolio',
    nextTitle: 'Dubem',
    nextTone: 'c',
  },
  {
    slug: 'model-portfolio',
    title: 'Dubem',
    category: 'Designs',
    tone: 'c',
    year: '2025',
    role: 'Art Direction & Frontend',
    stack: ['Astro', 'TypeScript', 'TailwindCSS', 'Motion'],
    description: 'A site for a friend who models, built around her distinct style sets.',
    problem:
      'A model is judged on the same thing the portfolio is — how it looks. Standard portfolio templates flatten everyone into one identical, sterile square grid.',
    decided:
      'Structure the entire showcase around her distinct style sets and editorial moods rather than a single flat gallery, so her aesthetic range becomes the focal point.',
    highlights: [
      'Organised around distinct editorial style sets instead of one uniform gallery.',
      'Dynamic layout built so range and versatility read immediately on first viewport.',
      'Silky image transitions and spring-physics media viewing.',
    ],
    link: '',
    prevSlug: 'token-extractor',
    prevTitle: 'Token Extractor',
    nextSlug: 'forge',
    nextTitle: 'Forge',
    nextTone: 'a',
  },
];

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return projects.find((project) => project.slug === slug);
}
