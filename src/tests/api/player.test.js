import { test, expect } from "@playwright/test";
import { deletePlayer, loginPlayer, registerNewPlayer } from "../helpers/player.js";


test("can register a new player", async () => {
    const registration = await registerNewPlayer();

    expect(registration.response.ok()).toBeTruthy();

    const player = await registration.response.json();
    expect(player).toEqual({
        username: registration.input.username,
        email: registration.input.email,
        fullName: null,
        password:registration.input.password
    });

    const login = await loginPlayer(registration.input.username,
                                                registration.input.password);
    await deletePlayer({
        id: (await login.json()).id,
        token: (await login.json()).password
    })
})

test("player can delete his account", async () => {
    const registration = await registerNewPlayer();
    let loginResponse = await loginPlayer(registration.input.username,
                                                      registration.input.password);
    loginResponse = await loginResponse.json();
    const deleteResponse = await deletePlayer({
                                            token: loginResponse.password,
                                            id: loginResponse.id
                                       })

    expect(deleteResponse.ok()).toBeTruthy();

    loginResponse = await loginPlayer(registration.input.username,
                                      registration.input.password);

    expect(loginResponse.status()).toBe(403);
})

test("always get status ok on deletion if a valid token is used", async () => {
    const registration = await registerNewPlayer();
    let loginResponse = await loginPlayer(registration.input.username,
                                                      registration.input.password);
    loginResponse = await loginResponse.json();
    const deleteResponse = await deletePlayer({
                                            id: Math.floor((Math.random() * 99)),
                                            token: loginResponse.password
                                       });

    expect(deleteResponse.ok()).toBeTruthy();

    await deletePlayer({ id: loginResponse.id, token: loginResponse.password })
})

test("cannot delete another player's account", async () => {
    const registration1 = await registerNewPlayer();
    let loginResponse1 = await loginPlayer(registration1.input.username,
                                                       registration1.input.password);
    loginResponse1 = await loginResponse1.json();

    const registration2 = await registerNewPlayer();
    let loginResponse2 = await loginPlayer(registration2.input.username,
                                                       registration2.input.password);
    loginResponse2 = await loginResponse2.json();

    await deletePlayer({
        id: loginResponse2.id,
        token: loginResponse1.password
    });

    loginResponse1 = await loginPlayer(registration1.input.username,
        registration1.input.password);
    expect(loginResponse1.ok()).toBeTruthy();
    loginResponse2 = await loginPlayer(registration2.input.username,
        registration2.input.password);
    expect(loginResponse2.ok()).toBeTruthy();

    loginResponse1 = await loginResponse1.json();
    loginResponse2 = await loginResponse2.json();
    await deletePlayer({ id: loginResponse1.id, token: loginResponse1.password });
    await deletePlayer({ id: loginResponse2.id, token: loginResponse2.password });
})
