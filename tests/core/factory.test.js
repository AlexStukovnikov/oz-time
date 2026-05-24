// tests/core/factory.test.js
import { describe, it, expect } from 'vitest';
import { now, fromTimestamp, fromDate, fromISO, fromComponents } from '../../src/core/factory.js';
import { OzTime } from '../../src/core/core.js';

describe('factory', () => {
    it('now returns OzTime', () => {
        const t = now();
        expect(t).toBeInstanceOf(OzTime);
    });

    it('fromTimestamp uses given timestamp', () => {
        const ts = 1234567890;
        const t = fromTimestamp(ts);
        expect(t.getTimestamp()).toBe(ts);
    });

    it('fromDate accepts Date instance', () => {
        const d = new Date('2026-03-01T00:00:00.000Z');
        const t = fromDate(d);
        expect(t).toBeInstanceOf(OzTime);
        expect(t.getTimestamp()).toBe(d.getTime());
    });

    it('fromISO parses ISO string', () => {
        const iso = '2026-03-01T00:00:00.000Z';
        const t = fromISO(iso);
        expect(t.getTimestamp()).toBe(Date.parse(iso));
    });

    it('fromComponents builds correct date', () => {
        const t = fromComponents(2026, 3, 1);
        const expected = Date.UTC(2026, 2, 1);
        expect(t.getTimestamp()).toBe(expected);
    });
});
