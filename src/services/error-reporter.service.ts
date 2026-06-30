export interface ErrorReportPayload {
  message: string;
  context: string;
  failedPayload?: unknown;
}

/**
 * @route POST /error-reports
 */
export async function reportError(payload: ErrorReportPayload): Promise<{ reported: true }> {
  console.error('[mock error report]', payload);
  return { reported: true };
}
