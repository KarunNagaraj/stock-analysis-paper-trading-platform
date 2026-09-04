import express from "express";
import router from "./routes/health.routes"
import cors from "cors";
import stockRouter from "./modules/stocks/stock.route.js";
const app = express();

const PORT = 5000;

app.use(cors());
app.use("/api",router);
app.use("/api/stocks", stockRouter);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});