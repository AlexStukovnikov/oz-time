import { OzTime } from '../core/core.js';
import { addByFixedUnit } from '../utils/calendar.js';

export function add(time, amount, unit) {
    if (!(time instanceof OzTime)) {
        throw new TypeError('add: first argument must be OzTime');
    }
    const ts = addByFixedUnit(time.getTimestamp(), amount, unit);
    return new OzTime(ts, time.getTimezone(), time.getLocale());
}

export function subtract(time, amount, unit) {
    return add(time, -amount, unit);
}
