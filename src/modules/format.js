import { OzTime } from '../core/core.js';

/**
 * Модуль форматирования экземпляров {@link OzTime}.
 *
 * @module modules/format
 */

/**
 * Проверяет, является ли значение экземпляром OzTime.
 *
 * @private
 * @param {*} value - Проверяемое значение.
 * @throws {TypeError} Выбрасывается, если значение не является экземпляром OzTime.
 * @returns {void}
 */
function assertOzTime(value) {
    if (!(value instanceof OzTime)) {
        throw new TypeError('format: first argument must be OzTime');
    }
}

/**
 * Дополняет значение ведущими нулями до нужной длины.
 *
 * @private
 * @param {string|number} value - Исходное значение.
 * @param {number} [length=2] - Итоговая длина строки.
 * @returns {string} Строка, дополненная ведущими нулями.
 */
function pad(value, length = 2) {
    return String(value).padStart(length, '0');
}

/**
 * Возвращает числовые части даты для форматирования.
 *
 * @private
 * @param {OzTime} time - Экземпляр времени.
 * @param {string} locale - Локаль форматирования.
 * @returns {Object.<string, string>} Объект с числовыми частями даты и времени.
 */
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

/**
 * Возвращает название месяца в нужном формате.
 *
 * @private
 * @param {OzTime} time - Экземпляр времени.
 * @param {string} locale - Локаль форматирования.
 * @param {'long'|'short'|'narrow'} length - Длина названия месяца.
 * @returns {string} Название месяца.
 */
function getMonthName(time, locale, length) {
    return new Intl.DateTimeFormat(locale, {
        timeZone: time.getTimezone(),
        month: length,
    }).format(new Date(time.getTimestamp()));
}

/**
 * Возвращает название дня недели в нужном формате.
 *
 * @private
 * @param {OzTime} time - Экземпляр времени.
 * @param {string} locale - Локаль форматирования.
 * @param {'long'|'short'|'narrow'} length - Длина названия дня недели.
 * @returns {string} Название дня недели.
 */
function getWeekdayName(time, locale, length) {
    return new Intl.DateTimeFormat(locale, {
        timeZone: time.getTimezone(),
        weekday: length,
    }).format(new Date(time.getTimestamp()));
}

/**
 * Возвращает строковое представление экземпляра {@link OzTime}
 * по заданному шаблону с токенами.
 *
 * Поддерживаются токены `YYYY`, `YY`, `MMMM`, `MMM`, `MM`, `M`, `dddd`, `ddd`,
 * `DD`, `D`, `HH`, `H`, `hh`, `h`, `mm`, `ss`, `SSS` и `A`.
 *
 * @param {OzTime} time - Экземпляр времени для форматирования.
 * @param {string} template - Шаблон форматирования.
 * @param {string} [locale] - Необязательное переопределение локали.
 * @throws {TypeError} Выбрасывается, если первый аргумент не является экземпляром OzTime или template некорректен.
 * @returns {string} Отформатированная строка.
 * @example
 * import { format, fromISO } from 'oz-time';
 *
 * const time = fromISO('2024-05-25T12:00:00Z', 'UTC', 'ru-RU');
 * console.log(format(time, 'DD.MM.YYYY HH:mm')); // ожидаемый результат: 25.05.2024 12:00
 */
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
