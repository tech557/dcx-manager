# Builder — Current Architecture (v0.3.2)

## Component Hierarchy

```
BuilderPage
  ├── BuilderLoadingShell
  ├── StageProvider
  │   ├── useDragState
  │   ├── useWeekState
  │   ├── useStageExpansion
  │   └── useTaskReschedule
  └── BuilderWorkspaceContent
      ├── Row 1: MetadataIsland
      │   ├── HeaderBrandIsland
      │   ├── MetadataDetailsContent
      │   │   ├── CampaignDetailsGroup
      │   │   ├── StatusDropdownBadge
      │   │   ├── CommunicationDateField
      │   │   ├── ViewTabSwitcher
      │   │   └── MetadataFilesPopup (BLD-FIL)
      │   └── HeaderUserIsland
      ├── Row 2:
      │   ├── EditorViewerIsland (multi-session)
      │   │   ├── useEditorPanel
      │   │   ├── useEditorDraft
      │   │   ├── useEditorGuard
      │   │   ├── EditorHeader
      │   │   ├── PhaseEditorSection
      │   │   ├── ActionEditorSection
      │   │   ├── DayEditorSection
      │   │   └── TaskEditor/
      │   ├── StageCore
      │   │   ├── stage.registry → KanbanView / WeeklyView / MonthlyView
      │   │   └── StageEdgeNavigation
      │   └── FocusIsland
      └── Row 3:
          ├── SelectionIsland
          ├── KanbanBuilderIsland / TimelineBuilderIsland
          └── ViewHelperIsland
```

## Known Issues (all resolved)

| Issue | Sprint | Status |
|---|---|---|
| Loading state was text placeholder | B1 | ✅ Resolved — BuilderLoadingShell renders loading UI |
| isFocusIslandExpanded in StageProvider | B0 | ✅ Resolved — moved to FocusIsland local state |
| isEditorDirty in StageProvider | B0 | ✅ Resolved — moved to useEditorDraft |
| Editor was single-session only | B5 | ✅ Resolved — multi-session with useEditorSessions |
| ViewHelperIsland wrong product | B-FIL + B8 | ✅ Resolved — View Context now in correct island |
| File preview in wrong island | B-FIL | ✅ Resolved — files popup in MetadataIsland |
| No Task read-only popup | B-CRD | ✅ Resolved — TaskReadOnlyPopup implemented |
| No long-press detection | B-CRD | ✅ Resolved — long-press triggers expanded state |
| No presentation mode | B6 | ✅ Resolved — PresentationMode isolates focused content |
| Stage max-width fixed at 1280px | B2 | ✅ Resolved — stage uses dynamic width |
