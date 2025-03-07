import sqlite3 from "sqlite3";
import {
  SensorDataInsertSchema,
  SensorDataResponse,
  SensorDataResponseSchema,
} from "./sensorSchema";
import { db } from "../../persistence/db";

// Create the table if it doesn't exist
const createTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS sensor_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mac TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        temperature REAL NOT NULL,
        humidity INTEGER NOT NULL
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

// Get all sensor data from the database and validate the response using Zod
export const getAllSensorData = (): Promise<SensorDataResponse[]> => {
  return new Promise<SensorDataResponse[]>((resolve, reject) => {
    const selectQuery =
      "SELECT id, mac, timestamp, temperature as t, humidity as h FROM sensor_data limit 10";
    const sensors: SensorDataResponse[] = [];

    db.each(
      selectQuery,
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          const parsed = SensorDataResponseSchema.safeParse(row);
          if (!parsed.success) {
            reject(new Error("Invalid data format in the database"));
          } else {
            sensors.push(parsed.data);
          }
        }
      },
      () => {
        resolve(sensors);
      }
    );
  });
};

// Insert sensor data into the database
export const insertSensorData = async (data: unknown) => {
  // Validate the incoming data using Zod and throw an error if it doesn't match the schema
  const result = SensorDataInsertSchema.parse(data);

  const { mac, t, h } = result;
  const timestamp = new Date().toISOString();

  return new Promise<number>((resolve, reject) => {
    const query = `
      INSERT INTO sensor_data (mac, timestamp, temperature, humidity) 
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
createTable();
