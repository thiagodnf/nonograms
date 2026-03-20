export default class ImportUtils {

    static readJson(file) {

        if (!file) return Promise.reject(new Error('No file provided'));

        return new Promise((resolve, reject) => {

            const reader = new FileReader();

            reader.onload = () => {
                try {
                    resolve(JSON.parse(reader.result));
                } catch {
                    reject(new Error('Invalid JSON'));
                }
            };

            reader.onerror = () => reject(reader.error);

            reader.readAsText(file);
        });
    }

    static readNonogram(file) {

        return ImportUtils.readJson(file).then(data => {

            if (!data || typeof data !== 'object') {
                throw new Error('The nonogram file is not an JSON object');
            }

            const { columns, lines, grid } = data;

            if (!Number.isInteger(columns) || columns <= 0) {
                throw new Error('The nonogram\'s columns must be positive integer');
            }

            if (!Number.isInteger(lines) || lines <= 0) {
                throw new Error('The nonogram\'s columns must be positive integer');
            }

            if (!Array.isArray(data.grid)) {
                throw new Error('The nonogram\'s grid must be array');
            }

            if (grid.length !== lines) {
                throw new Error(`Invalid: grid rows (${grid.length}) !== lines (${lines})`);
            }

            for (let i = 0; i < grid.length; i++) {

                const row = grid[i];

                if (!Array.isArray(row)) {
                    throw new Error(`Invalid: row ${i} is not array`);
                }

                if (row.length !== columns) {
                    throw new Error(`Invalid: row ${i} length !== columns`);
                }

                for (let j = 0; j < row.length; j++) {

                    const cell = row[j];

                    if (cell !== 0 && cell !== 1) {
                        throw new Error(`Invalid: cell [${i}][${j}] must be 0 or 1`);
                    }
                }
            }

            return data;
        });
    };
}
