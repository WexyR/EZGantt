interface Component {
    width: number;
    height: number;
    x: number;
    y: number;
    isBeingDragged: boolean;
    onDrag(dx: number, dy: number): void;
    render(context: CanvasRenderingContext2D): void;
}