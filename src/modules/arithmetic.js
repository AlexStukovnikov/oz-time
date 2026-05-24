import { OzTime } from '../core/core.js';
import { normalizeUnit, isFixedUnit, isCalendarUnit } from '../utils/units.js';
import { addByFixedUnit, addByCalendarUnit } from '../utils/calendar.js';

function assertOzTime(value, name) {
    if (!(value instanceof OzTime)) {
        throw new TypeError(`${name} must be OzTime`);
    }
}

function assertAmount(amount) {
    if (typeof amount !== 'number' || Number.isNaN(amount)) {
        throw new TypeError('amount must be a valid number');
    }
}

export function add(time, amount, unit) {
    assertOzTime(time, 'time');
    assertAmount(amount);

    const normalizedUnit = normalizeUnit(unit);
    const timestamp = time.getTimestamp();

    let nextTimestamp;

    if (isFixedUnit(normalizedUnit)) {
        nextTimestamp = addByFixedUnit(timestamp, amount, normalizedUnit);
    } else if (isCalendarUnit(normalizedUnit)) {
        nextTimestamp = addByCalendarUnit(timestamp, amount, normalizedUnit);
    }

    return new OzTime(nextTimestamp, time.getTimezone(), time.getLocale());
}

export function subtract(time, amount, unit) {
    assertOzTime(time, 'time');
    assertAmount(amount);

    return add(time, -amount, unit);
}
