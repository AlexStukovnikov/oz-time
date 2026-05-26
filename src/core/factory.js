import { OzTime } from './core.js';
import { daysInMonth } from '../utils/calendar.js';

/**
 * Фабричные функции для создания экземпляров {@link OzTime}.
 *
 * @module core/factory
 */

/**
 * Проверяет корректность timestamp.
 *
 * @private
 * @param {number} timestamp - Unix timestamp в миллисекундах.
 * @throws {TypeError} Выбрасывается, если timestamp некорректен.
 * @returns {void}
 */
function assertValidTimestamp(timestamp) {
    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
        throw new TypeError('fromTimestamp: timestamp must be a valid number');
    }
}

/**
 * Проверяет корректность объекта Date.
 *
 * @private
 * @param {Date} date - Проверяемый объект Date.
 * @throws {TypeError} Выбрасывается, если date некорректен.
 * @returns {void}
 */
function assertValidDate(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
        throw new TypeError('fromDate: date must be a valid Date');
    }
}

/**
 * Проверяет, что значение является целым числом.
 *
 * @private
 * @param {number} value - Проверяемое значение.
 * @param {string} name - Имя параметра.
 * @throws {TypeError} Выбрасывается, если значение не является целым числом.
 * @returns {void}
 */
function assertInteger(value, name) {
    if (!Number.isInteger(value)) {
        throw new TypeError(`${name} must be an integer`);
    }
}

/**
 * Создаёт и возвращает экземпляр {@link OzTime} для текущего момента времени.
 *
 * @param {string} [timezone='UTC'] - Часовой пояс в формате IANA.
 * @param {string} [locale='en-US'] - Локаль форматирования.
 * @returns {OzTime} Экземпляр с текущим временем.
 * @example
 * import { now } from 'oz-time';
 *
 * const current = now('Europe/Moscow', 'ru-RU');
 * console.log(current.getTimezone()); // ожидаемый результат: Europe/Moscow
 */
export function now(timezone = 'UTC', locale = 'en-US') {
    return new OzTime(Date.now(), timezone, locale);
}

/**
 * Создаёт и возвращает экземпляр {@link OzTime} на основе Unix timestamp.
 *
 * @param {number} timestamp - Unix timestamp в миллисекундах.
 * @param {string} [timezone='UTC'] - Часовой пояс в формате IANA.
 * @param {string} [locale='en-US'] - Локаль форматирования.
 * @throws {TypeError} Выбрасывается, если timestamp некорректен.
 * @returns {OzTime} Экземпляр времени.
 * @example
 * import { fromTimestamp } from 'oz-time';
 *
 * const time = fromTimestamp(1716638400000, 'UTC', 'ru-RU');
 * console.log(time.toISOString()); // ожидаемый результат: 2024-05-25T12:00:00.000Z
 */
export function fromTimestamp(timestamp, timezone = 'UTC', locale = 'en-US') {
    assertValidTimestamp(timestamp);
    return new OzTime(timestamp, timezone, locale);
}

/**
 * Создаёт и возвращает экземпляр {@link OzTime} на основе объекта {@link Date}.
 *
 * @param {Date} date - Нативный объект Date.
 * @param {string} [timezone='UTC'] - Часовой пояс в формате IANA.
 * @param {string} [locale='en-US'] - Локаль форматирования.
 * @throws {TypeError} Выбрасывается, если date некорректен.
 * @returns {OzTime} Экземпляр времени.
 * @example
 * import { fromDate } from 'oz-time';
 *
 * const time = fromDate(new Date('2024-05-25T12:00:00Z'), 'UTC', 'ru-RU');
 * console.log(time.toTimestamp()); // ожидаемый результат: 1716638400000
 */
export function fromDate(date, timezone = 'UTC', locale = 'en-US') {
    assertValidDate(date);
    return new OzTime(date.getTime(), timezone, locale);
}

/**
 * Создаёт и возвращает экземпляр {@link OzTime} на основе ISO-строки.
 *
 * @param {string} isoString - Строка даты и времени в формате ISO 8601.
 * @param {string} [timezone='UTC'] - Часовой пояс в формате IANA.
 * @param {string} [locale='en-US'] - Локаль форматирования.
 * @throws {TypeError} Выбрасывается, если строка пустая или не является строкой.
 * @throws {Error} Выбрасывается, если строку не удалось распарсить.
 * @returns {OzTime} Экземпляр времени.
 * @example
 * import { fromISO } from 'oz-time';
 *
 * const time = fromISO('2024-05-25T12:00:00Z', 'UTC', 'ru-RU');
 * console.log(time.format('DD.MM.YYYY HH:mm')); // ожидаемый результат: 25.05.2024 12:00
 */
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

/**
 * Создаёт и возвращает экземпляр {@link OzTime} на основе отдельных компонентов даты и времени.
 *
 * @param {number} year - Год.
 * @param {number} month - Месяц от 1 до 12.
 * @param {number} day - День месяца.
 * @param {number} [hour=0] - Час от 0 до 23.
 * @param {number} [minute=0] - Минута от 0 до 59.
 * @param {number} [second=0] - Секунда от 0 до 59.
 * @param {number} [ms=0] - Миллисекунда от 0 до 999.
 * @param {string} [timezone='UTC'] - Часовой пояс в формате IANA.
 * @param {string} [locale='en-US'] - Локаль форматирования.
 * @throws {TypeError} Выбрасывается, если любой числовой параметр не является целым числом.
 * @throws {RangeError} Выбрасывается, если любой компонент даты или времени вне допустимого диапазона.
 * @returns {OzTime} Экземпляр времени.
 * @example
 * import { fromComponents } from 'oz-time';
 *
 * const time = fromComponents(2024, 5, 25, 12, 0, 0, 0, 'UTC', 'ru-RU');
 * console.log(time.toISOString()); // ожидаемый результат: 2024-05-25T12:00:00.000Z
 */
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
