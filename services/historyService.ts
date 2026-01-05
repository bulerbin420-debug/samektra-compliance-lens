import { AnalysisResult, HistoryItem } from '../types';

const DB_NAME = 'SamektraDB';
const STORE_NAME = 'history';
const DB_VERSION = 1;
const MAX_HISTORY_ITEMS = 20;

// Open the IndexedDB database
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    //Check for support
    if (!('indexedDB' in window)) {
        reject(new Error("IndexedDB not supported"));
        return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("IndexedDB error:", request.error);
      reject(request.error);
    };

    request.onsuccess = (event) => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // Create object store with 'id' as key
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

// Get all history items sorted by date (newest first)
export const getHistory = async (): Promise<HistoryItem[]> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const items = request.result as HistoryItem[];
        // Sort in memory (newest first)
        items.sort((a, b) => b.timestamp - a.timestamp);
        resolve(items);
      };

      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Failed to load history from DB", error);
    return [];
  }
};

// Save a new scan and enforce limit
export const saveScan = async (result: AnalysisResult, image: string): Promise<HistoryItem[]> => {
  try {
    const db = await openDB();
    
    const newItem: HistoryItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      image: image,
      result: result
    };

    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const addRequest = store.add(newItem);

      addRequest.onsuccess = () => {
        // Enforce limit: Get all keys, if > MAX, delete oldest
        // Note: Using a separate cursor or getAllKeys would be more efficient for huge datasets,
        // but for 20 items, getAll is fine.
        const getAllRequest = store.getAll();
        getAllRequest.onsuccess = () => {
             const items = getAllRequest.result as HistoryItem[];
             if (items.length > MAX_HISTORY_ITEMS) {
                 // Sort ascending to find oldest
                 items.sort((a, b) => a.timestamp - b.timestamp);
                 const itemsToDelete = items.slice(0, items.length - MAX_HISTORY_ITEMS);
                 
                 itemsToDelete.forEach(item => {
                     store.delete(item.id);
                 });
             }
        };
      };

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });

    return await getHistory();
  } catch (error) {
    console.error("Failed to save scan to DB", error);
    // Return existing history if save fails so app doesn't crash
    return await getHistory();
  }
};

export const clearHistory = async (): Promise<void> => {
  try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
          const transaction = db.transaction(STORE_NAME, 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          const request = store.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
      });
  } catch (e) {
      console.error("Failed to clear history", e);
  }
};