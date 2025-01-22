import { test, expect, type Page } from "@playwright/test";

test.describe("Registration Page", () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto("/auth/register");
  });

  test("should display registration form with initial state", async ({
    page,
  }: {
    page: Page;
  }) => {
    // Check main heading and description
    await expect(
      page.getByRole("heading", { name: "Healthcare Provider Registration" })
    ).toBeVisible();
    await expect(
      page.getByText("Create your account to get started")
    ).toBeVisible();

    // Check basic form elements
    await expect(page.getByPlaceholder("Email")).toBeVisible();
    await expect(
      page.getByPlaceholder("Password", { exact: true })
    ).toBeVisible();
    await expect(
      page.getByPlaceholder("Confirm Password", { exact: true })
    ).toBeVisible();
    await expect(page.getByRole("combobox")).toBeVisible();
    await expect(page.getByRole("button", { name: "Register" })).toBeVisible();

    // Verify role selector placeholder
    await expect(page.getByText("Select Role")).toBeVisible();

    // Verify sign in link
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
  });

  test("should show error for mismatched passwords", async ({
    page,
  }: {
    page: Page;
  }) => {
    // Fill form with mismatched passwords
    await page.getByPlaceholder("Email").fill("test@example.com");
    await page
      .getByPlaceholder("Password", { exact: true })
      .fill("password123");
    await page
      .getByPlaceholder("Confirm Password", { exact: true })
      .fill("password456");

    // Submit form and wait for error state
    await Promise.all([
      page.waitForSelector("p.text-sm.text-red-500.text-center.mt-2"),
      page.getByRole("button", { name: "Register" }).click(),
    ]);

    // Verify error message with exact class matching
    await expect(
      page.locator("p.text-sm.text-red-500.text-center.mt-2")
    ).toHaveText("Passwords do not match");
  });

  test("should register doctor successfully", async ({
    page,
  }: {
    page: Page;
  }) => {
    // Fill basic information
    await page.getByPlaceholder("Email").fill("doctor@example.com");
    await page
      .getByPlaceholder("Password", { exact: true })
      .fill("password123");
    await page
      .getByPlaceholder("Confirm Password", { exact: true })
      .fill("password123");

    // Select doctor role
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Doctor" }).click();

    // Fill personal information
    await page.getByPlaceholder("Full Name").fill("Dr. John Doe");
    await page.getByPlaceholder("Qualification").fill("MBBS, MD");
    await page.getByPlaceholder("Specialization").fill("Cardiology");
    await page.getByPlaceholder("Years of Experience").fill("10");

    // Fill clinic address
    await page
      .getByPlaceholder("Clinic Address")
      .first()
      .fill("123 Medical Plaza");
    await page.getByPlaceholder("City").first().fill("Mumbai");
    await page.getByPlaceholder("State").first().fill("Maharashtra");
    await page.getByPlaceholder("PIN Code").first().fill("400001");

    // Set working days and timings
    await page.getByRole("combobox").nth(1).click();
    await page.getByRole("option", { name: "Weekdays + Saturday" }).click();
    await page.getByLabel("Opening Time").first().fill("09:00");
    await page.getByLabel("Closing Time").first().fill("17:00");

    // Submit form
    await page.getByRole("button", { name: "Register" }).click();

    // Wait for navigation to doctor dashboard
    await expect(page).toHaveURL("/doctor");
  });

  test("should register paramedic successfully", async ({
    page,
  }: {
    page: Page;
  }) => {
    // Fill basic information
    await page.getByPlaceholder("Email").fill("paramedic@example.com");
    await page
      .getByPlaceholder("Password", { exact: true })
      .fill("password123");
    await page
      .getByPlaceholder("Confirm Password", { exact: true })
      .fill("password123");

    // Select paramedic role
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Paramedic" }).click();

    // Fill personal information
    await page.getByPlaceholder("Full Name").fill("John Smith");
    await page.getByPlaceholder("Qualification").fill("EMT-P");
    await page.getByPlaceholder("Specialization").fill("Emergency Care");
    await page.getByPlaceholder("Years of Experience").fill("5");
    await page
      .getByPlaceholder("Professional Certifications")
      .fill("BLS, ACLS, PALS");

    // Submit form
    await page.getByRole("button", { name: "Register" }).click();

    // Wait for navigation to paramedic dashboard
    await expect(page).toHaveURL("/paramedic");
  });

  test("should register laboratory successfully", async ({
    page,
  }: {
    page: Page;
  }) => {
    // Fill basic information
    await page.getByPlaceholder("Email").fill("lab@example.com");
    await page
      .getByPlaceholder("Password", { exact: true })
      .fill("password123");
    await page
      .getByPlaceholder("Confirm Password", { exact: true })
      .fill("password123");

    // Select lab role
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Laboratory" }).click();

    // Fill lab information
    await page.getByPlaceholder("Full Name").fill("City Labs");
    await page.getByPlaceholder("Qualification").fill("NABL Certified");
    await page.getByPlaceholder("Specialization").fill("Pathology");
    await page.getByPlaceholder("Years of Experience").fill("15");

    // Fill lab address
    await page
      .getByPlaceholder("Laboratory Address")
      .first()
      .fill("456 Lab Complex");
    await page.getByPlaceholder("City").first().fill("Delhi");
    await page.getByPlaceholder("State").first().fill("Delhi");
    await page.getByPlaceholder("PIN Code").first().fill("110001");

    // Set working days and timings
    await page.getByRole("combobox").nth(1).click();
    await page.getByRole("option", { name: "All Days" }).click();
    await page.getByLabel("Opening Time").first().fill("00:00");
    await page.getByLabel("Closing Time").first().fill("23:59");

    // Submit form
    await page.getByRole("button", { name: "Register" }).click();

    // Wait for navigation to lab dashboard
    await expect(page).toHaveURL("/lab");
  });

  test("should handle multiple clinic addresses for doctor", async ({
    page,
  }: {
    page: Page;
  }) => {
    // Select doctor role first
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Doctor" }).click();

    // Add second clinic
    await page.getByRole("button", { name: /Add Another Clinic/i }).click();

    // Verify both clinic sections are visible
    await expect(page.getByText("Clinic 1")).toBeVisible();
    await expect(page.getByText("Clinic 2")).toBeVisible();

    // Fill details for both clinics
    const clinics = [
      {
        address: "123 Main St",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
      },
      {
        address: "456 Side St",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411001",
      },
    ];

    for (let i = 0; i < clinics.length; i++) {
      const clinic = clinics[i];
      await page.getByPlaceholder("Clinic Address").nth(i).fill(clinic.address);
      await page.getByPlaceholder("City").nth(i).fill(clinic.city);
      await page.getByPlaceholder("State").nth(i).fill(clinic.state);
      await page.getByPlaceholder("PIN Code").nth(i).fill(clinic.pincode);

      // Set timings for each clinic
      await page
        .getByRole("combobox")
        .nth(i + 1)
        .click();
      await page.getByRole("option", { name: "Weekdays + Saturday" }).click();
      await page.getByLabel("Opening Time").nth(i).fill("09:00");
      await page.getByLabel("Closing Time").nth(i).fill("17:00");
    }

    // Remove second clinic
    await page.getByRole("button").filter({ hasText: "×" }).nth(1).click();
    await expect(page.getByText("Clinic 2")).not.toBeVisible();
  });

  test("should handle multiple laboratory addresses", async ({
    page,
  }: {
    page: Page;
  }) => {
    // Select lab role first
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Laboratory" }).click();

    // Add second lab
    await page.getByRole("button", { name: /Add Another Laboratory/i }).click();

    // Verify both lab sections are visible
    await expect(page.getByText("Laboratory 1")).toBeVisible();
    await expect(page.getByText("Laboratory 2")).toBeVisible();

    // Fill details for both labs
    const labs = [
      {
        address: "789 Lab St",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001",
      },
      {
        address: "321 Test St",
        city: "Gurgaon",
        state: "Haryana",
        pincode: "122001",
      },
    ];

    for (let i = 0; i < labs.length; i++) {
      const lab = labs[i];
      await page
        .getByPlaceholder("Laboratory Address")
        .nth(i)
        .fill(lab.address);
      await page.getByPlaceholder("City").nth(i).fill(lab.city);
      await page.getByPlaceholder("State").nth(i).fill(lab.state);
      await page.getByPlaceholder("PIN Code").nth(i).fill(lab.pincode);

      // Set timings for each lab
      await page
        .getByRole("combobox")
        .nth(i + 1)
        .click();
      await page.getByRole("option", { name: "All Days" }).click();
      await page.getByLabel("Opening Time").nth(i).fill("00:00");
      await page.getByLabel("Closing Time").nth(i).fill("23:59");
    }

    // Remove second lab
    await page.getByRole("button").filter({ hasText: "×" }).nth(1).click();
    await expect(page.getByText("Laboratory 2")).not.toBeVisible();
  });

  test("should navigate to login page", async ({ page }: { page: Page }) => {
    await page.getByRole("link", { name: "Sign in" }).click();
    await expect(page).toHaveURL("/auth/login");
  });

  test("should show loading state during registration", async ({
    page,
  }: {
    page: Page;
  }) => {
    // Fill minimum required fields
    await page.getByPlaceholder("Email").fill("test@example.com");
    await page
      .getByPlaceholder("Password", { exact: true })
      .fill("password123");
    await page
      .getByPlaceholder("Confirm Password", { exact: true })
      .fill("password123");
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Doctor" }).click();

    // Click register and verify loading state
    await page.getByRole("button", { name: "Register" }).click();
    await expect(page.getByText("Registering...")).toBeVisible();
  });

  test("should show error on registration failure", async ({
    page,
  }: {
    page: Page;
  }) => {
    // Fill minimum required fields with invalid data to trigger failure
    await page.getByPlaceholder("Email").fill("invalid@test.com");
    await page
      .getByPlaceholder("Password", { exact: true })
      .fill("password123");
    await page
      .getByPlaceholder("Confirm Password", { exact: true })
      .fill("password123");
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Doctor" }).click();

    // Submit form
    await page.getByRole("button", { name: "Register" }).click();

    // Verify error message
    await expect(
      page.getByText("Registration failed. Please try again.")
    ).toBeVisible();
  });
});
