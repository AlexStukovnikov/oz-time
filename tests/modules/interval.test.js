import { describe, it, expect } from 'vitest';
import { OzTime } from '../../src/core/core.js';
import { Interval, interval } from '../../src/modules/interval.js';

describe('interval module', () => {
    describe('Interval', () => {
        it('creates interval from valid OzTime values', () => {
            const start = new OzTime(Date.UTC(2026, 2, 5, 10, 0, 0));
            const end = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0));

            const result = new Interval(start, end);

            expect(result).toBeInstanceOf(Interval);
            expect(result.getStart()).toBe(start);
            expect(result.getEnd()).toBe(end);
        });

        it('throws when start is after end', () => {
            const start = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0));
            const end = new OzTime(Date.UTC(2026, 2, 5, 10, 0, 0));

            expect(() => new Interval(start, end)).toThrow();
        });

        it('throws for invalid arguments', () => {
            const valid = new OzTime(Date.UTC(2026, 2, 5, 10, 0, 0));

            expect(() => new Interval({}, valid)).toThrow();
            expect(() => new Interval(valid, {})).toThrow();
        });
    });

    describe('interval factory', () => {
        it('creates Interval instance', () => {
            const start = new OzTime(Date.UTC(2026, 2, 5, 10, 0, 0));
            const end = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0));

            const result = interval(start, end);

            expect(result).toBeInstanceOf(Interval);
        });
    });

    describe('contains', () => {
        it('returns true for moment inside interval', () => {
            const start = new OzTime(Date.UTC(2026, 2, 5, 10, 0, 0));
            const end = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0));
            const target = new OzTime(Date.UTC(2026, 2, 5, 11, 0, 0));

            const result = interval(start, end);

            expect(result.contains(target)).toBe(true);
        });

        it('includes boundaries', () => {
            const start = new OzTime(Date.UTC(2026, 2, 5, 10, 0, 0));
            const end = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0));

            const result = interval(start, end);

            expect(result.contains(start)).toBe(true);
            expect(result.contains(end)).toBe(true);
        });

        it('returns false for moment outside interval', () => {
            const start = new OzTime(Date.UTC(2026, 2, 5, 10, 0, 0));
            const end = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0));
            const target = new OzTime(Date.UTC(2026, 2, 5, 13, 0, 0));

            const result = interval(start, end);

            expect(result.contains(target)).toBe(false);
        });

        it('throws for invalid argument', () => {
            const start = new OzTime(Date.UTC(2026, 2, 5, 10, 0, 0));
            const end = new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0));

            const result = interval(start, end);

            expect(() => result.contains({})).toThrow();
        });
    });

    describe('overlaps', () => {
        it('returns true for overlapping intervals', () => {
            const a = interval(new OzTime(Date.UTC(2026, 2, 5, 10, 0, 0)), new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0)));

            const b = interval(new OzTime(Date.UTC(2026, 2, 5, 11, 0, 0)), new OzTime(Date.UTC(2026, 2, 5, 13, 0, 0)));

            expect(a.overlaps(b)).toBe(true);
        });

        it('returns true for touching intervals', () => {
            const a = interval(new OzTime(Date.UTC(2026, 2, 5, 10, 0, 0)), new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0)));

            const b = interval(new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0)), new OzTime(Date.UTC(2026, 2, 5, 14, 0, 0)));

            expect(a.overlaps(b)).toBe(true);
        });

        it('returns false for non-overlapping intervals', () => {
            const a = interval(new OzTime(Date.UTC(2026, 2, 5, 10, 0, 0)), new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0)));

            const b = interval(new OzTime(Date.UTC(2026, 2, 5, 13, 0, 0)), new OzTime(Date.UTC(2026, 2, 5, 14, 0, 0)));

            expect(a.overlaps(b)).toBe(false);
        });

        it('throws for invalid argument', () => {
            const a = interval(new OzTime(Date.UTC(2026, 2, 5, 10, 0, 0)), new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0)));

            expect(() => a.overlaps({})).toThrow();
        });
    });

    describe('duration', () => {
        it('returns duration in milliseconds by default', () => {
            const result = interval(new OzTime(Date.UTC(2026, 2, 5, 10, 0, 0)), new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0)));

            expect(result.duration()).toBe(2 * 60 * 60 * 1000);
        });

        it('returns duration in fixed units', () => {
            const result = interval(new OzTime(Date.UTC(2026, 2, 5, 10, 0, 0)), new OzTime(Date.UTC(2026, 2, 5, 12, 30, 0)));

            expect(result.duration('hour')).toBe(2.5);
            expect(result.duration('minute')).toBe(150);
        });

        it('supports unit aliases', () => {
            const result = interval(new OzTime(Date.UTC(2026, 2, 5, 10, 0, 0)), new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0)));

            expect(result.duration('h')).toBe(2);
        });

        it('throws for calendar units', () => {
            const result = interval(new OzTime(Date.UTC(2026, 2, 5, 10, 0, 0)), new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0)));

            expect(() => result.duration('month')).toThrow();
            expect(() => result.duration('year')).toThrow();
        });

        it('throws for invalid unit', () => {
            const result = interval(new OzTime(Date.UTC(2026, 2, 5, 10, 0, 0)), new OzTime(Date.UTC(2026, 2, 5, 12, 0, 0)));

            expect(() => result.duration('unknown')).toThrow();
        });
    });
});
