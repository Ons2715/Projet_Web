import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { apiRouter } from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: env.clientOrigin
  })
);
app.use(express.json({ limit: "3mb" }));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    app: "educar-backend"
  });
});

app.use("/api", apiRouter);
app.use(errorHandler);

export { app };
