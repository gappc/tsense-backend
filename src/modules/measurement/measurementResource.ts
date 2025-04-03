import Router from "koa-router";
import { z } from "zod";
import {
  getAllMeasurements,
  insertMeasurementData,
} from "./measurementPersistence";

// Initialize Koa router
export const router = new Router();

// Route to get all measurements
router.get("/measurements", async (ctx) => {
  try {
    const data = await getAllMeasurements(ctx.query);
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
