/**
 * Island header micro-label — Gilroy (sans) Light, small caps, wide tracking.
 * Shared by the metadata island's campaign / status / launch-window / files labels
 * so every caption in the header pill reads as one lightweight, cohesive group.
 * Values (status, date, counts) keep their own weight — this is for LABELS only.
 */
// Pinned to Gilroy explicitly: the Tailwind `font-sans` token resolves to Geist in this
// theme, so `font-[family-name:Gilroy]` is what actually yields Gilroy Light (weight 300).
export const ISLAND_LABEL_CLASS =
  'font-[family-name:Gilroy] text-dcx-4xs font-light uppercase tracking-[0.16em] text-neutral-400/70 leading-none';
