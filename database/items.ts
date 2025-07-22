import { openDatabase, SQLResultSet } from 'expo-sqlite';

const db = openDatabase('app.db');

export const initItemsTable = () => {
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY NOT NULL, title TEXT, imagePath TEXT, synced INTEGER);',
        [],
        () => resolve(),
        (_, err) => reject(err)
      );
    });
  });
};

export const upsertItem = (item: { id: number; title: string; imagePath: string | null; synced: number }) => {
  return new Promise<SQLResultSet>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT OR REPLACE INTO items (id, title, imagePath, synced) VALUES (?, ?, ?, ?);',
        [item.id, item.title, item.imagePath, item.synced],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const getAllItems = () => {
  return new Promise<any[]>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM items ORDER BY id;',
        [],
        (_, { rows }) => resolve(rows._array),
        (_, err) => reject(err)
      );
    });
  });
};

export const getPendingItems = () => {
  return new Promise<any[]>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM items WHERE synced = 0;',
        [],
        (_, { rows }) => resolve(rows._array),
        (_, err) => reject(err)
      );
    });
  });
};

export const markItemSynced = (id: number) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE items SET synced = 1 WHERE id = ?;',
        [id],
        () => resolve(),
        (_, err) => reject(err)
      );
    });
  });
};
