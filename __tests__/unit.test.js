// unit.test.js

const functions = require('../code-to-unit-test/unit-test-me.js');

// TODO - Part 2

// Tests for isPhoneNumber
test('Valid phone number should return true 1', () => {
    expect(functions.isPhoneNumber('(123) 456-7890')).toBe(true);
});
test('Valid phone number should return true 2', () => {
    expect(functions.isPhoneNumber('123-456-7890')).toBe(true);
});

test('Invalid phone number should return false 1', () => {
    expect(functions.isPhoneNumber('1234567890')).toBe(false);
});
test('Invalid phone number should return false 2', () => {
    expect(functions.isPhoneNumber('abc-def-ghij')).toBe(false);
});

// Tests for isEmail
test('Valid email should return true 1', () => {
    expect(functions.isEmail('123@example.com')).toBe(true);
});
test('Valid email should return true 2', () => {
    expect(functions.isEmail('yunzexie@example.co')).toBe(true);
});

test('Invalid email should return false 1', () => {
    expect(functions.isEmail('123@example')).toBe(false);
});
test('Invalid email should return false 2', () => {
    expect(functions.isEmail('yunze.xie@example')).toBe(false);
});

// Tests for isStrongPassword
test('Valid strong password should return true 1', () => {
    expect(functions.isStrongPassword('Abcde123')).toBe(true);
});
test('Valid strong password should return true 2', () => {
    expect(functions.isStrongPassword('Password123_')).toBe(true);
});

test('Invalid weak password should return false 1', () => {
    expect(functions.isStrongPassword('123')).toBe(false);
});
test('Invalid weak password should return false 2', () => {
    expect(functions.isStrongPassword('e%^&*&^%$#')).toBe(false);
});

// Tests for isDate
test('Valid date should return true 1', () => {
    expect(functions.isDate('05/20/2022')).toBe(true);
});
test('Valid date should return true 2', () => {
    expect(functions.isDate('12/31/2023')).toBe(true);
});

test('Invalid date should return false 1', () => {
    expect(functions.isDate('5/5/00')).toBe(false);
});
test('Invalid date should return false 2', () => {
    expect(functions.isDate('2022/05/20')).toBe(false);
});

// Tests for isHexColor
test('Valid hex color should return true 1', () => {
    expect(functions.isHexColor('#aabbcc')).toBe(true);
});
test('Valid hex color should return true 2', () => {
    expect(functions.isHexColor('#F00')).toBe(true);
});

test('Invalid hex color should return false 1', () => {
    expect(functions.isHexColor('FFF00')).toBe(false);
});
test('Invalid hex color should return false 2', () => {
    expect(functions.isHexColor('#12345')).toBe(false);
});