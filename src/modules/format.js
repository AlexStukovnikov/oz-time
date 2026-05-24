import { OzTime } from '../core/core.js';

function assertOzTime(value) {
    if (!(value instanceof OzTime)) {
        throw new TypeError('format: first argument must be OzTime');
    }
}

function pad(value, length = 2) {
    return String(value).padStart(length, '0');
}

function getNumericParts(time, locale) {
    const formatter = new Intl.DateTimeFormat(locale, {
        timeZone: time.getTimezone(),
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    const parts = formatter.formatToParts(new Date(time.getTimestamp()));
    return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

function getMonthName(time, locale, length) {
    return new Intl.DateTimeFormat(locale, {
        timeZone: time.getTimezone(),
        month: length,
    }).format(new Date(time.getTimestamp()));
}

function getWeekdayName(time, locale, length) {
    return new Intl.DateTimeFormat(locale, {
        timeZone: time.getTimezone(),
        weekday: length,
    }).format(new Date(time.getTimestamp()));
}

export function format(time, template, locale) {
    assertOzTime(time);

    if (typeof template !== 'string' || template.trim() === '') {
        throw new TypeError('format: template must be a non-empty string');
    }

    const usedLocale = locale ?? time.getLocale();
    const parts = getNumericParts(time, usedLocale);

    const year = Number(parts.year);
    const month = Number(parts.month);
    const day = Number(parts.day);
    const hour24 = Number(parts.hour);
    const minute = Number(parts.minute);
    const second = Number(parts.second);
    const millisecond = new Date(time.getTimestamp()).getUTCMilliseconds();

    const hour12base = hour24 % 12;
    const hour12 = hour12base === 0 ? 12 : hour12base;
    const meridiem = hour24 >= 12 ? 'PM' : 'AM';

    const tokens = {
        YYYY: String(year),
        YY: String(year).slice(-2),

        MMMM: getMonthName(time, usedLocale, 'long'),
        MMM: getMonthName(time, usedLocale, 'short'),
        MM: pad(month),
        M: String(month),

        dddd: getWeekdayName(time, usedLocale, 'long'),
        ddd: getWeekdayName(time, usedLocale, 'short'),

        DD: pad(day),
        D: String(day),

        HH: pad(hour24),
        H: String(hour24),

        hh: pad(hour12),
        h: String(hour12),

        mm: pad(minute),
        ss: pad(second),
        SSS: pad(millisecond, 3),

        A: meridiem,
    };

    const tokenPattern = /YYYY|MMMM|MMM|MM|M|dddd|ddd|DD|D|HH|H|hh|h|mm|ss|SSS|YY|A/g;

    return template.replace(tokenPattern, (token) => tokens[token] ?? token);
}
