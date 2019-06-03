class Canvas {
    // Le contexte HTML. C'est la base du canvas, on en tire ses propriétés
    private context: CanvasRenderingContext2D;

    // Le panel sur lequel on dessine. Il est tiré du contexte et est parfois rafraichi
    private canvas: HTMLCanvasElement;

    // L'id html de l'élément canvas auquel s'attacher
    private canvasId: string;

    // Permet de slide le panel (=rajouter un offset au rendu)
    private renderOffsetX: number = 0;
    private renderOffsetY: number = 0;
    private nextLineId: number = 0;

    // Le contenu du canvas. Component est une interface.
    private components: Component[];

    // Non implémenté, la longueur du projet
    private projectLength: number = 3;

    // Cache pour les déplacements, sert de lien entre les events onMouseUp, onMouseMove et onMouseDown
    private haveDraggedComponent: boolean = false;
    private isDragged: boolean = false;

    // Constantes pour le rendu
    public static readonly DAY_WIDTH = 40;
    private static readonly TASK_HEIGHT = 80;
    private static readonly FONT_SIZE = 24;
    private static readonly LINE_HEIGHT = 28;
    private static readonly DAY_OF_THE_WEEK = ["L", "M", "M", "J", "V", "S", "D"]

    /**
     * Constructeur du gestionnaire de rendu d'un canvas d'id donné. Si à l'instant de la création aucun
     * canvas avec cet id n'existe, il est toujours possible d'update cette référence avec updateContext()
     * @param canvasId L'id HTML de l'élément canvas auquel se rattacher.
     */
    constructor(canvasId: string) {
        this.components = [];
        this.canvasId = canvasId;
        this.updateContext();
    }

    /**
     * Un bout de code utilitaire, en C++ je l'aurais mis inline
     */
    getOffset() {
        const rect = this.canvas.getBoundingClientRect();
        return {
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY
        };
    }

    /**
     * Ajout d'un composant / d'une tache
     * @param c Le composant à rajouter dans le canvas
     */
    registerComponent(c: Component) {
        this.components.push(c);
        c.y = this.nextLineId * Canvas.TASK_HEIGHT + Canvas.LINE_HEIGHT * 3;
        this.nextLineId++;
    }

    /**
     * Update du contexte. En gros si vous bidouillez le html du canvas, vous pouvez
     * update la reference au canvas et en refaire la config
     */
    updateContext() {
        this.canvas = <HTMLCanvasElement>document.getElementById(this.canvasId);
        if (!this.canvas) return;
        this.context = this.canvas.getContext('2d');
        this.canvas.style.width = document.documentElement.clientWidth + "px";
        this.canvas.style.height = document.documentElement.clientHeight + "px";
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;

        this.canvas.onmousedown = (e: MouseEvent) => {
            // tell the browser we're handling this mouse event
            e.stopPropagation();

            // get the current mouse position
            this.mouseX = e.clientX - this.getOffset().left;
            this.mouseY = e.clientY - this.getOffset().top;

            // test each components to see if mouse is inside
            for (let c of this.components) {
                if (this.mouseX > c.x && this.mouseX < c.x + c.width
                    && this.mouseY > c.y && this.mouseY < c.y + c.height) {
                    c.isBeingDragged = true;
                    this.haveDraggedComponent = true;
                    return;
                }
            }
            this.isDragged = true;

        };
        this.canvas.onmouseup = (e: MouseEvent) => {
            // tell the browser we're handling this mouse event
            //e.preventDefault();
            e.stopPropagation();

            // clear all the dragging flags
            this.haveDraggedComponent = false;
            for (let c of this.components) {
                if (c.isBeingDragged) {
                    c.isBeingDragged = false;
                    c.onDragFinished();
                }
            }
            this.isDragged = false;
        };
        this.canvas.onmousemove = (e: MouseEvent) => {
            // if we're dragging anything...
            if (this.haveDraggedComponent || this.isDragged) {

                // tell the browser we're handling this mouse event
                //e.preventDefault();
                e.stopPropagation();

                // get the current mouse position
                let nmx = e.clientX - this.getOffset().left;
                let nmy = e.clientY - this.getOffset().top;

                // calculate the distance the mouse has moved
                // since the last mousemove
                let dx = nmx - this.mouseX;
                let dy = nmy - this.mouseY;

                if (this.isDragged) {
                    this.renderOffsetX += dx;
                    for (let c of this.components) {
                        c.onDrag(dx, dy);
                    }
                } else {
                    for (let c of this.components) {
                        if (c.isBeingDragged) {
                            c.onDrag(dx, dy);
                        }
                    }
                }
                this.mouseX = nmx;
                this.mouseY = nmy;
                this.render();
            }
        };
        this.render()
    }

    /**
     * La fonction de rendu. Est appelée par les différents events qu'on gère
     */
    render(): boolean {
        if (!this.canvas) return false;
        this.context.clearRect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);

        // Loading fonts
        this.context.fillStyle = "DimGray";
        this.context.font = Canvas.FONT_SIZE + 'px mono';

        // Background grid
        let day = ~~Math.abs(Math.abs(this.renderOffsetX) / Canvas.DAY_WIDTH);
        if (this.renderOffsetX > 0) {
            day = Math.abs(day - 7 * ~~(Math.abs(this.renderOffsetX) / Canvas.DAY_WIDTH)) % 7;
        }
        day %= 7;
        for (let x = this.renderOffsetX % Canvas.DAY_WIDTH; x < this.canvas.width; x += Canvas.DAY_WIDTH) {
            this.context.strokeStyle = (day == 0 ? "DimGray" : "LightGray");
            this.context.beginPath();
            this.context.moveTo(x, (day == 0 ? 0 : Canvas.LINE_HEIGHT));
            this.context.lineTo(x, this.canvas.height);
            this.context.stroke();
            this.context.fillText(Canvas.DAY_OF_THE_WEEK[day], x + Canvas.DAY_WIDTH / 2 - Canvas.FONT_SIZE / 4, Canvas.LINE_HEIGHT * 3 / 2 + Canvas.FONT_SIZE / 2);
            day = (day + 1) % 7;
        }
        this.context.strokeStyle = "DimGray";
        this.context.beginPath();
        this.context.moveTo(0, Canvas.LINE_HEIGHT);
        this.context.lineTo(this.canvas.width, Canvas.LINE_HEIGHT);
        this.context.stroke();

        // Component rendering
        for (let c of this.components) {
            c.render(this.context);
        }
        return true;
    }

    clear(): void {
        this.components = [];
    }

    private mouseX: number;
    private mouseY: number;
}

// On crée notre instance ici. Je vais probablement la déplacer dans app.js plus tard 
var graph = new Canvas('graph');

/**
 * Charge dans une variable canvas donnée le gantt par défaut
 * @param canvas Le canvas à intialiser
 */
function openTestGraph(canvas: Canvas): void {
    canvas.clear();
    var begin: Date = new Date("2019-05-06");
    var t0: Task = new Task(undefined, begin, "t0");
    // tache debutant le 7 et durant une semaine
    t0.setTimeDate(new Date("2019-05-07"), undefined, new Duration(0, 0, 0, 0, 0, 1))
    t0.setTimeConstraint(TimeConstraint.Start)

    var t1: Task = new Task(undefined, begin, "t1");
    // tache debutant le 14 et durant une semaine
    t1.setTimeDate(new Date("2019-05-14"), undefined, new Duration(0, 0, 0, 0, 0, 1))
    //avec t0 comme predecessor
    t1.addPredecessor(t0);
    t1.setTimeConstraint(TimeConstraint.Timespan);

    //sous tache de 3jours au debut de t1
    //var st1_1 = new Task(t1, undefined, "st1_1");

    canvas.registerComponent(t0);
    canvas.registerComponent(t1);

    /*canvas.registerComponent(new Task("Création des graphes UML", 75, 150, 100, 200, 80, 'Silver'));
    canvas.registerComponent(new Task("Implémentation", 15, 360, 190, 200, 80, 'Silver'));*/
    //console.log(JSON.stringify(graph));
}
