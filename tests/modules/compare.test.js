import { describe, it, expect } from 'vitest';
import { OzTime } from '../../src/core/core.js';
import { isSame, isBefore, isAfter, isBetween } from '../../src/modules/compare.js';

describe('compare module', () => {
    describe('isSame', () => {
        it('returns true for equal timestamps', () => {
            const a = new OzTime(Date.UTC(2026, 2, 5, 10, 20, 30, 400));
            const b = new OzTime(Date.UTC(2026, 2, 5, 10, 20, 30, 400));

            expect(isSame(a, b)).toBe(true);
        });

        it('compares by hour', () => {
            const a = new OzTime(Date.UTC(2026, 2, 5, 10, 20, 30));
            const b = new OzTime(Date.UTC(2026, 2, 5, 10, 59, 59));

            expect(isSame(a, b, 'hour')).toBe(true);
        });

        it('supports unit aliases', () => {
            const a = new OzTime(Date.UTC(2026, 2, 5, 10, 20, 30));
            const b = new OzTime(Date.UTC(2026, 2, 5, 10, 59, 59));

            expect(isSame(a, b, 'h')).toBe(true);
            expect(isSame(a, b, 'm')).toBe(false);
        });

        it('compares by month', () => {
            const a = new OzTime(Date.UTC(2026, 2, 1, 0, 0, 0));
            const b = new OzTime(Date.UTC(2026, 2, 31, 23, 59, 59));

            expect(isSame(a, b, 'month')).toBe(true);
        });

        it('compares by year', () => {
            const a = new OzTime(Date.UTC(2026, 0, 1, 0, 0, 0));
            const b = new OzTime(Date.UTC(2026, 11, 31, 23, 59, 59));

            expect(isSame(a, b, 'year')).toBe(true);
        });

        it('throws for invalid arguments', () => {
            const valid = new OzTime(Date.UTC(2026, 0, 1));

            expect(() => isSame(valid, {})).toThrow();
            expect(() => isSame({}, valid)).toThrow();
        });
    });

    describe('isBefore', () => {
        it('returns true when first value is before second', () => {
            const a = new OzTime(Date.UTC(2026, 2, 5, 10, 0, 0));
            const b = new OzTime(Date.UTC(2026, 2, 5, 11, 0, 0));

            expect(isBefore(a, b)).toBe(true);
        });

        it('compares by day', () => {
            const a = new OzTime(Date.UTC(2026, 2, 5, 23, 59, 59));
            const b = new OzTime(Date.UTC(2026, 2, 6, 0, 0, 0));

            expect(isBefore(a, b, 'day')).toBe(true);
        });

        it('returns false when values are same in given unit', () => {
            const a = new OzTime(Date.UTC(2026, 2, 5, 10, 10, 0));
            const b = new OzTime(Date.UTC(2026, 2, 5, 10, 50, 0));

            expect(isBefore(a, b, 'hour')).toBe(false);
        });

        it('throws for invalid arguments', () => {
            const valid = new OzTime(Date.UTC(2026, 0, 1));

            expect(() => isBefore(valid, {})).toThrow();
            expect(() => isBefore({}, valid)).toThrow();
        });
    });

    describe('isAfter', () => {
        it('returns true when first value is after second', () => {
            const a = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0));
            const b = new OzTime(Date.UTC(2026, 2, 5, 11, 0, 0));

            expect(isAfter(a, b)).toBe(true);
        });

        it('compares by month', () => {
            const a = new OzTime(Date.UTC(2026, 3, 1, 0, 0, 0));
            const b = new OzTime(Date.UTC(2026, 2, 31, 23, 59, 59));

            expect(isAfter(a, b, 'month')).toBe(true);
        });

        it('returns false when values are same in given unit', () => {
            const a = new OzTime(Date.UTC(2026, 2, 5, 10, 10, 0));
            const b = new OzTime(Date.UTC(2026, 2, 5, 10, 50, 0));

            expect(isAfter(a, b, 'hour')).toBe(false);
        });

        it('throws for invalid arguments', () => {
            const valid = new OzTime(Date.UTC(2026, 0, 1));

            expect(() => isAfter(valid, {})).toThrow();
            expect(() => isAfter({}, valid)).toThrow();
        });
    });

    describe('isBetween', () => {
        it('returns true for inclusive boundaries by default', () => {
            const target = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0));
            const start = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0));
            const end = new OzTime(Date.UTC(2026, 2, 6, 12, 0, 0));

            expect(isBetween(target, start, end)).toBe(true);
        });

        it('supports exclusive boundaries', () => {
            const target = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0));
            const start = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0));
            const end = new OzTime(Date.UTC(2026, 2, 6, 12, 0, 0));

            expect(isBetween(target, start, end, 'millisecond', '()')).toBe(false);
        });

        it('supports reversed boundaries', () => {
            const target = new OzTime(Date.UTC(2026, 2, 5, 18, 0, 0));
            const start = new OzTime(Date.UTC(2026, 2, 6, 0, 0, 0));
            const end = new OzTime(Date.UTC(2026, 2, 5, 0, 0, 0));

            expect(isBetween(target, start, end)).toBe(true);
        });

        it('supports unit-aware comparison', () => {
            const target = new OzTime(Date.UTC(2026, 2, 5, 10, 30, 0));
            const start = new OzTime(Date.UTC(2026, 2, 5, 10, 0, 0));
            const end = new OzTime(Date.UTC(2026, 2, 5, 10, 59, 59));

            expect(isBetween(target, start, end, 'hour', '[]')).toBe(true);
            expect(isBetween(target, start, end, 'minute', '[]')).toBe(true);
        });

        it('throws for invalid inclusivity', () => {
            const target = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0));
            const start = new OzTime(Date.UTC(2026, 2, 5, 0, 0, 0));
            const end = new OzTime(Date.UTC(2026, 2, 6, 0, 0, 0));

            expect(() => isBetween(target, start, end, 'day', '??')).toThrow();
        });

        it('throws for invalid arguments', () => {
            const valid = new OzTime(Date.UTC(2026, 0, 1));

            expect(() => isBetween(valid, {}, valid)).toThrow();
            expect(() => isBetween({}, valid, valid)).toThrow();
            expect(() => isBetween(valid, valid, {})).toThrow();
        });
    });
});
