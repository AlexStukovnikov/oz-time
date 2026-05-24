import { describe, it, expect } from 'vitest';
import { OzTime } from '../../src/core/core.js';

describe('OzTime core', () => {
    it('creates OzTime with timestamp, timezone and locale', () => {
        const time = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0), 'UTC', 'en-US');

        expect(time.getTimestamp()).toBe(Date.UTC(2026, 2, 5, 12, 0, 0));
        expect(time.getTimezone()).toBe('UTC');
        expect(time.getLocale()).toBe('en-US');
    });

    it('returns timestamp and ISO string', () => {
        const ts = Date.UTC(2026, 2, 5, 12, 0, 0, 123);
        const time = new OzTime(ts, 'UTC', 'en-US');

        expect(time.toTimestamp()).toBe(ts);
        expect(time.toISOString()).toBe('2026-03-05T12:00:00.123Z');
    });

    it('formats through instance method', () => {
        const time = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0), 'UTC', 'en-US');

        expect(time.format('YYYY-MM-DD')).toBe('2026-03-05');
    });

    it('supports arithmetic chaining', () => {
        const time = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0), 'UTC', 'en-US');
        const result = time.add(1, 'day').subtract(2, 'hour');

        expect(result).toBeInstanceOf(OzTime);
        expect(result.toISOString()).toBe('2026-03-06T10:00:00.000Z');
    });

    it('supports timezone-aware chaining', () => {
        const time = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0), 'UTC', 'en-US');
        const result = time.add(1, 'hour').setTimezone('Europe/Moscow').format('HH:mm');

        expect(result).toBe('16:00');
    });

    it('supports comparisons through instance methods', () => {
        const a = new OzTime(Date.UTC(2026, 2, 5, 10, 0, 0), 'UTC', 'en-US');
        const b = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0), 'UTC', 'en-US');
        const c = new OzTime(Date.UTC(2026, 2, 5, 10, 30, 0), 'UTC', 'en-US');

        expect(a.isBefore(b)).toBe(true);
        expect(b.isAfter(a)).toBe(true);
        expect(a.isSame(c, 'hour')).toBe(true);
    });

    it('supports isBetween through instance method', () => {
        const target = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0), 'UTC', 'en-US');
        const start = new OzTime(Date.UTC(2026, 2, 5, 0, 0, 0), 'UTC', 'en-US');
        const end = new OzTime(Date.UTC(2026, 2, 6, 0, 0, 0), 'UTC', 'en-US');

        expect(target.isBetween(start, end)).toBe(true);
        expect(target.isBetween(start, end, 'day', '[]')).toBe(true);
    });

    it('supports diff through instance method', () => {
        const a = new OzTime(Date.UTC(2026, 2, 6, 12, 0, 0), 'UTC', 'en-US');
        const b = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0), 'UTC', 'en-US');

        expect(a.diff(b, 'day')).toBe(1);
        expect(a.diff(b, 'hour')).toBe(24);
    });

    it('returns timezone offset through instance method', () => {
        const time = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0), 'UTC', 'en-US');

        expect(typeof time.getTimezoneOffset()).toBe('number');
    });

    it('throws for invalid constructor arguments', () => {
        expect(() => new OzTime('bad', 'UTC', 'en-US')).toThrow();
        expect(() => new OzTime(Date.now(), '', 'en-US')).toThrow();
        expect(() => new OzTime(Date.now(), 'UTC', '')).toThrow();
    });
});
