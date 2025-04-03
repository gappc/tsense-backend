import sqlite3 from "sqlite3";

// Initialize the SQLite database
export const db = new sqlite3.Database("./db/sensor_data.db", (err) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

export const createTable = (tableName: string, createTableQuery: string) => {
  db.run(createTableQuery, (err) => {
    if (err) {
      console.error(`Error creating table "${tableName}"`, err.message);
    } else {
      console.log(`Table "${tableName}" created or already exists.`);
    }
  });
};
