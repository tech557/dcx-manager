// Telemetry event name registry — seeds event names but does not send any data in MVP.
export const TelemetryEvents = {
  AI_CHAT_OPENED: 'ai.chat.opened',
  AI_SUGGESTION_PREVIEWED: 'ai.suggestion.previewed',
  TEMPLATE_POPUP_OPENED: 'template.popup.opened',
  TEMPLATE_PREVIEWED: 'template.previewed',
  TEMPLATE_APPLY_REQUESTED: 'template.apply.requested',
  TELEMETRY_OPT_IN: 'telemetry.opt_in',
} as const;

export type TelemetryEventName = typeof TelemetryEvents[keyof typeof TelemetryEvents];
