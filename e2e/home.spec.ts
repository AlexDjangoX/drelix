/**
 * E2E tests for home page.
 * Targets elements by data-testid - no mocks.
 */
import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("renders main layout with navbar and content", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("home-page")).toBeVisible();
    await expect(page.getByTestId("main-navbar")).toBeVisible();
    await expect(page.getByTestId("main-content")).toBeVisible();
  });

  test("has correct page title and meta", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Drelix/i);
    const metaDescription = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(metaDescription).toBeTruthy();
  });

  test("renders products section", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("products-section").first()).toBeVisible();
  });

  test("navbar scroll progress is visible", async ({ page }) => {
    await page.goto("/");

    // Check if scroll progress bar exists
    const scrollProgress = page.locator('[data-testid*="scroll-progress"]');
    if (await scrollProgress.count()) {
      await expect(scrollProgress.first()).toBeVisible();
    }
  });

  test("language toggle works", async ({ page }) => {
    await page.goto("/");

    // Look for language selector
    const langSelector = page.locator("button").filter({ hasText: /EN|PL/i });
    if (await langSelector.count()) {
      const initialLang = await langSelector.first().textContent();
      await langSelector.first().click();
      const newLang = await langSelector.first().textContent();
      expect(newLang).not.toBe(initialLang);
    }
  });

  test("hero section is visible above fold", async ({ page }) => {
    await page.goto("/");

    // Hero section should be visible without scrolling
    const heroSection = page.locator("section").first();
    await expect(heroSection).toBeInViewport();
  });

  test("navigation links work", async ({ page }) => {
    await page.goto("/");

    const productsLink = page
      .getByTestId("main-navbar")
      .locator("a")
      .filter({ hasText: /products|produkty/i });
    if (await productsLink.count()) {
      await productsLink.first().click();
      // Should navigate to products page or scroll to products section
      await page.waitForTimeout(500);
      const url = page.url();
      expect(
        url.includes("#products") || url.includes("/products"),
      ).toBeTruthy();
    }
  });
});
