import express from "express";
import router from "./routes/health.routes"
import cors from "cors";
import stockRouter from "./modules/stocks/stock.route.js";
import screenerRoutes from "./modules/screener/screener.route.js";
const app = express();

const PORT = 5000;

app.use(cors());
app.use("/api",router); //health check route
app.use("/api/stocks", stockRouter);
app.use("/api/screener", screenerRoutes);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});