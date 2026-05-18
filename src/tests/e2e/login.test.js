import { test, expect } from "@playwright/test";
import { generatePassword, generatePlayer, generateUsername } from "../helpers/player.js";


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

test("email/username is required", async ({ page }) => {
    await page.getByRole('textbox', { name: /^Password$/ }).fill(generatePassword());
    await page.getByRole("button", { name: /^Login$/ }).click();

    await expect(page.getByText("Email or username must not be blank")).toBeVisible();
})

test("password is required", async ({ page }) => {
    await page.getByRole('textbox', { name: /^Email\/Username$/ }).fill(generateUsername());
    await page.getByRole("button", { name: /^Login$/ }).click();

    await expect(page.getByText("Password must not be blank")).toBeVisible();
})

test("email/username and password are required", async ({ page }) => {
    await page.getByRole("button", { name: /^Login$/ }).click();

    await expect(page.getByText("Email or username must not be blank")).toBeVisible();
    await expect(page.getByText("Password must not be blank")).toBeVisible();
})

test("cannot login with non-existing username", async ({ page }) => {
    await page.getByRole('textbox', { name: /^Email\/Username$/ }).fill(generateUsername());
    await page.getByRole('textbox', { name: /^Password$/ }).fill(generatePassword());
    await page.getByRole("button", { name: /^Login$/ }).click();

    await expect(page.getByText("Invalid username or password")).toHaveCount(2);
})

test("cannot login with wrong password", async ({ page }) => {
    await page.goto("http://localhost:5173/register")
    const player = generatePlayer();
    await page.getByRole('textbox', { name: "User name" }).fill(player.username);
    await page.getByRole('textbox', { name: "Email" }).fill(player.email);
    await page.getByRole('textbox', { name: "Password" }).fill(player.password);
    await page.getByRole("button", { name: /^Register$/ }).click();

    await page.getByRole('textbox', { name: /^Email\/Username$/ }).fill(player.username);
    await page.getByRole('textbox', { name: /^Password$/ }).fill("incorrect_password");
    await page.getByRole("button", { name: /^Login$/ }).click();

    await expect(page.getByText("Invalid username or password")).toHaveCount(2);
})

test("player can login", async ({ page }) => {
    await page.goto("http://localhost:5173/register")
    const player = generatePlayer();
    await page.getByRole('textbox', { name: "User name" }).fill(player.username);
    await page.getByRole('textbox', { name: "Email" }).fill(player.email);
    await page.getByRole('textbox', { name: "Password" }).fill(player.password);
    await page.getByRole("button", { name: /^Register$/ }).click();

    await page.getByRole('textbox', { name: /^Email\/Username$/ }).fill(player.username);
    await page.getByRole('textbox', { name: /^Password$/ }).fill(player.password);
    await page.getByRole("button", { name: /^Login$/ }).click();

    await expect(page).toHaveURL("http://localhost:5173/play");
})
