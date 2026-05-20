import { test, expect } from "@playwright/test";
import { registerNewPlayer } from "../helpers/player.js";


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