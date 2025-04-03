import Router from "koa-router";
import {
  getAllMeasurements,
  insertMeasurementData,
} from "./measurementPersistence";
import { z } from "zod";

// Initialize Koa router
export const router = new Router();

// Route to get all measurements
router.get("/measurements", async (ctx) => {
  // Destructure query parameters
  const { start, end, macAddress } = ctx.query;

  try {
    const data = await getAllMeasurements();
    const measurements = data.map(({ id, ...rest }) => rest);
    ctx.body = { measurements };
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = { error: "Error fetching data", err };
  }
});

// Route to insert new measurement data
router.post("/measurements", async (ctx) => {
  try {
    await insertMeasurementData(ctx.request.body);
    ctx.status = 201;
    ctx.body = { message: "Data inserted" };
  } catch (err) {
    // Handle validation error
    if (err instanceof z.ZodError) {
      ctx.status = 400;
      ctx.body = { error: err.format() };
      return;
    }

    ctx.status = 500;
    ctx.body = { error: "Error inserting data" };
  }
});
