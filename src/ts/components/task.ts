class Task implements Component {
    public isBeingDragged: boolean = false;
    public width: number = 50;
    public height: number = 50;
    public x: number = 0;
    public y: number = 0;

    private text: string;
    public clearingScore: number;
    public bgColor: string;
    public fontSize: number = 16;

    constructor(text: string, clearingScore: number, x: number, y: number, width: number, height: number, bgColor: string) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.clearingScore = clearingScore;
        this.width = width;
        this.height = height;
        this.bgColor = bgColor;
    }

    onDrag(dx: number, dy: number): void {
        this.x += dx;
    }

    render(context: CanvasRenderingContext2D): void {
        // Background
        context.fillStyle = this.bgColor;
        context.fillRect(this.x, this.y, this.width, this.height);
        // Title
        context.fillStyle = "Black"
        context.font = this.fontSize + 'px mono';
        context.fillText(this.text, this.x + this.width / 2 - this.text.length * 4, this.y + this.fontSize);
        // Progress
        context.fillText(this.clearingScore + "%", this.x + this.width / 2 - 12, this.y + 2 * this.height / 3 - this.fontSize/2, 3 * (this.fontSize/2));
        context.fillStyle = 'Green';
        context.fillRect(this.x, this.y + 2 * this.height / 3, this.width / 100 * this.clearingScore, this.height / 6);
        // Stroke
        context.strokeStyle = 'Black'
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.strokeRect(this.x, this.y + 2 * this.height / 3, this.width, this.height / 6);
    }
}