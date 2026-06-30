import { withServiceErrorHandler } from './service-utils';

export interface AIReviewDraft {
  id: string;
  summary: string;
  proposedActions: unknown[];
}

/**
 * @route POST /ai/review-draft
 */
export const createAIReviewDraft = withServiceErrorHandler('createAIReviewDraft', async (prompt: string): Promise<AIReviewDraft> => {
  return {
    id: 'mock-ai-draft',
    summary: `Seed-only AI draft for: ${prompt}`,
    proposedActions: [],
  };
});
