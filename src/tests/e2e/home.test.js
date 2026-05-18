import { test, expect } from "@playwright/test";


test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/")
})

test("has buttons", async ({ page }) => {
    await expect(page).toHaveTitle("chess-client");

    await expect(page.getByRole("button", { name: "guest"})).toBeVisible();
    await expect(page.getByRole("button", { name: "login"})).toBeVisible();
    await expect(page.getByRole("button", { name: "register"})).toBeVisible();

    await expect(page.getByText("Copyright © 2026 Mihai Gătejescu")).toBeVisible();
})

test("proceed as a guest", async ({ page }) => {
    await page.getByRole("button", { name: "guest"}).click();

    await expect(page).toHaveURL("http://localhost:5173/watch");
})

test("go to the login page", async ({ page }) => {
    await page.getByRole("button", { name: "login"}).click();

    await expect(page).toHaveURL("http://localhost:5173/login");
})

test("go to the register page", async ({ page }) => {
    await page.getByRole("button", { name: "register"}).click();

    await expect(page).toHaveURL("http://localhost:5173/register");
})
