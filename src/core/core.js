import { add, subtract } from '../modules/arithmetic.js';
import { format } from '../modules/format.js';
import { isSame, isBefore, isAfter, isBetween } from '../modules/compare.js';
import { setTimezone, getTimezoneOffset } from '../modules/timezone.js';
import { diff } from '../utils/calendar.js';

/**
 * Основной модуль, содержащий класс {@link OzTime}.
 *
 * @module core/core
 */

/**
 * Строка с идентификатором часового пояса в формате IANA.
 *
 * @typedef {string} TimezoneString
 */

/**
 * Строка локали, совместимая с Intl API.
 *
 * @typedef {string} LocaleString
 */

/**
 * Формат включённости границ диапазона.
 *
 * @typedef {'[]'|'[)'|'(]'|'()'} Inclusivity
 */

/**
 * Поддерживаемая единица времени.
 *
 * @typedef {'millisecond'|'second'|'minute'|'hour'|'day'|'month'|'year'} TimeUnit
 */

/**
 * Проверяет корректность timestamp.
 *
 * @private
 * @param {number} timestamp - Unix timestamp в миллисекундах.
 * @throws {TypeError} Выбрасывается, если timestamp не является корректным числом.
 * @returns {void}
 */
function assertValidTimestamp(timestamp) {
    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
        throw new TypeError('OzTime: timestamp must be a valid number');
    }
}

/**
 * Проверяет корректность строки часового пояса.
 *
 * @private
 * @param {TimezoneString} timezone - Идентификатор часового пояса.
 * @throws {TypeError} Выбрасывается, если timezone пустой или не является строкой.
 * @returns {void}
 */
function assertValidTimezone(timezone) {
    if (typeof timezone !== 'string' || timezone.trim() === '') {
        throw new TypeError('OzTime: timezone must be a non-empty string');
    }
}

/**
 * Проверяет корректность строки локали.
 *
 * @private
 * @param {LocaleString} locale - Локаль форматирования.
 * @throws {TypeError} Выбрасывается, если locale пустая или не является строкой.
 * @returns {void}
 */
function assertValidLocale(locale) {
    if (typeof locale !== 'string' || locale.trim() === '') {
        throw new TypeError('OzTime: locale must be a non-empty string');
    }
}

/**
 * Неизменяемый объект даты и времени на основе UTC timestamp
 * с дополнительными метаданными о часовом поясе и локали.
 *
 * @class
 */
export class OzTime {
    /**
     * Создаёт новый экземпляр OzTime.
     *
     * @param {number} timestamp - Unix timestamp в миллисекундах.
     * @param {TimezoneString} [timezone='UTC'] - Часовой пояс в формате IANA.
     * @param {LocaleString} [locale='en-US'] - Локаль, используемая для форматирования.
     * @throws {TypeError} Выбрасывается, если timestamp, timezone или locale некорректны.
     */
    constructor(timestamp, timezone = 'UTC', locale = 'en-US') {
        assertValidTimestamp(timestamp);
        assertValidTimezone(timezone);
        assertValidLocale(locale);

        this._timestamp = timestamp;
        this._timezone = timezone;
        this._locale = locale;
    }

    /**
     * Возвращает внутренний Unix timestamp экземпляра в миллисекундах.
     *
     * @returns {number} Unix timestamp в миллисекундах.
     * @example
     * import { fromISO } from '@alexstukovnikov/oz-time';
     *
     * const time = fromISO('2024-05-25T12:00:00Z', 'UTC', 'ru-RU');
     * console.log(time.getTimestamp()); // ожидаемый результат: 1716638400000
     */
    getTimestamp() {
        return this._timestamp;
    }

    /**
     * Возвращает текущий часовой пояс экземпляра.
     *
     * @returns {TimezoneString} Идентификатор часового пояса.
     * @example
     * import { fromISO } from '@alexstukovnikov/oz-time';
     *
     * const time = fromISO('2024-05-25T12:00:00Z', 'Europe/Moscow', 'ru-RU');
     * console.log(time.getTimezone()); // ожидаемый результат: Europe/Moscow
     */
    getTimezone() {
        return this._timezone;
    }

    /**
     * Возвращает текущую локаль экземпляра.
     *
     * @returns {LocaleString} Строка локали.
     * @example
     * import { fromISO } from '@alexstukovnikov/oz-time';
     *
     * const time = fromISO('2024-05-25T12:00:00Z', 'UTC', 'ru-RU');
     * console.log(time.getLocale()); // ожидаемый результат: ru-RU
     */
    getLocale() {
        return this._locale;
    }

    /**
     * Преобразует экземпляр в числовой timestamp.
     *
     * @returns {number} Unix timestamp в миллисекундах.
     * @example
     * const time = fromISO('2024-05-25T12:00:00Z', 'UTC', 'ru-RU');
console.log(time.toTimestamp()); // ожидаемый результат: 1716638400000
     */
    toTimestamp() {
        return this._timestamp;
    }

    /**
     * Преобразует текущее значение времени в строку формата ISO 8601.
     *
     * @returns {string} Строковое представление даты и времени в формате ISO 8601.
     * @example
     * import { fromComponents } from '@alexstukovnikov/oz-time';
     *
     * const time = fromComponents(2024, 5, 25, 12, 0, 0, 0, 'UTC', 'ru-RU');
     * console.log(time.toISOString()); // ожидаемый результат: 2024-05-25T12:00:00.000Z
     */
    toISOString() {
        return new Date(this._timestamp).toISOString();
    }

    /**
     * Возвращает новый экземпляр OzTime, у которого timestamp увеличен
     * на указанное количество единиц времени.
     *
     * Исходный экземпляр не изменяется.
     *
     * @param {number} amount - Количество единиц времени.
     * @param {TimeUnit|string} unit - Единица времени.
     * @returns {OzTime} Новый экземпляр OzTime с timestamp, сдвинутым вперёд.
     * @example
     * import { fromISO } from '@alexstukovnikov/oz-time';
     *
     * const time = fromISO('2024-05-25T12:00:00Z', 'UTC', 'ru-RU');
     * const nextDay = time.add(1, 'day');
     * console.log(nextDay.toISOString()); // ожидаемый результат: 2024-05-26T12:00:00.000Z
     */
    add(amount, unit) {
        return add(this, amount, unit);
    }

    /**
     * Возвращает новый экземпляр OzTime, у которого timestamp уменьшен
     * на указанное количество единиц времени.
     *
     * Исходный экземпляр не изменяется.
     *
     * @param {number} amount - Количество единиц времени.
     * @param {TimeUnit|string} unit - Единица времени.
     * @returns {OzTime} Новый экземпляр OzTime с timestamp, сдвинутым назад.
     * @example
     * import { fromISO } from '@alexstukovnikov/oz-time';
     *
     * const time = fromISO('2024-05-25T12:00:00Z', 'UTC', 'ru-RU');
     * const prevHour = time.subtract(1, 'hour');
     * console.log(prevHour.toISOString()); // ожидаемый результат: 2024-05-25T11:00:00.000Z
     */
    subtract(amount, unit) {
        return subtract(this, amount, unit);
    }

    /**
     * Возвращает строковое представление текущего значения времени по заданному шаблону.
     *
     * @param {string} template - Строка шаблона форматирования.
     * @param {LocaleString} [locale] - Локаль, которая переопределяет локаль экземпляра.
     * @returns {string} Отформатированная строка.
     * @example
     * import { fromISO } from '@alexstukovnikov/oz-time';
     *
     * const time = fromISO('2024-05-25T12:00:00Z', 'UTC', 'ru-RU');
     * console.log(time.format('DD.MM.YYYY HH:mm')); // ожидаемый результат: 25.05.2024 12:00
     */
    format(template, locale) {
        return format(this, template, locale);
    }

    /**
     * Проверяет, совпадает ли текущее значение с другим значением времени
     * на заданной точности.
     *
     * @param {OzTime} other - Второе значение для сравнения.
     * @param {TimeUnit|string} [unit='millisecond'] - Точность сравнения.
     * @returns {boolean} `true`, если значения совпадают на указанной точности.
     * @example
     * import { fromISO } from '@alexstukovnikov/oz-time';
     *
     * const a = fromISO('2024-05-25T12:00:00.100Z');
     * const b = fromISO('2024-05-25T12:00:00.900Z');
     * console.log(a.isSame(b, 'second')); // ожидаемый результат: true
     */
    isSame(other, unit = 'millisecond') {
        return isSame(this, other, unit);
    }

    /**
     * Проверяет, находится ли текущее значение раньше другого значения времени
     * на заданной точности.
     *
     * @param {OzTime} other - Второе значение для сравнения.
     * @param {TimeUnit|string} [unit='millisecond'] - Точность сравнения.
     * @returns {boolean} `true`, если текущее значение раньше.
     * @example
     * import { fromISO } from '@alexstukovnikov/oz-time';
     *
     * const a = fromISO('2024-05-25T12:00:00Z');
     * const b = fromISO('2024-05-26T12:00:00Z');
     * console.log(a.isBefore(b)); // ожидаемый результат: true
     */
    isBefore(other, unit = 'millisecond') {
        return isBefore(this, other, unit);
    }

    /**
     * Проверяет, находится ли текущее значение позже другого значения времени
     * на заданной точности.
     *
     * @param {OzTime} other - Второе значение для сравнения.
     * @param {TimeUnit|string} [unit='millisecond'] - Точность сравнения.
     * @returns {boolean} `true`, если текущее значение позже.
     * @example
     * import { fromISO } from '@alexstukovnikov/oz-time';
     *
     * const a = fromISO('2024-05-26T12:00:00Z');
     * const b = fromISO('2024-05-25T12:00:00Z');
     * console.log(a.isAfter(b)); // ожидаемый результат: true
     */
    isAfter(other, unit = 'millisecond') {
        return isAfter(this, other, unit);
    }

    /**
     * Проверяет, попадает ли текущее значение времени в диапазон между двумя границами
     * на заданной точности.
     *
     * @param {OzTime} start - Левая граница диапазона.
     * @param {OzTime} end - Правая граница диапазона.
     * @param {TimeUnit|string} [unit='millisecond'] - Точность сравнения.
     * @param {Inclusivity} [inclusivity='[]'] - Формат включённости границ.
     * @returns {boolean} `true`, если значение находится внутри диапазона.
     * @example
     * import { fromISO } from '@alexstukovnikov/oz-time';
     *
     * const current = fromISO('2024-05-25T12:00:00Z');
     * const start = fromISO('2024-05-25T10:00:00Z');
     * const end = fromISO('2024-05-25T14:00:00Z');
     * console.log(current.isBetween(start, end)); // ожидаемый результат: true
     */
    isBetween(start, end, unit = 'millisecond', inclusivity = '[]') {
        return isBetween(this, start, end, unit, inclusivity);
    }

    /**
     * Возвращает новый экземпляр OzTime с тем же timestamp и locale,
     * но с другим часовым поясом.
     *
     * Абсолютный момент времени при этом не изменяется.
     *
     * @param {TimezoneString} timezone - Новый часовой пояс.
     * @returns {OzTime} Новый экземпляр OzTime с обновлённым часовым поясом.
     * @example
     * import { fromISO } from '@alexstukovnikov/oz-time';
     *
     * const time = fromISO('2024-05-25T12:00:00Z', 'UTC', 'ru-RU');
     * const moscowTime = time.setTimezone('Europe/Moscow');
     * console.log(moscowTime.getTimezone()); // ожидаемый результат: Europe/Moscow
     */
    setTimezone(timezone) {
        return setTimezone(this, timezone);
    }

    /**
     * Возвращает смещение текущего часового пояса относительно UTC в минутах.
     *
     * @returns {number} Смещение в минутах относительно UTC.
     * @example
     * import { fromISO } from '@alexstukovnikov/oz-time';
     *
     * const time = fromISO('2024-05-25T12:00:00Z', 'Europe/Moscow', 'ru-RU');
     * console.log(time.getTimezoneOffset()); // ожидаемый результат: 180
     */
    getTimezoneOffset() {
        return getTimezoneOffset(this);
    }

    /**
     * Возвращает числовую разницу между текущим экземпляром и другим значением времени
     * в указанной единице измерения.
     *
     * @param {OzTime} other - Второе значение для сравнения.
     * @param {TimeUnit|string} [unit='millisecond'] - Единица измерения разницы.
     * @returns {number} Разница между двумя значениями времени.
     * @example
     * import { fromISO } from '@alexstukovnikov/oz-time';
     *
     * const start = fromISO('2024-05-25T12:00:00Z');
     * const end = fromISO('2024-05-25T14:00:00Z');
     * console.log(end.diff(start, 'hour')); // ожидаемый результат: 2
     */
    diff(other, unit = 'millisecond') {
        return diff(this, other, unit);
    }
}
