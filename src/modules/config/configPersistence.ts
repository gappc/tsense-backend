import { createTable, db } from "../../persistence/db";

const tableName = "config";

// Create the table if it doesn't exist
const initPersistence = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        value TEXT NOT NULL
    );
  `;

  createTable(tableName, createTableQuery);
};

export const getConfigForName = async (
  name: string
): Promise<string | null> => {
  return new Promise<string | null>((resolve, reject) => {
    const query = `SELECT value FROM ${tableName} WHERE name = ?`;
    db.get<{ value: string }>(query, [name], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row?.value ?? null);
      }
    });
  });
};

initPersistence();
