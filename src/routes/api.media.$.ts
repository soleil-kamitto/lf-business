import { createFileRoute } from "@tanstack/react-router";
import { getBytes, getContentType } from "@/lib/storage";

// Netlify Blobs have no public URL, so uploaded images are served from here.
// Image keys carry an upload timestamp and are never overwritten, which makes
// them safe to cache hard at the CDN — that is what keeps serving images off
// the monthly function-invocation budget.
export const Route = createFileRoute("/api/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const key = (params as { _splat?: string })._splat;
        if (!key) return new Response("Not found", { status: 404 });

        try {
          const bytes = await getBytes(key);
          if (!bytes) return new Response("Not found", { status: 404 });

          return new Response(bytes, {
            headers: {
              "content-type": (await getContentType(key)) ?? "application/octet-stream",
              "cache-control": "public, max-age=31536000, immutable",
            },
          });
        } catch (err) {
          console.error("media fetch failed", key, err);
          return new Response("Error", { status: 500 });
        }
      },
    },
  },
});
