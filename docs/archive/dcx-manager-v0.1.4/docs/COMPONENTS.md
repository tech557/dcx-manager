# Shared UI and Form Components Library

This catalog is a comprehensive api reference card representing both generic visual primitives (`src/components/ui/`) and functional campaign forms (`src/components/forms/`).

---

## Shared UI Primitives (`src/components/ui/`)

### 1. GlassCard
* **File Path:** `src/components/ui/GlassCard.tsx`
* **Props Interface:**
  ```typescript
  interface GlassCardProps {
    children: React.ReactNode;
    isDark: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    radius?: 'none' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    className?: string;
  }
  ```
* **When to use it:** Wrap generic modules, data grids, search panels, detail sidebars, and control forms to group content with visual depth and elevation.
* **When NOT to use it:** Avoid using it to wrap tiny inline elements, or when full native transparency is required without background blurring.
* **Example Usage Snippet:**
  ```tsx
  <GlassCard isDark={isDark} padding="md" radius="xl" className="hover:-translate-y-1">
    <h3>Content Details</h3>
  </GlassCard>
  ```

---

### 2. StatusBadge
* **File Path:** `src/components/ui/StatusBadge.tsx`
* **Props Interface:**
  ```typescript
  interface StatusBadgeProps {
    status: VersionStatus;
    isDark: boolean;
  }
  ```
* **When to use it:** To represent the workflow phase of a version workspace or campaign object (e.g. "Draft", "In Progress", "Ready for Review").
* **When NOT to use it:** Avoid using it for custom non-workflow parameters, or as interactive buttons. Use simple badges or styled elements instead.
* **Example Usage Snippet:**
  ```tsx
  <StatusBadge status="Ready for Review" isDark={isDark} />
  ```

---

### 3. FileTag
* **File Path:** `src/components/ui/FileTag.tsx`
* **Props Interface:**
  ```typescript
  interface FileTagProps {
    title: string;
    url: string;
    isDark: boolean;
    onRemove?: () => void;
  }
  ```
* **When to use it:** Display small drive attachments inline with remove capability for lists.
* **When NOT to use it:** Avoid using it for structural categories, tags or normal taxonomy.
* **Example Usage Snippet:**
  ```tsx
  <FileTag title="Campaign Brief" url="https://drive.google.com/..." isDark={isDark} />
  ```

---

### 4. AvatarStack
* **File Path:** `src/components/ui/AvatarStack.tsx`
* **Props Interface:**
  ```typescript
  interface AvatarStackProps {
    users: User[];
    isDark: boolean;
    limit?: number;
  }
  ```
* **When to use it:** Summarizing assigned collaborators inline inside list widgets or project cards cleanly without wasting horizontal layout space.
* **When NOT to use it:** Avoid using it when users need to perform full details inspection immediately on-click.
* **Example Usage Snippet:**
  ```tsx
  <AvatarStack users={assignedCrewList} isDark={isDark} limit={3} />
  ```

---

### 5. IslandCard
* **File Path:** `src/components/ui/IslandCard.tsx`
* **Props Interface:**
  ```typescript
  interface IslandCardProps {
    children: React.ReactNode;
    isDark: boolean;
    isActive?: boolean;
    className?: string;
  }
  ```
* **When to use it:** Styling floating control islands or interactive panel sheets in the builder workspace.
* **When NOT to use it:** Standard content lists and simple stat displays.
* **Example Usage Snippet:**
  ```tsx
  <IslandCard isDark={isDark} isActive={true}>
    <p>Floating Controller Actions</p>
  </IslandCard>
  ```

---

## Form Actions & Input Controls (`src/components/forms/`)

### 1. BrandedTextInput
* **File Path:** `src/components/forms/BrandedTextInput.tsx`
* **Props Interface:**
  ```typescript
  interface BrandedTextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    isDark: boolean;
    label?: string;
    id?: string;
    className?: string;
  }
  ```
* **When to use it:** Capturing short strings, emails, single digits or text keys across campaign wizards.
* **When NOT to use it:** Large text notes or documents draft copywriting (prefer Textarea).
* **Example Usage Snippet:**
  ```tsx
  <BrandedTextInput isDark={isDark} label="Sequence Code" placeholder="e.g. V3" />
  ```

---

### 2. BrandedSelect
* **File Path:** `src/components/forms/BrandedSelect.tsx`
* **Props Interface:**
  ```typescript
  interface BrandedSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    isDark: boolean;
    label?: string;
    id?: string;
    options: { value: string; label: string }[];
    className?: string;
  }
  ```
* **When to use it:** Picking structural values such as channels, priorities or roles out of pre-configured choices tables.
* **When NOT to use it:** Selecting collaborators dynamically with custom nested cards UI.
* **Example Usage Snippet:**
  ```tsx
  <BrandedSelect
    isDark={isDark}
    label="Assign Channel"
    options={[{ value: "ch-1", label: "Slack" }]}
  />
  ```

---

### 3. CreateDCXForm
* **File Path:** `src/components/forms/CreateDCXForm.tsx`
* **Props Interface:**
  ```typescript
  interface CreateDCXFormProps {
    isDark: boolean;
    onSubmit: (newVersion: EnrichedVersion) => void;
    onCancel: () => void;
    versions: EnrichedVersion[];
  }
  ```
* **When to use it:** Standard form embedded inside launchers or popups to execute project registration from scratch.
* **When NOT to use it:** Modifying a specific version sequence that has already been created (use `EditVersionForm` instead).
* **Example Usage Snippet:**
  ```tsx
  <CreateDCXForm
    isDark={isDark}
    versions={allVersions}
    onSubmit={handleCreate}
    onCancel={closePopup}
  />
  ```

---

### 4. EditVersionForm
* **File Path:** `src/components/forms/EditVersionForm.tsx`
* **Props Interface:**
  ```typescript
  interface EditVersionFormProps {
    isDark: boolean;
    version: EnrichedVersion;
    onSubmit: (updated: EnrichedVersion) => void;
    onCancel: () => void;
    id?: string;
  }
  ```
* **When to use it:** Underneath edit dialogs to re-assign teammates, attach Google Drive items, or adjust sequence identifiers for an active sandbox workspace.
* **When NOT to use it:** Spawning entirely new clients or initiating non-existing portfolios.
* **Example Usage Snippet:**
  ```tsx
  <EditVersionForm
    isDark={isDark}
    version={selectedVersion}
    onSubmit={handleUpdate}
    onCancel={closeEditor}
  />
  ```
