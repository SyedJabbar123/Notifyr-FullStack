import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cron from "node-cron";

import env from "./src/config/env.js";
import { assertDbConnection } from "./src/config/db.js";
import routes from "./src/routes/index.js";
import {
  errorHandler,
  notFoundHandler,
} from "./src/middleware/errorHandler.js";
import { pruneOldEntries } from "./src/services/rateLimitService.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

app.get("/health", (req, res) => res.status(200).json({ ok: true }));
app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler); // must be last

// Daily cleanup of message_rate_limits — keeps the 1GB Aiven tier from filling up.
cron.schedule("0 3 * * *", () => {
  pruneOldEntries().catch((err) =>
    console.error("Rate limit prune failed:", err),
  );
});

async function start() {
  try {
    await assertDbConnection();
    app.listen(env.PORT, () => {
      console.log(
        `Notifyr backend listening on port ${env.PORT} (${env.NODE_ENV})`,
      );
    });
  } catch (err) {
    console.error("Failed to start:", err.message);
    process.exit(1);
  }
}

start();
