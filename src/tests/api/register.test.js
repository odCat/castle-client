import { expect, test } from "@playwright/test";
import {
    deletePlayer,
    generateEmail,
    generateUsername,
    loginPlayer,
    registerNewPlayer
} from "../helpers/player.js";


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

test("cannot register with a short username", async () => {
    const registration = await registerNewPlayer("a");

    expect(registration.response.status()).toBe(400);
    expect((await registration.response.json()))
        .toEqual({
            username: "Username must have 4-24 characters and include only letters and digits."
        });
})

test("cannot register with a long username", async () => {
    const registration = await registerNewPlayer("AUsernameTooLongToBeValid");

    expect(registration.response.status()).toBe(400);
    expect((await registration.response.json()))
        .toEqual({
            username: "Username must have 4-24 characters and include only letters and digits."
        });
})

test("cannot register with an invalid email", async () => {
    const registration = await registerNewPlayer(generateUsername(), "not a valid email");

    expect(registration.response.status()).toBe(400);
    expect((await registration.response.json()))
        .toEqual({ email: "Must be a valid email address" });
})

test("cannot register with an invalid password", async () => {
    const username = generateUsername();
    const email = generateEmail(username);
    const password = "invalid_password";
    const registration = await registerNewPlayer(username, email, password);

    expect(registration.response.status()).toBe(400);
    expect((await registration.response.json())).toEqual({
            password: "Password must have 8-24 characters and include at least a digit, a lowercase, an uppercase and a symbol"
    });
})

test("cannot register with multiple invalid inputs", async () => {
    const username = "a";
    const email = "not a valid email";
    const password = "invalid_password";
    const registration = await registerNewPlayer(username, email, password);

    expect(registration.response.status()).toBe(400);
    expect((await registration.response.json())).toEqual({
        username: "Username must have 4-24 characters and include only letters and digits.",
        email: "Must be a valid email address" ,
        password: "Password must have 8-24 characters and include at least a digit, a lowercase, an uppercase and a symbol"
    });
})
