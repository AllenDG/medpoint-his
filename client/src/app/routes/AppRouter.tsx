import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

const PublicLayout   = lazy(() => import("./public/PublicLayout"));
const HelpdeskLayout = lazy(() => import("./helpdesk/HelpdeskLayout"));
const NurseLayout    = lazy(() => import("./nurse/NurseLayout"));

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSkeleton />}>
        <Routes>
          {/* Public — unauthenticated */}
          <Route path="/*" element={<PublicLayout />} />

          {/* Help Desk — role: HELPDESK */}
          <Route
            path="/helpdesk/*"
            element={
              <ProtectedRoute allowedRoles={["HELPDESK"]}>
                <HelpdeskLayout />
              </ProtectedRoute>
            }
          />

          {/* Nurse — role: NURSE */}
          <Route
            path="/nurse/*"
            element={
              <ProtectedRoute allowedRoles={["NURSE"]}>
                <NurseLayout />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
