export interface ClickUpEntryPayload {
  versionId: string;
  dcxId: string | null;
  sourceTaskId: string | null;
}

/**
 * @route GET /clickup/entry/:versionId
 */
export async function getClickUpEntryPayload(versionId: string): Promise<ClickUpEntryPayload> {
  return {
    versionId,
    dcxId: null,
    sourceTaskId: null,
  };
}
