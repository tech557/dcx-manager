import { DCXVersion, EnrichedVersion } from "../types";
import { MOCK_DCX_TABLE } from "./dcx";

export const MOCK_VERSIONS_TABLE: DCXVersion[] = [
  { 
    id: 'v-1', 
    dcxId: 'dcx-1', 
    versionNumber: 'V3', 
    status: 'In Progress', 
    createdAt: '2026-02-25',
    createdBy: 'u-1',
    lastUpdatedAt: '2026-03-01',
    lastUpdatedBy: 'u-1',
    communicatedDate: '2026-03-08',
    assignedTeam: [
      { userId: 'u-1', role: 'ICS' },
      { userId: 'u-2', role: 'Creative Director' },
      { userId: 'u-4', role: 'Project Manager' }
    ],
    attachments: [
      { title: 'Ramadan 2026 - Master Creative Brief v1.2', url: 'https://drive.google.com/drive/folders/ramadan-2026-brief' },
      { title: 'Copy Deck - Headline & Radio Spot Concepts', url: 'https://docs.google.com/document/d/copy-deck' },
      { title: 'Media Deployment Gsheet Schema', url: 'https://docs.google.com/spreadsheets/d/media-deployment' }
    ],
    phases: [
      {
        id: 'phase-init-1',
        label: 'Brand Awareness Phase',
        icon: 'awareness',
        startDate: '2026-03-01',
        endDate: '2026-03-15',
        position: { x: 100, y: 220 },
        actionCards: [
          {
            id: 'action-1-1',
            name: 'Out-of-Home Billboards',
            startDate: '2026-03-01',
            endDate: '2026-03-10',
            description: 'Deploy digital display boards across major highways and shopping centers.',
            tasks: [
              {
                id: 'task-1-1-1',
                name: 'Teaser Banner',
                channelId: 'ch-2',
                message: 'Hi Noura, please verify the credentials for the digital banner coordinates.',
                senderId: 'p-2',
                receiverId: 'r-3',
                specsIdentifier: 'SPC-OOH-COORD-001',
                missingData: [],
                date: { mode: 'fixed', date: '2026-03-02' }
              },
              {
                id: 'task-1-1-2',
                name: 'Teaser Post',
                channelId: 'ch-1',
                message: 'Upload direct social assets for billboard teaser post campaign.',
                senderId: 'p-1',
                receiverId: 'r-2',
                specsIdentifier: 'VEC-INC-OOH-944',
                missingData: [],
                date: { mode: 'fixed', date: '2026-03-05' }
              },
              {
                id: 'task-1-1-3',
                name: 'Launch Invite',
                channelId: 'ch-3',
                message: 'Send MS Teams invitation card and coordinate billboard launch timing.',
                senderId: 'p-3',
                receiverId: 'r-3',
                specsIdentifier: 'INV-LAUNCH-031'
              }
            ]
          },
          {
            id: 'action-1-2',
            name: 'Targeted Social Ads Campaign',
            startDate: '2026-03-05',
            endDate: '2026-03-15',
            description: 'Launch interest-based static creative sets targeting main demographic clusters.',
            tasks: [
              {
                id: 'task-1-2-1',
                name: 'Launch Video',
                channelId: 'ch-5',
                message: 'Verify that the launch video teaser preview behaves correctly.',
                senderId: 'p-4',
                receiverId: 'r-4',
                specsIdentifier: 'META-PIXEL-CAPI-V4',
                missingData: [],
                date: { mode: 'fixed', date: '2026-03-08' }
              },
              {
                id: 'task-1-2-2',
                name: 'Reinforcement Post',
                channelId: 'ch-4',
                message: 'Send reinforcement update note on WhatsApp Business channel.',
                senderId: 'p-1',
                receiverId: 'r-2',
                specsIdentifier: 'WA-ADS-RE-992'
              },
              {
                id: 'task-1-2-3',
                name: 'Reinforcement SMS',
                channelId: 'ch-6',
                message: 'Shoot SMS blast to our client-base informing of our new campaign update.',
                senderId: 'p-3',
                receiverId: 'r-1',
                specsIdentifier: 'SMS-BLAST-Q1P'
              }
            ]
          }
        ]
      },
      {
        id: 'phase-init-2',
        label: 'Teaser & Social Phase',
        icon: 'teaser',
        startDate: '2026-03-16',
        endDate: '2026-03-31',
        position: { x: 480, y: 220 },
        actionCards: [
          {
            id: 'action-2-1',
            name: 'Teaser Video Release',
            startDate: '2026-03-16',
            endDate: '2026-03-22',
            description: 'Upload 15-second bumper spots across YouTube, Meta, and auxiliary channels.',
            tasks: [
              {
                id: 'task-2-1-1',
                name: 'Teaser Reel',
                channelId: 'ch-6',
                message: 'Publish short 10-second social media reel post teaser video.',
                senderId: 'p-1',
                receiverId: 'r-3',
                specsIdentifier: 'YT-REEL-TSR'
              },
              {
                id: 'task-2-1-2',
                name: 'Teaser Blast',
                channelId: 'ch-6',
                message: 'Blast teaser SMS to registered pre-interest consumer segment.',
                senderId: 'p-2',
                receiverId: 'r-1',
                specsIdentifier: 'SMS-TS-012'
              }
            ]
          },
          {
            id: 'action-2-2',
            name: 'Influencer Seed Kits',
            startDate: '2026-03-20',
            endDate: '2026-03-31',
            description: 'Dispatch localized custom influencer kits for early-access reviews.',
            tasks: [
              {
                id: 'task-2-2-1',
                name: 'Launch Invite',
                channelId: 'ch-5',
                message: 'Notify influencers of early-access seed kits arrival.',
                senderId: 'p-3',
                receiverId: 'r-3',
                specsIdentifier: 'APP-INF-NOTIF'
              },
              {
                id: 'task-2-2-2',
                name: 'Reinforcement Note',
                channelId: 'ch-4',
                message: 'Follow-up WhatsApp message confirming receipt of unboxing kits.',
                senderId: 'p-3',
                receiverId: 'r-1',
                specsIdentifier: 'WA-FLW-INF'
              }
            ]
          }
        ]
      },
      {
        id: 'phase-init-3',
        label: 'Core Launch Activation',
        icon: 'launch',
        startDate: '2026-04-01',
        endDate: '2026-04-20',
        position: { x: 860, y: 220 },
        actionCards: [
          {
            id: 'action-3-1',
            name: 'Direct Purchase Portal Go-Live',
            startDate: '2026-04-01',
            endDate: '2026-04-05',
            description: 'Transition database migrations and open storefront to public traffic.',
            tasks: [
              {
                id: 'task-3-1-1',
                name: 'Launch Blast',
                channelId: 'ch-4',
                message: 'Broadcast WhatsApp Business go-live notification alert.',
                senderId: 'p-5',
                receiverId: 'r-1',
                specsIdentifier: 'WA-LAUNCH-LIVE'
              },
              {
                id: 'task-3-1-2',
                name: 'Launch Email',
                channelId: 'ch-2',
                message: 'Send the official HTML announcement launch email campaign.',
                senderId: 'p-3',
                receiverId: 'r-1',
                specsIdentifier: 'EML-LAUNCH392'
              },
              {
                id: 'task-3-1-3',
                name: 'Reinforcement Post',
                channelId: 'ch-1',
                message: 'Write slack update to coordination and operation teams.',
                senderId: 'p-2',
                receiverId: 'r-3',
                specsIdentifier: 'SLK-LIVE-POST'
              }
            ]
          },
          {
            id: 'action-3-2',
            name: 'PR Press Release Blitz',
            startDate: '2026-04-02',
            endDate: '2026-04-10',
            description: 'Blast official copy announcements to partnered industry news hubs.',
            tasks: [
              {
                id: 'task-3-2-1',
                name: 'Launch Article',
                channelId: 'ch-1',
                message: 'Upload press launch post regarding version deployment.',
                senderId: 'p-3',
                receiverId: 'r-3',
                specsIdentifier: 'PR-LIVE309'
              },
              {
                id: 'task-3-2-2',
                name: 'Teaser Deck',
                channelId: 'ch-2',
                message: 'Email primary news contacts with custom teaser deck credentials.',
                senderId: 'p-1',
                receiverId: 'r-3',
                specsIdentifier: 'EML-TSR-PR-02'
              }
            ]
          }
        ]
      }
    ]
  },
  { 
    id: 'v-2', 
    dcxId: 'dcx-1', 
    versionNumber: 'V2', 
    status: 'Placed', 
    createdAt: '2026-02-10',
    createdBy: 'u-1',
    lastUpdatedAt: '2026-02-15',
    lastUpdatedBy: 'u-1',
    communicatedDate: '2026-02-18',
    assignedTeam: [
      { userId: 'u-1', role: 'ICS' },
      { userId: 'u-4', role: 'Project Manager' }
    ],
    attachments: [
      { title: 'Ramadan 2026 - Concept Moodboard', url: 'https://slides.google.com/presentation/d/moodboard' }
    ]
  },
  { 
    id: 'v-3', 
    dcxId: 'dcx-1', 
    versionNumber: 'V1', 
    status: 'Placed', 
    createdAt: '2026-01-25',
    createdBy: 'u-1',
    lastUpdatedAt: '2026-02-01',
    lastUpdatedBy: 'u-1',
    communicatedDate: '2026-01-30',
    assignedTeam: [
      { userId: 'u-1', role: 'ICS' }
    ]
  },
  { 
    id: 'v-4', 
    dcxId: 'dcx-2', 
    versionNumber: 'V1', 
    status: 'Draft', 
    createdAt: '2026-02-20',
    createdBy: 'u-6',
    lastUpdatedAt: '2026-02-20',
    lastUpdatedBy: 'u-6',
    communicatedDate: 'TBH',
    assignedTeam: [
      { userId: 'u-6', role: 'Creative Copywriter' }
    ]
  },
  { 
    id: 'v-5', 
    dcxId: 'dcx-3', 
    versionNumber: 'V2', 
    status: 'Ready for Review', 
    createdAt: '2026-01-15',
    createdBy: 'u-2',
    lastUpdatedAt: '2026-01-20',
    lastUpdatedBy: 'u-2',
    communicatedDate: '2026-01-22',
    assignedTeam: [
      { userId: 'u-2', role: 'Creative Director' },
      { userId: 'u-3', role: 'Art Director' }
    ],
    attachments: [
      { title: 'Portfolio Guidelines Document v3', url: 'https://docs.google.com/document/d/guidelines' },
      { title: 'Asset Layout Sheet', url: 'https://docs.google.com/spreadsheets/d/assets' }
    ]
  },
  { 
    id: 'v-6', 
    dcxId: 'dcx-4', 
    versionNumber: 'V1', 
    status: 'In Progress', 
    createdAt: '2026-01-05',
    createdBy: 'u-5',
    lastUpdatedAt: '2026-01-10',
    lastUpdatedBy: 'u-5',
    communicatedDate: '2026-01-12',
    assignedTeam: [
      { userId: 'u-5', role: 'Digital Experience' }
    ]
  },
  { 
    id: 'v-7', 
    dcxId: 'dcx-5', 
    versionNumber: 'V4', 
    status: 'Approved', 
    createdAt: '2025-12-10',
    createdBy: 'u-3',
    lastUpdatedAt: '2025-12-15',
    lastUpdatedBy: 'u-3',
    communicatedDate: '2025-12-18',
    assignedTeam: [
      { userId: 'u-3', role: 'Art Director' },
      { userId: 'u-4', role: 'Project Manager' }
    ],
    attachments: [
      { title: 'Completed Campaign Deliverables PDF', url: 'https://drive.google.com/file/d/deliverables' }
    ]
  },
];

export const getEnrichedVersions = (): EnrichedVersion[] => {
  return MOCK_VERSIONS_TABLE.map(version => {
    const dcx = MOCK_DCX_TABLE.find(d => d.id === version.dcxId)!;
    const weeks = version.weeks || [
      { id: `wk-1-${version.id}`, weekNumber: 1 }
    ];
    return { ...version, dcx, weeks };
  });
};

export const MOCK_ENRICHED_RECENT = getEnrichedVersions().slice(0, 5);
