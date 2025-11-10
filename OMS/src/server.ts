import express from "express";
import { ordersRouter } from "./routes/order";
import { PORT } from "./config";

const app = express();
app.use(express.json());
app.use(ordersRouter);

app.listen(PORT, () => {
  console.log(`[OMS] Listening on :${PORT}`);
});
