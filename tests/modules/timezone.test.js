// tests/modules/timezone.test.js
import { describe, it, expect } from 'vitest';
import { OzTime } from '../../src/core/core.js';
import { setTimezone, getTimezoneOffset } from '../../src/modules/timezone.js';

describe('timezone module', () => {
    it('setTimezone returns new OzTime with same timestamp and new timezone', () => {
        const ts = Date.UTC(2026, 0, 15, 12, 0, 0);
        const base = new OzTime(ts, 'UTC', 'en-US');

        const inMoscow = setTimezone(base, 'Europe/Moscow');

        expect(inMoscow).toBeInstanceOf(OzTime);
        expect(inMoscow.getTimestamp()).toBe(base.getTimestamp());
        expect(inMoscow.getTimezone()).toBe('Europe/Moscow');
        expect(inMoscow.getLocale()).toBe('en-US');

        expect(base.getTimezone()).toBe('UTC');
    });

    it('setTimezone throws for invalid timezone', () => {
        const ts = Date.UTC(2026, 0, 15, 12, 0, 0);
        const base = new OzTime(ts, 'UTC', 'en-US');

        expect(() => setTimezone(base, 'Mars/Olympus')).toThrow();
    });

    it('getTimezoneOffset returns offset in minutes', () => {
        const ts = Date.UTC(2026, 0, 15, 12, 0, 0);
        const moscow = new OzTime(ts, 'Europe/Moscow', 'ru-RU');

        expect(getTimezoneOffset(moscow)).toBe(180);
    });
});
