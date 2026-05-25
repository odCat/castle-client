import { expect } from "@playwright/test";


export async function testHeaderAsGuest({ page }) {
    await testHeader({ page });
    await expect(page.getByRole("banner").getByRole("button", { name: "Guest" })).toBeVisible();
}

export async function testHeaderAsPlayer(username, { page }) {
    await testHeader({ page });
    await expect(page.getByRole("button", { name: username })).toBeVisible();
    await expect(page.getByRole("button", { name: "guest" })).not.toBeVisible();
}

export async function testHeader({ page }) {
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("banner").getByRole("button", {name: "Play"})).toBeVisible();
    await expect(page.getByRole("banner").getByRole("button", {name: "Watch"})).toBeVisible();
    await expect(page.getByRole("banner").getByRole("button", {name: "Demo"})).toBeVisible();
}
