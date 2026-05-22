import { test, expect } from "@playwright/test";
import { loginPlayer, registerNewPlayer } from "../helpers/player.js";


test("can register a new player", async () => {
    const registration = await registerNewPlayer();

    expect(registration.response.ok()).toBeTruthy();

    const player = await registration.response.json();
    expect(player).toMatchObject({
        username: registration.input.username,
        email: registration.input.email,
        password:registration.input.password
    });
})

test("player can login with username", async() => {
    const registration = await registerNewPlayer();

    const response = await loginPlayer(registration.input.username,
                                       registration.input.password);

    await checkLoginResponse(registration.input, response);
})

test("player can login with email", async() => {
    const registration = await registerNewPlayer();

    let response = await loginPlayer(registration.input.email,
                                     registration.input.password);

    await checkLoginResponse(registration.input, response);
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