import { isFixedUnit, unitToMilliseconds, normalizeUnit } from '../utils/units.js';

/**
 * Модуль для работы с фиксированными длительностями.
 *
 * @module modules/duration
 */

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
 * Представляет фиксированную длительность, хранящуюся в миллисекундах.
 *
 * @class
 * @example
 * import { Duration } from 'oz-time';
 *
 * const duration = new Duration(3600000);
 * console.log(duration.asHours()); // ожидаемый результат: 1
 */
export class Duration {
    /**
     * Создаёт экземпляр Duration.
     *
     * @param {number} milliseconds - Длительность в миллисекундах.
     * @throws {TypeError} Выбрасывается, если milliseconds некорректен.
     */
    constructor(milliseconds) {
        if (typeof milliseconds !== 'number' || Number.isNaN(milliseconds)) {
            throw new TypeError('Duration: milliseconds must be a valid number');
        }

        this._milliseconds = milliseconds;
    }

    /**
     * Возвращает длительность в миллисекундах.
     *
     * @returns {number} Длительность в миллисекундах.
     * @example
     * import { duration } from 'oz-time';
     *
     * const value = duration(3600000, 'millisecond');
     * console.log(value.asMilliseconds()); // ожидаемый результат: 3600000
     */
    asMilliseconds() {
        return this._milliseconds;
    }

    /**
     * Возвращает длительность в секундах.
     *
     * @returns {number} Длительность в секундах.
     * @example
     * import { duration } from 'oz-time';
     *
     * const value = duration(3600000, 'millisecond');
     * console.log(value.asSeconds()); // ожидаемый результат: 3600
     */
    asSeconds() {
        return this._milliseconds / unitToMilliseconds('second');
    }

    /**
     * Возвращает длительность в минутах.
     *
     * @returns {number} Длительность в минутах.
     * @example
     * import { duration } from 'oz-time';
     *
     * const value = duration(3600000, 'millisecond');
     * console.log(value.asMinutes()); // ожидаемый результат: 60
     */
    asMinutes() {
        return this._milliseconds / unitToMilliseconds('minute');
    }

    /**
     * Возвращает длительность в часах.
     *
     * @returns {number} Длительность в часах.
     * @example
     * import { duration } from 'oz-time';
     *
     * const value = duration(36000000, 'millisecond');
     * console.log(value.asHours()); // ожидаемый результат: 10
     */
    asHours() {
        return this._milliseconds / unitToMilliseconds('hour');
    }

    /**
     * Возвращает длительность в днях.
     *
     * @returns {number} Длительность в днях.
     * @example
     * import { duration } from 'oz-time';
     *
     * const value = duration(120, 'hour');
     * console.log(value.asDays()); // ожидаемый результат: 5
     */
    asDays() {
        return this._milliseconds / unitToMilliseconds('day');
    }

    /**
     * Возвращает новую длительность, равную сумме текущей и переданной длительности.
     *
     * @param {Duration} other - Вторая длительность.
     * @throws {TypeError} Выбрасывается, если other не является экземпляром Duration.
     * @returns {Duration} Новая длительность, равная сумме двух значений.
     * @example
     * import { duration } from 'oz-time';
     *
     * const a = duration(1, 'second');
     * const b = duration(2, 'second');
     * console.log(a.add(b).asMilliseconds()); // ожидаемый результат: 3000
     */
    add(other) {
        if (!(other instanceof Duration)) {
            throw new TypeError('Duration.add: other must be Duration');
        }

        return new Duration(this._milliseconds + other._milliseconds);
    }
}

/**
 * Создаёт и возвращает экземпляр {@link Duration} из числа
 * и фиксированной единицы времени.
 *
 * @param {number} amount - Количество единиц времени.
 * @param {string} unit - Фиксированная единица времени.
 * @throws {TypeError} Выбрасывается, если amount некорректен.
 * @throws {Error} Выбрасывается, если unit не является фиксированной единицей времени.
 * @returns {Duration} Экземпляр Duration.
 * @example
 * import { duration } from 'oz-time';
 *
 * const value = duration(2, 'hour');
 * console.log(value.asMinutes()); // ожидаемый результат: 120
 */
export function duration(amount, unit) {
    assertAmount(amount);

    const normalizedUnit = normalizeUnit(unit);

    if (!isFixedUnit(normalizedUnit)) {
        throw new Error(`duration supports only fixed units: ${unit}`);
    }

    return new Duration(amount * unitToMilliseconds(normalizedUnit));
}
