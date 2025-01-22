import { test, expect, type Page } from "@playwright/test";

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto("/auth/login");
  });

  test("should display login form", async ({ page }: { page: Page }) => {
    await expect(
      page.getByRole("heading", { name: "Welcome back" })
    ).toBeVisible();
    await expect(page.getByPlaceholder("Email")).toBeVisible();
    await expect(page.getByPlaceholder("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("should show error for invalid credentials", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.getByPlaceholder("Email").fill("invalid@example.com");
    await page.getByPlaceholder("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Invalid email or password")).toBeVisible();
  });

  test("should login successfully with valid credentials", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.getByPlaceholder("Email").fill("test@example.com");
    await page.getByPlaceholder("Password").fill("password123");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Wait for navigation to dashboard
    await expect(page).toHaveURL("/dashboard");
  });

  test("should toggle password visibility", async ({
    page,
  }: {
    page: Page;
  }) => {
    const passwordInput = page.getByPlaceholder("Password");
    await passwordInput.fill("password123");

    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute("type", "password");

    // Click show password button
    await page.getByRole("button", { name: "Show password" }).click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    // Click hide password button
    await page.getByRole("button", { name: "Hide password" }).click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("should navigate to registration page", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.getByRole("link", { name: "Create an account" }).click();
    await expect(page).toHaveURL("/auth/register");
  });
});
