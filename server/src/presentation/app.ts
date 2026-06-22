import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./errors/errorHandler";
import { publicRoutes } from "./routes/public.routes";
import { helpdeskRoutes } from "./routes/helpdesk.routes";
import { nurseRoutes } from "./routes/nurse.routes";

export const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL ?? "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/public",   publicRoutes);
app.use("/api/helpdesk", helpdeskRoutes);
app.use("/api/nurse",    nurseRoutes);

app.use(errorHandler);
