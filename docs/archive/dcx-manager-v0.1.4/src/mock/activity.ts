import { Activity } from "../types";

export const MOCK_ACTIVITY: Activity[] = [
  {
    id: 'a1',
    type: 'status_change',
    userId: 'u1', // Admin
    versionId: 'v1',
    projectName: 'Ramadan 2024 Campaign',
    clientName: 'HSA',
    versionNumber: 'V2',
    timestamp: new Date().toISOString(),
    details: 'changed status to Approved'
  },
  {
    id: 'a2',
    type: 'update',
    userId: 'u2', // CD
    versionId: 'v1',
    projectName: 'Ramadan 2024 Campaign',
    clientName: 'HSA',
    versionNumber: 'V2',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    details: 'edited campaign assets'
  },
  {
    id: 'a3',
    type: 'create',
    userId: 'u4', // UI Designer
    versionId: 'v1',
    projectName: 'Ramadan 2024 Campaign',
    clientName: 'HSA',
    versionNumber: 'V1',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    details: 'created DCX record'
  },
  {
    id: 'a4',
    type: 'status_change',
    userId: 'u3', // Client
    versionId: 'v2',
    projectName: 'SNB Digital Rebrand',
    clientName: 'SNB',
    versionNumber: 'V1',
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(), // 5 hours ago
    details: 'changed status to Rejected'
  },
  {
    id: 'a5',
    type: 'update',
    userId: 'u5', // Motion
    versionId: 'v2',
    projectName: 'SNB Digital Rebrand',
    clientName: 'SNB',
    versionNumber: 'V1',
    timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(), // 10 hours ago
    details: 'edited storyboard'
  },
  {
    id: 'a6',
    type: 'create',
    userId: 'u1',
    versionId: 'v2',
    projectName: 'SNB Digital Rebrand',
    clientName: 'SNB',
    versionNumber: 'V1',
    timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), // 1 day ago
    details: 'created DCX record'
  }
];
