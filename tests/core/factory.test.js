import { describe, it, expect } from 'vitest';
import { OzTime } from '../../src/core/core.js';
import { now, fromTimestamp, fromDate, fromISO, fromComponents } from '../../src/core/factory.js';

describe('factory module', () => {
    describe('now', () => {
        it('creates OzTime instance with current timestamp', () => {
            const before = Date.now();
            const result = now('UTC', 'en-US');
            const after = Date.now();

            expect(result).toBeInstanceOf(OzTime);
            expect(result.getTimezone()).toBe('UTC');
            expect(result.getLocale()).toBe('en-US');
            expect(result.getTimestamp()).toBeGreaterThanOrEqual(before);
            expect(result.getTimestamp()).toBeLessThanOrEqual(after);
        });
    });

    describe('fromTimestamp', () => {
        it('creates OzTime from valid timestamp', () => {
            const ts = Date.UTC(2026, 2, 5, 12, 0, 0);
            const result = fromTimestamp(ts, 'Europe/Moscow', 'ru-RU');

            expect(result).toBeInstanceOf(OzTime);
            expect(result.getTimestamp()).toBe(ts);
            expect(result.getTimezone()).toBe('Europe/Moscow');
            expect(result.getLocale()).toBe('ru-RU');
        });

        it('throws for invalid timestamp', () => {
            expect(() => fromTimestamp('123')).toThrow();
            expect(() => fromTimestamp(NaN)).toThrow();
        });
    });

    describe('fromDate', () => {
        it('creates OzTime from valid Date', () => {
            const date = new Date(Date.UTC(2026, 2, 5, 12, 0, 0));
            const result = fromDate(date, 'UTC', 'en-US');

            expect(result).toBeInstanceOf(OzTime);
            expect(result.getTimestamp()).toBe(date.getTime());
        });

        it('throws for invalid Date', () => {
            expect(() => fromDate('2026-03-05')).toThrow();
            expect(() => fromDate(new Date('invalid'))).toThrow();
            expect(() => fromDate({})).toThrow();
        });
    });

    describe('fromISO', () => {
        it('creates OzTime from valid ISO string', () => {
            const result = fromISO('2026-03-05T12:00:00.000Z', 'UTC', 'en-US');

            expect(result).toBeInstanceOf(OzTime);
            expect(result.toISOString()).toBe('2026-03-05T12:00:00.000Z');
        });

        it('throws for invalid ISO string', () => {
            expect(() => fromISO('not-a-date')).toThrow();
            expect(() => fromISO('')).toThrow();
            expect(() => fromISO('   ')).toThrow();
        });
    });

    describe('fromComponents', () => {
        it('creates OzTime from valid components', () => {
            const result = fromComponents(2026, 3, 5, 12, 30, 15, 123, 'UTC', 'en-US');

            expect(result).toBeInstanceOf(OzTime);
            expect(result.toISOString()).toBe('2026-03-05T12:30:15.123Z');
            expect(result.getTimezone()).toBe('UTC');
            expect(result.getLocale()).toBe('en-US');
        });

        it('creates OzTime with default time parts', () => {
            const result = fromComponents(2026, 3, 5);

            expect(result.toISOString()).toBe('2026-03-05T00:00:00.000Z');
        });

        it('supports leap day', () => {
            const result = fromComponents(2024, 2, 29);

            expect(result.toISOString()).toBe('2024-02-29T00:00:00.000Z');
        });

        it('throws for invalid component types', () => {
            expect(() => fromComponents('2026', 3, 5)).toThrow();
            expect(() => fromComponents(2026, '3', 5)).toThrow();
            expect(() => fromComponents(2026, 3, '5')).toThrow();
        });

        it('throws for invalid month', () => {
            expect(() => fromComponents(2026, 0, 5)).toThrow();
            expect(() => fromComponents(2026, 13, 5)).toThrow();
        });

        it('throws for invalid day', () => {
            expect(() => fromComponents(2026, 2, 29)).toThrow();
            expect(() => fromComponents(2026, 4, 31)).toThrow();
            expect(() => fromComponents(2026, 3, 0)).toThrow();
        });

        it('throws for invalid time parts', () => {
            expect(() => fromComponents(2026, 3, 5, 24)).toThrow();
            expect(() => fromComponents(2026, 3, 5, 12, 60)).toThrow();
            expect(() => fromComponents(2026, 3, 5, 12, 30, 60)).toThrow();
            expect(() => fromComponents(2026, 3, 5, 12, 30, 15, 1000)).toThrow();
        });
    });
});
