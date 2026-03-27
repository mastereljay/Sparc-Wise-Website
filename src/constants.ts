export interface Program {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
}

export interface NavItem {
  label: string;
  href: string;
}

export const PROGRAMS: Program[] = [
  {
    id: 'housing',
    title: 'Subsidized Housing',
    description: 'Innovative affordable housing solutions through hotel conversions and transitional support.',
    icon: 'Home',
    details: [
      'Hotel-to-Affordable Housing conversions',
      'Transitional Housing (6-24 months)',
      'Tenant education and financial literacy',
      'On-site support services'
    ]
  },
  {
    id: 'workforce',
    title: 'Workforce Development',
    description: 'Specialized trade schools focusing on the entertainment industry and sustainable agriculture.',
    icon: 'Briefcase',
    details: [
      'Entertainment Industry Trade School (Film, Music, Digital Media)',
      'Sustainable Agriculture Trade School (Viticulture, Dairy)',
      'Job Readiness & Soft Skills training',
      'Internship and apprenticeship placements'
    ]
  },
  {
    id: 'incubation',
    title: 'Business Incubation',
    description: 'Mentorship and facilities for local entrepreneurs, nonprofits, and cooperatives.',
    icon: 'Rocket',
    details: [
      'Winery & Creamery Incubator',
      'Entrepreneur Support Program',
      'Microloan programs up to $10,000',
      'Shared office and retail spaces'
    ]
  },
  {
    id: 'community',
    title: 'Community Hubs',
    description: 'Centralized resource centers and activity spaces for all Josephine County residents.',
    icon: 'Users',
    details: [
      'Community Resource Hub (Information & Referral)',
      'Community Activity Center (Arts, Culture, Recreation)',
      'Youth Programming & Tutoring',
      'Senior Social & Wellness Services'
    ]
  },
  {
    id: 'food',
    title: 'Food Sustainability',
    description: 'Increasing access to nutritious food through farm-to-table initiatives and community gardens.',
    icon: 'Leaf',
    details: [
      'Community Garden & Nutrition classes',
      'Meal programs for vulnerable populations',
      'Food distribution partnerships',
      'Regenerative agriculture techniques'
    ]
  }
];

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'Vision', href: '#vision' },
  { label: 'News', href: '#news' },
  { label: 'Programs', href: '#programs' },
  { label: 'About', href: '#about' },
  { label: 'Public', href: '#public' },
  { label: 'Contact', href: '#contact' }
];
