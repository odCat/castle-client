import { test, expect } from "@playwright/test";


test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/tools/demo");
})

test("has components", async ({ page }) => {
    await expect(page).toHaveTitle("chess-client");

    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("banner").getByRole("button", { name: "Play" })).toBeVisible();
    await expect(page.getByRole("banner").getByRole("button", { name: "Watch" })).toBeVisible();
    await expect(page.getByRole("banner").getByRole("button", { name: "Demo" })).toBeVisible();
    await expect(page.getByRole("banner").getByRole("button", { name: "Guest" })).toBeVisible();

    await expect(await page.locator("#chessboard-board")).toHaveCount(1);
    await expect(page.getByText(/^Copyright © 202\d Mihai Gătejescu$/ )).toBeVisible();
})
