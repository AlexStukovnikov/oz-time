import { describe, it, expect } from 'vitest';
import { OzTime } from '../../src/core/core.js';
import { Interval, interval } from '../../src/modules/interval.js';

describe('interval module', () => {
    const start = new OzTime(Date.UTC(2026, 0, 10, 10, 0, 0));
    const middle = new OzTime(Date.UTC(2026, 0, 10, 12, 0, 0));
    const end = new OzTime(Date.UTC(2026, 0, 14, 10, 0, 0));
    const outside = new OzTime(Date.UTC(2026, 0, 15, 10, 0, 0));

    it('creates interval via constructor', () => {
        const i = new Interval(start, end);

        expect(i.getStart()).toBe(start);
        expect(i.getEnd()).toBe(end);
    });

    it('creates interval via factory', () => {
        const i = interval(start, end);

        expect(i).toBeInstanceOf(Interval);
        expect(i.getStart()).toBe(start);
        expect(i.getEnd()).toBe(end);
    });

    it('contains returns true for inner moment', () => {
        const i = interval(start, end);

        expect(i.contains(middle)).toBe(true);
    });

    it('contains returns true for interval boundaries', () => {
        const i = interval(start, end);

        expect(i.contains(start)).toBe(true);
        expect(i.contains(end)).toBe(true);
    });

    it('contains returns false for outside moment', () => {
        const i = interval(start, end);

        expect(i.contains(outside)).toBe(false);
    });

    it('overlaps returns true for intersecting intervals', () => {
        const i1 = interval(new OzTime(Date.UTC(2026, 0, 10, 10, 0, 0)), new OzTime(Date.UTC(2026, 0, 10, 14, 0, 0)));

        const i2 = interval(new OzTime(Date.UTC(2026, 0, 10, 13, 0, 0)), new OzTime(Date.UTC(2026, 0, 10, 16, 0, 0)));

        expect(i1.overlaps(i2)).toBe(true);
        expect(i2.overlaps(i1)).toBe(true);
    });

    it('overlaps returns false for non-intersecting intervals', () => {
        const i1 = interval(new OzTime(Date.UTC(2026, 0, 10, 10, 0, 0)), new OzTime(Date.UTC(2026, 0, 10, 12, 0, 0)));

        const i2 = interval(new OzTime(Date.UTC(2026, 0, 10, 13, 0, 0)), new OzTime(Date.UTC(2026, 0, 10, 15, 0, 0)));

        expect(i1.overlaps(i2)).toBe(false);
    });

    it('duration returns interval length in days', () => {
        const i = interval(new OzTime(Date.UTC(2026, 0, 10, 10, 0, 0)), new OzTime(Date.UTC(2026, 0, 13, 10, 0, 0)));

        expect(i.duration('day')).toBe(3);
    });

    it('duration throws for calendar units', () => {
        const i = interval(start, end);

        expect(() => i.duration('month')).toThrow();
    });

    it('throws if start is after end', () => {
        expect(() => interval(end, start)).toThrow();
    });
});
