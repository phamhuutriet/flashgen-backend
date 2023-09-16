// Dot env have to start before any module can consume env vars
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import mongoDBInstance from "./dbs/init.mongodb";
import router from "./routes";
import { ErrorResponse } from "./core/error.response";

// init app
const app = express();

// middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init database
mongoDBInstance;

// init routes
app.use("/", router);

// Error handling for non-route hits
app.use((req, res, next) => {
  const error = new ErrorResponse("Not found", 404);
  next(error);
});

// Central error handling
app.use(
  (
    error: ErrorResponse,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      status: "error",
      code: statusCode,
      message: error.message || "Internal error",
    });
  }
);

export default app;
