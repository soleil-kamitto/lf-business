import { createFileRoute } from "@tanstack/react-router";
import { runAnalyticsImport } from "@/lib/analytics";

// Hit daily by the Vercel cron (see vercel.json) so the archive keeps the days
// that fall out of Vercel's 30-day reporting window.
export const Route = createFileRoute("/api/analytics-import")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const secret = process.env.CRON_SECRET;
        const auth = request.headers.get("authorization");
        if (secret && auth !== `Bearer ${secret}`) {
          return new Response("Unauthorized", { status: 401 });
        }

        try {
          const result = await runAnalyticsImport();
          return Response.json(result);
        } catch (err) {
          const message = err instanceof Error ? err.message : "unknown";
          return Response.json({ ok: false, error: message }, { status: 500 });
        }
      },
    },
  },
});
