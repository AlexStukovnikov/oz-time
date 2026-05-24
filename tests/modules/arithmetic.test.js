import { describe, it, expect } from 'vitest';
import { OzTime } from '../../src/core/core.js';
import { add, subtract } from '../../src/modules/arithmetic.js';

describe('arithmetic module', () => {
    it('add returns new OzTime with shifted timestamp', () => {
        const base = new OzTime(Date.UTC(2026, 2, 1), 'UTC', 'en-US');
        const res = add(base, 1, 'day');

        expect(res).toBeInstanceOf(OzTime);
        expect(res.getTimestamp()).toBe(base.getTimestamp() + 24 * 60 * 60 * 1000);
        // неизменяемость
        expect(base.getTimestamp()).toBe(Date.UTC(2026, 2, 1));
    });

    it('subtract returns new OzTime with shifted timestamp', () => {
        const base = new OzTime(Date.UTC(2026, 2, 10), 'UTC', 'en-US');
        const res = subtract(base, 3, 'day');

        expect(res.getTimestamp()).toBe(base.getTimestamp() - 3 * 24 * 60 * 60 * 1000);
    });
});
