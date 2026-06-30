import { Megaphone, Sparkles, Rocket, TrendingUp, Wrench } from 'lucide-react';
import type { ApiPhaseIconType } from '@/types/api';

export const PHASE_ICONS: Record<ApiPhaseIconType, React.ComponentType<{ size?: number; className?: string }>> = {
  awareness: Megaphone,
  teaser:    Sparkles,
  launch:    Rocket,
  scale:     TrendingUp,
  maintenance: Wrench,
};
