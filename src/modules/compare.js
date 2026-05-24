import { OzTime } from '../core/core.js';
import { normalizeUnit } from '../utils/units.js';

function assertOzTime(value, name) {
    if (!(value instanceof OzTime)) {
        throw new TypeError(`${name} must be OzTime`);
    }
}

function truncateToUnit(timestamp, unit) {
    const normalizedUnit = normalizeUnit(unit);
    const d = new Date(timestamp);

    switch (normalizedUnit) {
        case 'millisecond':
            return d.getTime();

        case 'second':
            d.setUTCMilliseconds(0);
            break;

        case 'minute':
            d.setUTCSeconds(0, 0);
            break;

        case 'hour':
            d.setUTCMinutes(0, 0, 0);
            break;

        case 'day':
            d.setUTCHours(0, 0, 0, 0);
            break;

        case 'month':
            d.setUTCHours(0, 0, 0, 0);
            d.setUTCDate(1);
            break;

        case 'year':
            d.setUTCHours(0, 0, 0, 0);
            d.setUTCDate(1);
            d.setUTCMonth(0);
            break;

        default:
            throw new Error(`Unsupported unit for truncateToUnit: ${unit}`);
    }

    return d.getTime();
}

export function isSame(a, b, unit = 'millisecond') {
    assertOzTime(a, 'a');
    assertOzTime(b, 'b');

    const tsA = truncateToUnit(a.getTimestamp(), unit);
    const tsB = truncateToUnit(b.getTimestamp(), unit);

    return tsA === tsB;
}

export function isBefore(a, b, unit = 'millisecond') {
    assertOzTime(a, 'a');
    assertOzTime(b, 'b');

    const tsA = truncateToUnit(a.getTimestamp(), unit);
    const tsB = truncateToUnit(b.getTimestamp(), unit);

    return tsA < tsB;
}

export function isAfter(a, b, unit = 'millisecond') {
    assertOzTime(a, 'a');
    assertOzTime(b, 'b');

    const tsA = truncateToUnit(a.getTimestamp(), unit);
    const tsB = truncateToUnit(b.getTimestamp(), unit);

    return tsA > tsB;
}

export function isBetween(target, left, right, unit = 'millisecond', inclusivity = '[]') {
    assertOzTime(target, 'target');
    assertOzTime(left, 'left');
    assertOzTime(right, 'right');

    const t = truncateToUnit(target.getTimestamp(), unit);
    const l = truncateToUnit(left.getTimestamp(), unit);
    const r = truncateToUnit(right.getTimestamp(), unit);

    const min = Math.min(l, r);
    const max = Math.max(l, r);

    switch (inclusivity) {
        case '[]':
            return t >= min && t <= max;
        case '[)':
            return t >= min && t < max;
        case '(]':
            return t > min && t <= max;
        case '()':
            return t > min && t < max;
        default:
            throw new Error(`Invalid inclusivity value: ${inclusivity}`);
    }
}
