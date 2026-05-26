import { OzTime } from '../core/core.js';

/**
 * Модуль для работы с часовыми поясами.
 *
 * @module modules/timezone
 */

/**
 * Проверяет корректность идентификатора часового пояса.
 *
 * @private
 * @param {string} timezone - Идентификатор часового пояса в формате IANA.
 * @throws {TypeError} Выбрасывается, если timezone пустой или не является строкой.
 * @throws {Error} Выбрасывается, если timezone не поддерживается.
 * @returns {void}
 */
function validateTimezone(timezone) {
    if (typeof timezone !== 'string' || timezone.trim() === '') {
        throw new TypeError('setTimezone: timezone must be a non-empty string');
    }

    if (!Intl.supportedValuesOf('timeZone').includes(timezone)) {
        throw new Error(`Unsupported timezone: ${timezone}`);
    }
}

/**
 * Вычисляет смещение часового пояса относительно UTC для конкретного timestamp.
 *
 * @private
 * @param {number} timestamp - Unix timestamp в миллисекундах.
 * @param {string} timeZone - Часовой пояс в формате IANA.
 * @returns {number} Смещение в минутах относительно UTC.
 */
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

/**
 * Возвращает новый экземпляр {@link OzTime} с тем же timestamp и locale,
 * но с другим часовым поясом.
 *
 * Абсолютный момент времени при этом не изменяется.
 *
 * @param {OzTime} time - Исходный экземпляр {@link OzTime}.
 * @param {string} timezone - Новый часовой пояс в формате IANA.
 * @throws {TypeError} Выбрасывается, если первый аргумент не является экземпляром OzTime или timezone некорректен.
 * @throws {Error} Выбрасывается, если timezone не поддерживается.
 * @returns {OzTime} Новый экземпляр OzTime с другим часовым поясом.
 * @example
 * import { setTimezone, fromISO } from '@alexstukovnikov/oz-time';
 *
 * const time = fromISO('2024-05-25T12:00:00Z', 'UTC', 'ru-RU');
 * const moscow = setTimezone(time, 'Europe/Moscow');
 * console.log(moscow.getTimezone()); // ожидаемый результат: Europe/Moscow
 */
export function setTimezone(time, timezone) {
    if (!(time instanceof OzTime)) {
        throw new TypeError('tz: first argument must be OzTime');
    }

    validateTimezone(timezone);

    return new OzTime(time.getTimestamp(), timezone, time.getLocale());
}

/**
 * Возвращает смещение часового пояса экземпляра относительно UTC в минутах.
 *
 * @param {OzTime} time - Экземпляр времени.
 * @throws {TypeError} Выбрасывается, если аргумент не является экземпляром OzTime.
 * @returns {number} Смещение в минутах относительно UTC.
 * @example
 * import { getTimezoneOffset, fromISO } from '@alexstukovnikov/oz-time';
 *
 * const time = fromISO('2024-05-25T12:00:00Z', 'Europe/Moscow', 'ru-RU');
 * console.log(getTimezoneOffset(time)); // ожидаемый результат: 180
 */
export function getTimezoneOffset(time) {
    if (!(time instanceof OzTime)) {
        throw new TypeError('getTimezoneOffset: argument must be OzTime');
    }
    const timestamp = time.getTimestamp();
    const timeZone = time.getTimezone();
    return getOffsetMinutesFor(timestamp, timeZone);
}
