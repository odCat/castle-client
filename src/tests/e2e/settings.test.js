import {expect, test} from "@playwright/test";
import {generatePassword, registerNewPlayer} from "../helpers/player.js";


test("has components", async ({ page }) => {
    const registration = await registerNewPlayer();
    const player = await registration.input;
    await page.goto("http://localhost:5173/login")
    await page.getByRole('textbox', { name: /^Email\/Username$/ }).fill(player.username);
    await page.getByRole('textbox', { name: /^Password$/ }).fill(player.password);
    await page.getByRole("button", { name: /^Login$/ }).click();

    await page.goto("http://localhost:5173/settings")

    await expect(page).toHaveTitle("chess-client");

    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();

    await expect(page.getByRole("heading", { name: "Username" })).toBeVisible();
    await expect(page.locator("#username")).toBeVisible();

    await expect(page.getByRole("heading", { name: "Password" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Enter the new password" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "(again)" })).toBeVisible();

    await expect(page.getByRole("heading", { name: "Full name" })).toBeVisible();
    await expect(page.locator("#full_name")).toBeVisible();

    await expect(page.getByRole("heading", { name: "Email" })).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();

    await expect(page.getByRole("button", { name: /^Save changes$/ })).toBeVisible();

    await expect(page.getByRole("heading", { name: "Delete account" })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Delete your account$/ })).toBeVisible();

    await expect(page.getByText(/^Copyright © 202\d Mihai Gătejescu$/ )).toBeVisible();
})
