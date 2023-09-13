import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import mongoDBInstance from "./dbs/init.mongodb";

const app = express();

// middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init database
mongoDBInstance;

export default app;
