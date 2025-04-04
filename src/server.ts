import { bodyParser } from "@koa/bodyparser";
import Koa from "koa";
import { router as configRouter } from "./modules/config/configResource";
import { router as measurementRouter } from "./modules/measurement/measurementResource";

// Initialize Koa app
const app = new Koa();

// Add body parser
app.use(bodyParser());

// Add routes
app.use(configRouter.routes()).use(configRouter.allowedMethods());
app.use(measurementRouter.routes()).use(measurementRouter.allowedMethods());

// Start the Koa app
const port = 3000;
app.listen(port, () => {
  console.log(`Koa server running on http://localhost:${port}`);
});
