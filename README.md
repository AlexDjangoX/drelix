This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Convex (catalog backend)

The product catalog is stored in [Convex](https://convex.dev). To use it locally:

1. **Create a Convex project** (one-time): run `npx convex dev` and follow the prompts (log in, create/link project). This generates `convex/_generated` and sets `CONVEX_DEPLOYMENT` in `.env.local`.
2. **Set the Convex URL**: add `NEXT_PUBLIC_CONVEX_URL=<your deployment URL>` to `.env.local`. You can copy the URL from the Convex dashboard or from the output of `npx convex dev`.
3. **Seed the catalog**: log in at `/admin/login`, then upload a Kartoteki CSV (Windows-1250, semicolon-delimited) via the admin “Process new CSV” area. That replaces the Convex catalog with the categorized products.

Admin catalog edits (inline save) and the public `/products` page read/write from Convex. Without `NEXT_PUBLIC_CONVEX_URL`, the app builds using a placeholder URL; set it for real data.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# drelix
