import { OzTime } from '../core/core.js';

function validateTimezone(timezone) {
    if (typeof timezone !== 'string' || timezone.trim() === '') {
        throw new TypeError('setTimezone: timezone must be a non-empty string');
    }

    if (!Intl.supportedValuesOf('timeZone').includes(timezone)) {
        throw new Error(`Unsupported timezone: ${timezone}`);
    }
}

function getOffsetMinutesFor(timestamp, timeZone) {
    const date = new Date(timestamp);

    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const lookup = Object.fromEntries(parts.map((p) => [p.type, p.value]));

    const year = Number(lookup.year);
    const month = Number(lookup.month);
    const day = Number(lookup.day);
    const hour = Number(lookup.hour);
    const minute = Number(lookup.minute);
    const second = Number(lookup.second);

    const utcTimestamp = Date.UTC(year, month - 1, day, hour, minute, second);

    return (utcTimestamp - timestamp) / 60000;
}

export function setTimezone(time, timezone) {
    if (!(time instanceof OzTime)) {
        throw new TypeError('tz: first argument must be OzTime');
    }

    validateTimezone(timezone);

    return new OzTime(
        time.getTimestamp(),
        timezone,
        time.getLocale()
    );
}

export function getTimezoneOffset(time) {
    if (!(time instanceof OzTime)) {
        throw new TypeError('getTimezoneOffset: argument must be OzTime');
    }
    const timestamp = time.getTimestamp();
    const timeZone = time.getTimezone();
    return getOffsetMinutesFor(timestamp, timeZone);
}
