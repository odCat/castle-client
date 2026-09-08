// noinspection JSCheckFunctionSignatures, JSUnusedGlobalSymbols

import { expect, request, test as base } from "@playwright/test";
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
    registration: async ({}, use) => {
        const registration = await registerNewPlayer();
        await use(registration);
        await deletePlayer({ usernameOrEmail: registration.input.username, password: registration.input.password });
    },
    // eslint-disable-next-line no-empty-pattern
    registration1: async ({}, use) => {
        const registration = await registerNewPlayer();
        await use(registration);
        await deletePlayer({ usernameOrEmail: registration.input.username, password: registration.input.password });
    },
    // eslint-disable-next-line no-empty-pattern
    registration2: async ({}, use) => {
        const registration = await registerNewPlayer();
        await use(registration);
        await deletePlayer({ usernameOrEmail: registration.input.username, password: registration.input.password });
    }
});

test("update all player information", async ({ registration }) => {
    const api = await request.newContext({baseURL: 'http://localhost:8080'});
    let login = await (await loginPlayer(registration.input.username,
                                         registration.input.password)).json();

    const id = login.id;

    const newUsername = generateUsername();
    const newFullName = "John Doe";
    const newEmail = generateEmail(newUsername);
    const newPassword = generatePassword();
    const today = new Date().toISOString().split('T')[0];

    let updated = await api.patch(`/players?id=${login.id}`, {
        headers: {
            Authorization: `Bearer ${login.password}`
        },
        data: {
            username: newUsername,
            fullName: newFullName,
            email: newEmail,
            password: newPassword,
        }
    });

    expect(updated.ok()).toBeTruthy();

    registration.input.username = newUsername;
    registration.input.password = newPassword;

    updated = await updated.json();

    expect(updated.id).toEqual(id);
    expect(updated.username).toEqual(newUsername);
    expect(updated.email).toEqual(newEmail);
    expect(updated.fullName).toEqual(newFullName);
    expect(updated.created).toEqual(today);
})

test("update full name", async ({ registration }) => {
    let login = await (await loginPlayer(registration.input.username,
        registration.input.password)).json();

    const newFullName = "John Doe";
    const api = await request.newContext({baseURL: 'http://localhost:8080'});
    let updated = await api.patch(`/players?id=${login.id}`, {
        headers: {
            Authorization: `Bearer ${login.password}`
        },
        data: {
            fullName: newFullName,
        }
    });

    expect(updated.ok()).toBeTruthy();

    updated = await updated.json();
    expect(updated.fullName).toEqual(newFullName);
})

test("player can login with new password", async ({ registration }) => {
    const api = await request.newContext({baseURL: 'http://localhost:8080'});
    let login = await (await loginPlayer(registration.input.username,
                                         registration.input.password)).json();

    const newPassword = generatePassword();
    const updated = await api.patch(`/players?id=${login.id}`, {
        headers: {
            Authorization: `Bearer ${login.password}`
        },
        data: {
            password: newPassword,
        }
    });

    expect(updated.ok()).toBeTruthy();

    registration.input.password = newPassword;

    login = await loginPlayer(registration.input.username, newPassword);
    expect(login.ok()).toBeTruthy();
})

test("player can login with new username", async ({ registration }) => {
    const api = await request.newContext({baseURL: 'http://localhost:8080'});
    let login = await (await loginPlayer(registration.input.username,
                                         registration.input.password)).json();

    const newUsername = generateUsername();
    const updated = await api.patch(`/players?id=${login.id}`, {
        headers: {
            Authorization: `Bearer ${login.password}`
        },
        data: {
            username: newUsername,
        }
    });

    expect(updated.ok()).toBeTruthy();

    registration.input.username = newUsername;

    login = await loginPlayer(newUsername, registration.input.password);
    expect(login.ok()).toBeTruthy();
})

test("player cannot update without authentication", async ({ registration }) => {
    let login = await (await loginPlayer(registration.input.username,
                                         registration.input.password)).json();

    const api = await request.newContext({baseURL: 'http://localhost:8080'});
    const newUsername = generateUsername();
    const updated = await api.patch(`/players?id=${login.id}`, {
        data: {
            username: newUsername,
        }
    });

    expect(updated.status()).toBe(403);

    login = await loginPlayer(newUsername, registration.input.password);
    expect(login.ok()).toBeFalsy();

    login = await loginPlayer(registration.input.username, registration.input.password);
    expect(login.ok()).toBeTruthy();
})

test("player cannot update another player", async ({ registration1, registration2 }) => {
    let login1 = await (await loginPlayer(registration1.input.username,
                                          registration1.input.password)).json();
    let login2 = await (await loginPlayer(registration2.input.username,
                                          registration2.input.password)).json();

    const api = await request.newContext({baseURL: 'http://localhost:8080'});
    const newUsername = generateUsername();
    const updated = await api.patch(`/players?id=${login2.id}`, {
        headers: {
            Authorization: `Bearer ${login1.password}`
        },
        data: {
            username: newUsername,
        }
    });

    expect(updated.status()).toBe(403);

    const login3 = await loginPlayer(newUsername, generatePassword());
    expect(login3.status()).toBe(403);

    login1 = await loginPlayer(registration1.input.username, registration1.input.password);
    expect(login1.ok()).toBeTruthy();

    login2 = await loginPlayer(registration2.input.username, registration2.input.password);
    expect(login2.ok()).toBeTruthy();
})

test("cannot update with invalid data", async ({ registration }) => {
    const api = await request.newContext({baseURL: 'http://localhost:8080'});
    let login = await (await loginPlayer(registration.input.username,
                                         registration.input.password)).json();

    const newUsername = "|nvalid n@me";
    const newEmail = "not and email";
    const newPassword = "weak password";
    let updated = await api.patch(`/players?id=${login.id}`, {
        headers: {
            Authorization: `Bearer ${login.password}`
        },
        data: {
            username: newUsername,
            email: newEmail,
            password: newPassword,
        }
    });

    expect(updated.status()).toBe(400);
    expect(await updated.json()).toEqual({
        password: "Password must have 8-24 characters and include at least a digit, a lowercase, an uppercase and a symbol",
        email: "Must be a valid email address",
        username: "Username must have 4-24 characters and include only letters and digits."
    });
})
