import { normalizeUnit, isFixedUnit, unitToMilliseconds } from './units.js';
import { OzTime } from '../core/core.js';

/**
 * Календарные утилиты для работы с датами, високосными годами
 * и разницей между значениями времени.
 *
 * @module utils/calendar
 */

/**
 * Проверяет корректность timestamp.
 *
 * @private
 * @param {number} timestamp - Unix timestamp в миллисекундах.
 * @param {string} name - Имя вызывающей функции.
 * @throws {TypeError} Выбрасывается, если timestamp некорректен.
 * @returns {void}
 */
function assertValidTimestamp(timestamp, name) {
    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
        throw new TypeError(`${name}: timestamp must be a valid number`);
    }
}

/**
 * Проверяет корректность количества единиц времени.
 *
 * @private
 * @param {number} amount - Количество единиц времени.
 * @param {string} name - Имя вызывающей функции.
 * @throws {TypeError} Выбрасывается, если amount некорректен.
 * @returns {void}
 */
function assertValidAmount(amount, name) {
    if (typeof amount !== 'number' || Number.isNaN(amount)) {
        throw new TypeError(`${name}: amount must be a valid number`);
    }
}

/**
 * Проверяет, является ли значение экземпляром OzTime.
 *
 * @private
 * @param {*} value - Проверяемое значение.
 * @param {string} name - Имя параметра.
 * @throws {TypeError} Выбрасывается, если значение не является экземпляром OzTime.
 * @returns {void}
 */
function assertOzTime(value, name) {
    if (!(value instanceof OzTime)) {
        throw new TypeError(`${name} must be OzTime`);
    }
}

/**
 * Вычисляет календарную разницу в месяцах между двумя timestamp.
 *
 * @private
 * @param {number} leftTimestamp - Левый timestamp.
 * @param {number} rightTimestamp - Правый timestamp.
 * @returns {number} Разница в месяцах.
 */
function diffInMonths(leftTimestamp, rightTimestamp) {
    const left = new Date(leftTimestamp);
    const right = new Date(rightTimestamp);

    let months = (left.getUTCFullYear() - right.getUTCFullYear()) * 12 + (left.getUTCMonth() - right.getUTCMonth());

    const leftDay = left.getUTCDate();
    const rightDay = right.getUTCDate();

    if (months > 0 && leftDay < rightDay) {
        months -= 1;
    } else if (months < 0 && leftDay > rightDay) {
        months += 1;
    }

    return months;
}

/**
 * Вычисляет календарную разницу в годах между двумя timestamp.
 *
 * @private
 * @param {number} leftTimestamp - Левый timestamp.
 * @param {number} rightTimestamp - Правый timestamp.
 * @returns {number} Разница в годах.
 */
function diffInYears(leftTimestamp, rightTimestamp) {
    const left = new Date(leftTimestamp);
    const right = new Date(rightTimestamp);

    let years = left.getUTCFullYear() - right.getUTCFullYear();

    const leftMonth = left.getUTCMonth();
    const rightMonth = right.getUTCMonth();
    const leftDay = left.getUTCDate();
    const rightDay = right.getUTCDate();

    if (years > 0 && (leftMonth < rightMonth || (leftMonth === rightMonth && leftDay < rightDay))) {
        years -= 1;
    } else if (years < 0 && (leftMonth > rightMonth || (leftMonth === rightMonth && leftDay > rightDay))) {
        years += 1;
    }

    return years;
}

/**
 * Проверяет, является ли год високосным по григорианскому календарю.
 *
 * @param {number} year - Год.
 * @throws {TypeError} Выбрасывается, если year не является целым числом.
 * @returns {boolean} `true`, если год високосный.
 * @example
 * import { isLeapYear } from '@alexstukovnikov/oz-time';
 *
 * console.log(isLeapYear(2024)); // ожидаемый результат: true
 */
export function isLeapYear(year) {
    if (!Number.isInteger(year)) {
        throw new TypeError('isLeapYear: year must be an integer');
    }

    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

/**
 * Возвращает количество дней в указанном месяце указанного года.
 *
 * @param {number} year - Год.
 * @param {number} month - Месяц от 1 до 12.
 * @throws {TypeError} Выбрасывается, если year или month не являются целыми числами.
 * @throws {RangeError} Выбрасывается, если month вне диапазона от 1 до 12.
 * @returns {number} Количество дней в месяце.
 * @example
 * import { daysInMonth } from '@alexstukovnikov/oz-time';
 *
 * console.log(daysInMonth(2024, 2)); // ожидаемый результат: 29
 */
export function daysInMonth(year, month) {
    if (!Number.isInteger(year) || !Number.isInteger(month)) {
        throw new TypeError('daysInMonth: year and month must be integers');
    }

    if (month < 1 || month > 12) {
        throw new RangeError('daysInMonth: month must be between 1 and 12');
    }

    return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Возвращает новый timestamp, увеличенный на указанное количество
 * фиксированных единиц времени.
 *
 * @param {number} timestamp - Unix timestamp в миллисекундах.
 * @param {number} amount - Количество единиц времени.
 * @param {string} unit - Фиксированная единица времени.
 * @throws {TypeError} Выбрасывается, если timestamp или amount некорректны.
 * @throws {Error} Выбрасывается, если unit не является фиксированной единицей.
 * @returns {number} Новый Unix timestamp в миллисекундах.
 * @example
 * import { addByFixedUnit } from './utils/calendar.js';
 *
 * console.log(addByFixedUnit(1716638400000, 1, 'day')); // ожидаемый результат: 1716724800000
 */
export function addByFixedUnit(timestamp, amount, unit) {
    assertValidTimestamp(timestamp, 'addByFixedUnit');
    assertValidAmount(amount, 'addByFixedUnit');

    const normalizedUnit = normalizeUnit(unit);

    if (!isFixedUnit(normalizedUnit)) {
        throw new Error(`addByFixedUnit does not support calendar unit: ${unit}`);
    }

    return timestamp + amount * unitToMilliseconds(normalizedUnit);
}

/**
 * Возвращает новый timestamp, увеличенный на указанное количество
 * календарных единиц времени.
 *
 * Поддерживаются только `month` и `year`.
 *
 * @param {number} timestamp - Unix timestamp в миллисекундах.
 * @param {number} amount - Количество единиц времени.
 * @param {string} unit - Календарная единица времени.
 * @throws {TypeError} Выбрасывается, если timestamp или amount некорректны.
 * @throws {Error} Выбрасывается, если unit не поддерживается.
 * @returns {number} Новый Unix timestamp в миллисекундах.
 * @example
 * import { addByCalendarUnit } from './utils/calendar.js';
 *
 * console.log(addByCalendarUnit(Date.UTC(2024, 0, 31, 0, 0, 0, 0), 1, 'month')); // ожидаемый результат: 1709164800000
 */
export function addByCalendarUnit(timestamp, amount, unit) {
    assertValidTimestamp(timestamp, 'addByCalendarUnit');
    assertValidAmount(amount, 'addByCalendarUnit');

    const normalizedUnit = normalizeUnit(unit);
    const date = new Date(timestamp);

    if (normalizedUnit === 'month') {
        const originalDay = date.getUTCDate();

        date.setUTCDate(1);
        date.setUTCMonth(date.getUTCMonth() + amount);

        const maxDay = daysInMonth(date.getUTCFullYear(), date.getUTCMonth() + 1);
        date.setUTCDate(Math.min(originalDay, maxDay));

        return date.getTime();
    }

    if (normalizedUnit === 'year') {
        const originalMonth = date.getUTCMonth();
        const originalDay = date.getUTCDate();

        date.setUTCDate(1);
        date.setUTCFullYear(date.getUTCFullYear() + amount);
        date.setUTCMonth(originalMonth);

        const maxDay = daysInMonth(date.getUTCFullYear(), originalMonth + 1);
        date.setUTCDate(Math.min(originalDay, maxDay));

        return date.getTime();
    }

    throw new Error(`addByCalendarUnit supports only month and year: ${unit}`);
}

/**
 * Возвращает числовую разницу между двумя экземплярами {@link OzTime}
 * в указанной единице времени.
 *
 * Для фиксированных единиц может возвращать дробное число,
 * для месяцев и лет возвращает целочисленную календарную разницу.
 *
 * @param {OzTime} left - Левое значение.
 * @param {OzTime} right - Правое значение.
 * @param {string} [unit='millisecond'] - Единица времени.
 * @throws {TypeError} Выбрасывается, если хотя бы один аргумент не является экземпляром OzTime.
 * @throws {Error} Выбрасывается, если unit не поддерживается.
 * @returns {number} Разница между двумя значениями времени.
 * @example
 * import { diff } from './utils/calendar.js';
 * import { fromISO } from '@alexstukovnikov/oz-time';
 *
 * const a = fromISO('2024-05-25T14:00:00Z');
 * const b = fromISO('2024-05-25T12:00:00Z');
 * console.log(diff(a, b, 'hour')); // ожидаемый результат: 2
 */
export function diff(left, right, unit = 'millisecond') {
    assertOzTime(left, 'left');
    assertOzTime(right, 'right');

    const normalizedUnit = normalizeUnit(unit);
    const leftTimestamp = left.getTimestamp();
    const rightTimestamp = right.getTimestamp();

    if (isFixedUnit(normalizedUnit)) {
        return (leftTimestamp - rightTimestamp) / unitToMilliseconds(normalizedUnit);
    }

    if (normalizedUnit === 'month') {
        return diffInMonths(leftTimestamp, rightTimestamp);
    }

    if (normalizedUnit === 'year') {
        return diffInYears(leftTimestamp, rightTimestamp);
    }

    throw new Error(`Unsupported unit: ${unit}`);
}
