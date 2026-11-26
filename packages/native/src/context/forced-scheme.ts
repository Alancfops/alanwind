// R3, D162: the forced scheme is alanwind's own state, equal on iOS, Android
// and web. It never goes through `Appearance.setColorScheme`.

export type SchemeChoice = 'light' | 'dark' | 'system';

type Listener = () => void;

let choice: SchemeChoice = 'system';
const listeners = new Set<Listener>();

export function setColorScheme(next: SchemeChoice): void {
  if (next === choice) return;
  choice = next;
  for (const listener of listeners) listener();
}

export function getSchemeChoice(): SchemeChoice {
  return choice;
}

export function subscribeToSchemeChoice(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
