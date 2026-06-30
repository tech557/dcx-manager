import { EnrichedVersion, PhaseData, VersionStatus } from "../types";
import { getEnrichedVersions } from "../mock/versions";

const STORAGE_KEY = "dcx_versions";

// Check and seed initial data
const getStoredVersions = (): EnrichedVersion[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse dcx_versions in service", e);
      }
    }
    // Seed and write
    const initial = getEnrichedVersions();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return [];
};

export const versionsService = {
  /**
   * Fetches all registered enriched campaign version environments.
   *
   * @route GET /api/v1/versions
   * @access Authenticated (All workspace users)
   * @response Array<EnrichedVersion> complete list representing active sequences
   */
  getVersions: async (): Promise<EnrichedVersion[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredVersions());
      }, 350);
    });
  },

  /**
   * Retrieves specific enriched version details by unique identity code.
   *
   * @route GET /api/v1/versions/:id
   * @param id Clean string identifier representing the active version (e.g., "v-1")
   * @access Authenticated (Granted members holding project visibility key)
   * @response EnrichedVersion | undefined matching environment details or undefined
   */
  getVersionById: async (id: string): Promise<EnrichedVersion | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = getStoredVersions();
        resolve(list.find((v) => v.id === id));
      }, 200);
    });
  },

  /**
   * Performs an update of general version metadata properties (e.g., sequence, files, crew list).
   *
   * @route PUT /api/v1/versions/:id
   * @param updated EnrichedVersion payload containing modified properties
   * @access High-privilege Authenticated (Assigned campaign staff only)
   * @response EnrichedVersion the updated object confirming persistence
   */
  updateVersion: async (updated: EnrichedVersion): Promise<EnrichedVersion> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = getStoredVersions();
        const updatedList = list.map((v) => (v.id === updated.id ? updated : v));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
        resolve(updated);
      }, 400);
    });
  },

  /**
   * Patches the comprehensive phase-action-task relational sub-tree in a single transactional payload.
   * Leverages debounce-throttled visual auto-save updates.
   *
   * @route PATCH /api/v1/versions/:id/phases
   * @param id Unique target version identifier
   * @param phases Complete PhaseData collection tree
   * @access Authorized workspace strategist or designer
   * @response EnrichedVersion the patched version holding restructured phases
   */
  patchVersionPhases: async (id: string, phases: PhaseData[]): Promise<EnrichedVersion> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const list = getStoredVersions();
        const found = list.find((v) => v.id === id);
        if (!found) {
          reject(new Error(`Version with ID ${id} not found`));
          return;
        }
        const updated: EnrichedVersion = {
          ...found,
          phases,
          lastUpdatedAt: new Date().toISOString().split("T")[0],
        };
        const updatedList = list.map((v) => (v.id === id ? updated : v));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
        resolve(updated);
      }, 600); // realistic saving latency
    });
  },

  /**
   * Initializes a brand-new campaign sequence sandbox.
   *
   * @route POST /api/v1/versions
   * @param version Prepared EnrichedVersion payload
   * @access Authenticated personnel
   * @response EnrichedVersion the freshly created campaign version
   */
  createVersion: async (version: EnrichedVersion): Promise<EnrichedVersion> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = getStoredVersions();
        const updatedList = [version, ...list];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
        resolve(version);
      }, 300);
    });
  },

  /**
   * Updates safety staging workflow status flags of a target version workspace.
   *
   * @route PATCH /api/v1/versions/:id/status
   * @param id Target version identifier to alter
   * @param status Next workflow status enum ('Draft' | 'In Progress' | 'Ready for Review' | 'Approved' etc.)
   * @access Higher-authority personnel or coordinator
   * @response EnrichedVersion the version with updated status tag
   */
  updateVersionStatus: async (id: string, status: VersionStatus): Promise<EnrichedVersion> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const list = getStoredVersions();
        const found = list.find((v) => v.id === id);
        if (!found) {
          reject(new Error(`Version with ID ${id} not found`));
          return;
        }
        const updated: EnrichedVersion = {
          ...found,
          status,
          lastUpdatedAt: new Date().toISOString().split("T")[0],
        };
        const updatedList = list.map((v) => (v.id === id ? updated : v));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
        resolve(updated);
      }, 300);
    });
  },
};
