import Router from "koa-router";
import { getAllSensorData, insertSensorData } from "./sensorPersistence";
import { z } from "zod";

// Initialize Koa router
export const router = new Router();

// Route to get all sensor data
router.get("/sensors", async (ctx) => {
  // Destructure query parameters
  const { start, end, macAddress } = ctx.query;

  try {
    const data = await getAllSensorData();
    const sensors = data.map(({ id, ...rest }) => rest);
    ctx.body = { sensors };
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = { error: "Error fetching data", err };
  }
});

// Route to insert new sensor data
router.post("/sensors", async (ctx) => {
  try {
    await insertSensorData(ctx.request.body);
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
