import { OzTime } from '../core/core.js';
import { normalizeUnit, isFixedUnit, unitToMilliseconds } from '../utils/units.js';

/**
 * Модуль интервалов времени.
 *
 * @module modules/interval
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
 * Представляет замкнутый интервал между двумя значениями времени.
 *
 * @class
 * @example
 * import { Interval, fromISO } from '@alexstukovnikov/oz-time';
 *
 * const start = fromISO('2024-05-25T10:00:00Z');
 * const end = fromISO('2024-05-25T12:00:00Z');
 * const range = new Interval(start, end);
 * console.log(range.contains(fromISO('2024-05-25T11:00:00Z'))); // ожидаемый результат: true
 */
export class Interval {
    /**
     * Создаёт новый экземпляр Interval.
     *
     * @param {OzTime} start - Начало интервала.
     * @param {OzTime} end - Конец интервала.
     * @throws {TypeError} Выбрасывается, если start или end не являются экземплярами OzTime.
     * @throws {RangeError} Выбрасывается, если start больше end.
     */
    constructor(start, end) {
        assertOzTime(start, 'start');
        assertOzTime(end, 'end');

        if (start.getTimestamp() > end.getTimestamp()) {
            throw new RangeError('Interval: start must be before or equal to end');
        }

        this._start = start;
        this._end = end;
    }

    /**
     * Возвращает начало интервала.
     *
     * @returns {OzTime} Начальная граница интервала.
     * @example
     * import { Interval, fromISO } from '@alexstukovnikov/oz-time';
     *
     * const range = new Interval(
     *   fromISO('2024-05-25T10:00:00Z'),
     *   fromISO('2024-05-25T12:00:00Z')
     * );
     * console.log(range.getStart().toISOString()); // ожидаемый результат: 2024-05-25T10:00:00.000Z
     */
    getStart() {
        return this._start;
    }

    /**
     * Возвращает конец интервала.
     *
     * @returns {OzTime} Конечная граница интервала.
     * @example
     * import { Interval, fromISO } from '@alexstukovnikov/oz-time';
     *
     * const range = new Interval(
     *   fromISO('2024-05-25T10:00:00Z'),
     *   fromISO('2024-05-25T12:00:00Z')
     * );
     * console.log(range.getEnd().toISOString()); // ожидаемый результат: 2024-05-25T12:00:00.000Z
     */
    getEnd() {
        return this._end;
    }

    /**
     * Проверяет, содержит ли интервал переданное значение времени.
     *
     * @param {OzTime} moment - Проверяемое значение.
     * @throws {TypeError} Выбрасывается, если moment не является экземпляром OzTime.
     * @returns {boolean} `true`, если значение входит в интервал.
     * @example
     * import { Interval, fromISO } from '@alexstukovnikov/oz-time';
     *
     * const range = new Interval(
     *   fromISO('2024-05-25T10:00:00Z'),
     *   fromISO('2024-05-25T12:00:00Z')
     * );
     * console.log(range.contains(fromISO('2024-05-25T11:00:00Z'))); // ожидаемый результат: true
     */
    contains(moment) {
        assertOzTime(moment, 'moment');

        const ts = moment.getTimestamp();
        return ts >= this._start.getTimestamp() && ts <= this._end.getTimestamp();
    }

    /**
     * Проверяет, пересекается ли текущий интервал с другим интервалом.
     *
     * @param {Interval} other - Второй интервал.
     * @throws {TypeError} Выбрасывается, если other не является экземпляром Interval.
     * @returns {boolean} `true`, если интервалы пересекаются.
     * @example
     * import { Interval, fromISO } from '@alexstukovnikov/oz-time';
     *
     * const a = new Interval(
     *   fromISO('2024-05-25T10:00:00Z'),
     *   fromISO('2024-05-25T12:00:00Z')
     * );
     * const b = new Interval(
     *   fromISO('2024-05-25T11:00:00Z'),
     *   fromISO('2024-05-25T13:00:00Z')
     * );
     * console.log(a.overlaps(b)); // ожидаемый результат: true
     */
    overlaps(other) {
        if (!(other instanceof Interval)) {
            throw new TypeError('other must be Interval');
        }

        const startA = this._start.getTimestamp();
        const endA = this._end.getTimestamp();
        const startB = other.getStart().getTimestamp();
        const endB = other.getEnd().getTimestamp();

        return startA <= endB && startB <= endA;
    }

    /**
     * Возвращает длительность интервала в фиксированной единице времени.
     *
     * @param {string} [unit='millisecond'] - Фиксированная единица времени.
     * @throws {Error} Выбрасывается, если unit не является фиксированной единицей времени.
     * @returns {number} Длительность интервала в указанной единице.
     * @example
     * import { Interval, fromISO } from '@alexstukovnikov/oz-time';
     *
     * const range = new Interval(
     *   fromISO('2024-05-25T10:00:00Z'),
     *   fromISO('2024-05-25T12:00:00Z')
     * );
     * console.log(range.duration('hour')); // ожидаемый результат: 2
     */
    duration(unit = 'millisecond') {
        const normalizedUnit = normalizeUnit(unit);

        if (!isFixedUnit(normalizedUnit)) {
            throw new Error(`Interval.duration supports only fixed units: ${unit}`);
        }

        const diffMs = this._end.getTimestamp() - this._start.getTimestamp();
        return diffMs / unitToMilliseconds(normalizedUnit);
    }
}

/**
 * Создаёт и возвращает экземпляр {@link Interval}.
 *
 * @param {OzTime} start - Начало интервала.
 * @param {OzTime} end - Конец интервала.
 * @returns {Interval} Новый экземпляр Interval.
 * @example
 * import { interval, fromISO } from '@alexstukovnikov/oz-time';
 *
 * const range = interval(
 *   fromISO('2024-05-25T10:00:00Z'),
 *   fromISO('2024-05-25T12:00:00Z')
 * );
 * console.log(range.duration('hour')); // ожидаемый результат: 2
 */
export function interval(start, end) {
    return new Interval(start, end);
}
