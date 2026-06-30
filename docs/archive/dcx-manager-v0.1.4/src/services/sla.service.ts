export interface SlaTaskRecommendation {
  label: string;
  duration: string;
}

const SLA_RECOMMENDATIONS: Record<string, SlaTaskRecommendation[]> = {
  "ch-1": [ // Slack Workplace
    { label: "Draft Slack message body", duration: "1 hr" },
    { label: "Design custom Slack header image", duration: "1.5 hrs" },
    { label: "Verify Slack webhook delivery integrations", duration: "0.5 hrs" },
  ],
  "ch-2": [ // Direct Email
    { label: "Draft HTML email body", duration: "2 hrs" },
    { label: "Proofread and test internal links", duration: "0.5 hrs" },
    { label: "A/B subject line check", duration: "1 hr" },
  ],
  "ch-3": [ // Microsoft Teams
    { label: "Format Teams adaptive card layout", duration: "2 hrs" },
    { label: "Test desktop vs mobile notifications formatting", duration: "1 hr" },
  ],
  "ch-4": [ // WhatsApp Business
    { label: "Draft short marketing copy under 160 characters", duration: "0.5 hrs" },
    { label: "Approve WhatsApp template with Meta Business Manager", duration: "2.5 hrs" },
  ],
  "ch-5": [ // In-App Notification
    { label: "Define triggering logic rules", duration: "1.5 hrs" },
    { label: "Mock layout and copy variables", duration: "1 hr" },
  ],
  "ch-6": [ // SMS Gateway
    { label: "Draft SMS copy and shortlinks", duration: "0.5 hrs" },
    { label: "Validate SMS compliance regulations", duration: "1.5 hrs" },
  ]
};

export const slaService = {
  /**
   * Generates recommended subtask checklists and recommended operational durations (SLA metrics)
   * for a target communication channel.
   *
   * @route GET /api/v1/channels/:channelId/sla
   * @param channelId Unique identifier of the selected channel (e.g., "ch-1" for Slack)
   * @access General Authenticated User
   * @response Array<SlaTaskRecommendation> matching the specific operational tasks for that channel
   */
  async getSlaRecommendations(channelId: string): Promise<SlaTaskRecommendation[]> {
    // Simulate slight backend response delay
    await new Promise((resolve) => setTimeout(resolve, 150));
    return SLA_RECOMMENDATIONS[channelId] || [];
  }
};
