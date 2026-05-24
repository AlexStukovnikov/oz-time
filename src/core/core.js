import { add, subtract } from '../modules/arithmetic.js';
import { format } from '../modules/format.js';
import { isSame, isBefore, isAfter, isBetween } from '../modules/compare.js';
import { setTimezone, getTimezoneOffset } from '../modules/timezone.js';
import { diff } from '../utils/calendar.js';

function assertValidTimestamp(timestamp) {
    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
        throw new TypeError('OzTime: timestamp must be a valid number');
    }
}

function assertValidTimezone(timezone) {
    if (typeof timezone !== 'string' || timezone.trim() === '') {
        throw new TypeError('OzTime: timezone must be a non-empty string');
    }
}

function assertValidLocale(locale) {
    if (typeof locale !== 'string' || locale.trim() === '') {
        throw new TypeError('OzTime: locale must be a non-empty string');
    }
}

export class OzTime {
    constructor(timestamp, timezone = 'UTC', locale = 'en-US') {
        assertValidTimestamp(timestamp);
        assertValidTimezone(timezone);
        assertValidLocale(locale);

        this._timestamp = timestamp;
        this._timezone = timezone;
        this._locale = locale;
    }

    getTimestamp() {
        return this._timestamp;
    }

    getTimezone() {
        return this._timezone;
    }

    getLocale() {
        return this._locale;
    }

    toTimestamp() {
        return this._timestamp;
    }

    toISOString() {
        return new Date(this._timestamp).toISOString();
    }

    add(amount, unit) {
        return add(this, amount, unit);
    }

    subtract(amount, unit) {
        return subtract(this, amount, unit);
    }

    format(template, locale) {
        return format(this, template, locale);
    }

    isSame(other, unit = 'millisecond') {
        return isSame(this, other, unit);
    }

    isBefore(other, unit = 'millisecond') {
        return isBefore(this, other, unit);
    }

    isAfter(other, unit = 'millisecond') {
        return isAfter(this, other, unit);
    }

    isBetween(start, end, unit = 'millisecond', inclusivity = '[]') {
    return isBetween(this, start, end, unit, inclusivity);
}

    setTimezone(timezone) {
        return setTimezone(this, timezone);
    }

    getTimezoneOffset() {
        return getTimezoneOffset(this);
    }

    diff(other, unit = 'millisecond') {
        return diff(this, other, unit);
    }
}
