import { OzTime } from './core.js';
import { daysInMonth } from '../utils/calendar.js';

function assertValidTimestamp(timestamp) {
    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
        throw new TypeError('fromTimestamp: timestamp must be a valid number');
    }
}

function assertValidDate(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
        throw new TypeError('fromDate: date must be a valid Date');
    }
}

function assertInteger(value, name) {
    if (!Number.isInteger(value)) {
        throw new TypeError(`${name} must be an integer`);
    }
}

export function now(timezone = 'UTC', locale = 'en-US') {
    return new OzTime(Date.now(), timezone, locale);
}

export function fromTimestamp(timestamp, timezone = 'UTC', locale = 'en-US') {
    assertValidTimestamp(timestamp);
    return new OzTime(timestamp, timezone, locale);
}

export function fromDate(date, timezone = 'UTC', locale = 'en-US') {
    assertValidDate(date);
    return new OzTime(date.getTime(), timezone, locale);
}

export function fromISO(isoString, timezone = 'UTC', locale = 'en-US') {
    if (typeof isoString !== 'string' || isoString.trim() === '') {
        throw new TypeError('fromISO: isoString must be a non-empty string');
    }

    const ts = Date.parse(isoString);

    if (Number.isNaN(ts)) {
        throw new Error(`Invalid ISO date string: ${isoString}`);
    }

    return new OzTime(ts, timezone, locale);
}

export function fromComponents(year, month, day, hour = 0, minute = 0, second = 0, ms = 0, timezone = 'UTC', locale = 'en-US') {
    assertInteger(year, 'year');
    assertInteger(month, 'month');
    assertInteger(day, 'day');
    assertInteger(hour, 'hour');
    assertInteger(minute, 'minute');
    assertInteger(second, 'second');
    assertInteger(ms, 'millisecond');

    if (month < 1 || month > 12) {
        throw new RangeError('month must be between 1 and 12');
    }

    if (hour < 0 || hour > 23) {
        throw new RangeError('hour must be between 0 and 23');
    }

    if (minute < 0 || minute > 59) {
        throw new RangeError('minute must be between 0 and 59');
    }

    if (second < 0 || second > 59) {
        throw new RangeError('second must be between 0 and 59');
    }

    if (ms < 0 || ms > 999) {
        throw new RangeError('millisecond must be between 0 and 999');
    }

    const maxDay = daysInMonth(year, month);

    if (day < 1 || day > maxDay) {
        throw new RangeError(`day must be between 1 and ${maxDay} for ${year}-${month}`);
    }

    const ts = Date.UTC(year, month - 1, day, hour, minute, second, ms);
    return new OzTime(ts, timezone, locale);
}
