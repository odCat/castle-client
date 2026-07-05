import { expect, test } from "@playwright/test";
import {
    deletePlayer,
    generateEmail,
    generatePassword,
    generateUsername,
    loginPlayer,
    registerNewPlayer
} from "../helpers/player.js";


test("player can login with username", async() => {
    const registration = await registerNewPlayer();
    const response = await loginPlayer(registration.input.username,
                                                   registration.input.password);

    await checkLoginResponse(registration.input, response);

    await deletePlayer({
        id: (await response.json()).id,
        token: (await response.json()).password
    })
})

test("player can login with email", async() => {
    const registration = await registerNewPlayer();

    let response = await loginPlayer(registration.input.email,
                                                 registration.input.password);

    await checkLoginResponse(registration.input, response);

    await deletePlayer({
        id: (await response.json()).id,
        token: (await response.json()).password
    })
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

test("cannot login with the wrong password", async () => {
    const registration = await registerNewPlayer();
    let response = await loginPlayer(registration.input.username,
                                     generatePassword());

    expect(response.status()).toBe(403);
    response = await response.json();
    expect(response).toEqual({ error: "Invalid username or password" });

    response = await (await loginPlayer(registration.input.username, registration.input.password)).json();
    await deletePlayer({
        id: response.id,
        token: response.password
    })
})

test("cannot login without password", async () => {
    const registration = await registerNewPlayer();
    const response = await loginPlayer(registration.input.username, null);

    expect(response.status()).toBe(400);
    expect((await response.json())).toEqual({
        password: "Password must not be blank",
    });
})

test("cannot login with empty password", async () => {
    const registration = await registerNewPlayer();
    const response = await loginPlayer(registration.input.username, "");

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
