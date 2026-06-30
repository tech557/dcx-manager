# Builder — Target Architecture (post-plan)

## Component Hierarchy

```
BuilderPage
  ├── BuilderLoadingShell           ← B1
  ├── StageProvider (cleaned)        ← B0
  └── BuilderWorkspaceContent
      ├── Row 1: MetadataIsland
      │   ├── HeaderBrandIsland
      │   ├── MetadataDetailsContent
      │   │   ├── CampaignDetailsGroup
      │   │   ├── StatusDropdownBadge
      │   │   ├── CommunicationDateField
      │   │   ├── ViewTabSwitcher
      │   │   └── MetadataFilesPopup  ← B-FIL (file list + preview sessions)
      │   └── HeaderUserIsland
      ├── Row 2:
      │   ├── EditorViewerIsland
      │   │   ├── EditorSessionManager  ← B5
      │   │   ├── EditorSessionPill[]   ← B5
      │   │   └── TaskEditorSession (active)
      │   ├── StageCore (fills available width)  ← B2
      │   │   ├── KanbanView (density)  ← B3
      │   │   │   └── PhaseCard → ActionCard → TaskCard
      │   │   │       └── TaskReadOnlyPopup (independent)  ← B-CRD
      │   │   ├── WeeklyView → DayGridCard (Day readiness)  ← B11
      │   │   └── MonthlyView
      │   └── FocusIsland (applied + AND/OR)  ← B7
      └── Row 3:
          ├── SelectionIsland (presentation mode)  ← B6
          ├── KanbanBuilderIsland / TimelineBuilderIsland
          └── ViewContextIsland (undated+disabled task list)  ← B8
```
