import { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware";

export function roleMiddleware(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ code: "FORBIDDEN", message: "Insufficient permissions" });
      return;
    }
    next();
  };
}
