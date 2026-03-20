import LocalStorageUtils from "./utils/LocalStorageUtils.js";
import CanvasZoom from "./utils/CanvasZoom.js";
import ExportUtils from "./utils/ExportUtils.js";
import ImportUtils from "./utils/ImportUtils.js";

// Cell's Dimensions
const dim = 25;

let nonogram = {
    lines: 5,
    columns: 5,
    grid: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ]
};

const $newModal = document.getElementById('newModal');
const $newForm = document.getElementById('newForm');
const $btnNew = document.getElementById("btn-new");
const $btnExportToJson = document.getElementById("btn-export-to-json");
const $btnExportToPng = document.getElementById("btn-export-to-png");
const $canvas = document.getElementById("canvas");
const $btnOpen = document.getElementById('btn-open');
const $input = document.getElementById('fileInput');

const canvasZoom = new CanvasZoom($canvas);

const modal = new bootstrap.Modal($newModal, {
    backdrop: 'static',
    keyboard: false
});

$newModal.addEventListener('shown.bs.modal', () => {
    document.getElementById('lines').focus();
});

$newModal.addEventListener('show.bs.modal', () => {
    $newForm.classList.remove('was-validated');
});

$newForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!$newForm.checkValidity()) {
        $newForm.classList.add('was-validated');
        return;
    }

    const data = Object.fromEntries(new FormData($newForm).entries());

    onModalClose(data);

    modal.hide();
});

function onModalClose(data) {

    const lines = parseInt(data.lines);
    const columns = parseInt(data.columns);

    nonogram = {
        lines,
        columns,
        grid: createMatrix(columns, lines)
    }

    LocalStorageUtils.set("creative-mode-nonogram", nonogram);
}

function createMatrix(x, y) {

    const matrix = new Array(y);

    for (let i = 0; i < y; i++) {

        matrix[i] = new Array(x);

        for (let j = 0; j < x; j++) {
            matrix[i][j] = 0;
        }
    }

    return matrix;
}

function draw() {

    canvasZoom.clear();

    update();

    requestAnimationFrame(draw);
}

function update() {

    const { lines, columns, grid } = nonogram;

    for (var i = 0; i < lines; i++) {
        for (var j = 0; j < columns; j++) {
            if (grid[i][j] == 1) {
                canvasZoom.fillSquare(j * dim, i * dim, dim, dim, "#424242");
            } else {
                canvasZoom.fillSquare(j * dim, i * dim, dim, dim, "white");
            }
        }
    }
}

function onMouseUp(mouse) {

    const { lines, columns, grid } = nonogram;

    const j = Math.floor(mouse.x / dim);
    const i = Math.floor(mouse.y / dim);

    // Ignore if clicked outside
    if (i < 0 || j < 0 || i >= lines || j >= columns) return;

    // Flip the number
    grid[i][j] = 1 - grid[i][j];

    LocalStorageUtils.set("creative-mode-nonogram", nonogram);
}

function onInit() {

    canvasZoom.resizeCanvas();
    draw();

    const savedNonogram = LocalStorageUtils.get("creative-mode-nonogram");

    if (savedNonogram) {
        nonogram = savedNonogram;
    }

    $btnNew.addEventListener('click', () => {
        modal.show();
    });

    $btnExportToJson.addEventListener('click', () => {
        ExportUtils.asJson(nonogram);
    });

    $btnExportToPng.addEventListener('click', () => {
        ExportUtils.asPng(canvas);
    });

    $btnOpen.addEventListener('click', () => $input.click());

    $input.addEventListener('change', (e) => {

        const file = e.target.files[0];

        ImportUtils.readNonogram(file).then(data => {
            nonogram = data;
        }).catch(err => {
            console.error(err.message);
        });
    });

}

/**
 * Disable the default browser context menu on canvas element.
 */
function onContextMenu(e) {
    e.preventDefault();
}

canvasZoom.on("mouseup", onMouseUp);

// Add Canvas Events
canvasZoom.canvas.addEventListener('contextmenu', onContextMenu);

// Add Window Events
window.addEventListener('resize', canvasZoom.resizeCanvas);

// Add Document Events
document.addEventListener('DOMContentLoaded', onInit);
