import { z } from "zod";

const bluetoothMacAddressRegex = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
const temperatureMin = -50;
const temperatureMax = 100;
const humidityMin = 0;
const humidityMax = 100;

// Define the schema for measurements that will be inserted into the database
export const MeasurementDataInsertSchema = z.object({
  mac: z.string().regex(bluetoothMacAddressRegex, {
    message: "Invalid Bluetooth MAC address format",
  }),
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
export const MeasurementDataResponseSchema = MeasurementDataInsertSchema.extend(
  {
    id: z.number(),
    timestamp: z.string().datetime(),
  }
);

export type MeasurementDataInsert = z.infer<typeof MeasurementDataInsertSchema>;
export type MeasurementDataResponse = z.infer<
  typeof MeasurementDataResponseSchema
>;
