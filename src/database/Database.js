import { openDatabase } from 'expo-sqlite';
console.log("openDatabase is:", openDatabase); // ✅ deve mostrar function

const db = openDatabase('app.db');
export const initDB = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, sincronizado INTEGER);',
        [],
        () => resolve(),
        (_, err) => reject(err)
      );
    });
  });
};

export const insertUsuario = (nome, email) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO usuarios (nome, email, sincronizado) VALUES (?, ?, 0);',
        [nome, email],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const getUsuariosNaoSincronizados = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM usuarios WHERE sincronizado = 0;',
        [],
        (_, { rows }) => resolve(rows._array),
        (_, err) => reject(err)
      );
    });
  });
};

export const marcarComoSincronizado = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE usuarios SET sincronizado = 1 WHERE id = ?;',
        [id],
        () => resolve(),
        (_, err) => reject(err)
      );
    });
  });
};
