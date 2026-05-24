import { normalizeUnit, isFixedUnit, unitToMilliseconds } from './units.js';
import { OzTime } from '../core/core.js';

function assertValidTimestamp(timestamp, name) {
    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
        throw new TypeError(`${name}: timestamp must be a valid number`);
    }
}

function assertValidAmount(amount, name) {
    if (typeof amount !== 'number' || Number.isNaN(amount)) {
        throw new TypeError(`${name}: amount must be a valid number`);
    }
}

function assertOzTime(value, name) {
    if (!(value instanceof OzTime)) {
        throw new TypeError(`${name} must be OzTime`);
    }
}

function diffInMonths(leftTimestamp, rightTimestamp) {
    const left = new Date(leftTimestamp);
    const right = new Date(rightTimestamp);

    let months = (left.getUTCFullYear() - right.getUTCFullYear()) * 12 + (left.getUTCMonth() - right.getUTCMonth());

    const leftDay = left.getUTCDate();
    const rightDay = right.getUTCDate();

    if (months > 0 && leftDay < rightDay) {
        months -= 1;
    } else if (months < 0 && leftDay > rightDay) {
        months += 1;
    }

    return months;
}

function diffInYears(leftTimestamp, rightTimestamp) {
    const left = new Date(leftTimestamp);
    const right = new Date(rightTimestamp);

    let years = left.getUTCFullYear() - right.getUTCFullYear();

    const leftMonth = left.getUTCMonth();
    const rightMonth = right.getUTCMonth();
    const leftDay = left.getUTCDate();
    const rightDay = right.getUTCDate();

    if (years > 0 && (leftMonth < rightMonth || (leftMonth === rightMonth && leftDay < rightDay))) {
        years -= 1;
    } else if (years < 0 && (leftMonth > rightMonth || (leftMonth === rightMonth && leftDay > rightDay))) {
        years += 1;
    }

    return years;
}

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
    assertValidTimestamp(timestamp, 'addByFixedUnit');
    assertValidAmount(amount, 'addByFixedUnit');

    const normalizedUnit = normalizeUnit(unit);

    if (!isFixedUnit(normalizedUnit)) {
        throw new Error(`addByFixedUnit does not support calendar unit: ${unit}`);
    }

    return timestamp + amount * unitToMilliseconds(normalizedUnit);
}

export function addByCalendarUnit(timestamp, amount, unit) {
    assertValidTimestamp(timestamp, 'addByCalendarUnit');
    assertValidAmount(amount, 'addByCalendarUnit');

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

export function diff(left, right, unit = 'millisecond') {
    assertOzTime(left, 'left');
    assertOzTime(right, 'right');

    const normalizedUnit = normalizeUnit(unit);
    const leftTimestamp = left.getTimestamp();
    const rightTimestamp = right.getTimestamp();

    if (isFixedUnit(normalizedUnit)) {
        return (leftTimestamp - rightTimestamp) / unitToMilliseconds(normalizedUnit);
    }

    if (normalizedUnit === 'month') {
        return diffInMonths(leftTimestamp, rightTimestamp);
    }

    if (normalizedUnit === 'year') {
        return diffInYears(leftTimestamp, rightTimestamp);
    }

    throw new Error(`Unsupported unit: ${unit}`);
}
