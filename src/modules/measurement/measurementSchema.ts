import { z } from "zod";
import { StringAsNumberSchema } from "../../schema";

const bluetoothMacAddressRegex = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
const temperatureMin = -50;
const temperatureMax = 100;
const humidityMin = 0;
const humidityMax = 100;

const BluetoothMacAddressSchema = z.string().regex(bluetoothMacAddressRegex, {
  message: "Invalid Bluetooth MAC address format",
});

// Define the schema for measurements that will be inserted into the database
export const MeasurementInsertSchema = z.object({
  mac: BluetoothMacAddressSchema,
  t: z
    .number()
    .min(-50, `Temperature must not be below ${temperatureMin}`)
    .max(100, `Temperature must not be above ${temperatureMax}`),
  h: z
    .number()
    .int()
    .min(0, `Humidity must not be below ${humidityMin}`)
    .max(100, `Humidity must not be above ${humidityMax}`),
});

// Define the schema for the response that will be sent back to the client
export const MeasurementResponseSchema = MeasurementInsertSchema.extend({
  id: z.number(),
  timestamp: z.string().datetime(),
});

export type MeasurementInsertRequest = z.infer<typeof MeasurementInsertSchema>;
export type MeasurementInsertResponse = z.infer<
  typeof MeasurementResponseSchema
>;

// Define the schema for measurements that will be inserted into the database
export const MeasurementQuerySchema = z.object({
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  macAddress: BluetoothMacAddressSchema.optional(),
  limit: z.union([StringAsNumberSchema, z.number()]).optional().default(10),
  offset: z.union([StringAsNumberSchema, z.number()]).optional().default(0),
});
export type MeasurementQueryRequest = z.infer<typeof MeasurementQuerySchema>;
