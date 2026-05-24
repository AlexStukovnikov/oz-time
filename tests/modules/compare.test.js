// tests/modules/compare.test.js
import { describe, it, expect } from 'vitest';
import { OzTime } from '../../src/core/core.js';
import { isSame, isBefore, isAfter, isBetween } from '../../src/modules/compare.js';

describe('compare module', () => {
    const t1 = new OzTime(Date.UTC(2026, 2, 1, 10, 30, 0));
    const t2 = new OzTime(Date.UTC(2026, 2, 1, 10, 30, 0));
    const t3 = new OzTime(Date.UTC(2026, 2, 1, 11, 0, 0));
    const tDayLater = new OzTime(Date.UTC(2026, 2, 2, 9, 0, 0));

    it('isSame with default (millisecond) precision', () => {
        expect(isSame(t1, t2)).toBe(true);
        expect(isSame(t1, t3)).toBe(false);
    });

    it('isSame with hour precision', () => {
        expect(isSame(t1, t3, 'hour')).toBe(false);
        expect(isSame(t1, t2, 'hour')).toBe(true);
    });

    it('isBefore and isAfter', () => {
        expect(isBefore(t1, t3)).toBe(true);
        expect(isBefore(t3, t1)).toBe(false);
        expect(isAfter(t3, t1)).toBe(true);
        expect(isAfter(t1, t3)).toBe(false);
    });

    it('isBetween inclusive []', () => {
        expect(isBetween(t3, t1, tDayLater, 'millisecond', '[]')).toBe(true);
        expect(isBetween(t1, t1, tDayLater, 'millisecond', '[]')).toBe(true);
        expect(isBetween(tDayLater, t1, tDayLater, 'millisecond', '[]')).toBe(true);
    });

    it('isBetween exclusive ()', () => {
        expect(isBetween(t3, t1, tDayLater, 'millisecond', '()')).toBe(true);
        expect(isBetween(t1, t1, tDayLater, 'millisecond', '()')).toBe(false);
        expect(isBetween(tDayLater, t1, tDayLater, 'millisecond', '()')).toBe(false);
    });
});
