import { describe, it, expect } from 'vitest';
import { Duration, duration } from '../../src/modules/duration.js';

describe('duration module', () => {
    it('creates Duration directly', () => {
        const d = new Duration(3600000);
        expect(d.toMilliseconds()).toBe(3600000);
        expect(d.asMilliseconds()).toBe(3600000);
    });

    it('throws for invalid constructor value', () => {
        expect(() => new Duration('1000')).toThrow();
        expect(() => new Duration(NaN)).toThrow();
    });

    it('creates duration from fixed units', () => {
        const d = duration(2, 'hour');
        expect(d.asHours()).toBe(2);
        expect(d.asMinutes()).toBe(120);
        expect(d.asSeconds()).toBe(7200);
        expect(d.asDays()).toBeCloseTo(2 / 24);
    });

    it('creates Duration from factory', () => {
        const d = duration(2, 'hour');

        expect(d).toBeInstanceOf(Duration);
        expect(d.asMilliseconds()).toBe(2 * 60 * 60 * 1000);
    });

    it('converts duration to seconds, minutes, hours and days', () => {
        const d = duration(48, 'hour');

        expect(d.asMilliseconds()).toBe(48 * 60 * 60 * 1000);
        expect(d.asSeconds()).toBe(48 * 60 * 60);
        expect(d.asMinutes()).toBe(48 * 60);
        expect(d.asHours()).toBe(48);
        expect(d.asDays()).toBe(2);
    });

    it('supports unit aliases', () => {
        const d = duration(30, 'minutes');

        expect(d.asMinutes()).toBe(30);
        expect(d.asHours()).toBe(0.5);
    });

    it('adds two durations', () => {
        const d1 = duration(2, 'hour');
        const d2 = duration(30, 'minute');
        const result = d1.add(d2);

        expect(result).toBeInstanceOf(Duration);
        expect(result.asMinutes()).toBe(150);
        expect(result.asHours()).toBe(2.5);
    });

    it('supports negative durations', () => {
        const d = duration(-2, 'hour');

        expect(d.asHours()).toBe(-2);
        expect(d.asMinutes()).toBe(-120);
    });

    it('throws for calendar units', () => {
        expect(() => duration(1, 'month')).toThrow();
        expect(() => duration(1, 'year')).toThrow();
    });

    it('throws when adding non-Duration value', () => {
        const d = duration(1, 'hour');

        expect(() => d.add(123)).toThrow();
    });

    it('throws for invalid amount', () => {
        expect(() => duration('2', 'hour')).toThrow();
        expect(() => duration(NaN, 'hour')).toThrow();
    });
});
