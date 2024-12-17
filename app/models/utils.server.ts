import { unstable_createFileUploadHandler as createFileUploadHandler } from "@remix-run/node";
import {
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
} from "@remix-run/server-runtime";
import { getSession } from "~/session.server";
import { can } from "~/utils";

export const uploadHandler = composeUploadHandlers(
  createFileUploadHandler({
    directory: "public/uploads",
    maxPartSize: 1048576,
  }),
  createMemoryUploadHandler(),
);

export async function hasPermission(
  request: Request,
  permission: string | string[],
) {
  const session = await getSession(request);
  const userPermissions = session.get("userPermissions") ?? [];
  const hasPermission = can(userPermissions, permission);
  if (!hasPermission) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return hasPermission;
}
