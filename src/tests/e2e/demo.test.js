import { test, expect } from "@playwright/test";
import { testHeaderAsGuest } from "../helpers/header.js";


test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/tools/demo");
})

test("has components", async ({ page }) => {
    await expect(page).toHaveTitle("chess-client");

    await testHeaderAsGuest({ page });
    await expect(await page.locator("#chessboard-board")).toHaveCount(1);
    await expect(page.getByText(/^Copyright © 202\d Mihai Gătejescu$/ )).toBeVisible();
})

test("navigate to the play page", async ({ page }) => {
    await page.getByRole("button", { name: "Play" }).click();

    await expect(page).toHaveURL("http://localhost:5173/play");
})

test("navigate to the watch page", async ({ page }) => {
    await page.getByRole("button", { name: "Watch" }).click();

    await expect(page).toHaveURL("http://localhost:5173/watch");
})

test("navigate to the demo page", async ({ page }) => {
    await page.getByRole("button", { name: "Demo" }).click();

    await expect(page).toHaveURL("http://localhost:5173/tools/demo");
})
