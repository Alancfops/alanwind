import { useSyncExternalStore } from 'react';
import {
  Appearance,
  Dimensions,
  Platform,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import {
  getSchemeChoice,
  type SchemeChoice,
  subscribeToSchemeChoice,
} from './forced-scheme';
import { screenBandFor } from './screen-band';
import type { ResolutionContext } from './types';

// R5: only `ios`, `android` and `web` exist in the IR; `react-native-web`
// reports `web`.
function platformOf(): ResolutionContext['platform'] {
  return Platform.OS === 'ios' || Platform.OS === 'android'
    ? Platform.OS
    : 'web';
}

function schemeOf(
  choice: SchemeChoice,
  system: string | null | undefined,
): ResolutionContext['scheme'] {
  if (choice !== 'system') return choice;
  return system === 'dark' ? 'dark' : 'light';
}

function buildContext(
  scheme: ResolutionContext['scheme'],
  window: ResolutionContext['window'],
): ResolutionContext {
  return {
    scheme,
    band: screenBandFor(window.width),
    platform: platformOf(),
    window: { width: window.width, height: window.height },
  };
}

/** Current context, read once; it does not react to later changes (R40). */
export function readResolutionContext(): ResolutionContext {
  return buildContext(
    schemeOf(getSchemeChoice(), Appearance.getColorScheme()),
    Dimensions.get('window'),
  );
}

/** Current context; re-renders when the scheme or the window change (R6). */
export function useResolutionContext(): ResolutionContext {
  const choice = useSyncExternalStore(subscribeToSchemeChoice, getSchemeChoice);
  const system = useColorScheme();
  const window = useWindowDimensions();
  return buildContext(schemeOf(choice, system), window);
}
