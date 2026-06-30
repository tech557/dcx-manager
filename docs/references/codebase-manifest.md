# Codebase Manifest

_Auto-generated: 2026-06-25 | Regenerate: bash scripts/gen-manifest.sh_

## src/ — Overview

| Directory | Files | Lines (TS/TSX) | Purpose |
|---|---|---|---|
actions | 9 | 902 | Domain-action functions (create, update, move, delete) for phases/actions/tasks/nodes
brand | 23 | 91 | Theme config, design tokens, global CSS, font files
builder | 134 | 11985 | Core builder workspace: page shell, stage, islands, cards, drag-drop, focus, import
components | 44 | 3535 | Reusable UI components: forms, buttons, modals, feedback indicators
hooks | 4 | 226 | App-wide React hooks: autosave, permissions, preferences, theme
mock | 3 | 82 | Mock data for channels, compositions, subtask definitions
pages | 3 | 43 | Top-level route pages: RootLayout, HomePage, VersionPage
queries | 6 | 142 | TanStack Query hooks for builder, channels, subtask-defs, users, versions
rules | 6 | 312 | Business-rule pure functions: readiness, date, permissions, validation
services | 12 | 820 | API client abstraction, mappers, and per-domain service modules
store | 2 | 174 | Zustand stores: appStore (global), builderStore (builder state)
telemetry | 2 | 23 | Event-name constants and opt-in check
types | 8 | 497 | Domain model types, API DTOs, builder-node types, card types
ui | 12 | 638 | Low-level UI primitives: backgrounds, dividers, badges, motion, glass surfaces
utils | 8 | 417 | Pure utility functions: node helpers, date helpers, composition helpers

### Builder Sub-Directories (`src/builder/`)

| Sub-directory | Files | Lines (TS/TSX) | Purpose |
|---|---|---|---|
cards | 30 | 2733 | Card shell, drag helpers, registry, and card templates (Phase/Action/Task/Day)
dropzones | 3 | 203 | Drop-target components and registry
focus | 2 | 127 | Focus engine and useFocus hook
import | 3 | 310 | Import helpers and useImport hook
islands | 58 | 5088 | All builder islands (EditorViewer, Metadata, Focus, Selection, Kanban, etc.)
stage | 35 | 3206 | Stage core, provider, layout, views (Kanban/Timeline/Weekly/Monthly/Matrix)

## Key Exports by Directory

### `src/actions`

| File | Key exports |
|---|---|
`action.actions.ts` | interface CreateActionInput {,interface UpdateActionInput {,interface MoveActionInput {,function createDefaultAction(phaseId: string, orderIndex: number, input: CreateActionInput): ActionCardData {,function cloneAction(action: ActionCardData, phaseId: string, orderIndex: number): ActionCardData {
`action.guards.ts` | interface ActionGuardResult {,class ActionGuardError extends Error {,function canRunBuilderMutation(command: string): ActionGuardResult {,function assertCanRunBuilderMutation(command: string): void {
`action.helpers.ts` | const SYSTEM_USER_ID = 'mock-user';,function now(): string {,function renumberPhases(nodes: BuilderNode[]): BuilderNode[] {,function renumberActions(actions: ActionCardData[]): ActionCardData[] {,function renumberTasks(tasks: TaskCardData[]): TaskCardData[] {
`builder.actions.ts` | * from './phase.actions';,* from './action.actions';,* from './task.actions';,* from './node.actions';,const builderActions = {
`node.actions.ts` | interface DuplicateNodeInput {,interface ApplyImportInput {,const nodeActions = {
`phase.actions.ts` | interface CreatePhaseInput {,interface UpdatePhaseInput {,interface MovePhaseInput {,const phaseActions = {
`task.actions.ts` | interface CreateTaskInput {,interface UpdateTaskInput {,interface MoveTaskInput {,function createDefaultTask(actionId: string, orderIndex: number, input: CreateTaskInput): TaskCardData {,function cloneTask(task: TaskCardData, actionId: string, orderIndex: number): TaskCardData {
`useBuilderActions.ts` | function useBuilderActions() {
`version.actions.ts` | function updateVersionStatus(versionId: string, status: VersionStatus): Promise<Version> {,function updateVersionCommunicationDate(,function duplicateEditableVersion(versionId: string): Promise<Version> {

### `src/builder/cards`

| File | Key exports |
|---|---|
`CardShell.tsx` | function CardShell({
`CardShellContent.tsx` | function CardShellContent({
`FieldIndicator.tsx` | function FieldIndicator(: FieldIndicatorProps) {
`card.registry.ts` | const cardRegistry: Record<CardKind, CardConfig> = {,function getCardConfig(kind: CardKind): CardConfig {
`cardDrag.helpers.ts` | interface CardDragPayload {,function setActiveCardDragPayload(payload: CardDragPayload \| null): void {,function getActiveCardDragPayload(): CardDragPayload \| null {,function beginCardDrag(,function parseCardDragPayload(raw: string): CardDragPayload \| null {
`cardSelection.helpers.ts` | function getSelectionInfo(nodes: BuilderNode[], selectedIds: string[]): SelectionInfo {
`dragDropHelpers.ts` | interface ActionLocation {,function findActionLocation(nodes: BuilderNode[], actionId: string): ActionLocation \| null {,interface TaskLocation {,function findTaskLocation(nodes: BuilderNode[], taskId: string): TaskLocation \| null {,function findPhaseLocation(nodes: BuilderNode[], phaseId: string) {
`handleCardDrop.ts` | function handleCardDrop({
`useCardBehavior.ts` | type CardData = PhaseNodeData \| ActionCardData \| TaskCardData \| ;,interface CardBehaviorInput {,function useCardBehavior(: CardBehaviorInput) {
`useCardDrag.ts` | function useCardDrag(: UseCardDragOptions) {
`useCardEffects.ts` | function useCardEffects({

### `src/builder/stage`

| File | Key exports |
|---|---|
`StageCore.tsx` | function StageCore() {,function createStageRegistryEntry(view: ViewKind) {
`StageEdgeNavigation.tsx` | function StageEdgeNavigation({
`StageLayoutContract.ts` | const STAGE_LAYOUT_CONTRACT: Record<ViewKind, StageLayoutContractShape> = {,function getStageLayoutContract(view: ViewKind): StageLayoutContractShape {
`StageProvider.tsx` | function StageProvider(: StageProviderProps) {,function useStageContext(): StageContextValue {,function useOptionalStageContext(): StageContextValue \| null {
`stage.registry.ts` | interface StageViewRendererProps {,interface StageViewRegistryEntry {,const stageRegistry: Record<ViewKind, StageViewRegistryEntry> = {,function getStageRenderer(view: ViewKind): StageViewRegistryEntry {,const stageViewOrder: ViewKind[] = ['kanban', 'timeline', 'weekly', 'monthly'];
`stageContext.types.ts` | type PendingAction = PendingViewAction \| PendingSelectAction \| PendingFocusAction;,interface StageContextValue extends StageContext {
`useDragState.ts` | function useDragState() {
`useStageExpansion.ts` | function findParentId(nodes: BuilderNode[], nodeId: string): string \| null {,function useStageExpansion({
`useStageMovement.ts` | type StageEdge = 'top' \| 'right' \| 'bottom' \| 'left';,interface StageMovementState {,function getEdgeFromPoint(rect: DOMRect, x: number, y: number): StageEdge \| null {,function getTimelineOffstageNavigation(view: ViewKind, edge: StageEdge \| null): StageMovementState['offstageNavigation'] {,function useStageMovement(view: ViewKind = 'kanban') {
`useTaskReschedule.ts` | function useTaskReschedule(nodes: BuilderNode[]) {
`useWeekState.ts` | function useWeekState() {

### `src/hooks`

| File | Key exports |
|---|---|
`useAutosave.ts` | function useAutosave(versionId: string) {
`usePermissions.ts` | function usePermissions() {
`usePreferences.ts` | type ActiveSubView = 'weekly' \| 'monthly' \| 'matrix';,type UIPreferences = {,default function usePreferences(scope: PreferenceScope) {
`useTheme.ts` | function useTheme() {

### `src/rules`

| File | Key exports |
|---|---|
`date.rules.ts` | function resolveStoredTaskDate(date: TaskDate, communicatedDate: string \| null): string \| null {,function getTaskResolvedDate(task: Task, communicatedDate: string \| null): string \| null {,function getActionDateSpan(action: Action, communicatedDate: string \| null) {,function getPhaseDateSpan(phase: Phase, communicatedDate: string \| null) {
`lifecycle.rules.ts` | const ALLOWED_TRANSITIONS: Readonly<Record<VersionStatus, readonly VersionStatus[]>> = {,function canTransition(from: VersionStatus, to: VersionStatus): boolean {,function isVersionLocked(status: VersionStatus): boolean {,function isVersionEditable(status: VersionStatus): boolean {,function canApproveVersion(version: ): boolean {
`permissions.rules.ts` | interface PermissionContext {,interface PermissionResult {,function canReadDCX(context: PermissionContext): PermissionResult {,function canEditVersion(context: PermissionContext): PermissionResult {
`readiness.rules.ts` | interface ReadinessResult {,function getFieldReadiness(field: FieldCompletionState): ReadinessResult {,function getTaskReadiness(task: Task): ReadinessResult {,function getActionReadiness(action: Action): ReadinessResult {,function getPhaseReadiness(phase: Phase): ReadinessResult {
`validation.rules.ts` | interface ValidationResult {,function validatePhaseForReady(phase: Phase): ReadinessResult {,function validateVersionForReady(version: Version, phases: Phase[]): ValidationResult {,function validateVersionForApproval(version: Version): ValidationResult {

### `src/services`

| File | Key exports |
|---|---|
`access.service.ts` | interface MyAccess {,interface DCXAccess {,async function getMyAccess(): Promise<MyAccess> {,async function checkDCXAccess(dcxId: string): Promise<DCXAccess> {
`ai.service.ts` | interface AIReviewDraft {,async function createAIReviewDraft(prompt: string): Promise<AIReviewDraft> {
`api-client.ts` | interface ApiClientRequestOptions<TBody = unknown> {,interface ApiClientResponse<TData> {,function getMockStorageKey(key: string): string {,function readMockJson<T>(key: string, fallback: T): T {,function writeMockJson<T>(key: string, value: T): T {
`api-mappers.ts` | interface DomainBuilderTree {,function apiAssignedMemberToDomain(member: ApiAssignedMember): AssignedMember {,function domainAssignedMemberToApi(member: AssignedMember): ApiAssignedMember {,function apiFileAttachmentToDomain(file: ApiFileAttachment): FileAttachment {,function domainFileAttachmentToApi(file: FileAttachment): ApiFileAttachment {
`builder.service.ts` | async function getBuilder(versionId: string): Promise<ApiBuilderTree> {,async function saveBuilder(versionId: string, phases: ApiPhase[]): Promise<ApiBuilderTree> {
`channels.service.ts` | async function getChannels(): Promise<ApiChannel[]> {,async function getCompositions(channelId: string): Promise<ApiChannelComposition[]> {,async function createComposition(
`clickup.service.ts` | interface ClickUpEntryPayload {,async function getClickUpEntryPayload(versionId: string): Promise<ClickUpEntryPayload> {
`error-reporter.service.ts` | interface ErrorReportPayload {,async function reportError(payload: ErrorReportPayload): Promise<> {
`files.service.ts` | async function getVersionFiles(versionId: string): Promise<ApiFileAttachment[]> {,async function attachVersionFile(versionId: string, file: ApiFileAttachment): Promise<ApiFileAttachment> {
`logs.service.ts` | interface WriteLifecycleLogInput {,async function getActivityLogs(versionId: string): Promise<ApiActivityEvent[]> {,async function writeLifecycleLog(input: WriteLifecycleLogInput): Promise<ApiActivityEvent> {
`subtask-definitions.service.ts` | async function getSubtaskDefinitions(channelId?: string): Promise<ApiSubtaskDefinition[]> {
`versions.service.ts` | async function getVersions(dcxId: string): Promise<ApiVersion[]> {,async function getVersion(versionId: string): Promise<ApiVersion> {,async function updateStatus(versionId: string, status: VersionStatus): Promise<ApiVersion> {,async function updateVersionDate(versionId: string, date: string \| null): Promise<ApiVersion> {,async function duplicateVersion(sourceVersionId: string): Promise<ApiVersion> {

### `src/types`

| File | Key exports |
|---|---|
`api.ts` | type ApiJsonValue =,type ApiTaskDate =,interface ApiChannel {,interface ApiSubtaskDefinition {,interface ApiChannelComposition {
`builder-node.types.ts` | type BuilderNodeKind = 'phase' \| 'action' \| 'task';,interface BuilderNodeBase<TKind extends BuilderNodeKind, TData> {,interface TaskCardData extends Task {,interface ActionCardData extends Omit<Action, 'tasks'> {,interface PhaseNodeData extends Omit<Phase, 'actions'> {
`card.types.ts` | type CardKind = BuilderNodeKind \| 'day';,type CardCapability =,type MovementAxis = 'horizontal' \| 'vertical' \| 'free' \| 'none';,type ReadinessState = 'ready' \| 'blocked' \| 'incomplete' \| 'empty';,type ReadinessSource = 'self' \| 'children' \| 'fields' \| 'derived';
`domain.ts` | type JsonValue =,type ISODate = string;,type ISOTimestamp = string;,type TaskDate =,type FieldCompletionState =
`dropzone.types.ts` | type DropzoneTarget = 'stage' \| 'phase' \| 'action' \| 'task' \| 'day' \| 'edge';,type DropzoneEdge = 'top' \| 'right' \| 'bottom' \| 'left' \| null;,type DropCommand =,interface Dropzone {
`index.ts` | * from './api';,* from './builder-node.types';,* from './card.types';,* from './domain';,* from './dropzone.types';
`lifecycle.ts` | type VersionStatus =,type VersionSourceType = 'scratch' \| 'duplicate' \| 'import' \| 'template';,type LifecycleEventType =,const EDITABLE_VERSION_STATUSES: VersionStatus[] = ['Draft', 'In Progress'];,const LOCKED_VERSION_STATUSES: VersionStatus[] = [
`stage.types.ts` | type ViewKind = 'kanban' \| 'timeline' \| 'weekly' \| 'monthly';,interface StagePosition {,interface StageContext {,type StageSurfaceBehavior = 'push' \| 'float' \| 'filter' \| 'none';,interface StageLayoutContract {

### `src/ui`

| File | Key exports |
|---|---|
`DividerLine.tsx` | function DividerLine(: DividerLineProps) {
`LockBadge.tsx` | function LockBadge(: LockBadgeProps) {
`PopoverShell.tsx` | function PopoverShell({
`StatusBadge.tsx` | function StatusBadge(: StatusBadgeProps) {
`StickyPopupShell.tsx` | default function StickyPopupShell({
### `src/builder/islands/`

| Island / File | Key exports |
|---|---|
`AIChatPopup.tsx` | default function AIChatPopup(: ) {
`BuilderIslandShell.tsx` | interface BuilderIslandShellProps {,function BuilderIslandShell({
`ActionEditorSection.tsx` | function ActionEditorSection(: ActionEditorSectionProps) {
`DayEditorSection.tsx` | function DayEditorSection(: DayEditorSectionProps) {
`DiscardSessionModal.tsx` | function DiscardSessionModal(: DiscardSessionModalProps) {
`EditorHeader.tsx` | function EditorHeader({
`EditorSessionPill.tsx` | function EditorSessionPill(: {
`EditorViewerIsland.tsx` | function EditorViewerIsland() {
`PhaseEditorSection.tsx` | function PhaseEditorSection(: PhaseEditorSectionProps) {
`UnsavedChangesModal.tsx` | function UnsavedChangesModal({
`useActiveNode.ts` | function useActiveNode(focusedNodeId: string \| null, nodes: BuilderNode[]) {
`useDayEditorTasks.ts` | function useDayEditorTasks(activeNode:  \| null, nodes: BuilderNode[], anchorDateStr: string) {
`useEditorDraft.ts` | interface DayNode {,interface DayDraft {,type EditorDraftData = TaskCardData \| ActionCardData \| PhaseNodeData \| DayDraft;
`useEditorGuard.ts` | function useEditorGuard(handleSave: () => void, setIsEditorDirty: (dirty: boolean) => void) {
`useEditorPanel.ts` | function useEditorPanel() {
`useEditorReadiness.ts` | function useEditorReadiness(
`useTaskSectionReadiness.ts` | function useTaskSectionReadiness(
`FocusIsland.tsx` | function FocusIsland() {
`HeaderBrandIsland.tsx` | function HeaderBrandIsland(: HeaderBrandIslandProps) {
`HeaderUserActionsMenu.tsx` | function HeaderUserActionsMenu({
`HeaderUserIsland.tsx` | function HeaderUserIsland(: HeaderUserIslandProps) {
`KanbanBuilderIsland.tsx` | function KanbanBuilderIsland(: KanbanBuilderIslandProps) {
`CampaignDetailsGroup.tsx` | function CampaignDetailsGroup(: CampaignDetailsGroupProps) {
`MetadataDetailsContent.tsx` | function MetadataDetailsContent({
`MetadataFilesPopup.tsx` | function MetadataFilesPopup({
`MetadataIsland.tsx` | function MetadataIsland({
`MetadataModalsContainer.tsx` | function MetadataModalsContainer({
`StatusDropdownBadge.tsx` | function StatusDropdownBadge({
`ViewTabSwitcher.tsx` | function ViewTabSwitcher(: ViewTabSwitcherProps) {
`useFilePreview.ts` | type FileSession = {,function useFilePreview() {
`ReviewModal.tsx` | default function ReviewModal({
`DeleteConfirmation.tsx` | interface DeleteConfirmationProps {,function DeleteConfirmation(: DeleteConfirmationProps) {
`SelectionButtons.tsx` | interface SelectionButtonsProps {,function SelectionButtons({
`SelectionIsland.tsx` | function SelectionIsland() {
`SelectionLabel.tsx` | interface SelectionLabelProps {,function SelectionLabel({
`selection.utils.ts` | function getSelfAndDescendants(nodeIds: string[], allNodes: BuilderNode[]): string[] {
`usePresentationMode.ts` | function usePresentationMode() {
`CreateCompositionForm.tsx` | function CreateCompositionForm(: CreateCompositionFormProps) {
`Step1_SelectChannel.tsx` | function Step1SelectChannel(: Step1SelectChannelProps) {
`Step2_SelectComposition.tsx` | function Step2SelectComposition({
`Step3_ReviewSubtasks.tsx` | function Step3ReviewSubtasks({
`TaskCreationFlow.tsx` | function TaskCreationFlow(: TaskCreationFlowProps) {
`useTaskCreationFlow.ts` | type TaskCreationStep = 'channel' \| 'composition' \| 'review';,function useTaskCreationFlow() {
`TemplatePopup.tsx` | default function TemplatePopup(: ) {
`TimelineBuilderIsland.tsx` | function TimelineBuilderIsland(: TimelineBuilderIslandProps) {
`ViewContextTaskItem.tsx` | function ViewContextTaskItem(: ViewContextTaskItemProps) {
`ViewContextTaskList.tsx` | function ViewContextTaskList() {
`ViewHelperIsland.tsx` | function ViewHelperIsland() {
`useViewHelper.ts` | function useViewHelper() {
`useViewHelperScrollers.ts` | function useViewHelperScrollers() {
`island.registry.ts` | type IslandScope = 'global' \| 'view-limited' \| 'view-specific';,interface IslandRegistryEntry {,const islandRegistry: Record<string, IslandRegistryEntry> = {


# MANUAL:
# Add or edit annotations below this line. They are preserved across regeneration.
# Do not edit anything above this line — it is auto-generated.

## Manual Annotations

### actions/
- All mutations go through useBuilderActions() — never call setNodes from cards/islands/stage
- action.guards.ts enforces permission checks before mutations

### builder/cards/
- Card templates never import from src/rules/ — use useCardBehavior()
- Card templates never import from src/services/
- card.registry.ts is the extension point for new card types

### builder/islands/
- EditorViewerIsland pushes stage (stage narrows when editor opens)
- FocusIsland filters visibility — does not move anything
- SelectionIsland bounded by maxWidth: 420px
- ViewHelperIsland uses position: fixed for overflow

### builder/stage/
- StageProvider is stage-level state only — island state must not live in stage context
- stage.registry.ts maps ViewKind -> renderer
- StageCore is the single render entry point

### hooks/
- useAutosave calls domainPhasesToApi() mapper — do not regress

### rules/
- readiness.rules.ts is the single source of readiness — never compute readiness in UI

### services/
- api-mappers.ts is the mandatory mapping layer — never pass domain types to services with as any

### types/
- Never create src/types.ts — import from src/types/index.ts

### ui/
- effects.registry.ts is the only animation entry point — never create parallel animation systems
