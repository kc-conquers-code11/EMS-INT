import { LOCAL_AUTH_STORAGE_KEY } from './constants';
import localforage from 'localforage';
import type { AuthUser } from '../types/auth.types';

export const saveAuthUser = async (user: AuthUser): Promise<AuthUser> => {
  try {
    await localforage.setItem(LOCAL_AUTH_STORAGE_KEY, user);
    return user;
  } catch (error) {
    console.error('Error in saveAuthUser:', error);
    throw new Error('Failed to save authenticated user to storage.');
  }
};

export const getAuthUser = async (): Promise<AuthUser | null> => {
  try {
    const user: AuthUser | null = await localforage.getItem(LOCAL_AUTH_STORAGE_KEY);
    return user;
  } catch (error) {
    console.error('Error in getAuthUser:', error);
    return null;
  }
};

export const clearAuthUser = async (): Promise<void> => {
  try {
    await localforage.removeItem(LOCAL_AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Error in clearAuthUser:', error);
    throw new Error('Failed to clear authenticated user from storage.');
  }
};
