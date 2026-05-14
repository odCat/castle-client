import { test, expect } from "@playwright/test";

test("has components", async ({ page }) => {
    await page.goto("http://localhost:5173/login")

    await expect(page).toHaveTitle("chess-client");

    await expect(page.getByRole("button", { name: "login"})).toBeVisible();

    await expect(page.getByText("Copyright © 2026 Mihai Gătejescu")).toBeVisible();
})
