export default class CanvasZoom {

    static mouse = null;

    // coordinates of our cursor
    static cursorX;
    static cursorY;
    static prevCursorX;
    static prevCursorY;

    static zoomSpeed = 0.002;

    // mouse functions
    static leftMouseDown = false;
    static rightMouseDown = false;

    constructor(canvas) {

        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        // internal storage for listeners
        this.listeners = {};

        // distance from origin
        this.offsetX = 0;
        this.offsetY = 0;

        // zoom amount
        this.scale = 1;

        const that = this;

        // Mouse Event Handlers
        this.canvas.addEventListener('mousedown', onMouseDown);
        this.canvas.addEventListener('mouseup', onMouseUp, false);
        this.canvas.addEventListener('mouseout', onMouseOut, false);
        this.canvas.addEventListener('mousemove', onMouseMove, false);
        this.canvas.addEventListener('wheel', onMouseWheel, false);

        this.zoomActualSize();

        function getMouseLocation(e) {

            const rect = that.canvas.getBoundingClientRect();

            const screenX = e.clientX - rect.left;
            const screenY = e.clientY - rect.top;

            return {
                x: (screenX / that.scale) - that.offsetX,
                y: (screenY / that.scale) - that.offsetY
            };
        }

        function onMouseOut(event) {

            that.emit('mouseout', {});
        }

        function onMouseDown(event) {

            // detect left clicks
            if (event.button == 0) {
                CanvasZoom.leftMouseDown = true;
                CanvasZoom.rightMouseDown = false;
            }

            // detect right clicks
            if (event.button == 2) {
                CanvasZoom.rightMouseDown = true;
                CanvasZoom.leftMouseDown = false;
            }

            // update the cursor coordinates
            CanvasZoom.cursorX = event.pageX;
            CanvasZoom.cursorY = event.pageY;
            CanvasZoom.prevCursorX = event.pageX;
            CanvasZoom.prevCursorY = event.pageY;

            that.emit('mousedown', { mouse: CanvasZoom.mouse });
        }

        function onMouseMove(event) {

            // get mouse position
            CanvasZoom.cursorX = event.pageX;
            CanvasZoom.cursorY = event.pageY;

            if (CanvasZoom.leftMouseDown) {
                // move the screen
                that.offsetX += (CanvasZoom.cursorX - CanvasZoom.prevCursorX) / that.scale;
                that.offsetY += (CanvasZoom.cursorY - CanvasZoom.prevCursorY) / that.scale;
            }

            CanvasZoom.prevCursorX = CanvasZoom.cursorX;
            CanvasZoom.prevCursorY = CanvasZoom.cursorY;

            CanvasZoom.mouse = getMouseLocation(event);

            that.emit('mousemove', { mouse: CanvasZoom.mouse });
        }

        function onMouseUp() {

            CanvasZoom.leftMouseDown = false;
            CanvasZoom.rightMouseDown = false;

            that.emit('mouseup', CanvasZoom.mouse);
        }

        function onMouseWheel(event) {
            event.preventDefault();

            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            const prevScale = that.scale;
            const scaleFactor = Math.exp(-event.deltaY * CanvasZoom.zoomSpeed);
            const newScale = prevScale * scaleFactor;

            // world position before zoom
            const worldX = (mouseX / prevScale) - that.offsetX;
            const worldY = (mouseY / prevScale) - that.offsetY;

            // apply new scale
            that.scale = newScale;

            // recompute offset so cursor stays fixed
            that.offsetX = (mouseX / newScale) - worldX;
            that.offsetY = (mouseY / newScale) - worldY;

            that.emit('wheel', CanvasZoom.mouse);
        }
    }

    resizeCanvas() {

        const rect = this.canvas.getBoundingClientRect();

        const availableHeight = window.innerHeight - rect.top - 20;

        this.canvas.style.height = availableHeight + "px";
        this.canvas.width = rect.width;
        this.canvas.height = availableHeight;
    }

    size(size) {
        return size * this.scale;
    }

    toScreenX(xTrue) {
        return (xTrue + this.offsetX) * this.scale;
    }

    toScreenY(yTrue) {
        return (yTrue + this.offsetY) * this.scale;
    }

    toTrueX(xScreen) {
        return (xScreen / this.scale) - this.offsetX;
    }

    toTrueY(yScreen) {
        return (yScreen / this.scale) - this.offsetY;
    }

    trueHeight() {
        return this.canvas.clientHeight / this.scale;
    }

    trueWidth() {
        return this.canvas.clientWidth / this.scale;
    }

    zoomActualSize() {
        this.scale = 1;
        this.offsetX = 10;
        this.offsetY = 10;
    }

    zoomIn() {

        const deltaY = -50;
        const scaleAmount = -deltaY / 500;

        this.scale = this.scale * (1 + scaleAmount);
    }

    zoomOut() {

        const deltaY = 50;
        const scaleAmount = -deltaY / 500;

        this.scale = this.scale * (1 + scaleAmount);
    }

    on(trigger, handler) {

        if (!this.listeners[trigger]) {
            this.listeners[trigger] = [];
        }

        this.listeners[trigger].push(handler);
    }

    emit(trigger, ...args) {

        if (!this.listeners[trigger]) {
            return;
        }

        this.listeners[trigger].forEach(handler => handler(...args));
    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    fillSquare(x, y, width, height, color) {

        x = this.toScreenX(x);
        y = this.toScreenY(y);
        width = this.size(width);
        height = this.size(height);

        this.ctx.beginPath();
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
        this.ctx.strokeRect(x, y, width, height);
    }

    drawLine(x1, y1, x2, y2, color) {

        x1 = this.toScreenX(x1);
        y1 = this.toScreenY(y1);
        x2 = this.toScreenX(x2);
        y2 = this.toScreenY(y2);

        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }
}
