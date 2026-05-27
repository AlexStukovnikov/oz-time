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

    describe('Static factory methods', () => {
        it('creates instance via static now()', () => {
            const time = OzTime.now('Europe/Moscow', 'ru-RU');
            expect(time).toBeInstanceOf(OzTime);
            expect(time.getTimezone()).toBe('Europe/Moscow');
            expect(time.getLocale()).toBe('ru-RU');
            expect(typeof time.getTimestamp()).toBe('number');
        });

        it('creates instance via static fromTimestamp()', () => {
            const ts = Date.UTC(2026, 2, 5, 12, 0, 0);
            const time = OzTime.fromTimestamp(ts, 'UTC', 'en-US');
            expect(time).toBeInstanceOf(OzTime);
            expect(time.getTimestamp()).toBe(ts);
        });

        it('creates instance via static fromDate()', () => {
            const d = new Date(Date.UTC(2026, 2, 5, 12, 0, 0));
            const time = OzTime.fromDate(d, 'UTC', 'en-US');
            expect(time).toBeInstanceOf(OzTime);
            expect(time.getTimestamp()).toBe(d.getTime());
        });

        it('creates instance via static fromISO()', () => {
            const time = OzTime.fromISO('2026-03-05T12:00:00.000Z', 'UTC', 'en-US');
            expect(time).toBeInstanceOf(OzTime);
            expect(time.toTimestamp()).toBe(Date.UTC(2026, 2, 5, 12, 0, 0));
        });

        it('creates instance via static fromComponents()', () => {
            // Месяц март = 3
            const time = OzTime.fromComponents(2026, 3, 5, 12, 0, 0, 0, 'UTC', 'en-US');
            expect(time).toBeInstanceOf(OzTime);
            expect(time.toISOString()).toBe('2026-03-05T12:00:00.000Z');
        });

        it('creates interval via static interval()', () => {
            const start = OzTime.fromISO('2026-03-05T10:00:00Z');
            const end = OzTime.fromISO('2026-03-05T12:00:00Z');
            const range = OzTime.interval(start, end);
            
            // Проверяем, что вернулся объект интервала, у которого есть метод duration
            expect(typeof range.duration).toBe('function');
            expect(range.duration('hour')).toBe(2);
        });

        it('creates duration via static duration()', () => {
            const dur = OzTime.duration(2, 'hour');
            
            // Проверяем, что вернулся объект длительности, у которого есть методы as*
            expect(typeof dur.asMilliseconds).toBe('function');
            expect(dur.asMilliseconds()).toBe(2 * 60 * 60 * 1000);
            expect(dur.asMinutes()).toBe(120);
        });
    });
