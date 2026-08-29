/**
 * PURPOSE:
 * Server Component page handler for the /users-management route.
 * Fetches user profile and initial paginated users list concurrently on the server.
 * Validates whether the current user holds the ADMIN role; if unauthorized, renders UnauthorizedCard.
 * Otherwise, renders UsersManagementClient.
 */

import React from "react";
import { getUser } from "@/app/services/auth/user";
import { UserRole } from "@/app/types/enum";
import UnauthorizedCard from "../language-management/components/UnauthorizedCard";
import UsersManagementClient from "./UsersManagementClient";
import { getAllUsers } from "../services/admin/get-all-users";

export default async function UsersManagementPage() {
  const [{ data: user }, { data: initialUsersRes }] = await Promise.all([
    getUser(),
    getAllUsers({ page: 1, limit: 10 }),
  ]);

  if (!user || user.role !== UserRole.ADMIN) {
    return <UnauthorizedCard />;
  }

  return (
    <UsersManagementClient
      initialUsers={initialUsersRes?.data || []}
      initialMeta={initialUsersRes?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }}
    />
  );
}
