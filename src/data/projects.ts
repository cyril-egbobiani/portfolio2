// src/data/projects.ts — Project cards for the homepage Work section.
// Each card's full case study lives in src/content/projects/<slug>.mdx;
// this list decides which projects appear and in what order.
// Thumbnails are imported from src/assets so Astro resizes and converts them.
import forgeHome from '../assets/projects/forge-home.webp';
import gdgBabcockHome from '../assets/projects/gdg-babcock-home.png';
import fbdilAttendancePhone from '../assets/projects/fbdil-attendance-phone.png';

export interface ProjectCard {
  slug: string;
  title: string;
  shortBlurb: string;
  thumbnailImage?: ImageMetadata;
  deviceType: 'phone' | 'desktop';
}

export const projects: ProjectCard[] = [
  {
    slug: 'forge',
    title: 'Forge',
    shortBlurb: 'Cross-platform spiritual app & React admin portal for youth communities.',
    thumbnailImage: forgeHome,
    deviceType: 'phone',
  },
  {
    slug: '9to5er',
    title: '9to5er',
    shortBlurb: 'Deep-dives and operational breakdowns of design & engineering agencies.',
    deviceType: 'desktop',
  },
  {
    slug: 'token-extractor',
    title: 'Token Extractor',
    shortBlurb: 'Browser extension extracting computed CSS tokens into JSON and Tailwind variables.',
    deviceType: 'desktop',
  },
  {
    slug: 'model-portfolio',
    title: 'Dubem',
    shortBlurb: 'Editorial portfolio built around distinct style sets and dynamic spring motion.',
    deviceType: 'desktop',
  },
  {
    slug: 'gdg-babcock',
    title: 'GDG Babcock',
    shortBlurb: 'A redesign of the GDG Babcock website into a modern, accessible community platform.',
    thumbnailImage: gdgBabcockHome,
    deviceType: 'desktop',
  },
  {
    slug: 'fbdil-attendance',
    title: 'FBDIL Attendance',
    shortBlurb: 'A mobile attendance system that replaced a manual process at the First Bank Digital Innovation Lab.',
    // Phone cropped out of the original landscape mockup (fbdil-attendance-mockup.png)
    thumbnailImage: fbdilAttendancePhone,
    deviceType: 'phone',
  },
];

export function getProjectBySlug(slug: string): ProjectCard | undefined {
  return projects.find((project) => project.slug === slug);
}
