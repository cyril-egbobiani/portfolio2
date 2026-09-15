// src/data/projects.ts — Project cards for the homepage Work section.
// Each card's full case study lives in src/content/projects/<slug>.mdx;
// this list decides which projects appear and in what order.

export interface ProjectCard {
  slug: string;
  title: string;
  shortBlurb: string;
  thumbnailImage?: string;
  deviceType: 'phone' | 'desktop';
}

export const projects: ProjectCard[] = [
  {
    slug: 'forge',
    title: 'Forge',
    shortBlurb: 'Cross-platform spiritual app & React admin portal for youth communities.',
    thumbnailImage: '/projects/forge/bright-warm-editorial.webp',
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
    thumbnailImage: '/projects/gdg-babcock/gdg-babcock-home.png',
    deviceType: 'desktop',
  },
  {
    slug: 'fbdil-attendance',
    title: 'FBDIL Attendance',
    shortBlurb: 'A mobile attendance system that replaced a manual process at the First Bank Digital Innovation Lab.',
    // Phone cropped out of the original landscape mockup (fbdil-attendance.png)
    thumbnailImage: '/projects/fbdil-attendance/fbdil-attendance-phone.png',
    deviceType: 'phone',
  },
];

export function getProjectBySlug(slug: string): ProjectCard | undefined {
  return projects.find((project) => project.slug === slug);
}
