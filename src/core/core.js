import { add, subtract } from '../modules/arithmetic.js';
import { format } from '../modules/format.js';
import { isSame, isBefore, isAfter, isBetween } from '../modules/compare.js';
import { setTimezone, getTimezoneOffset } from '../modules/timezone.js';
import { interval as createInterval } from '../modules/interval.js';
import { duration as createDuration } from '../modules/duration.js';
import { diff } from '../utils/calendar.js';
import {
    now as createNow,
    fromTimestamp as createFromTimestamp,
    fromDate as createFromDate,
    fromISO as createFromISO,
    fromComponents as createFromComponents,
} from './factory.js';

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
 * Класс поддерживает как создание экземпляров через конструктор,
 * так и через статические фабричные методы.
 *
 * @class
 * @example
 * import { OzTime } from '@alexstukovnikov/oz-time';
 *
 * const time = OzTime.fromISO('2024-05-25T12:00:00Z', 'UTC', 'ru-RU');
 * console.log(time.toISOString()); // ожидаемый результат: 2024-05-25T12:00:00.000Z
 *
 * @example
 * import { OzTime } from '@alexstukovnikov/oz-time';
 *
 * const result = OzTime
 *   .fromISO('2024-05-25T12:00:00Z', 'UTC', 'ru-RU')
 *   .add(1, 'day')
 *   .add(2, 'hour')
 *   .subtract(30, 'minute')
 *   .setTimezone('Europe/Moscow')
 *   .format('DD.MM.YYYY HH:mm:ss');
 *
 * console.log(result);
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
     * Создаёт экземпляр {@link OzTime} для текущего момента времени.
     *
     * @param {TimezoneString} [timezone='UTC'] - Часовой пояс в формате IANA.
     * @param {LocaleString} [locale='en-US'] - Локаль форматирования.
     * @returns {OzTime} Экземпляр с текущим временем.
     * @example
     * import { OzTime } from '@alexstukovnikov/oz-time';
     *
     * const current = OzTime.now('Europe/Moscow', 'ru-RU');
     * console.log(current.getTimezone()); // ожидаемый результат: Europe/Moscow
     */
    static now(timezone = 'UTC', locale = 'en-US') {
        return createNow(timezone, locale);
    }

    /**
     * Создаёт экземпляр {@link OzTime} из Unix timestamp в миллисекундах.
     *
     * @param {number} timestamp - Unix timestamp в миллисекундах.
     * @param {TimezoneString} [timezone='UTC'] - Часовой пояс в формате IANA.
     * @param {LocaleString} [locale='en-US'] - Локаль форматирования.
     * @returns {OzTime} Экземпляр времени.
     * @example
     * import { OzTime } from '@alexstukovnikov/oz-time';
     *
     * const time = OzTime.fromTimestamp(1716638400000, 'UTC', 'ru-RU');
     * console.log(time.toISOString()); // ожидаемый результат: 2024-05-25T12:00:00.000Z
     */
    static fromTimestamp(timestamp, timezone = 'UTC', locale = 'en-US') {
        return createFromTimestamp(timestamp, timezone, locale);
    }

    /**
     * Создаёт экземпляр {@link OzTime} из объекта {@link Date}.
     *
     * @param {Date} date - Нативный объект Date.
     * @param {TimezoneString} [timezone='UTC'] - Часовой пояс в формате IANA.
     * @param {LocaleString} [locale='en-US'] - Локаль форматирования.
     * @returns {OzTime} Экземпляр времени.
     * @example
     * import { OzTime } from '@alexstukovnikov/oz-time';
     *
     * const time = OzTime.fromDate(new Date('2024-05-25T12:00:00Z'), 'UTC', 'ru-RU');
     * console.log(time.toTimestamp()); // ожидаемый результат: 1716638400000
     */
    static fromDate(date, timezone = 'UTC', locale = 'en-US') {
        return createFromDate(date, timezone, locale);
    }

    /**
     * Создаёт экземпляр {@link OzTime} из ISO-строки.
     *
     * @param {string} isoString - Строка даты и времени в формате ISO 8601.
     * @param {TimezoneString} [timezone='UTC'] - Часовой пояс в формате IANA.
     * @param {LocaleString} [locale='en-US'] - Локаль форматирования.
     * @returns {OzTime} Экземпляр времени.
     * @example
     * import { OzTime } from '@alexstukovnikov/oz-time';
     *
     * const time = OzTime.fromISO('2024-05-25T12:00:00Z', 'UTC', 'ru-RU');
     * console.log(time.format('DD.MM.YYYY HH:mm')); // ожидаемый результат: 25.05.2024 12:00
     */
    static fromISO(isoString, timezone = 'UTC', locale = 'en-US') {
        return createFromISO(isoString, timezone, locale);
    }

    /**
     * Создаёт экземпляр {@link OzTime} из отдельных компонентов даты и времени.
     *
     * @param {number} year - Год.
     * @param {number} month - Месяц от 1 до 12.
     * @param {number} day - День месяца.
     * @param {number} [hour=0] - Час от 0 до 23.
     * @param {number} [minute=0] - Минута от 0 до 59.
     * @param {number} [second=0] - Секунда от 0 до 59.
     * @param {number} [ms=0] - Миллисекунда от 0 до 999.
     * @param {TimezoneString} [timezone='UTC'] - Часовой пояс в формате IANA.
     * @param {LocaleString} [locale='en-US'] - Локаль форматирования.
     * @returns {OzTime} Экземпляр времени.
     * @example
     * import { OzTime } from '@alexstukovnikov/oz-time';
     *
     * const time = OzTime.fromComponents(2024, 5, 25, 12, 0, 0, 0, 'UTC', 'ru-RU');
     * console.log(time.toISOString()); // ожидаемый результат: 2024-05-25T12:00:00.000Z
     */
    static fromComponents(year, month, day, hour = 0, minute = 0, second = 0, ms = 0, timezone = 'UTC', locale = 'en-US') {
        return createFromComponents(year, month, day, hour, minute, second, ms, timezone, locale);
    }

    /**
     * Создаёт новый интервал между двумя значениями {@link OzTime}.
     *
     * @param {OzTime} start - Начало интервала.
     * @param {OzTime} end - Конец интервала.
     * @returns {Interval} Экземпляр интервала.
     * @example
     * import { OzTime } from '@alexstukovnikov/oz-time';
     *
     * const start = OzTime.fromISO('2024-05-25T10:00:00Z');
     * const end = OzTime.fromISO('2024-05-25T12:00:00Z');
     * const range = OzTime.interval(start, end);
     *
     * console.log(range.duration('hour')); // ожидаемый результат: 2
     */
    static interval(start, end) {
        return createInterval(start, end);
    }

    /**
     * Создаёт новую длительность из фиксированной единицы времени.
     *
     * @param {number} amount - Количество единиц времени.
     * @param {TimeUnit|string} unit - Единица времени.
     * @returns {Duration} Экземпляр длительности.
     * @example
     * import { OzTime } from '@alexstukovnikov/oz-time';
     *
     * const value = OzTime.duration(2, 'hour');
     * console.log(value.asMinutes()); // ожидаемый результат: 120
     */
    static duration(amount, unit) {
        return createDuration(amount, unit);
    }

    /**
     * Возвращает внутренний Unix timestamp экземпляра в миллисекундах.
     *
     * @returns {number} Unix timestamp в миллисекундах.
     * @example
     * import { OzTime } from '@alexstukovnikov/oz-time';
     *
     * const time = OzTime.fromISO('2024-05-25T12:00:00Z', 'UTC', 'ru-RU');
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
     * import { OzTime } from '@alexstukovnikov/oz-time';
     *
     * const time = OzTime.fromISO('2024-05-25T12:00:00Z', 'Europe/Moscow', 'ru-RU');
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
     * import { OzTime } from '@alexstukovnikov/oz-time';
     *
     * const time = OzTime.fromISO('2024-05-25T12:00:00Z', 'UTC', 'ru-RU');
     * console.log(time.getLocale()); // ожидаемый результат: ru-RU
     */
    getLocale() {
        return this._locale;
    }

    /**
     * Возвращает внутренний Unix timestamp экземпляра в миллисекундах.
     *
     * @returns {number} Unix timestamp в миллисекундах.
     * @example
     * import { OzTime } from '@alexstukovnikov/oz-time';
     *
     * const time = OzTime.fromISO('2024-05-25T12:00:00Z', 'UTC', 'ru-RU');
     * console.log(time.toTimestamp()); // ожидаемый результат: 1716638400000
     */
    toTimestamp() {
        return this._timestamp;
    }

    /**
     * Преобразует текущее значение времени в строку формата ISO 8601.
     *
     * @returns {string} Строковое представление даты и времени в формате ISO 8601.
     * @example
     * import { OzTime } from '@alexstukovnikov/oz-time';
     *
     * const time = OzTime.fromComponents(2024, 5, 25, 12, 0, 0, 0, 'UTC', 'ru-RU');
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
     * import { OzTime } from '@alexstukovnikov/oz-time';
     *
     * const nextDay = OzTime
     *   .fromISO('2024-05-25T12:00:00Z')
     *   .add(1, 'day');
     *
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
     * import { OzTime } from '@alexstukovnikov/oz-time';
     *
     * const prevHour = OzTime
     *   .fromISO('2024-05-25T12:00:00Z')
     *   .subtract(1, 'hour');
     *
     * console.log(prevHour.toISOString()); // ожидаемый результат: 2024-05-25T11:00:00.000Z
     */
    subtract(amount, unit) {
        return subtract(this, amount, unit);
    }

    /**
     * Форматирует текущее значение времени по заданному шаблону.
     *
     * @param {string} template - Строка шаблона форматирования.
     * @param {LocaleString} [locale] - Локаль, которая временно переопределяет локаль экземпляра.
     * @returns {string} Отформатированная строка.
     * @example
     * import { OzTime } from '@alexstukovnikov/oz-time';
     *
     * const value = OzTime.fromISO('2024-05-25T12:00:00Z', 'UTC', 'ru-RU');
     * console.log(value.format('DD.MM.YYYY HH:mm')); // ожидаемый результат: 25.05.2024 12:00
     */
    format(template, locale) {
        return format(this, template, locale);
    }

    /**
     * Проверяет, совпадает ли текущее значение с другим временем
     * на заданной точности.
     *
     * @param {OzTime} other - Второе значение для сравнения.
     * @param {TimeUnit|string} [unit='millisecond'] - Точность сравнения.
     * @returns {boolean} `true`, если значения совпадают.
     * @example
     * import { OzTime } from '@alexstukovnikov/oz-time';
     *
     * const a = OzTime.fromISO('2024-05-25T12:00:00.100Z');
     * const b = OzTime.fromISO('2024-05-25T12:00:00.900Z');
     * console.log(a.isSame(b, 'second')); // ожидаемый результат: true
     */
    isSame(other, unit = 'millisecond') {
        return isSame(this, other, unit);
    }

    /**
     * Проверяет, находится ли текущее значение раньше другого времени.
     *
     * @param {OzTime} other - Второе значение для сравнения.
     * @param {TimeUnit|string} [unit='millisecond'] - Точность сравнения.
     * @returns {boolean} `true`, если текущее значение меньше.
     * @example
     * import { OzTime } from '@alexstukovnikov/oz-time';
     *
     * const a = OzTime.fromISO('2024-05-25T12:00:00Z');
     * const b = a.add(1, 'day');
     * console.log(a.isBefore(b)); // ожидаемый результат: true
     */
    isBefore(other, unit = 'millisecond') {
        return isBefore(this, other, unit);
    }

    /**
     * Проверяет, находится ли текущее значение позже другого времени.
     *
     * @param {OzTime} other - Второе значение для сравнения.
     * @param {TimeUnit|string} [unit='millisecond'] - Точность сравнения.
     * @returns {boolean} `true`, если текущее значение больше.
     * @example
     * import { OzTime } from '@alexstukovnikov/oz-time';
     *
     * const a = OzTime.fromISO('2024-05-26T12:00:00Z');
     * const b = OzTime.fromISO('2024-05-25T12:00:00Z');
     * console.log(a.isAfter(b)); // ожидаемый результат: true
     */
    isAfter(other, unit = 'millisecond') {
        return isAfter(this, other, unit);
    }

    /**
     * Проверяет, попадает ли текущее значение в диапазон между двумя датами.
     *
     * @param {OzTime} start - Левая граница диапазона.
     * @param {OzTime} end - Правая граница диапазона.
     * @param {TimeUnit|string} [unit='millisecond'] - Точность сравнения.
     * @param {Inclusivity} [inclusivity='[]'] - Формат включённости границ.
     * @returns {boolean} `true`, если значение находится внутри диапазона.
     * @example
     * import { OzTime } from '@alexstukovnikov/oz-time';
     *
     * const current = OzTime.fromISO('2024-05-25T12:00:00Z');
     * const start = current.subtract(1, 'day');
     * const end = current.add(1, 'day');
     * console.log(current.isBetween(start, end)); // ожидаемый результат: true
     */
    isBetween(start, end, unit = 'millisecond', inclusivity = '[]') {
        return isBetween(this, start, end, unit, inclusivity);
    }

    /**
     * Возвращает новый экземпляр с тем же timestamp, но другим часовым поясом.
     *
     * @param {TimezoneString} timezone - Новый часовой пояс.
     * @returns {OzTime} Новый экземпляр с обновлённым часовым поясом.
     * @example
     * import { OzTime } from '@alexstukovnikov/oz-time';
     *
     * const moscowTime = OzTime
     *   .fromISO('2024-05-25T12:00:00Z', 'UTC', 'ru-RU')
     *   .setTimezone('Europe/Moscow');
     *
     * console.log(moscowTime.getTimezone()); // ожидаемый результат: Europe/Moscow
     */
    setTimezone(timezone) {
        return setTimezone(this, timezone);
    }

    /**
     * Возвращает смещение текущего часового пояса относительно UTC в минутах.
     *
     * @returns {number} Смещение в минутах.
     * @example
     * import { OzTime } from '@alexstukovnikov/oz-time';
     *
     * const time = OzTime.fromISO('2024-05-25T12:00:00Z', 'Europe/Moscow', 'ru-RU');
     * console.log(time.getTimezoneOffset()); // ожидаемый результат: 180
     */
    getTimezoneOffset() {
        return getTimezoneOffset(this);
    }

    /**
     * Вычисляет разницу между текущим значением и другим временем.
     *
     * @param {OzTime} other - Второе значение для сравнения.
     * @param {TimeUnit|string} [unit='millisecond'] - Единица измерения разницы.
     * @returns {number} Разница между двумя значениями.
     * @example
     * import { OzTime } from '@alexstukovnikov/oz-time';
     *
     * const start = OzTime.fromISO('2024-05-25T12:00:00Z');
     * const end = start.add(2, 'hour');
     * console.log(end.diff(start, 'hour')); // ожидаемый результат: 2
     */
    diff(other, unit = 'millisecond') {
        return diff(this, other, unit);
    }
}
