export interface SessionType {
  id: string;
  name: string;
  duration: number; // in minutes
  description: string;
  color: string;
}

export const sessionTypes: SessionType[] = [
  {
    id: 'pomodoro',
    name: 'Pomodoro',
    duration: 25,
    description: 'Classic 25-minute focused work session',
    color: '#0ea5e9',
  },
  {
    id: 'deep-work',
    name: 'Deep Work',
    duration: 50,
    description: 'Extended 50-minute session for complex tasks',
    color: '#7c3aed',
  },
  {
    id: 'quick-win',
    name: 'Quick Win',
    duration: 15,
    description: 'Short 15-minute session for small tasks',
    color: '#10b981',
  },
  {
    id: 'custom',
    name: 'Custom',
    duration: 30,
    description: 'Custom duration session',
    color: '#f59e0b',
  },
];

export const defaultSessionType = sessionTypes[0]; // Pomodoro

export const getSessionTypeById = (id: string): SessionType | undefined => {
  return sessionTypes.find(type => type.id === id);
};

export const getSessionTypeByDuration = (duration: number): SessionType | undefined => {
  return sessionTypes.find(type => type.duration === duration);
}; 