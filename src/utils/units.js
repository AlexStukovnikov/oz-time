/**
 * Утилиты для нормализации и проверки единиц времени.
 *
 * @module utils/units
 */

/**
 * Объект соотношений разных названий единиц времени к каноническим названиям.
 *
 * @type {Object.<string, string>}
 */
const UNIT_ALIASES = {
    millisecond: 'millisecond',
    milliseconds: 'millisecond',
    ms: 'millisecond',

    second: 'second',
    seconds: 'second',
    s: 'second',

    minute: 'minute',
    minutes: 'minute',
    m: 'minute',

    hour: 'hour',
    hours: 'hour',
    h: 'hour',

    day: 'day',
    days: 'day',
    d: 'day',

    month: 'month',
    months: 'month',

    year: 'year',
    years: 'year',
    y: 'year',
};

/**
 * Точное количество миллисекунд для фиксированных единиц времени.
 *
 * @type {Object.<string, number>}
 */
export const FIXED_UNIT_TO_MS = {
    millisecond: 1,
    second: 1000,
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
};

/**
 * Массив поддерживаемых календарных единиц времени.
 *
 * @type {string[]}
 */
export const CALENDAR_UNITS = ['month', 'year'];

/**
 * Нормализует единицу времени к каноническому виду.
 *
 * @param {string} unit - Единица времени.
 * @throws {TypeError} Выбрасывается, если unit пустой или не является строкой.
 * @throws {Error} Выбрасывается, если unit не поддерживается.
 * @returns {string} Каноническое название единицы времени.
 * @example
 * import { normalizeUnit } from './utils/units.js';
 *
 * console.log(normalizeUnit('hours')); // ожидаемый результат: hour
 */
export function normalizeUnit(unit) {
    if (typeof unit !== 'string' || unit.trim() === '') {
        throw new TypeError('normalizeUnit: unit must be a non-empty string');
    }

    const normalized = unit.toLowerCase().trim();
    const canonical = UNIT_ALIASES[normalized];

    if (!canonical) {
        throw new Error(`Unsupported unit: ${unit}`);
    }

    return canonical;
}

/**
 * Проверяет, является ли единица фиксированной.
 *
 * @param {string} unit - Единица времени.
 * @returns {boolean} `true`, если единица является фиксированной.
 * @example
 * import { isFixedUnit } from './utils/units.js';
 *
 * console.log(isFixedUnit('minute')); // ожидаемый результат: true
 */
export function isFixedUnit(unit) {
    return normalizeUnit(unit) in FIXED_UNIT_TO_MS;
}

/**
 * Проверяет, является ли единица календарной.
 *
 * @param {string} unit - Единица времени.
 * @returns {boolean} `true`, если единица является календарной.
 * @example
 * import { isCalendarUnit } from './utils/units.js';
 *
 * console.log(isCalendarUnit('month')); // ожидаемый результат: true
 */
export function isCalendarUnit(unit) {
    return CALENDAR_UNITS.includes(normalizeUnit(unit));
}

/**
 * Возвращает точное количество миллисекунд в одной фиксированной единице времени.
 *
 * @param {string} unit - Фиксированная единица времени.
 * @throws {Error} Выбрасывается, если unit нельзя точно перевести в миллисекунды.
 * @returns {number} Количество миллисекунд в одной единице времени.
 * @example
 * import { unitToMilliseconds } from './utils/units.js';
 *
 * console.log(unitToMilliseconds('hour')); // ожидаемый результат: 3600000
 */
export function unitToMilliseconds(unit) {
    const normalizedUnit = normalizeUnit(unit);

    if (!(normalizedUnit in FIXED_UNIT_TO_MS)) {
        throw new Error(`Unit cannot be converted to milliseconds exactly: ${unit}`);
    }

    return FIXED_UNIT_TO_MS[normalizedUnit];
}
