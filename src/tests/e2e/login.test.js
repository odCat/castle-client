import { test, expect } from "@playwright/test";


test.beforeEach( async ({ page }) => {
    await page.goto("http://localhost:5173/login")
})

test("has components", async ({ page }) => {
    await expect(page).toHaveTitle("chess-client");

    await expect(page.getByRole("textbox", { name: /^Email\/Username$/ })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /^Password$/ })).toBeVisible();

    await expect(page.getByRole("button", { name: /^Login$/ })).toBeVisible();

    await expect(page.getByText(/^Copyright © 202\d Mihai Gătejescu$/)).toBeVisible();
})
