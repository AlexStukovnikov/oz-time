import { describe, it, expect } from 'vitest';
import { OzTime } from '../../src/core/core.js';
import { add, subtract } from '../../src/modules/arithmetic.js';

describe('arithmetic module', () => {
    describe('add', () => {
        it('adds fixed units and returns new OzTime', () => {
            const time = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0), 'UTC', 'en-US');
            const result = add(time, 2, 'hour');

            expect(result).toBeInstanceOf(OzTime);
            expect(result).not.toBe(time);
            expect(result.toISOString()).toBe('2026-03-05T14:00:00.000Z');
        });

        it('adds calendar months correctly', () => {
            const time = new OzTime(Date.UTC(2026, 0, 31, 12, 0, 0), 'UTC', 'en-US');
            const result = add(time, 1, 'month');

            expect(result.toISOString()).toBe('2026-02-28T12:00:00.000Z');
        });

        it('adds calendar years correctly', () => {
            const time = new OzTime(Date.UTC(2024, 1, 29, 12, 0, 0), 'UTC', 'en-US');
            const result = add(time, 1, 'year');

            expect(result.toISOString()).toBe('2025-02-28T12:00:00.000Z');
        });

        it('supports unit aliases', () => {
            const time = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0), 'UTC', 'en-US');

            expect(add(time, 30, 'minutes').toISOString()).toBe('2026-03-05T12:30:00.000Z');
            expect(add(time, 1, 'days').toISOString()).toBe('2026-03-06T12:00:00.000Z');
        });

        it('supports negative values', () => {
            const time = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0), 'UTC', 'en-US');
            const result = add(time, -2, 'hour');

            expect(result.toISOString()).toBe('2026-03-05T10:00:00.000Z');
        });

        it('preserves timezone and locale', () => {
            const time = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0), 'Europe/Moscow', 'ru-RU');
            const result = add(time, 1, 'day');

            expect(result.getTimezone()).toBe('Europe/Moscow');
            expect(result.getLocale()).toBe('ru-RU');
        });

        it('throws for unsupported normalized unit', () => {
            const valid = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0));
            expect(() => add(valid, 1, 'quarter')).toThrow();
        });

        it('throws for invalid arguments', () => {
            const valid = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0), 'UTC', 'en-US');

            expect(() => add({}, 1, 'day')).toThrow();
            expect(() => add(valid, '1', 'day')).toThrow();
            expect(() => add(valid, 1, 'unknown')).toThrow();
        });
    });

    describe('subtract', () => {
        it('subtracts fixed units', () => {
            const time = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0), 'UTC', 'en-US');
            const result = subtract(time, 2, 'hour');

            expect(result).toBeInstanceOf(OzTime);
            expect(result.toISOString()).toBe('2026-03-05T10:00:00.000Z');
        });

        it('subtracts calendar months correctly', () => {
            const time = new OzTime(Date.UTC(2026, 2, 31, 12, 0, 0), 'UTC', 'en-US');
            const result = subtract(time, 1, 'month');

            expect(result.toISOString()).toBe('2026-02-28T12:00:00.000Z');
        });

        it('subtracts calendar years correctly', () => {
            const time = new OzTime(Date.UTC(2025, 1, 28, 12, 0, 0), 'UTC', 'en-US');
            const result = subtract(time, 1, 'year');

            expect(result.toISOString()).toBe('2024-02-28T12:00:00.000Z');
        });

        it('supports negative values as inverse operation', () => {
            const time = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0), 'UTC', 'en-US');
            const result = subtract(time, -2, 'hour');

            expect(result.toISOString()).toBe('2026-03-05T14:00:00.000Z');
        });

        it('throws for invalid arguments', () => {
            const valid = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0), 'UTC', 'en-US');

            expect(() => subtract({}, 1, 'day')).toThrow();
            expect(() => subtract(valid, '1', 'day')).toThrow();
            expect(() => subtract(valid, 1, 'unknown')).toThrow();
        });
    });
});
