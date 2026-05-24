import { describe, it, expect } from 'vitest';
import { normalizeUnit, isFixedUnit, isCalendarUnit, unitToMilliseconds } from '../../src/utils/units.js';

describe('units utils', () => {
    it('normalizes aliases correctly', () => {
        expect(normalizeUnit('hours')).toBe('hour');
        expect(normalizeUnit('ms')).toBe('millisecond');
        expect(normalizeUnit('y')).toBe('year');
    });

    it('detects fixed units', () => {
        expect(isFixedUnit('hour')).toBe(true);
        expect(isFixedUnit('day')).toBe(true);
        expect(isFixedUnit('month')).toBe(false);
    });

    it('detects calendar units', () => {
        expect(isCalendarUnit('month')).toBe(true);
        expect(isCalendarUnit('year')).toBe(true);
        expect(isCalendarUnit('minute')).toBe(false);
    });

    it('converts fixed units to milliseconds', () => {
        expect(unitToMilliseconds('second')).toBe(1000);
        expect(unitToMilliseconds('minute')).toBe(60 * 1000);
        expect(unitToMilliseconds('hour')).toBe(60 * 60 * 1000);
    });

    it('throws for calendar units in unitToMilliseconds', () => {
        expect(() => unitToMilliseconds('month')).toThrow();
    });
});
