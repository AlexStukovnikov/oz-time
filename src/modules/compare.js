import { OzTime } from '../core/core.js';

function truncateToUnit(timestamp, unit) {
    const d = new Date(timestamp);

    switch (unit) {
        case 'millisecond':
        case 'ms':
            return timestamp;

        case 'second':
        case 's':
            d.setUTCMilliseconds(0);
            break;

        case 'minute':
        case 'm':
            d.setUTCSeconds(0, 0);
            break;

        case 'hour':
        case 'h':
            d.setUTCMinutes(0, 0, 0);
            break;

        case 'day':
        case 'd':
            d.setUTCHours(0, 0, 0, 0);
            break;

        default:
            throw new Error(`Unsupported unit for truncateToUnit: ${unit}`);
    }

    return d.getTime();
}

export function isSame(a, b, unit = 'millisecond') {
    if (!(a instanceof OzTime) || !(b instanceof OzTime)) {
        throw new TypeError('isSame: arguments must be OzTime');
    }
    const tsA = truncateToUnit(a.getTimestamp(), unit);
    const tsB = truncateToUnit(b.getTimestamp(), unit);
    return tsA === tsB;
}

export function isBefore(a, b, unit = 'millisecond') {
    if (!(a instanceof OzTime) || !(b instanceof OzTime)) {
        throw new TypeError('isBefore: arguments must be OzTime');
    }
    const tsA = truncateToUnit(a.getTimestamp(), unit);
    const tsB = truncateToUnit(b.getTimestamp(), unit);
    return tsA < tsB;
}

export function isAfter(a, b, unit = 'millisecond') {
    if (!(a instanceof OzTime) || !(b instanceof OzTime)) {
        throw new TypeError('isAfter: arguments must be OzTime');
    }
    const tsA = truncateToUnit(a.getTimestamp(), unit);
    const tsB = truncateToUnit(b.getTimestamp(), unit);
    return tsA > tsB;
}

export function isBetween(target, left, right, unit = 'millisecond', inclusive = '[]') {
    if (!(target instanceof OzTime) || !(left instanceof OzTime) || !(right instanceof OzTime)) {
        throw new TypeError('isBetween: arguments must be OzTime');
    }

    const t = truncateToUnit(target.getTimestamp(), unit);
    const l = truncateToUnit(left.getTimestamp(), unit);
    const r = truncateToUnit(right.getTimestamp(), unit);

    const min = Math.min(l, r);
    const max = Math.max(l, r);

    switch (inclusive) {
        case '[]':
            return t >= min && t <= max;
        case '[)':
            return t >= min && t < max;
        case '(]':
            return t > min && t <= max;
        case '()':
            return t > min && t < max;
        default:
            throw new Error(`Invalid inclusive value: ${inclusive}`);
    }
}
