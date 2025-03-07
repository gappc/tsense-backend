import Router from "koa-router";
import { getConfig } from "./configPersistence";

// Initialize Koa router
export const router = new Router();

// Route to get all sensor data
router.get("/config/:id", async (ctx) => {
  const id = ctx.params.id;
  try {
    const data = await getConfig(id);
    ctx.body = data;
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = { error: "Error fetching data", err };
  }
});
