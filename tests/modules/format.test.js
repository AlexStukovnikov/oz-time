import { describe, it, expect } from 'vitest';
import { OzTime } from '../../src/core/core.js';
import { format } from '../../src/modules/format.js';

describe('format module', () => {
    it('formats numeric date tokens', () => {
        const time = new OzTime(Date.UTC(2026, 2, 5, 9, 7, 4, 123), 'UTC', 'en-US');

        expect(format(time, 'YYYY-MM-DD')).toBe('2026-03-05');
        expect(format(time, 'YY-M-D')).toBe('26-3-5');
    });

    it('formats time tokens', () => {
        const time = new OzTime(Date.UTC(2026, 2, 5, 9, 7, 4, 123), 'UTC', 'en-US');

        expect(format(time, 'HH:mm:ss')).toBe('09:07:04');
        expect(format(time, 'H')).toBe('9');
        expect(format(time, 'hh A')).toBe('09 AM');
        expect(format(time, 'h A')).toBe('9 AM');
        expect(format(time, 'SSS')).toBe('123');
    });

    it('formats English month and weekday names', () => {
        const time = new OzTime(Date.UTC(2026, 2, 5, 9, 7, 4, 123), 'UTC', 'en-US');

        expect(format(time, 'MMMM')).toBe('March');
        expect(format(time, 'dddd')).toBe('Thursday');
        expect(format(time, 'MMM')).not.toBe('');
        expect(format(time, 'ddd')).not.toBe('');
    });

    it('formats Russian month and weekday names', () => {
        const time = new OzTime(Date.UTC(2026, 2, 5, 9, 7, 4, 123), 'UTC', 'ru-RU');

        expect(format(time, 'MMMM')).toBe('март');
        expect(format(time, 'dddd')).toBe('четверг');
    });

    it('respects timezone when formatting', () => {
        const time = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0, 0), 'Europe/Moscow', 'en-US');

        expect(format(time, 'HH:mm')).toBe('15:00');
    });

    it('supports locale override', () => {
        const time = new OzTime(Date.UTC(2026, 2, 5, 9, 7, 4, 123), 'UTC', 'en-US');

        expect(format(time, 'MMMM', 'ru-RU')).toBe('март');
    });

    it('leaves unsupported tokens as plain text', () => {
        const time = new OzTime(Date.UTC(2026, 2, 5, 9, 7, 4, 123), 'UTC', 'en-US');

        expect(format(time, 'H:m')).toBe('9:m');
    });

    it('throws for invalid template', () => {
        const time = new OzTime(Date.UTC(2026, 2, 5, 9, 7, 4, 123), 'UTC', 'en-US');

        expect(() => format(time, '')).toThrow();
        expect(() => format(time, '   ')).toThrow();
        expect(() => format(time, 123)).toThrow();
    });

    it('throws for invalid first argument', () => {
        expect(() => format({}, 'YYYY-MM-DD')).toThrow();
    });
});
