import { UserRole } from "shared";

export type RbacRule = {
  method: string;
  path: string;
  role: UserRole[];
};

const publicRoutes = [
  {
    method: "POST",
    path: "/auth/register",
  },
  {
    method: "POST",
    path: "/auth/login",
  },
] as const;

const authenticatedRbacRules: RbacRule[] = [
  {
    method: "GET",
    path: "/auth/me",
    role: ["USER", "ADMIN"],
  },
  {
    method: "POST",
    path: "/tasks/add-task",
    role: ["USER", "ADMIN"],
  },
  {
    method: "GET",
    path: "/tasks",
    role: ["USER", "ADMIN"],
  },
  {
    method: "GET",
    path: "/tasks/admin",
    role: ["ADMIN"],
  },
  {
    method: "GET",
    path: "/tasks/:id",
    role: ["USER"],
  },
  {
    method: "GET",
    path: "/tasks/admin/:id",
    role: ["ADMIN"],
  },
  {
    method: "DELETE",
    path: "/tasks/:id",
    role: ["USER"],
  },
  {
    method: "PATCH",
    path: "/tasks/:id",
    role: ["USER"],
  },
  {
    method: "DELETE",
    path: "/tasks/admin/:id",
    role: ["ADMIN"],
  },
  {
    method: "POST",
    path: "/tasks/:taskId/attachments",
    role: ["USER", "ADMIN"],
  },
  {
    method: "GET",
    path: "/tasks/:taskId/attachments",
    role: ["USER", "ADMIN"],
  },
  {
    method: "GET",
    path: "/tasks/:taskId/workflows",
    role: ["USER", "ADMIN"],
  },
];

export function matchPath(pattern: string, actual: string): boolean {
  if (pattern === actual) {
    return true;
  }

  const patternSplittedParts = pattern.split("/");
  const actualSplittedParts = actual.split("/");

  if (patternSplittedParts.length !== actualSplittedParts.length) {
    return false;
  }

  return patternSplittedParts.every(
    (part, index) =>
      part.startsWith(":") || part === actualSplittedParts[index],
  );
}

export function isPublicRoute(method: string, path: string): boolean {
  return publicRoutes.some(
    (route) => route.method === method && matchPath(route.path, path),
  );
}

export function getAllowedRolesForPath(
  method: string,
  path: string,
): UserRole[] | null {
  const allowedRoles = authenticatedRbacRules.find(
    (currentIndex) =>
      currentIndex.method === method && matchPath(currentIndex.path, path),
  );

  return allowedRoles?.role ?? null;
}
