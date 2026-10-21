export interface VisitorLog {
  id: string;
  ip: string;
  name: string; // If left empty or anonymous, defaults to "Anonymous Explorer"
  email?: string;
  isNamed: boolean;
  userAgent: string;
  browser: string;
  os: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  country?: string;
  countryCode?: string;
  city?: string;
  region?: string;
  firstVisitedAt: string;
  lastActiveAt: string;
  visitCount: number;
  visitedPages: string[];
  notes?: string;
  emailNotified?: boolean;
}

export interface TrackRequest {
  visitorId?: string;
  name?: string;
  email?: string;
  page?: string;
  notes?: string;
  screenResolution?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'Systems / OS' | 'Full-Stack' | 'AI / ML' | 'Cloud & DevOps';
  technologies: string[];
  metrics?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  gradient: string;
}

export interface SkillCategory {
  category: string;
  iconName: string;
  description: string;
  skills: {
    name: string;
    level: string; // e.g. "Advanced", "Proficient", "Exploring"
    tag: string;
    icon?: string;
  }[];
}

export interface SemesterMilestone {
  semester: string;
  year: string;
  period: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  highlights: string[];
  coreSubjects: string[];
  keyProject: string;
}
