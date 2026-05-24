import { normalizeUnit, isFixedUnit, unitToMilliseconds } from './units.js';

export function isLeapYear(year) {
    if (!Number.isInteger(year)) {
        throw new TypeError('isLeapYear: year must be an integer');
    }

    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function daysInMonth(year, month) {
    if (!Number.isInteger(year) || !Number.isInteger(month)) {
        throw new TypeError('daysInMonth: year and month must be integers');
    }

    if (month < 1 || month > 12) {
        throw new RangeError('daysInMonth: month must be between 1 and 12');
    }

    return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function addByFixedUnit(timestamp, amount, unit) {
    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
        throw new TypeError('addByFixedUnit: timestamp must be a valid number');
    }

    if (typeof amount !== 'number' || Number.isNaN(amount)) {
        throw new TypeError('addByFixedUnit: amount must be a valid number');
    }

    const normalizedUnit = normalizeUnit(unit);

    if (!isFixedUnit(normalizedUnit)) {
        throw new Error(`addByFixedUnit does not support calendar unit: ${unit}`);
    }

    return timestamp + amount * unitToMilliseconds(normalizedUnit);
}

export function addByCalendarUnit(timestamp, amount, unit) {
    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
        throw new TypeError('addByCalendarUnit: timestamp must be a valid number');
    }

    if (typeof amount !== 'number' || Number.isNaN(amount)) {
        throw new TypeError('addByCalendarUnit: amount must be a valid number');
    }

    const normalizedUnit = normalizeUnit(unit);
    const date = new Date(timestamp);

    if (normalizedUnit === 'month') {
        const originalDay = date.getUTCDate();

        date.setUTCDate(1);
        date.setUTCMonth(date.getUTCMonth() + amount);

        const maxDay = daysInMonth(date.getUTCFullYear(), date.getUTCMonth() + 1);
        date.setUTCDate(Math.min(originalDay, maxDay));

        return date.getTime();
    }

    if (normalizedUnit === 'year') {
        const originalMonth = date.getUTCMonth();
        const originalDay = date.getUTCDate();

        date.setUTCDate(1);
        date.setUTCFullYear(date.getUTCFullYear() + amount);
        date.setUTCMonth(originalMonth);

        const maxDay = daysInMonth(date.getUTCFullYear(), originalMonth + 1);
        date.setUTCDate(Math.min(originalDay, maxDay));

        return date.getTime();
    }

    throw new Error(`addByCalendarUnit supports only month and year: ${unit}`);
}
