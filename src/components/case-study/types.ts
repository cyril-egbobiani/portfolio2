// Shared prop types for case study components

export interface CaseStudyLink {
  label: string;
  href: string;
}

export interface NextCaseProps {
  href: string;
  title: string;
  summary: string;
  /** Screenshot shown on the card (project case studies) */
  image?: ImageMetadata;
  device?: 'phone' | 'desktop';
  /** Sketch → final pair shown on the card (design case studies) */
  design?: {
    sketch: ImageMetadata;
    final: ImageMetadata;
    device: 'phone' | 'desktop';
  };
}
