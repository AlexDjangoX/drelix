import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";
import {
  createFileValidationError,
  validateImageFile,
  processImageToVariants,
} from "@/lib/image";

const DEV_IMAGES_BASE = path.join(process.cwd(), "public", "product-images");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return createFileValidationError("No file provided");
    }

    const validation = await validateImageFile(file);
    if (!validation.isValid) {
      return createFileValidationError(validation.error ?? "Invalid file");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const metadata = await sharp(buffer)
      .metadata()
      .catch(() => {
        throw new Error("Unsupported image format");
      });

    if (!metadata.format) {
      return createFileValidationError("Unsupported image format");
    }

    const kodRaw = formData.get("kod");
    const kod =
      typeof kodRaw === "string" && kodRaw.trim() ? kodRaw.trim() : undefined;
    const nazwaRaw = formData.get("nazwa");
    const nazwa =
      typeof nazwaRaw === "string" && nazwaRaw.trim()
        ? nazwaRaw.trim()
        : undefined;
    const body = await processImageToVariants(buffer, {
      kod,
      nazwa,
      originalFilename: file.name ?? "",
    });

    if (process.env.NODE_ENV === "development") {
      const thumbDir = path.join(DEV_IMAGES_BASE, "thumbnails");
      const largeDir = path.join(DEV_IMAGES_BASE, "large");
      await mkdir(thumbDir, { recursive: true });
      await mkdir(largeDir, { recursive: true });
      const thumbBuf = Buffer.from(body.thumbnail.base64, "base64");
      const largeBuf = Buffer.from(body.large.base64, "base64");
      await writeFile(path.join(thumbDir, body.thumbnail.filename), thumbBuf);
      await writeFile(path.join(largeDir, body.large.filename), largeBuf);
    }

    return NextResponse.json(body, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorType =
      error instanceof Error ? error.constructor.name : typeof error;
    console.error("Image process error:", errorType);

    return new NextResponse("Failed to process the file. Please try again.", {
      status: 500,
    });
  }
}
