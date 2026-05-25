import { test, expect } from "@playwright/test";
import {
    deletePlayer,
    generatePassword,
    generateUsername,
    loginPlayer,
    registerNewPlayer
} from "../helpers/player.js";


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

test("cannot login with a wrong password", async ({ page }) => {
    const registration = await registerNewPlayer();
    const player = await registration.response.json();
    await page.getByRole('textbox', { name: /^Email\/Username$/ }).fill(player.username);
    await page.getByRole('textbox', { name: /^Password$/ }).fill("incorrect_password");
    await page.getByRole("button", { name: /^Login$/ }).click();

    await expect(page.getByText("Invalid username or password")).toHaveCount(2);

    const login = await loginPlayer(registration.input.username,
                                    registration.input.password);
    await deletePlayer({
        id: (await login.json()).id,
        token: (await login.json()).password
    })
})

test("player can login", async ({ page }) => {
    const registration = await registerNewPlayer();
    const player = await registration.response.json();
    await page.getByRole('textbox', { name: /^Email\/Username$/ }).fill(player.username);
    await page.getByRole('textbox', { name: /^Password$/ }).fill(player.password);
    await page.getByRole("button", { name: /^Login$/ }).click();

    await expect(page).toHaveURL("http://localhost:5173/play");
    await expect(page.getByRole("button", { name: player.username })).toBeVisible();
    await expect(page.getByRole("button", { name: "guest" })).not.toBeVisible();

    const login = await loginPlayer(registration.input.username,
                                    registration.input.password);
    await deletePlayer({
        id: (await login.json()).id,
        token: (await login.json()).password
    })
})
