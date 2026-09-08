// noinspection JSCheckFunctionSignatures, JSUnusedGlobalSymbols

import { expect, test as base } from "@playwright/test";
import {
    deletePlayer,
    generatePassword,
    generateUsername,
    registerNewPlayer
} from "../helpers/player.js";
import { testHeaderAsPlayer } from "../helpers/header.js";


const test = base.extend({
    // eslint-disable-next-line no-empty-pattern
    player: async ({}, use) => {
        const registration = await registerNewPlayer({});
        await use(registration.input);
        await deletePlayer({ usernameOrEmail: registration.input.username, password: registration.input.password });
    }
});

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

test("cannot login with a wrong password", async ({ page, player }) => {
    await page.getByRole('textbox', { name: /^Email\/Username$/ }).fill(player.username);
    await page.getByRole('textbox', { name: /^Password$/ }).fill("incorrect_password");
    await page.getByRole("button", { name: /^Login$/ }).click();

    await expect(page.getByText("Invalid username or password")).toHaveCount(2);

})

test("player can login", async ({ page, player }) => {
    await page.getByRole('textbox', { name: /^Email\/Username$/ }).fill(player.username);
    await page.getByRole('textbox', { name: /^Password$/ }).fill(player.password);
    await page.getByRole("button", { name: /^Login$/ }).click();

    await expect(page).toHaveURL("http://localhost:5173/play");
    await expect(page.getByRole("button", { name: player.username })).toBeVisible();
    await expect(page.getByRole("button", { name: "guest" })).not.toBeVisible();
    await testHeaderAsPlayer(player.username, { page });
})
