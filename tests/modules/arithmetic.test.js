import { describe, it, expect } from 'vitest';
import { OzTime } from '../../src/core/core.js';
import { add, subtract } from '../../src/modules/arithmetic.js';

describe('arithmetic module', () => {
    it('adds fixed units', () => {
        const base = new OzTime(Date.UTC(2026, 0, 15, 12, 0, 0));
        const result = add(base, 2, 'day');

        expect(result.getTimestamp()).toBe(Date.UTC(2026, 0, 17, 12, 0, 0));
    });

    it('adds one month with calendar logic', () => {
        const base = new OzTime(Date.UTC(2026, 0, 31, 12, 0, 0)); // 31 Jan 2026
        const result = add(base, 1, 'month');

        expect(result.getTimestamp()).toBe(Date.UTC(2026, 1, 28, 12, 0, 0));
    });

    it('subtracts one year with calendar logic', () => {
        const base = new OzTime(Date.UTC(2026, 2, 1, 12, 0, 0)); // 1 Mar 2026
        const result = subtract(base, 1, 'year');

        expect(result.getTimestamp()).toBe(Date.UTC(2025, 2, 1, 12, 0, 0));
    });

    it('returns new OzTime preserving locale and timezone', () => {
        const base = new OzTime(Date.UTC(2026, 0, 15, 12, 0, 0), 'Europe/Moscow', 'ru-RU');
        const result = add(base, 1, 'hour');

        expect(result).toBeInstanceOf(OzTime);
        expect(result.getTimezone()).toBe('Europe/Moscow');
        expect(result.getLocale()).toBe('ru-RU');
    });
});
