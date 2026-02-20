import { NextRequest, NextResponse } from "next/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "convex/_generated/api";
import sharp from "sharp";
import { COOKIE_NAME, verifyAdminSession } from "@/lib/auth";

/** Admin-only. Fetches catalog items, reads image dimensions with sharp (thumbnail when available, to match grid display), writes to imageDimensions. Catalog order: subcategory → image height (tallest first) → Nazwa. */
export async function POST(request: NextRequest) {
  const sessionCookie = request.cookies.get(COOKIE_NAME);
  if (!sessionCookie?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const session = await verifyAdminSession(sessionCookie.value);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sections = await fetchQuery(api.catalog.listCatalogSections);
    const seen = new Set<string>();
    const toProcess: { storageId: string; imageUrl: string }[] = [];
    for (const section of sections) {
      for (const item of section.items) {
        const row = item as {
          imageStorageId?: string;
          imageUrl?: string;
          thumbnailStorageId?: string;
          thumbnailUrl?: string;
        };
        // Prefer thumbnail (what the grid displays) so sort order matches visual height.
        // Use || (not ??) so empty-string thumbnailStorageId/Url falls back to the large image.
        const storageId = (row.thumbnailStorageId || row.imageStorageId || "").trim();
        const imageUrl = (row.thumbnailUrl || row.imageUrl || "").trim();
        if (storageId && imageUrl && !seen.has(storageId)) {
          seen.add(storageId);
          toProcess.push({ storageId, imageUrl });
        }
      }
    }

    const origin = new URL(request.url).origin;
    const toAbsolute = (url: string) =>
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `${origin}${url.startsWith("/") ? "" : "/"}${url}`;

    let populated = 0;
    let firstError: string | null = null;
    for (const { storageId, imageUrl } of toProcess) {
      try {
        const url = toAbsolute(imageUrl);
        const res = await fetch(url, {
          signal: AbortSignal.timeout(15000),
          headers: {
            Accept: "image/*",
            "User-Agent": "DrelixCatalogPopulator/1.0",
          },
        });
        if (!res.ok) {
          if (!firstError) firstError = `fetch ${res.status} ${res.statusText}`;
          continue;
        }
        const buf = Buffer.from(await res.arrayBuffer());
        const meta = await sharp(buf).metadata();
        const w = meta.width ?? 0;
        const h = meta.height ?? 0;
        if (w > 0 && h > 0) {
          await fetchMutation(api.catalog.setImageDimensions, {
            storageId,
            width: w,
            height: h,
          });
          populated++;
        } else if (!firstError) {
          firstError = "sharp: no width/height in metadata";
        }
      } catch (err) {
        if (!firstError) {
          firstError =
            err instanceof Error ? err.message : String(err);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      populated,
      total: toProcess.length,
      ...(firstError && populated === 0 ? { firstError } : {}),
    });
  } catch (e) {
    console.error("populate-image-dimensions", e);
    return NextResponse.json(
      { error: "Failed to populate dimensions" },
      { status: 500 },
    );
  }
}
