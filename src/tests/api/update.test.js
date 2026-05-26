import {expect, request, test} from "@playwright/test";
import {
    deletePlayer,
    generateEmail,
    generatePassword,
    generateUsername,
    loginPlayer,
    registerNewPlayer
} from "../helpers/player.js";


test("update all player information", async () => {
    const registration = await registerNewPlayer();

    expect(registration.response.ok()).toBeTruthy();

    const api = await request.newContext({baseURL: 'http://localhost:8080'});
    let login = await (await loginPlayer(registration.input.username,
                                         registration.input.password)).json();

    const id = login.id;
    const oldPassword = login.password;

    const newUsername = generateUsername();
    const newFullName = "John Doe";
    const newEmail = generateEmail(newUsername);
    const newPassword = generatePassword();
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

    updated = await updated.json();
    expect(updated.id).toEqual(id);
    expect(updated.username).toEqual(newUsername);
    expect(updated.email).toEqual(newEmail);
    expect(updated.fullName).toEqual(newFullName);

    await deletePlayer({
        id: id,
        token: updated.password
    })
})

test("player can login with new password", async () => {
    const registration = await registerNewPlayer();

    expect(registration.response.ok()).toBeTruthy();

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

    login = await loginPlayer(registration.input.username, newPassword);
    expect(login.ok()).toBeTruthy();

    login = await login.json();
    await deletePlayer({
        id: login.id,
        token: login.password
    })
})
