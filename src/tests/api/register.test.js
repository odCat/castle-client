import {test, expect, request} from "@playwright/test";
import {generateEmail, generatePassword, generateUsername} from "../helpers/player.js";


test("can register a new user", async () => {
    const username = generateUsername();
    const email = generateEmail(username);
    const password = generatePassword();

    const api = await request.newContext({ baseURL: 'http://localhost:8080' });

    const response = await api.post('/players/register', {
        data: {
            username: username,
            email: email,
            password: password,
        }
    });

    expect(response.ok()).toBeTruthy();
    await expect(response.json()).resolves.toMatchObject({
        username: username,
        email: email,
        password: password,
    });
})