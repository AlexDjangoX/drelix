import { notFound } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { fetchQuery } from "convex/nextjs";
import { api } from "convex/_generated/api";
import { ProductPageClient } from "@/components/products/ProductPage";

type Props = { params: Promise<{ slug: string }> };

/** Set DEBUG_CATALOG=1 to write server debug payload to logs/catalog-debug-{slug}.json */
const DEBUG_CATALOG = process.env.DEBUG_CATALOG === "1" || process.env.DEBUG_CATALOG === "true";

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const section = await fetchQuery(api.catalog.getCatalogSection, {
    slug,
    ...(DEBUG_CATALOG ? { debug: true } : {}),
  });
  if (!section) notFound();

  const sectionForClient = { ...section } as typeof section & { __debug?: unknown };
  if (sectionForClient.__debug) {
    try {
      const logsDir = path.join(process.cwd(), "logs");
      await mkdir(logsDir, { recursive: true });
      const filePath = path.join(logsDir, `catalog-debug-${slug}.json`);
      await writeFile(
        filePath,
        JSON.stringify(sectionForClient.__debug, null, 2),
        "utf-8",
      );
      console.log("[catalog] Wrote debug payload to", filePath);
    } catch (e) {
      console.error("[catalog] Failed to write debug file:", e);
    }
    delete sectionForClient.__debug;
  }

  return <ProductPageClient slug={slug} section={sectionForClient} />;
}
