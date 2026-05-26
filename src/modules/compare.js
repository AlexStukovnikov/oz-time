import { OzTime } from '../core/core.js';
import { normalizeUnit } from '../utils/units.js';

/**
 * Модуль сравнений для экземпляров {@link OzTime}.
 *
 * @module modules/compare
 */

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
 * Обрезает timestamp до заданной точности.
 *
 * @private
 * @param {number} timestamp - Исходный timestamp в миллисекундах.
 * @param {string} unit - Единица точности.
 * @throws {Error} Выбрасывается, если единица не поддерживается.
 * @returns {number} Timestamp, обрезанный до заданной единицы времени.
 */
function truncateToUnit(timestamp, unit) {
    const normalizedUnit = normalizeUnit(unit);
    const d = new Date(timestamp);

    switch (normalizedUnit) {
        case 'millisecond':
            return d.getTime();

        case 'second':
            d.setUTCMilliseconds(0);
            break;

        case 'minute':
            d.setUTCSeconds(0, 0);
            break;

        case 'hour':
            d.setUTCMinutes(0, 0, 0);
            break;

        case 'day':
            d.setUTCHours(0, 0, 0, 0);
            break;

        case 'month':
            d.setUTCHours(0, 0, 0, 0);
            d.setUTCDate(1);
            break;

        case 'year':
            d.setUTCHours(0, 0, 0, 0);
            d.setUTCDate(1);
            d.setUTCMonth(0);
            break;

        default:
            throw new Error(`Unsupported unit for truncateToUnit: ${unit}`);
    }

    return d.getTime();
}

/**
 * Проверяет, равны ли два значения времени с учётом заданной точности.
 *
 * @param {OzTime} a - Первое значение.
 * @param {OzTime} b - Второе значение.
 * @param {string} [unit='millisecond'] - Точность сравнения.
 * @throws {TypeError} Выбрасывается, если хотя бы один аргумент не является экземпляром OzTime.
 * @returns {boolean} `true`, если значения равны на заданной точности.
 * @example
 * import { isSame, fromISO } from '@alexstukovnikov/oz-time';
 *
 * const a = fromISO('2024-05-25T12:00:00.100Z');
 * const b = fromISO('2024-05-25T12:00:00.900Z');
 * console.log(isSame(a, b, 'second')); // ожидаемый результат: true
 */
export function isSame(a, b, unit = 'millisecond') {
    assertOzTime(a, 'a');
    assertOzTime(b, 'b');

    const tsA = truncateToUnit(a.getTimestamp(), unit);
    const tsB = truncateToUnit(b.getTimestamp(), unit);

    return tsA === tsB;
}

/**
 * Проверяет, находится ли первое значение раньше второго
 * с учётом заданной точности.
 *
 * @param {OzTime} a - Первое значение.
 * @param {OzTime} b - Второе значение.
 * @param {string} [unit='millisecond'] - Точность сравнения.
 * @throws {TypeError} Выбрасывается, если хотя бы один аргумент не является экземпляром OzTime.
 * @returns {boolean} `true`, если первое значение раньше второго.
 * @example
 * import { isBefore, fromISO } from '@alexstukovnikov/oz-time';
 *
 * const a = fromISO('2024-05-25T12:00:00Z');
 * const b = fromISO('2024-05-26T12:00:00Z');
 * console.log(isBefore(a, b)); // ожидаемый результат: true
 */
export function isBefore(a, b, unit = 'millisecond') {
    assertOzTime(a, 'a');
    assertOzTime(b, 'b');

    const tsA = truncateToUnit(a.getTimestamp(), unit);
    const tsB = truncateToUnit(b.getTimestamp(), unit);

    return tsA < tsB;
}

/**
 * Проверяет, находится ли первое значение позже второго
 * с учётом заданной точности.
 *
 * @param {OzTime} a - Первое значение.
 * @param {OzTime} b - Второе значение.
 * @param {string} [unit='millisecond'] - Точность сравнения.
 * @throws {TypeError} Выбрасывается, если хотя бы один аргумент не является экземпляром OzTime.
 * @returns {boolean} `true`, если первое значение позже второго.
 * @example
 * import { isAfter, fromISO } from '@alexstukovnikov/oz-time';
 *
 * const a = fromISO('2024-05-26T12:00:00Z');
 * const b = fromISO('2024-05-25T12:00:00Z');
 * console.log(isAfter(a, b)); // ожидаемый результат: true
 */
export function isAfter(a, b, unit = 'millisecond') {
    assertOzTime(a, 'a');
    assertOzTime(b, 'b');

    const tsA = truncateToUnit(a.getTimestamp(), unit);
    const tsB = truncateToUnit(b.getTimestamp(), unit);

    return tsA > tsB;
}

/**
 * Проверяет, попадает ли целевое значение в диапазон между двумя границами
 * с учётом заданной точности.
 *
 * @param {OzTime} target - Проверяемое значение.
 * @param {OzTime} left - Левая граница.
 * @param {OzTime} right - Правая граница.
 * @param {string} [unit='millisecond'] - Точность сравнения.
 * @param {'[]'|'[)'|'(]'|'()'} [inclusivity='[]'] - Формат включённости границ.
 * @throws {TypeError} Выбрасывается, если хотя бы один аргумент не является экземпляром OzTime.
 * @throws {Error} Выбрасывается, если inclusivity задан некорректно.
 * @returns {boolean} `true`, если значение находится внутри диапазона.
 * @example
 * import { isBetween, fromISO } from '@alexstukovnikov/oz-time';
 *
 * const target = fromISO('2024-05-25T12:00:00Z');
 * const start = fromISO('2024-05-25T10:00:00Z');
 * const end = fromISO('2024-05-25T14:00:00Z');
 * console.log(isBetween(target, start, end)); // ожидаемый результат: true
 */
export function isBetween(target, left, right, unit = 'millisecond', inclusivity = '[]') {
    assertOzTime(target, 'target');
    assertOzTime(left, 'left');
    assertOzTime(right, 'right');

    const t = truncateToUnit(target.getTimestamp(), unit);
    const l = truncateToUnit(left.getTimestamp(), unit);
    const r = truncateToUnit(right.getTimestamp(), unit);

    const min = Math.min(l, r);
    const max = Math.max(l, r);

    switch (inclusivity) {
        case '[]':
            return t >= min && t <= max;
        case '[)':
            return t >= min && t < max;
        case '(]':
            return t > min && t <= max;
        case '()':
            return t > min && t < max;
        default:
            throw new Error(`Invalid inclusivity value: ${inclusivity}`);
    }
}
