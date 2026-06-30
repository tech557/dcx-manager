import { readPreference, writePreference } from '@/utils/preference.helpers';
import type { PreferenceScope } from '@/utils/preference.helpers';

const PREF_NAME = 'telemetry.opt_in';

export function readTelemetryOptIn(scope: PreferenceScope): boolean {
  return readPreference<boolean>(scope, PREF_NAME, false);
}

export function writeTelemetryOptIn(scope: PreferenceScope, value: boolean): void {
  writePreference<boolean>(scope, PREF_NAME, !!value);
}
