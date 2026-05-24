import { describe, it, expect } from 'vitest';
import { normalizeUnit, isFixedUnit, isCalendarUnit, unitToMilliseconds } from '../../src/utils/units.js';

describe('units utils', () => {
    it('normalizes unit aliases', () => {
        expect(normalizeUnit('ms')).toBe('millisecond');
        expect(normalizeUnit('seconds')).toBe('second');
        expect(normalizeUnit('h')).toBe('hour');
        expect(normalizeUnit('days')).toBe('day');
        expect(normalizeUnit('months')).toBe('month');
        expect(normalizeUnit('years')).toBe('year');
    });

    it('detects fixed units', () => {
        expect(isFixedUnit('millisecond')).toBe(true);
        expect(isFixedUnit('day')).toBe(true);
        expect(isFixedUnit('month')).toBe(false);
    });

    it('detects calendar units', () => {
        expect(isCalendarUnit('month')).toBe(true);
        expect(isCalendarUnit('year')).toBe(true);
        expect(isCalendarUnit('hour')).toBe(false);
    });

    it('returns milliseconds for fixed units', () => {
        expect(unitToMilliseconds('millisecond')).toBe(1);
        expect(unitToMilliseconds('second')).toBe(1000);
        expect(unitToMilliseconds('minute')).toBe(60000);
        expect(unitToMilliseconds('hour')).toBe(3600000);
        expect(unitToMilliseconds('day')).toBe(86400000);
    });

    it('throws for unknown unit normalization', () => {
        expect(() => normalizeUnit('quarter')).toThrow();
    });

    it('throws for unsupported unitToMilliseconds', () => {
        expect(() => unitToMilliseconds('month')).toThrow();
        expect(() => unitToMilliseconds('quarter')).toThrow();
    });
});
