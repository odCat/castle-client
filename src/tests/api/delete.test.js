import { expect, test as base } from "@playwright/test";
import { deletePlayer, loginPlayer, registerNewPlayer } from "../helpers/player.js";


const test = base.extend({
    // eslint-disable-next-line no-empty-pattern
    player: async ({}, use) => {
        const registration = await registerNewPlayer();
        await use(registration.input);
    },

    // eslint-disable-next-line no-empty-pattern
    player1: async ({}, use) => {
        const registration = await registerNewPlayer();
        await use(registration.input);
        await deletePlayer({ usernameOrEmail: registration.input.username, password: registration.input.password });
    },

    // eslint-disable-next-line no-empty-pattern
    player2: async ({}, use) => {
        const registration = await registerNewPlayer();
        await use(registration.input);
        await deletePlayer({ usernameOrEmail: registration.input.username, password: registration.input.password });
    }
});

test("player can delete his account", async ({ player }) => {
    let loginResponse = await loginPlayer(player.username, player.password);
    loginResponse = await loginResponse.json();
    const deleteResponse = await deletePlayer({
                                            token: loginResponse.password,
                                            id: loginResponse.id
                                       })

    expect(deleteResponse.ok()).toBeTruthy();

    loginResponse = await loginPlayer(player.username, player.password);

    expect(loginResponse.status()).toBe(403);
    expect(await loginResponse.json()).toEqual({ error: "Invalid username or password" });
})

test("always get status ok on deletion if a valid token is used", async ({ player1 }) => {
    let loginResponse = await loginPlayer(player1.username, player1.password);
    loginResponse = await loginResponse.json();
    const deleteResponse = await deletePlayer({
                                            id: Math.floor((Math.random() * 99)),
                                            token: loginResponse.password
                                       });

    expect(deleteResponse.ok()).toBeTruthy();
})

test("cannot delete without authentication", async () => {
    const registration = await registerNewPlayer();
    let loginResponse = await loginPlayer(registration.input.username,
                                                      registration.input.password);
    loginResponse = await loginResponse.json();
    const deleteResponse = await deletePlayer({
        id: loginResponse.id,
        token: null
    });

    expect(deleteResponse.status()).toBe(403);

    await deletePlayer({ id: loginResponse.id, token: loginResponse.password })
})

test("re-delete a player account", async ({ player }) => {
    let loginResponse = await loginPlayer(player.username, player.password);
    loginResponse = await loginResponse.json();
    await deletePlayer({ id: loginResponse.id, token: loginResponse.password })

    const deleteResponse = await deletePlayer({
        id: loginResponse.id,
        token: loginResponse.password
    });

    expect(deleteResponse.status()).toBe(200);
})

test("cannot delete another player's account", async ({ player1, player2 }) => {
    let loginResponse1 = await loginPlayer(player1.username, player1.password);
    loginResponse1 = await loginResponse1.json();

    let loginResponse2 = await loginPlayer(player2.username, player2.password);
    loginResponse2 = await loginResponse2.json();

    await deletePlayer({
        id: loginResponse2.id,
        token: loginResponse1.password
    });

    loginResponse1 = await loginPlayer(player1.username, player1.password);
    expect(loginResponse1.ok()).toBeTruthy();
    loginResponse2 = await loginPlayer(player2.username, player2.password);
    expect(loginResponse2.ok()).toBeTruthy();
})
