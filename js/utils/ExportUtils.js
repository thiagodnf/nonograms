export default class ExportUtils {

    static asJson(nanogram) {

        const str = JSON.stringify(nanogram, null, 2);

        const blob = new Blob([str], { type: 'application/json' });

        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'nanogram.json';
        a.click();

        URL.revokeObjectURL(url);
    }

    static asPng(canvas) {
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'nanogram.png';
            a.click();

            URL.revokeObjectURL(url);
        }, 'image/png');
    }
}
