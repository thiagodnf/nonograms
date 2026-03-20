export default class LocalStorageUtils {

    static set(key, value) {

        if (!key || key.trim() === "") {
            throw new Error('Key is required');
        }

        localStorage.setItem(key, JSON.stringify(value));
    }

    static get(key, defaultValue = null) {

        if (!key || key.trim() === "") {
            throw new Error('Key is required');
        }

        const raw = localStorage.getItem(key);

        if (raw === null) return defaultValue;

        try {
            return JSON.parse(raw);
        } catch {
            return defaultValue;
        }
    }

    static remove(key) {

        if (!key || key.trim() === "") {
            throw new Error('Key is required');
        }

        localStorage.removeItem(key);
    }

    static clear() {
        localStorage.clear();
    }

    static has(key) {

        if (!key || key.trim() === "") {
            throw new Error('Key is required');
        }

        return localStorage.getItem(key) !== null;
    }
}
