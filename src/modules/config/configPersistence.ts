import { db } from "../../persistence/db";

// Create the table if it doesn't exist
const createTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS config (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        value TEXT NOT NULL
    );
  `;

  db.run(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating table", err.message);
    } else {
      console.log("Table created or already exists.");
    }
  });
};
export const getConfig = async (name: string): Promise<string | null> => {
  return new Promise<string | null>((resolve, reject) => {
    const query = "SELECT value FROM config WHERE name = ?";
    db.get<{ value: string }>(query, [name], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.value);
      }
    });
  });
};

createTable();
