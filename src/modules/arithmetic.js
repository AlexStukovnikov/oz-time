import { OzTime } from '../core/core.js';
import { normalizeUnit, isFixedUnit, isCalendarUnit } from '../utils/units.js';
import { addByFixedUnit, addByCalendarUnit } from '../utils/calendar.js';

/**
 * Модуль арифметических операций над экземплярами {@link OzTime}.
 *
 * @module modules/arithmetic
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
 * Проверяет корректность числового значения amount.
 *
 * @private
 * @param {number} amount - Количество единиц времени.
 * @throws {TypeError} Выбрасывается, если amount не является корректным числом.
 * @returns {void}
 */
function assertAmount(amount) {
    if (typeof amount !== 'number' || Number.isNaN(amount)) {
        throw new TypeError('amount must be a valid number');
    }
}

/**
 * Возвращает новый экземпляр {@link OzTime}, у которого timestamp увеличен
 * на указанное количество единиц времени.
 *
 * Поддерживает как фиксированные, так и календарные единицы времени.
 * Исходный экземпляр не изменяется.
 *
 * @param {OzTime} time - Исходное значение времени.
 * @param {number} amount - Количество единиц времени.
 * @param {string} unit - Единица времени.
 * @throws {TypeError} Выбрасывается, если time или amount некорректны.
 * @returns {OzTime} Новый экземпляр OzTime с timestamp, сдвинутым вперёд.
 * @example
 * import { add, fromISO } from '@alexstukovnikov/oz-time';
 *
 * const time = fromISO('2024-05-25T12:00:00Z', 'UTC', 'ru-RU');
 * const result = add(time, 2, 'day');
 * console.log(result.toISOString()); // ожидаемый результат: 2024-05-27T12:00:00.000Z
 */
export function add(time, amount, unit) {
    assertOzTime(time, 'time');
    assertAmount(amount);

    const normalizedUnit = normalizeUnit(unit);
    const timestamp = time.getTimestamp();

    let nextTimestamp;

    if (isFixedUnit(normalizedUnit)) {
        nextTimestamp = addByFixedUnit(timestamp, amount, normalizedUnit);
    } else if (isCalendarUnit(normalizedUnit)) {
        nextTimestamp = addByCalendarUnit(timestamp, amount, normalizedUnit);
    }

    return new OzTime(nextTimestamp, time.getTimezone(), time.getLocale());
}

/**
 * Возвращает новый экземпляр {@link OzTime}, у которого timestamp уменьшен
 * на указанное количество единиц времени.
 *
 * Исходный экземпляр не изменяется.
 *
 * @param {OzTime} time - Исходное значение времени.
 * @param {number} amount - Количество единиц времени.
 * @param {string} unit - Единица времени.
 * @throws {TypeError} Выбрасывается, если time или amount некорректны.
 * @returns {OzTime} Новый экземпляр OzTime с timestamp, сдвинутым назад.
 * @example
 * import { subtract, fromISO } from '@alexstukovnikov/oz-time';
 *
 * const time = fromISO('2024-05-25T12:00:00Z', 'UTC', 'ru-RU');
 * const result = subtract(time, 3, 'hour');
 * console.log(result.toISOString()); // ожидаемый результат: 2024-05-25T09:00:00.000Z
 */
export function subtract(time, amount, unit) {
    assertOzTime(time, 'time');
    assertAmount(amount);

    return add(time, -amount, unit);
}
