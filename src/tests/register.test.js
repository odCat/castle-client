import { test, expect } from "@playwright/test";

test("has components", async ({ page }) => {
    await page.goto("http://localhost:5173/register")

    await expect(page).toHaveTitle("chess-client");

    await expect(page.getByRole("textbox", { name: /^User name$/ })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /^Full name$/ })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /^Email$/ })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /^Password$/ })).toBeVisible();

    await expect(page.getByRole("button", { name: /^Register$/ })).toBeVisible();

    await expect(page.getByText(/^Copyright © 202\d Mihai Gătejescu$/ )).toBeVisible();
})
