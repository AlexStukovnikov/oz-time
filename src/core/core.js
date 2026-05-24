export class OzTime {
    #timestamp; // миллисекунды UTC
    #timezone; // "Europe/Moscow"
    #locale; // "ru-RU"

    constructor(timestamp, timezone = 'UTC', locale = 'en-US') {
        this.#timestamp = Number(timestamp);
        this.#timezone = String(timezone);
        this.#locale = String(locale);
        Object.freeze(this); // защита от мутаций
    }

    // Доступ к внутреннему состоянию
    getTimestamp() {
        return this.#timestamp;
    }

    getTimezone() {
        return this.#timezone;
    }

    getLocale() {
        return this.#locale;
    }

    // Базовые преобразования
    toDate() {
        return new Date(this.#timestamp);
    }

    toISOString() {
        return new Date(this.#timestamp).toISOString();
    }

    toTimestamp() {
        return this.#timestamp;
    }
}
