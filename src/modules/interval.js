import { OzTime } from '../core/core.js';
import { normalizeUnit, isFixedUnit, unitToMilliseconds } from '../utils/units.js';

function assertOzTime(value, name) {
    if (!(value instanceof OzTime)) {
        throw new TypeError(`${name} must be OzTime`);
    }
}

export class Interval {
    constructor(start, end) {
        assertOzTime(start, 'start');
        assertOzTime(end, 'end');

        if (start.getTimestamp() > end.getTimestamp()) {
            throw new RangeError('Interval: start must be before or equal to end');
        }

        this._start = start;
        this._end = end;
    }

    getStart() {
        return this._start;
    }

    getEnd() {
        return this._end;
    }

    contains(moment) {
        assertOzTime(moment, 'moment');

        const ts = moment.getTimestamp();
        return ts >= this._start.getTimestamp() && ts <= this._end.getTimestamp();
    }

    overlaps(other) {
        if (!(other instanceof Interval)) {
            throw new TypeError('other must be Interval');
        }

        const startA = this._start.getTimestamp();
        const endA = this._end.getTimestamp();
        const startB = other.getStart().getTimestamp();
        const endB = other.getEnd().getTimestamp();

        return startA <= endB && startB <= endA;
    }

    duration(unit = 'millisecond') {
        const normalizedUnit = normalizeUnit(unit);

        if (!isFixedUnit(normalizedUnit)) {
            throw new Error(`Interval.duration supports only fixed units: ${unit}`);
        }

        const diffMs = this._end.getTimestamp() - this._start.getTimestamp();
        return diffMs / unitToMilliseconds(normalizedUnit);
    }
}

export function interval(start, end) {
    return new Interval(start, end);
}
