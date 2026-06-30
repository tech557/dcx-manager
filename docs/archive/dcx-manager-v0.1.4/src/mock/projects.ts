export interface MockProject {
  id: string;
  name: string;
}

export interface MockClient {
  id: string; // e.g., 'c-hsa', 'c-snb'
  name: string; // e.g., 'HSA', 'SNB'
  projects: MockProject[];
}

export const MOCK_CLIENTS_WITH_PROJECTS: MockClient[] = [
  {
    id: 'c-hsa',
    name: 'HSA',
    projects: [
      { id: 'p-ramadan', name: 'Ramadan 2026' },
      { id: 'p-abwab', name: 'Abwab El Abtkar' },
      { id: 'p-winter', name: 'Winter Gala' },
      { id: 'p-autumn', name: 'Autumn Refresh 2026' },
      { id: 'p-health', name: 'Heal & Nourish Hub' },
    ]
  },
  {
    id: 'c-snb',
    name: 'SNB',
    projects: [
      { id: 'p-national', name: 'National Day Showcase' },
      { id: 'p-summer', name: 'Summer Vibes campaign' },
      { id: 'p-awareness', name: 'Public Social Awareness' },
      { id: 'p-wealth', name: 'Wealth Horizon Launch' },
    ]
  },
  {
    id: 'c-almarai',
    name: 'Almarai',
    projects: [
      { id: 'p-dairy', name: 'Dairy Gold Premium' },
      { id: 'p-fresh', name: 'Fresh Start 2026 Boost' },
      { id: 'p-juice', name: 'Pure juice activations' },
    ]
  },
  {
    id: 'c-aramco',
    name: 'Aramco',
    projects: [
      { id: 'p-tech', name: 'Tech & Net-Zero Forum' },
      { id: 'p-energy', name: 'Future Energy Horizons' },
      { id: 'p-spark', name: 'Youth Spark Initiative' },
    ]
  }
];

/**
 * Simulates a server list endpoint returning clients with nested projects.
 * Supports realistic fake network latency.
 */
export const fetchClientsWithProjectsSimulated = (): Promise<MockClient[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_CLIENTS_WITH_PROJECTS);
    }, 450); // Balanced realistic delay for sleek micro-interactions
  });
};
