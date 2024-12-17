import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export { User };

export async function verifyLogin(
    email: User["email"],
    password: Password["hash"],
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
      password,
      userWithPassword.password.hash,
  );

  if (!isValid) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(email: string, name: string) {
  return prisma.user.create({
    data: {
      email,
      name,
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