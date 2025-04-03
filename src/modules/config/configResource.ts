import Router from "koa-router";
import { getConfigForName } from "./configPersistence";

// Initialize Koa router
export const router = new Router();

// Route to get specific configuration by ID
router.get("/config/:id", async (ctx) => {
  const id = ctx.params.id;
  try {
    const data = await getConfigForName(id);
    ctx.body = data;
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = { error: "Error fetching data", err };
  }
});
