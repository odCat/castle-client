// noinspection JSCheckFunctionSignatures, JSUnusedGlobalSymbols

import { expect, test as base } from "@playwright/test";
import {
    deletePlayer,
    generateEmail,
    generatePassword,
    generateUsername,
    loginPlayer,
    registerNewPlayer
} from "../helpers/player.js";


const test = base.extend({
    // eslint-disable-next-line no-empty-pattern
    player: async ({}, use) => {
        const registration = await registerNewPlayer({});
        await use(registration.input);
        await deletePlayer({ usernameOrEmail: registration.input.username, password: registration.input.password });
    }
});

test("player can login with username", async({ player }) => {
    let login = await loginPlayer(player.username, player.password);

    await checkLoginResponse(player, login);
})

test("player can login with email", async({ player }) => {
    let login = await loginPlayer(player.username, player.password);

    await checkLoginResponse(player, login);
})

test("cannot login with an nonexisting username", async () => {
    let response = await loginPlayer(
        generateUsername(),
        generatePassword()
    )

    expect(response.status()).toBe(403);

    response = await response.json();
    expect(response).toEqual({ error: "Invalid username or password" });
})

test("cannot login with an nonexisting email", async () => {
    let response = await loginPlayer(
        generateEmail(generateUsername()),
        generatePassword()
    )

    expect(response.status()).toBe(403);

    response = await response.json();
    expect(response).toEqual({ error: "Invalid username or password" });
})

test("cannot login with the wrong password", async ({ player }) => {
    let response = await loginPlayer(player.username, generatePassword());

    expect(response.status()).toBe(403);
    response = await response.json();
    expect(response).toEqual({ error: "Invalid username or password" });
})

test("cannot login without password", async ({ player }) => {
    let response = await loginPlayer(player.username, null);

    expect(response.status()).toBe(400);
    expect((await response.json())).toEqual({
        password: "Password must not be blank",
    });
})

test("cannot login with empty password", async ({ player }) => {
    let response = await loginPlayer(player.username, "");

    expect(response.status()).toBe(400);
    expect((await response.json())).toEqual({
        password: "Password must not be blank",
    });
})

async function checkLoginResponse(input, response) {
    expect(response.ok()).toBeTruthy();
    response = await response.json();

    expect(response.id).toBeDefined();
    expect(response.username).toBeDefined();
    expect(response.email).toBeDefined();
    expect(response.fullName).toBeDefined();
    expect(response.usernameOrEmail).toBeDefined();
    expect(response.password).toBeDefined();
    expect(response.password).toMatch(/\d+/);
    expect(response.password).not.toEqual(input.password);
}
