import { describe, it, expect } from 'vitest';
import { isLeapYear, daysInMonth, addByFixedUnit } from '../../src/utils/calendar.js';

describe('calendar utils', () => {
    it('detects leap years correctly', () => {
        expect(isLeapYear(2000)).toBe(true);
        expect(isLeapYear(1900)).toBe(false);
        expect(isLeapYear(2024)).toBe(true);
        expect(isLeapYear(2023)).toBe(false);
    });

    it('returns correct days in month', () => {
        expect(daysInMonth(2024, 2)).toBe(29);
        expect(daysInMonth(2023, 2)).toBe(28);
        expect(daysInMonth(2023, 1)).toBe(31);
        expect(daysInMonth(2023, 4)).toBe(30);
    });

    it('adds fixed units to timestamp', () => {
        const ts = Date.UTC(2026, 2, 1); // 1 марта 2026
        const dayLater = addByFixedUnit(ts, 1, 'day');
        expect(dayLater).toBe(ts + 24 * 60 * 60 * 1000);
    });
});
