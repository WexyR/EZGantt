abstract class Component {
    public isBeingDragged: boolean;

    onDrag(dx: number, dy: number): void { };
    onDragFinished(): void { };

    abstract render(context: CanvasRenderingContext2D): void;

    abstract getWidth(): number;
    abstract getHeight(): number;

    abstract getX(): number;
    abstract setX(x: number): void;

    abstract getY(): number;
    abstract setY(y: number): void;
}