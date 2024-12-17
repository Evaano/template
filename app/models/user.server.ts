import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export { User };

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({
    where: { id, deletedAt: null },
    include: { departments: true },
  });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(email: string, name: string) {
  const defaultRole = await prisma.role.findUnique({
    where: { name: "USER" },
  });

  const unspecifiedDepartment = await prisma.department.findUnique({
    where: { name: "Unspecified" },
  });

  return prisma.user.create({
    data: {
      email,
      name,
      roleId: defaultRole?.id,
      departments: {
        connect: {
          id: unspecifiedDepartment?.id,
        },
      },
    },
  });
}

export async function getUserPermissions(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      deletedAt: null,
    },
    include: {
      role: true,
    },
  });

  if (!user || !user.role) {
    return [];
  }

  const userPermissions = await prisma.rolePermission.findMany({
    where: {
      roleId: user.role.id,
    },
    select: {
      permission: {
        select: {
          name: true,
        },
      },
    },
  });

  return userPermissions.map(
    (permissionItem) => permissionItem.permission.name,
  );
}

export async function getUserRole(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      role: true,
    },
  });

  return user?.role;
}

export async function getUsersToManage(
  page: number,
  itemsPerPage: number,
  query: string,
  roleId: number | null,
  departmentId: string,
) {
  const where = {
    deletedAt: null,
    roleId: roleId ? roleId : undefined,
    departments: departmentId
      ? {
          some: {
            id: departmentId,
          },
        }
      : undefined,
    OR: [
      {
        name: {
          contains: query,
          mode: "insensitive" as const,
        },
      },
    ],
  };

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      where,
      include: {
        role: true,
        departments: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, totalCount };
}

export async function getAllRoles() {
  return prisma.role.findMany();
}

export async function getUserWithDepartments(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      departments: true,
    },
  });
}

export async function getExistingUser(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      role: true,
      departments: true,
    },
  });
}

export async function updateUser(
  existingUser: {
    id: string;
    roleId: number;
    departments: { id: string }[];
  },
  validData: { roleId: number; departments: string[] },
) {
  await prisma.$transaction(async (prisma) => {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        roleId: existingUser.roleId,
        departments: {
          disconnect: existingUser.departments.map((department) => ({
            id: department.id,
          })),
        },
      },
    });

    return prisma.user.update({
      where: { id: existingUser.id },
      data: {
        roleId: validData.roleId,
        departments: {
          connect: validData.departments.map((departmentId) => ({
            id: departmentId,
          })),
        },
      },
    });
  });
}

export async function getUserDepartmentNames(
  userId: string,
): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      departments: {
        select: { name: true },
      },
    },
  });

  // Map department names or return an empty array if no departments exist
  return user?.departments.map((dept) => dept.name) || [];
}
