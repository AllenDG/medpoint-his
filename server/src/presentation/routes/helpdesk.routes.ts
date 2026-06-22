import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

export const helpdeskRoutes = Router();
helpdeskRoutes.use(authMiddleware, roleMiddleware(["HELPDESK", "ADMIN"]));

// TODO: wire controllers
helpdeskRoutes.get("/tickets",               (_, res) => res.json({ data: [] }));
helpdeskRoutes.post("/tickets",              (_, res) => res.status(201).json({ data: {} }));
helpdeskRoutes.get("/tickets/:id",           (_, res) => res.json({ data: {} }));
helpdeskRoutes.patch("/tickets/:id/status",  (_, res) => res.json({ data: {} }));
helpdeskRoutes.post("/tickets/:id/escalate", (_, res) => res.json({ data: {} }));
helpdeskRoutes.get("/appointments",          (_, res) => res.json({ data: [] }));
