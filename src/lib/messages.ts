import { createServerFn } from "@tanstack/react-start";
import { getJson, putJson } from "@/lib/storage";
import { requireAdmin } from "@/lib/adminAuth";

// Until now the contact form only faked a send: it showed a green tick after a
// timeout and threw the message away, so every enquiry was lost silently.
const MESSAGES_KEY = "contact-messages.json";

// Keeps one blob small and bounded; far more than a consultancy receives.
const MAX_STORED = 500;

export type ContactMessage = {
  id: string;
  at: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
};

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export const sendMessage = createServerFn({ method: "POST" })
  .validator((data: { name: string; email: string; message: string }) => data)
  .handler(async ({ data }) => {
    const name = clean(data.name, 120);
    const email = clean(data.email, 200);
    const message = clean(data.message, 5000);

    // The form is public, so never trust what arrives: required fields and a
    // plausible address, with everything length-capped above.
    if (!name || !email || !message) throw new Error("INCOMPLETE");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("BAD_EMAIL");

    const stored = (await getJson<ContactMessage[]>(MESSAGES_KEY)) ?? [];
    const entry: ContactMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      at: new Date().toISOString(),
      name,
      email,
      message,
      read: false,
    };
    await putJson(MESSAGES_KEY, [entry, ...stored].slice(0, MAX_STORED));
    return { ok: true as const };
  });

export const listMessages = createServerFn({ method: "GET" }).handler(async (): Promise<ContactMessage[]> => {
  await requireAdmin();
  return (await getJson<ContactMessage[]>(MESSAGES_KEY)) ?? [];
});

export const markMessageRead = createServerFn({ method: "POST" })
  .validator((data: { id: string; read: boolean }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const stored = (await getJson<ContactMessage[]>(MESSAGES_KEY)) ?? [];
    await putJson(
      MESSAGES_KEY,
      stored.map((m) => (m.id === data.id ? { ...m, read: data.read } : m)),
    );
    return { ok: true as const };
  });

export const deleteMessage = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const stored = (await getJson<ContactMessage[]>(MESSAGES_KEY)) ?? [];
    await putJson(MESSAGES_KEY, stored.filter((m) => m.id !== data.id));
    return { ok: true as const };
  });
