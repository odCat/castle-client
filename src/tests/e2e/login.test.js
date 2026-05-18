import { test, expect } from "@playwright/test";
import { generatePlayer } from "../helpers/player.js";


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

test("player can login", async ({ page }) => {
    await page.goto("http://localhost:5173/register")
    const player = generatePlayer();
    await page.getByRole('textbox', { name: "User name" }).fill(player.username);
    await page.getByRole('textbox', { name: "Email" }).fill(player.email);
    await page.getByRole('textbox', { name: "Password" }).fill(player.password);
    await page.getByRole("button", { name: /^Register$/ }).click();
    await expect(page).toHaveURL("http://localhost:5173/login");

    await page.getByRole('textbox', { name: /^Email\/Username$/ }).fill(player.username);
    await page.getByRole('textbox', { name: /^Password$/ }).fill(player.password);
    await page.getByRole("button", { name: /^Login$/ }).click();

    await expect(page).toHaveURL("http://localhost:5173/play");
})
