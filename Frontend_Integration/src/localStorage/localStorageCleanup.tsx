import localforage from 'localforage';

export const cleanupLocalStorage = async () => {
  await localforage.clear();
  return true;
};
