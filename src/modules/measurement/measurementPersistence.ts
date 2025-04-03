import sqlite3 from "sqlite3";
import {
  MeasurementDataInsertSchema,
  MeasurementDataResponse,
  MeasurementDataResponseSchema,
} from "./measurementSchema";
import { createTable, db } from "../../persistence/db";

const tableName = "measurement";

// Create the table if it doesn't exist
const initPersistence = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mac TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        temperature REAL NOT NULL,
        humidity INTEGER NOT NULL
    );
  `;

  createTable(tableName, createTableQuery);
};

// Get all measurements from the database and validate the response using Zod
export const getAllMeasurements = (): Promise<MeasurementDataResponse[]> => {
  return new Promise<MeasurementDataResponse[]>((resolve, reject) => {
    const selectQuery =
      "SELECT id, mac, timestamp, temperature as t, humidity as h FROM measurement limit 10";
    const measurements: MeasurementDataResponse[] = [];

    db.each(
      selectQuery,
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          const parsed = MeasurementDataResponseSchema.safeParse(row);
          if (!parsed.success) {
            reject(new Error("Invalid data format in the database"));
          } else {
            measurements.push(parsed.data);
          }
        }
      },
      () => {
        resolve(measurements);
      }
    );
  });
};

// Insert measurement data into the database
export const insertMeasurementData = async (data: unknown) => {
  // Validate the incoming data using Zod and throw an error if it doesn't match the schema
  const result = MeasurementDataInsertSchema.parse(data);

  const { mac, t, h } = result;
  const timestamp = new Date().toISOString();

  return new Promise<number>((resolve, reject) => {
    const query = `
      INSERT INTO ${tableName} (mac, timestamp, temperature, humidity) 
      VALUES (?, ?, ?, ?)
    `;
    db.run(
      query,
      [mac.toUpperCase(), timestamp, t, h],
      function (this: sqlite3.RunResult, err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
};

// Initialize the database and create the table
initPersistence();
