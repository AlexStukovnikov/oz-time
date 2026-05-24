import { OzTime } from './core.js';

export function now(timezone = 'UTC', locale = 'en-US') {
    return new OzTime(Date.now(), timezone, locale);
}

export function fromTimestamp(timestamp, timezone = 'UTC', locale = 'en-US') {
    return new OzTime(timestamp, timezone, locale);
}

export function fromDate(date, timezone = 'UTC', locale = 'en-US') {
    const ts = date instanceof Date ? date.getTime() : new Date(date).getTime();
    return new OzTime(ts, timezone, locale);
}

export function fromISO(isoString, timezone = 'UTC', locale = 'en-US') {
    const ts = Date.parse(isoString);
    if (Number.isNaN(ts)) {
        throw new Error(`Invalid ISO date string: ${isoString}`);
    }
    return new OzTime(ts, timezone, locale);
}

export function fromComponents(
    year, 
    month, 
    day, 
    hour = 0, 
    minute = 0, 
    second = 0, 
    ms = 0, 
    timezone = 'UTC', 
    locale = 'en-US'
) {
    const ts = Date.UTC(year, month - 1, day, hour, minute, second, ms);
    return new OzTime(ts, timezone, locale);
}
