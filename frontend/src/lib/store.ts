// This project uses Redux Toolkit for state management.
// See: @/lib/redux/store.ts for the store configuration
// See: @/lib/redux/slices/ for auth, theme, and notification slices
// See: @/lib/redux/hooks.ts for useAppSelector and useAppDispatch hooks

export { store, persistor } from './redux/store';
export type { RootState, AppDispatch } from './redux/store';
export { useAppSelector, useAppDispatch } from './redux/hooks';
