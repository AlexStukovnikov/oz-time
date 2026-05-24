const UNIT_ALIASES = {
    millisecond: 'millisecond',
    milliseconds: 'millisecond',
    ms: 'millisecond',

    second: 'second',
    seconds: 'second',
    s: 'second',

    minute: 'minute',
    minutes: 'minute',
    m: 'minute',

    hour: 'hour',
    hours: 'hour',
    h: 'hour',

    day: 'day',
    days: 'day',
    d: 'day',

    month: 'month',
    months: 'month',

    year: 'year',
    years: 'year',
    y: 'year',
};

export const FIXED_UNIT_TO_MS = {
    millisecond: 1,
    second: 1000,
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
};

export const CALENDAR_UNITS = ['month', 'year'];

export function normalizeUnit(unit) {
    if (typeof unit !== 'string' || unit.trim() === '') {
        throw new TypeError('normalizeUnit: unit must be a non-empty string');
    }

    const normalized = unit.toLowerCase().trim();
    const canonical = UNIT_ALIASES[normalized];

    if (!canonical) {
        throw new Error(`Unsupported unit: ${unit}`);
    }

    return canonical;
}

export function isFixedUnit(unit) {
    return normalizeUnit(unit) in FIXED_UNIT_TO_MS;
}

export function isCalendarUnit(unit) {
    return CALENDAR_UNITS.includes(normalizeUnit(unit));
}

export function unitToMilliseconds(unit) {
    const normalizedUnit = normalizeUnit(unit);

    if (!(normalizedUnit in FIXED_UNIT_TO_MS)) {
        throw new Error(`Unit cannot be converted to milliseconds exactly: ${unit}`);
    }

    return FIXED_UNIT_TO_MS[normalizedUnit];
}
