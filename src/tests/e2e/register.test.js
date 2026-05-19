import { test, expect } from "@playwright/test";
import {generatePlayer} from "../helpers/player.js";


test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/register")
})

test("has components", async ({ page }) => {
    await expect(page).toHaveTitle("chess-client");

    await expect(page.getByRole("textbox", { name: /^User name$/ })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /^Full name$/ })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /^Email$/ })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /^Password$/ })).toBeVisible();

    await expect(page.getByRole("button", { name: /^Register$/ })).toBeVisible();

    await expect(page.getByText(/^Copyright © 202\d Mihai Gătejescu$/ )).toBeVisible();
})

test("have to enter an username, email, and password", async ({ page}) => {
    await page.getByRole("button", { name: /^Register$/ }).click();

    await expect(page.getByText("Username should not be empty")).toBeVisible();
    await expect(page.getByText("Email should not be empty")).toBeVisible();
    await expect(page.getByText("Password should not be empty")).toBeVisible();
})

test("have to enter a valid username, email and password", async ({ page}) => {
    await page.getByRole('textbox', { name: /^User name$/ }).fill("a");
    await page.getByRole('textbox', { name: /^Email$/ }).fill("invalid-email");
    await page.getByRole('textbox', { name: /^Password$/ }).fill("password123");
    await page.getByRole("button", { name: /^Register$/ }).click();

    await expect(page.getByText("Username must have 4-24 characters and include only letters and digits")).toBeVisible();
    await expect(page.getByText("Must be a valid email address")).toBeVisible();
    await expect(page.getByText("Password must have 8-24 characters and include at least a digit, a lowercase, an uppercase and a symbol")).toBeVisible();
})

test("cannot register an existing username", async ({ page}) => {
    await page.getByRole('textbox', { name: /^User name$/ }).fill("costel");
    await page.getByRole('textbox', { name: /^Email$/ }).fill("valid@mail.com");
    await page.getByRole('textbox', { name: /^Password$/ }).fill("Z2heWOKUUOF9$d#P9V");
    await page.getByRole("button", { name: /^Register$/ }).click();

    await expect(page.getByText("Username is already taken")).toBeVisible();
})

test("cannot register an existing email", async ({ page}) => {
    await page.getByRole('textbox', { name: /^User name$/ }).fill("notcostel");
    await page.getByRole('textbox', { name: /^Email$/ }).fill("costel@test.net");
    await page.getByRole('textbox', { name: /^Password$/ }).fill("Z2heWOKUUOF9$d#P9V");
    await page.getByRole("button", { name: /^Register$/ }).click();

    await expect(page.getByText("Email is already taken")).toBeVisible();
})

test("player can register", async ({ page }) => {
    const player = generatePlayer();
    await page.getByRole('textbox', { name: /^User name$/ }).fill(player.username);
    await page.getByRole('textbox', { name: /^Email$/ }).fill(player.email);
    await page.getByRole('textbox', { name: /^Password$/ }).fill(player.password);
    await page.getByRole("button", { name: /^Register$/ }).click();

    await expect(page).toHaveURL("http://localhost:5173/login");
})