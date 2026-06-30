import { MOCK_USER_ID } from '@/mock/constants';
import { canApproveVersion, canTransition } from '@/rules/lifecycle.rules';
import type { ApiFileAttachment, ApiVersion } from '@/types/api';
import type { VersionStatus } from '@/types/lifecycle';
import { readMockStore, writeMockStore } from './store';
import { getBuilderFromMock, saveBuilderToMock } from './builder.mock';
import { writeLifecycleLogToMock } from './logs.mock';

const VERSIONS_KEY = 'versions';

function makeVersion(
  id: string,
  dcxId: string,
  versionNumber: string,
  status: VersionStatus,
  overrides: Partial<ApiVersion> = {},
): ApiVersion {
  const timestamp = '2026-06-19T09:00:00.000Z';
  return {
    id,
    dcxId,
    versionNumber,
    status,
    communicatedDate: null,
    createdAt: timestamp,
    createdBy: MOCK_USER_ID,
    lastUpdatedAt: timestamp,
    lastUpdatedBy: MOCK_USER_ID,
    inProgressAt: status !== 'Draft' ? timestamp : null,
    readyAt: status === 'Ready for Approval' || status === 'Approved' || status === 'Superseded' ? timestamp : null,
    approvedAt: status === 'Approved' ? timestamp : null,
    supersededAt: status === 'Superseded' ? timestamp : null,
    sourceType: 'scratch',
    sourceVersionId: null,
    sourceBackupId: null,
    sourceTemplateId: null,
    assignedTeam: [{ userId: MOCK_USER_ID, role: 'ICS', isProtected: true }],
    attachments: [],
    metadata: null,
    strategyContext: null,
    ...overrides,
  };
}

function seedVersions(): ApiVersion[] {
  return [
    makeVersion('v-1', 'dcx-1', 'V1', 'In Progress', {
      communicatedDate: '2026-07-01',
      metadata: { client: 'HSA', project: 'Brand Awareness Q3', product: 'DCX Suite' },
      assignedTeam: [
        { userId: MOCK_USER_ID, role: 'ICS', isProtected: true },
        { userId: 'u-2', role: 'Strategist', isProtected: false },
      ],
      attachments: [
        { id: 'f-1', versionId: 'v-1', title: 'Brand Guidelines Q3.pdf', url: 'https://drive.google.com/file/d/mock-1', source: 'google-drive', createdBy: 'ms', createdAt: '2026-06-19T09:00:00.000Z' },
        { id: 'f-2', versionId: 'v-1', title: 'Campaign Brief', url: 'https://docs.google.com/document/d/mock-2', source: 'google-drive', createdBy: 'ms', createdAt: '2026-06-19T09:00:00.000Z' },
      ],
    }),
    makeVersion('v-2', 'dcx-1', 'V2', 'Ready for Approval', {
      communicatedDate: '2026-07-05',
      sourceType: 'duplicate',
      sourceVersionId: 'v-1',
      metadata: { client: 'HSA', project: 'Brand Awareness Q3', product: 'DCX Suite' },
      assignedTeam: [
        { userId: MOCK_USER_ID, role: 'ICS', isProtected: true },
        { userId: 'u-2', role: 'Strategist', isProtected: false },
        { userId: 'u-3', role: 'Creative', isProtected: false },
      ],
      attachments: [
        { id: 'f-3', versionId: 'v-2', title: 'Revised Brief V2.pdf', url: 'https://drive.google.com/file/d/mock-3', source: 'google-drive', createdBy: 'ms', createdAt: '2026-06-19T09:00:00.000Z' },
      ],
    }),
    makeVersion('v-3', 'dcx-2', 'V1', 'Draft', {
      metadata: { client: 'SNB', project: 'Product Launch 2026', product: 'DCX Suite' },
    }),
    makeVersion('v-4', 'dcx-2', 'V2', 'In Progress', {
      communicatedDate: '2026-08-15',
      sourceType: 'duplicate',
      sourceVersionId: 'v-3',
      metadata: { client: 'SNB', project: 'Product Launch 2026', product: 'DCX Suite' },
      assignedTeam: [
        { userId: MOCK_USER_ID, role: 'ICS', isProtected: true },
        { userId: 'u-3', role: 'Creative', isProtected: false },
      ],
    }),
    makeVersion('v-5', 'dcx-3', 'V1', 'Approved', {
      communicatedDate: '2026-06-01',
      metadata: { client: 'Almarai', project: 'Summer Campaign', product: 'DCX Suite' },
      assignedTeam: [{ userId: MOCK_USER_ID, role: 'ICS', isProtected: true }],
    }),
    makeVersion('v-6', 'dcx-3', 'V2', 'Superseded', {
      communicatedDate: '2026-06-10',
      sourceType: 'duplicate',
      sourceVersionId: 'v-5',
      metadata: { client: 'Almarai', project: 'Summer Campaign', product: 'DCX Suite' },
    }),
  ];
}

function getVersionsFromMock(): ApiVersion[] {
  return readMockStore<ApiVersion[]>(VERSIONS_KEY, seedVersions());
}

function saveVersionsToMock(versions: ApiVersion[]): ApiVersion[] {
  return writeMockStore(VERSIONS_KEY, versions);
}

export function getAllVersionsFromMock(): ApiVersion[] {
  return getVersionsFromMock();
}

export function getVersionsForDcxFromMock(dcxId: string): ApiVersion[] {
  return getVersionsFromMock().filter((version) => version.dcxId === dcxId);
}

export function getVersionFromMock(versionId: string): ApiVersion {
  const version = getVersionsFromMock().find((item) => item.id === versionId);

  if (!version) {
    throw new Error(`Version not found: ${versionId}`);
  }

  return version;
}

export function updateStatusInMock(versionId: string, status: VersionStatus): ApiVersion {
  const versions = getVersionsFromMock();
  const current = versions.find((version) => version.id === versionId);

  if (!current) {
    throw new Error(`Version not found: ${versionId}`);
  }

  if (current.status !== status && !canTransition(current.status, status)) {
    throw new Error(`Illegal version transition: ${current.status} -> ${status}`);
  }

  if (status === 'Approved' && !canApproveVersion(current)) {
    throw new Error('Approval is blocked until the version communication date is set.');
  }

  const timestamp = new Date().toISOString();
  const supersededSiblingIds: string[] = [];
  const updatedVersions = versions.map((version) => {
    if (version.id === versionId) {
      return {
        ...version,
        status,
        lastUpdatedAt: timestamp,
        lastUpdatedBy: MOCK_USER_ID,
        readyAt: status === 'Ready for Approval' ? timestamp : version.readyAt,
        approvedAt: status === 'Approved' ? timestamp : version.approvedAt,
        supersededAt: status === 'Superseded' ? timestamp : version.supersededAt,
      };
    }

    if (status === 'Approved' && version.dcxId === current.dcxId && version.status !== 'Superseded') {
      supersededSiblingIds.push(version.id);
      return {
        ...version,
        status: 'Superseded' as VersionStatus,
        supersededAt: timestamp,
        lastUpdatedAt: timestamp,
        lastUpdatedBy: MOCK_USER_ID,
      };
    }

    return version;
  });

  saveVersionsToMock(updatedVersions);
  writeLifecycleLogToMock({
    type: status === 'Approved' ? 'approved' : status === 'Superseded' ? 'superseded' : 'ready_submitted',
    versionId,
    userId: MOCK_USER_ID,
    details: { status, supersededSiblingIds },
  });

  return getVersionFromMock(versionId);
}

export function updateVersionDateInMock(versionId: string, date: string | null): ApiVersion {
  const updatedVersions = getVersionsFromMock().map((version) => {
    if (version.id !== versionId) {
      return version;
    }

    return {
      ...version,
      communicatedDate: date,
      lastUpdatedAt: new Date().toISOString(),
      lastUpdatedBy: MOCK_USER_ID,
    };
  });

  saveVersionsToMock(updatedVersions);
  return getVersionFromMock(versionId);
}

export async function duplicateVersionInMock(sourceVersionId: string): Promise<ApiVersion> {
  const versions = getVersionsFromMock();
  const source = versions.find((version) => version.id === sourceVersionId);

  if (!source) {
    throw new Error(`Source version not found: ${sourceVersionId}`);
  }

  const newId = `v-${Math.floor(Math.random() * 1000 + 100)}`;
  const timestamp = new Date().toISOString();
  const duplicated: ApiVersion = {
    ...source,
    id: newId,
    versionNumber: `V${versions.length + 1}`,
    status: 'Draft',
    createdAt: timestamp,
    createdBy: MOCK_USER_ID,
    lastUpdatedAt: timestamp,
    lastUpdatedBy: MOCK_USER_ID,
    inProgressAt: null,
    readyAt: null,
    approvedAt: null,
    supersededAt: null,
    sourceType: 'duplicate',
    sourceVersionId,
    sourceBackupId: null,
    sourceTemplateId: null,
  };

  saveVersionsToMock([...versions, duplicated]);

  try {
    const sourceTree = getBuilderFromMock(sourceVersionId);
    saveBuilderToMock(newId, sourceTree.phases);
  } catch (err) {
    console.error('Failed to copy builder tree during duplication:', err);
  }

  return duplicated;
}

export function getVersionFilesFromMock(versionId: string): ApiFileAttachment[] {
  return getVersionFromMock(versionId).attachments ?? [];
}

export function attachVersionFileToMock(
  versionId: string,
  file: ApiFileAttachment,
): ApiFileAttachment {
  const versions = getVersionsFromMock();
  const nextVersions = versions.map((version) => {
    if (version.id !== versionId) {
      return version;
    }

    return {
      ...version,
      attachments: [...(version.attachments ?? []), file],
    };
  });

  if (!versions.some((version) => version.id === versionId)) {
    throw new Error(`Version not found: ${versionId}`);
  }

  saveVersionsToMock(nextVersions);
  return file;
}
