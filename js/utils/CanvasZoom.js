export default class CanvasZoom {

    static canvas = null;

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

        CanvasZoom.canvas = canvas;

        // internal storage for listeners
        this.listeners = {};

        // distance from origin
        this.offsetX = 0;
        this.offsetY = 0;

        // zoom amount
        this.scale = 1;

        const that = this;

        // Mouse Event Handlers
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mouseup', onMouseUp, false);
        canvas.addEventListener('mouseout', onMouseOut, false);
        canvas.addEventListener('mousemove', onMouseMove, false);
        canvas.addEventListener('wheel', onMouseWheel, false);

        this.zoomActualSize();

        function getMouseLocation(e) {

            const rect = canvas.getBoundingClientRect();

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

            that.emit('mouseup', CanvasZoom.mouse, that.wasMoving);
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
        return CanvasZoom.canvas.clientHeight / this.scale;
    }

    trueWidth() {
        return CanvasZoom.canvas.clientWidth / this.scale;
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

    clear(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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

    fillSquare(ctx, x, y, width, height, color) {

        x = this.toScreenX(x);
        y = this.toScreenY(y);
        width = this.size(width);
        height = this.size(height);

        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
    }

    drawLine(ctx, x1, y1, x2, y2, color) {

        x1 = this.toScreenX(x1);
        y1 = this.toScreenY(y1);
        x2 = this.toScreenX(x2);
        y2 = this.toScreenY(y2);

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}
