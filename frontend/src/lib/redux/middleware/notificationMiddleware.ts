import { Middleware } from '@reduxjs/toolkit';
import { removeNotification } from '../slices/notificationSlice';

// Middleware to handle notification auto-removal with setTimeout
export const notificationMiddleware: Middleware = (store) => (next) => (action: any) => {
  const result = next(action);

  // Handle addNotification action
  if (action.type === 'notification/addNotification') {
    const { duration = 3000 } = action.payload;
    const notifications = store.getState().notification.notifications;
    const lastNotification = notifications[notifications.length - 1];

    if (duration > 0 && lastNotification) {
      setTimeout(() => {
        store.dispatch(removeNotification(lastNotification.id));
      }, duration);
    }
  }

  return result;
};
