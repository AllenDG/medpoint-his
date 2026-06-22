import { Router } from "express";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50 });

export const publicRoutes = Router();
publicRoutes.use(limiter);

// TODO: wire controllers
publicRoutes.get("/doctors",        (_, res) => res.json({ data: [] }));
publicRoutes.get("/services",       (_, res) => res.json({ data: [] }));
publicRoutes.post("/appointments",  (_, res) => res.status(201).json({ data: {} }));
publicRoutes.post("/contact",       (_, res) => res.status(201).json({ data: {} }));
