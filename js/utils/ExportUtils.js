export default class ExportUtils {

    static save(blob, filename) {

        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    }

    static asJson(nanogram) {

        const str = JSON.stringify(nanogram, null, 2);

        const blob = new Blob([str], { type: 'application/json' });

        ExportUtils.save(blob, 'nanogram.json');
    }

    static asPng(canvas) {
        canvas.toBlob((blob) => {
            ExportUtils.save(blob, 'nanogram.png');
        }, 'image/png');
    }
}
