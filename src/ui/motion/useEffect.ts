import {
  effectsRegistry,
  reducedEffectsRegistry,
  type EffectMotionProps,
  type EffectName,
} from './effects.registry';

export function useEffect(
  name: EffectName,
  active: boolean,
  reduced = false,
): EffectMotionProps {
  if (!active) {
    return {};
  }

  return reduced ? reducedEffectsRegistry[name] : effectsRegistry[name];
}
