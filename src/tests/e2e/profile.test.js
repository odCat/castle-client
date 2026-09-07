// noinspection JSCheckFunctionSignatures, JSUnusedGlobalSymbols

import { expect, test as base } from "@playwright/test";
import { deletePlayer, registerNewPlayer } from "../helpers/player.js";


const test = base.extend({
    player: async (_, use) => {
        const registration = await registerNewPlayer();
        await use(registration.input);
        await deletePlayer({ usernameOrEmail: registration.input.username, password: registration.input.password });
    }
});

async function loginAndGoToProfile(page, player) {
    await page.goto("http://localhost:5173/login")
    await page.getByRole('textbox', { name: /^Email\/Username$/ }).fill(player.username);
    await page.getByRole('textbox', { name: /^Password$/ }).fill(player.password);
    await page.getByRole("button", { name: /^Login$/ }).click();
    await page.getByRole("button", { name: player.username }).click();
    await page.getByRole("menuitem", { name: "Profile" }).click();
}

test("player can see his profile", async ({ page, player }) => {
    await loginAndGoToProfile(page, player);

    await expect(page).toHaveTitle("chess-client");

    await expect(page.getByRole("heading", { name: "Game History" })).toBeVisible();

    await expect(page.locator("#game_history")).toBeVisible();

    await expect(page.getByRole("columnheader", { name: "White" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Black" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Date" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Result" })).toBeVisible();

    await expect(page.locator("#game_history tr")).toHaveCount(1);

    await expect(page.getByText(/^Copyright © 202\d Mihai Gătejescu$/ )).toBeVisible();
})

test("can see player profile", async ({ page }) => {
    await page.goto("http://localhost:5173/profile/1")

    await expect(page).toHaveTitle("chess-client");

    await expect(page.getByRole("heading", { name: "Game History" })).toBeVisible();

    await expect(page.locator("#game_history")).toBeVisible();

    await expect(page.getByRole("columnheader", { name: "White" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Black" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Date" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Result" })).toBeVisible();

    await expect(page.locator("#game_history tr")).toHaveCount(6);

    await expect(page.getByText(/^Copyright © 202\d Mihai Gătejescu$/ )).toBeVisible();
})
