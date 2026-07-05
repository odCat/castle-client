import { expect, test } from 'vitest'
import { generateUsername, generateEmail, generatePassword,  } from '../helpers/player'


test("generate username from a name", () => {
    expect(generateUsername("John Doe")).toMatch(/^john_doe\d{5}$/);
})

test("generate a random username", () => {
    expect(generateUsername()).toMatch(/^[a-z]*\d{5}$/);
})

test("throw error when the name is too long", () => {
    expect(() => generateUsername("ANameTooLongToFitInTwentyFourCharacters"))
        .toThrow("The name is too long.")
})

test("generate email", () => {
    expect(generateEmail("john_doe")).toBe("john_doe@test.com");
})

test("generate a valid password", () => {
    for (let i = 0; i < 100; ++i) {
        let password = generatePassword();
        expect(password).toHaveLength(24);
        expect(password).toMatch(/^.*\d+.*$/);
        expect(password).toMatch(/^.*[a-z]+.*$/);
        expect(password).toMatch(/^.*[A-Z]+.*$/);
        expect(password).toMatch(/^.*\d+.*$/);
    }
})