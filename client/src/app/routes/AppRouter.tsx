import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { PublicLoginPage }   from "@/features/auth/components/PublicLoginPage";
import { HelpdeskLoginPage } from "@/features/auth/components/HelpdeskLoginPage";
import { NurseLoginPage }    from "@/features/auth/components/NurseLoginPage";

const PublicLayout   = lazy(() => import("./public/PublicLayout"));
const HelpdeskLayout = lazy(() => import("./helpdesk/HelpdeskLayout"));
const NurseLayout    = lazy(() => import("./nurse/NurseLayout"));

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSkeleton />}>
        <Routes>
          {/* ── Auth / login routes (no protection) ── */}
          <Route path="/login"           element={<PublicLoginPage />} />
          <Route path="/helpdesk/login"  element={<HelpdeskLoginPage />} />
          <Route path="/nurse/login"     element={<NurseLoginPage />} />

          {/* ── Helpdesk: role HELPDESK or ADMIN ── */}
          <Route
            path="/helpdesk/*"
            element={
              <ProtectedRoute allowedRoles={["HELPDESK", "ADMIN"]} loginPath="/helpdesk/login">
                <HelpdeskLayout />
              </ProtectedRoute>
            }
          />

          {/* ── Nurse: per-user URL /nurse/:nurseId/* ── */}
          <Route
            path="/nurse/:nurseId/*"
            element={
              <ProtectedRoute allowedRoles={["NURSE"]} loginPath="/nurse/login">
                <NurseLayout />
              </ProtectedRoute>
            }
          />

          {/* ── Public site: catch-all (must be last) ── */}
          <Route path="/*" element={<PublicLayout />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
