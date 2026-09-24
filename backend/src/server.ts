import express from "express";
import router from "./routes/health.routes"
import cors from "cors";
import path from "path";
import stockRouter from "./modules/stocks/stock.route.js";
import screenerRoutes from "./modules/screener/screener.route.js";
import authRouter from "./modules/auth/auth.route";
import paperAccountRouter from "./modules/paperTrading/paperAccount.route";
import paperOrderRouter from "./modules/paperTrading/paperOrder.route";
import paperPortfolioRouter from "./modules/paperTrading/paperPortfolio.route";
import {
  startScreenerMarketSyncJob,
} from "./jobs/screenerMarketSync.job.js";

const app = express();

const PORT = Number(process.env.PORT) || 5000;
const corsOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const frontendDistPath = path.resolve(process.cwd(), "../frontend/dist");

app.use(express.json());
app.use(
  cors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
  })
);

app.use("/api", router);
app.use("/api/stocks", stockRouter);
app.use("/api/screener", screenerRoutes);
app.use("/api/auth", authRouter);
app.use("/api/paper", paperAccountRouter);
app.use("/api/paper", paperOrderRouter);
app.use("/api/paper", paperPortfolioRouter);

// Serve the production React build from the same Render service.
app.use(express.static(frontendDistPath));

// React Router fallback for client-side routes.
// API requests that reach this point should not receive index.html.
app.get("/{*splat}", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }

  res.sendFile(path.join(frontendDistPath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving frontend from: ${frontendDistPath}`);

  startScreenerMarketSyncJob();
});