abstract class Component {
    width: number;
    height: number;
    x: number;
    y: number;
    isBeingDragged: boolean;
    onDrag(dx: number, dy: number): void {};
    onDragFinished(): void {};
    abstract render(context: CanvasRenderingContext2D): void;
}