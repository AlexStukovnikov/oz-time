import { describe, it, expect } from 'vitest';
import { OzTime } from '../../src/core/core.js';
import { setTimezone, getTimezoneOffset } from '../../src/modules/timezone.js';

describe('timezone module', () => {
    describe('setTimezone', () => {
        it('returns new OzTime with same timestamp and new timezone', () => {
            const time = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0), 'UTC', 'en-US');
            const result = setTimezone(time, 'Europe/Moscow');

            expect(result).toBeInstanceOf(OzTime);
            expect(result).not.toBe(time);
            expect(result.getTimestamp()).toBe(time.getTimestamp());
            expect(result.getTimezone()).toBe('Europe/Moscow');
            expect(result.getLocale()).toBe('en-US');
        });

        it('throws for invalid first argument', () => {
            expect(() => setTimezone({}, 'UTC')).toThrow();
        });

        it('throws for empty timezone', () => {
            const time = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0), 'UTC', 'en-US');

            expect(() => setTimezone(time, '')).toThrow();
            expect(() => setTimezone(time, '   ')).toThrow();
        });

        it('throws for unsupported timezone', () => {
            const time = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0), 'UTC', 'en-US');

            expect(() => setTimezone(time, 'Bad/Zone')).toThrow();
        });
    });

    describe('getTimezoneOffset', () => {
        it('returns 0 for UTC', () => {
            const time = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0), 'UTC', 'en-US');

            expect(getTimezoneOffset(time)).toBe(0);
        });

        it('returns number for valid timezone', () => {
            const time = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0), 'Europe/Moscow', 'en-US');

            expect(typeof getTimezoneOffset(time)).toBe('number');
        });

        it('returns stable offset for Europe/Moscow', () => {
            const time = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0), 'Europe/Moscow', 'en-US');

            expect(getTimezoneOffset(time)).toBe(180);
        });

        it('throws for invalid argument', () => {
            expect(() => getTimezoneOffset({})).toThrow();
        });
    });
});
