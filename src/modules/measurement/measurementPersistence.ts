import sqlite3 from "sqlite3";
import { createTable, db } from "../../persistence/db";
import {
  MeasurementInsertResponse,
  MeasurementInsertSchema,
  MeasurementQuerySchema,
  MeasurementResponseSchema,
} from "./measurementSchema";

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
export const getAllMeasurements = (
  queryParams: unknown
): Promise<MeasurementInsertResponse[]> => {
  const { startTime, endTime, macAddress, limit, offset } =
    MeasurementQuerySchema.parse(queryParams);

  let selectQuery =
    "SELECT id, mac, timestamp, temperature as t, humidity as h FROM measurement";

  // Array to hold dynamic query parameters
  const queryParamsArray: any[] = [];

  // Add conditions to the query based on the presence of parameters
  if (startTime) {
    selectQuery += " WHERE timestamp >= ?";
    queryParamsArray.push(startTime);
  }

  if (endTime) {
    // Add an "AND" if startTime was already included, otherwise use WHERE
    if (queryParamsArray.length > 0) {
      selectQuery += " AND timestamp <= ?";
    } else {
      selectQuery += " WHERE timestamp <= ?";
    }
    queryParamsArray.push(endTime);
  }

  if (macAddress) {
    // Add an "AND" if any other condition exists
    if (queryParamsArray.length > 0) {
      selectQuery += " AND mac = ?";
    } else {
      selectQuery += " WHERE mac = ?";
    }
    queryParamsArray.push(macAddress);
  }

  // Add LIMIT and OFFSET
  selectQuery += " LIMIT ?";
  queryParamsArray.push(limit);

  selectQuery += " OFFSET ?";
  queryParamsArray.push(offset);

  return new Promise<MeasurementInsertResponse[]>((resolve, reject) => {
    const measurements: MeasurementInsertResponse[] = [];

    db.each(
      selectQuery,
      queryParamsArray,
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          const parsed = MeasurementResponseSchema.safeParse(row);
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
  const result = MeasurementInsertSchema.parse(data);

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
