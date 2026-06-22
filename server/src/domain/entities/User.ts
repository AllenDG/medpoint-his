export type UserRole = "HELPDESK" | "NURSE" | "DOCTOR" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}
