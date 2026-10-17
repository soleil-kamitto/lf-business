import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";

type AdminSessionData = { authed?: boolean };

export const SESSION_CONFIG = {
  name: "lf_admin_session",
  maxAge: 60 * 60 * 24 * 30,
};

export const checkAdminAuth = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSessionData>({ password: process.env.SESSION_SECRET!, ...SESSION_CONFIG });
  return { authed: !!session.data.authed };
});

export const loginAdmin = createServerFn({ method: "POST" })
  .validator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    if (!process.env.ADMIN_PASSWORD || data.password !== process.env.ADMIN_PASSWORD) {
      return { ok: false as const };
    }
    const session = await useSession<AdminSessionData>({ password: process.env.SESSION_SECRET!, ...SESSION_CONFIG });
    await session.update({ authed: true });
    return { ok: true as const };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSessionData>({ password: process.env.SESSION_SECRET!, ...SESSION_CONFIG });
  await session.clear();
  return { ok: true };
});

export const requireAdmin = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSessionData>({ password: process.env.SESSION_SECRET!, ...SESSION_CONFIG });
  if (!session.data.authed) {
    throw new Error("UNAUTHORIZED");
  }
});
