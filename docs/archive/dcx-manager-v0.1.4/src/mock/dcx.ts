import { DCX } from "../types";

export const MOCK_DCX_TABLE: DCX[] = [
  { 
    id: 'dcx-1', 
    client: 'HSA', 
    projectName: 'Ramadan 2026', 
    product: 'Campaign Management', 
    status: 'In Progress', 
    tags: ['Internal Campaigns', 'Functional'],
    createdAt: '2026-01-01',
    createdBy: 'u-4',
    lastUpdatedAt: '2026-03-01',
    lastUpdatedBy: 'u-1'
  },
  { 
    id: 'dcx-2', 
    client: 'HSA', 
    projectName: 'Abwab El Abtkar', 
    product: 'Nurturing Flow', 
    status: 'Draft', 
    tags: ['Internal Campaigns', 'Nurturing'],
    createdAt: '2026-01-15',
    createdBy: 'u-4',
    lastUpdatedAt: '2026-02-20',
    lastUpdatedBy: 'u-6'
  },
  { 
    id: 'dcx-3', 
    client: 'SNB', 
    projectName: 'National Day', 
    product: 'Public Awareness', 
    status: 'Completed', 
    tags: ['Public', 'Awareness'],
    createdAt: '2025-12-01',
    createdBy: 'u-4',
    lastUpdatedAt: '2026-01-20',
    lastUpdatedBy: 'u-2'
  },
  { 
    id: 'dcx-4', 
    client: 'SNB', 
    projectName: 'Summer Vibes', 
    product: 'Social Engagement', 
    status: 'In Progress', 
    tags: ['Social', 'Engagement'],
    createdAt: '2026-01-05',
    createdBy: 'u-4',
    lastUpdatedAt: '2026-01-10',
    lastUpdatedBy: 'u-5'
  },
  { 
    id: 'dcx-5', 
    client: 'HSA', 
    projectName: 'Winter Gala', 
    product: 'Internal Events', 
    status: 'Completed', 
    tags: ['Internal', 'Event'],
    createdAt: '2025-11-20',
    createdBy: 'u-4',
    lastUpdatedAt: '2025-12-15',
    lastUpdatedBy: 'u-3'
  },
];
