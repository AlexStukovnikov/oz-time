import { describe, it, expect } from 'vitest';
import { OzTime } from '../../src/core/core.js';
import { isLeapYear, daysInMonth, addByFixedUnit, addByCalendarUnit, diff } from '../../src/utils/calendar.js';

describe('calendar utils', () => {
    describe('isLeapYear', () => {
        it('returns true for leap years', () => {
            expect(isLeapYear(2024)).toBe(true);
            expect(isLeapYear(2000)).toBe(true);
        });

        it('returns false for non-leap years', () => {
            expect(isLeapYear(2025)).toBe(false);
            expect(isLeapYear(1900)).toBe(false);
        });

        it('throws for invalid input', () => {
            expect(() => isLeapYear(2024.5)).toThrow();
            expect(() => isLeapYear('2024')).toThrow();
        });
    });

    describe('daysInMonth', () => {
        it('returns correct number of days for regular months', () => {
            expect(daysInMonth(2026, 1)).toBe(31);
            expect(daysInMonth(2026, 4)).toBe(30);
        });

        it('returns 28 for February in a non-leap year', () => {
            expect(daysInMonth(2025, 2)).toBe(28);
        });

        it('returns 29 for February in a leap year', () => {
            expect(daysInMonth(2024, 2)).toBe(29);
        });

        it('throws for invalid month', () => {
            expect(() => daysInMonth(2026, 0)).toThrow();
            expect(() => daysInMonth(2026, 13)).toThrow();
        });

        it('throws for invalid input types', () => {
            expect(() => daysInMonth('2026', 1)).toThrow();
            expect(() => daysInMonth(2026, '1')).toThrow();
            expect(() => daysInMonth(2026.5, 1)).toThrow();
        });
    });

    describe('addByFixedUnit', () => {
        it('adds milliseconds correctly', () => {
            const ts = Date.UTC(2026, 0, 15, 12, 0, 0, 0);
            const result = addByFixedUnit(ts, 500, 'millisecond');

            expect(result).toBe(Date.UTC(2026, 0, 15, 12, 0, 0, 500));
        });

        it('adds days correctly', () => {
            const ts = Date.UTC(2026, 0, 15, 12, 0, 0);
            const result = addByFixedUnit(ts, 2, 'day');

            expect(result).toBe(Date.UTC(2026, 0, 17, 12, 0, 0));
        });

        it('supports unit aliases', () => {
            const ts = Date.UTC(2026, 0, 15, 12, 0, 0);
            const result = addByFixedUnit(ts, 2, 'hours');

            expect(result).toBe(Date.UTC(2026, 0, 15, 14, 0, 0));
        });

        it('throws for calendar units', () => {
            const ts = Date.UTC(2026, 0, 15, 12, 0, 0);

            expect(() => addByFixedUnit(ts, 1, 'month')).toThrow();
            expect(() => addByFixedUnit(ts, 1, 'year')).toThrow();
        });

        it('throws for invalid arguments', () => {
            expect(() => addByFixedUnit('bad', 1, 'day')).toThrow();
            expect(() => addByFixedUnit(Date.UTC(2026, 0, 15), '1', 'day')).toThrow();
            expect(() => addByFixedUnit(Date.UTC(2026, 0, 15), 1, 'unknown')).toThrow();
        });
    });

    describe('addByCalendarUnit', () => {
        it('adds one month preserving calendar logic', () => {
            const ts = Date.UTC(2026, 0, 31, 12, 0, 0);
            const result = addByCalendarUnit(ts, 1, 'month');

            expect(result).toBe(Date.UTC(2026, 1, 28, 12, 0, 0));
        });

        it('adds one month in leap year February correctly', () => {
            const ts = Date.UTC(2024, 0, 31, 12, 0, 0);
            const result = addByCalendarUnit(ts, 1, 'month');

            expect(result).toBe(Date.UTC(2024, 1, 29, 12, 0, 0));
        });

        it('adds one year preserving month and day when possible', () => {
            const ts = Date.UTC(2026, 2, 1, 12, 0, 0);
            const result = addByCalendarUnit(ts, 1, 'year');

            expect(result).toBe(Date.UTC(2027, 2, 1, 12, 0, 0));
        });

        it('handles leap day when adding years', () => {
            const ts = Date.UTC(2024, 1, 29, 12, 0, 0);
            const result = addByCalendarUnit(ts, 1, 'year');

            expect(result).toBe(Date.UTC(2025, 1, 28, 12, 0, 0));
        });

        it('supports negative amounts', () => {
            const ts = Date.UTC(2026, 2, 31, 12, 0, 0);
            const result = addByCalendarUnit(ts, -1, 'month');

            expect(result).toBe(Date.UTC(2026, 1, 28, 12, 0, 0));
        });

        it('throws for unsupported units', () => {
            const ts = Date.UTC(2026, 0, 15, 12, 0, 0);

            expect(() => addByCalendarUnit(ts, 1, 'day')).toThrow();
            expect(() => addByCalendarUnit(ts, 1, 'hour')).toThrow();
        });

        it('throws for invalid arguments', () => {
            expect(() => addByCalendarUnit('bad', 1, 'month')).toThrow();
            expect(() => addByCalendarUnit(Date.UTC(2026, 0, 15), '1', 'month')).toThrow();
            expect(() => addByCalendarUnit(Date.UTC(2026, 0, 15), 1, 'unknown')).toThrow();
        });
    });

    describe('diff', () => {
        it('returns diff in fixed units', () => {
            const left = new OzTime(Date.UTC(2026, 0, 15, 12, 0, 0));
            const right = new OzTime(Date.UTC(2026, 0, 15, 10, 0, 0));

            expect(diff(left, right, 'hour')).toBe(2);
            expect(diff(left, right, 'minute')).toBe(120);
        });

        it('returns negative diff when left is before right', () => {
            const left = new OzTime(Date.UTC(2026, 0, 15, 8, 0, 0));
            const right = new OzTime(Date.UTC(2026, 0, 15, 10, 0, 0));

            expect(diff(left, right, 'hour')).toBe(-2);
        });

        it('returns whole calendar months', () => {
            const left = new OzTime(Date.UTC(2026, 2, 15, 12, 0, 0));
            const right = new OzTime(Date.UTC(2026, 0, 15, 12, 0, 0));

            expect(diff(left, right, 'month')).toBe(2);
        });

        it('does not count incomplete month', () => {
            const left = new OzTime(Date.UTC(2026, 2, 10, 12, 0, 0));
            const right = new OzTime(Date.UTC(2026, 0, 15, 12, 0, 0));

            expect(diff(left, right, 'month')).toBe(1);
        });

        it('returns whole calendar years', () => {
            const left = new OzTime(Date.UTC(2026, 5, 20, 12, 0, 0));
            const right = new OzTime(Date.UTC(2024, 5, 20, 12, 0, 0));

            expect(diff(left, right, 'year')).toBe(2);
        });

        it('does not count incomplete year', () => {
            const left = new OzTime(Date.UTC(2026, 4, 1, 12, 0, 0));
            const right = new OzTime(Date.UTC(2024, 5, 20, 12, 0, 0));

            expect(diff(left, right, 'year')).toBe(1);
        });

        it('supports unit aliases for fixed units', () => {
            const left = new OzTime(Date.UTC(2026, 0, 15, 12, 0, 0));
            const right = new OzTime(Date.UTC(2026, 0, 15, 10, 0, 0));

            expect(diff(left, right, 'h')).toBe(2);
        });

        it('throws for invalid arguments', () => {
            const valid = new OzTime(Date.UTC(2026, 0, 1, 0, 0, 0));

            expect(() => diff(valid, {}, 'day')).toThrow();
            expect(() => diff({}, valid, 'day')).toThrow();
            expect(() => diff(valid, valid, 'unknown')).toThrow();
        });
    });
});
