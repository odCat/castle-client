import { expect } from "@playwright/test";


export async function testHeader({ page }) {
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("banner").getByRole("button", { name: "Play" })).toBeVisible();
    await expect(page.getByRole("banner").getByRole("button", { name: "Watch" })).toBeVisible();
    await expect(page.getByRole("banner").getByRole("button", { name: "Demo" })).toBeVisible();
    await expect(page.getByRole("banner").getByRole("button", { name: "Guest" })).toBeVisible();
}