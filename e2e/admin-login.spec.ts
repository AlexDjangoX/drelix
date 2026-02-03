/**
 * E2E tests for admin login page.
 * Targets elements by data-testid - no mocks.
 */
import { test, expect } from '@playwright/test';

test.describe('Admin login page', () => {
  test('renders login form with required elements', async ({ page }) => {
    await page.goto('/admin/login');

    await expect(page.getByTestId('admin-login-page')).toBeVisible();
    await expect(page.getByTestId('admin-login-card')).toBeVisible();
    await expect(page.getByTestId('admin-login-form')).toBeVisible();
    await expect(page.getByTestId('admin-login-password')).toBeVisible();
    await expect(page.getByTestId('admin-login-submit')).toBeVisible();
  });

  test('password input accepts input', async ({ page }) => {
    await page.goto('/admin/login');

    const passwordInput = page.getByTestId('admin-login-password');
    await passwordInput.fill('test-password-123');
    await expect(passwordInput).toHaveValue('test-password-123');
  });

  test('form has required password field', async ({ page }) => {
    await page.goto('/admin/login');

    const passwordInput = page.getByTestId('admin-login-password');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(passwordInput).toHaveAttribute('required');
  });

  test('submit button shows loading state when clicked', async ({ page }) => {
    await page.goto('/admin/login');

    const passwordInput = page.getByTestId('admin-login-password');
    const submitButton = page.getByTestId('admin-login-submit');

    await passwordInput.fill('wrong-password');
    await submitButton.click();

    // Button should be disabled during submission
    await expect(submitButton).toBeDisabled();
  });

  test('shows error message for wrong password', async ({ page }) => {
    await page.goto('/admin/login');

    const passwordInput = page.getByTestId('admin-login-password');
    const submitButton = page.getByTestId('admin-login-submit');

    await passwordInput.fill('definitely-wrong-password');

    // Wait for API response before asserting toast (avoids race in Chromium)
    const loginResponse = page.waitForResponse(
      (r) =>
        r.url().includes('/api/admin/login') && r.request().method() === 'POST'
    );
    await submitButton.click();
    await loginResponse;

    // Error toast: wrong password ("Nieprawidłowe hasło") or rate limit ("Zbyt wiele prób...")
    const notifications = page.getByRole('region', { name: /notification/i });
    await expect(notifications).toContainText(
      /hasło|password|nieprawidłowe|błąd|error|prób|próby/i,
      { timeout: 10000 }
    );
  });

  test('back link navigates to home', async ({ page }) => {
    await page.goto('/admin/login');

    const backLink = page.getByTestId('admin-login-back-link');
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/');
  });
});
