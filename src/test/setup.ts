import '@testing-library/jest-dom';

// Node 25+ ships its own `localStorage` global, which is undefined unless
// `--localstorage-file` is passed and shadows jsdom's Storage. Restore jsdom's
// (Vitest exposes the JSDOM instance as `globalThis.jsdom`).
const jsdomInstance = (globalThis as typeof globalThis & { jsdom?: { window: Window } }).jsdom;
if (typeof localStorage === 'undefined' && jsdomInstance) {
  Object.defineProperty(globalThis, 'localStorage', {
    value: jsdomInstance.window.localStorage,
    configurable: true,
    writable: true,
  });
}

if (typeof window !== 'undefined' && !window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = () => {};
}
