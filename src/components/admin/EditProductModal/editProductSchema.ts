import { z } from "zod";

/** Max lengths for Convex/DB safety. */
const MAX_STRING = 500;
/** Product description (can include HTML); Convex doc limit ~1MB so 100k is safe. */
const MAX_DESCRIPTION = 100_000;

export const editProductSchema = z.object({
  Kod: z.string().min(1, "Kod jest wymagany").max(100),
  Nazwa: z.string().min(1, "Nazwa jest wymagana").max(MAX_STRING),
  ProductDescription: z.string().max(MAX_STRING),
  CenaNetto: z.string().max(50),
  JednostkaMiary: z.string().max(50),
  StawkaVAT: z.string().max(50),
  categorySlug: z.string().min(1, "Kategoria jest wymagana").max(100),
  Heading: z.string().max(MAX_STRING),
  Subheading: z.string().max(MAX_STRING),
  Description: z.string().max(MAX_DESCRIPTION),
});

export type EditProductFormValues = z.infer<typeof editProductSchema>;
