import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

export const nurseRoutes = Router();
nurseRoutes.use(authMiddleware, roleMiddleware(["NURSE", "ADMIN"]));

// TODO: wire controllers
nurseRoutes.get("/triage",                       (_, res) => res.json({ data: [] }));
nurseRoutes.post("/patients/:id/vitals",         (_, res) => res.status(201).json({ data: {} }));
nurseRoutes.post("/triage/:id/escalate",         (_, res) => res.json({ data: {} }));
nurseRoutes.get("/patients/:id",                 (_, res) => res.json({ data: {} }));
nurseRoutes.get("/patients/:id/care-notes",      (_, res) => res.json({ data: [] }));
nurseRoutes.post("/patients/:id/care-notes",     (_, res) => res.status(201).json({ data: {} }));
