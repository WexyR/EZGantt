class Renderer {
    // Le contexte HTML. C'est la base du canvas, on en tire ses propriétés
    private context: CanvasRenderingContext2D;

    // Le panel sur lequel on dessine. Il est tiré du contexte et est parfois rafraichi
    private canvas: HTMLCanvasElement;

    // L'id html de l'élément canvas auquel s'attacher
    private canvasId: string;

    // Permet de slide le panel (=rajouter un offset au rendu)
    private renderOffsetX: number = 0;
    private renderOffsetY: number = 0;

    /*// Le contenu du canvas. Component est une interface.
    private components: Component[];*/
    public selectedProject: Project;

    // Non implémenté, la longueur du projet en semaine
    private projectLength: number = 3;
    private projectStart: Date;

    // Cache pour les déplacements, sert de lien entre les events onMouseUp, onMouseMove et onMouseDown
    private haveDraggedComponent: boolean = false;
    private isDragged: boolean = false;

    // Dernière position connue de la souris. Sert aux calculs de déplacement 'drag'
    private mouseX: number;
    private mouseY: number;

    // Constantes pour le rendu
    public static readonly DAY_WIDTH = 40;
    public static readonly TASK_HEIGHT = 80;
    public static readonly FONT_SIZE = 24;
    public static readonly LINE_HEIGHT = 28;
    public static readonly DAY_OF_THE_WEEK = ["L", "M", "M", "J", "V", "S", "D"]

    /**
     * L'interface de modification de tache, faute de mieux
     */
    public static readonly MODIFICATION_ENABLED =
        '<p>'
        + '<label for="task-modification-name">Nom tache</label> :'
        + '<input type="text" name="task-modification-name" id="task-modification-name" placeholder="Tache #1" required>'
        + '</p>'
        + '<p>'
        + '<label for="task-modification-weight">Poids</label> :'
        + '<input type="number" name="task-modification-weight" id="task-modification-weight" required>'
        + '</p>'
        + '<p>'
        + '<label for="task-modification-progress">Progression 1-100</label> :'
        + '<input type="number" name="task-modification-progress" id="task-modification-progress" required>'
        + '</p>'
        + '<p>'
        + '<label for="task-modification-predecessor">Prédecesseur</label> :'
        + '<input type="text" name="task-modification-predecessor" id="task-modification-predecessor" required>'
        + '</p>';

    //"Vous avez sélectionné ouno tash. Cherr élèèèèèève";

    /**
     * La tab de modification de tache, quand il n'y a pas de selection
     */
    public static readonly MODIFICATION_DISABLED = "<p>Selectionner une tache pour commencer</p>";

    /**
     * En attendant la création d'une classe projet
     * TODO: La créer ^^'
     */
    public static begin: Date = new Date("2019-05-06");

    /**
     * Constructeur du gestionnaire de rendu d'un canvas d'id donné. Si à l'instant de la création aucun
     * canvas avec cet id n'existe, il est toujours possible d'update cette référence avec updateContext()
     * @param canvasId L'id HTML de l'élément canvas auquel se rattacher.
     */
    constructor(canvasId: string) {
        this.selectedProject = new Project();
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

        /**
         * On définit l'event clic start du canvas
         */
        this.canvas.onmousedown = (e: MouseEvent) => {
            // tell the browser we're handling this mouse event
            e.stopPropagation();

            // get the current mouse position
            this.mouseX = e.clientX - this.getOffset().left;
            this.mouseY = e.clientY - this.getOffset().top;

            // test each components to see if mouse is inside
            for (let c of this.selectedProject.components) {
                if (this.mouseX > c.getX() + this.renderOffsetX - 5 && this.mouseX < c.getX() + c.getWidth() + this.renderOffsetX + 5
                    && this.mouseY > c.getY() + this.renderOffsetY && this.mouseY < c.getY() + c.getHeight() + this.renderOffsetY) {
                    c.isBeingDragged = true;
                    this.haveDraggedComponent = true;
                    document.getElementById("modification-menu").innerHTML = Renderer.MODIFICATION_ENABLED;
                    document.getElementById("modification-menu").innerHTML += '<button onclick="">Appliquer la modification</button>';
                    return;
                }
            }
            document.getElementById("modification-menu").innerHTML = Renderer.MODIFICATION_DISABLED;
            this.isDragged = true;
        };

        /**
         * On définit l'event clic end du canvas
         */
        this.canvas.onmouseup = (e: MouseEvent) => {
            // tell the browser we're handling this mouse event
            //e.preventDefault();
            e.stopPropagation();

            // clear all the dragging flags
            this.haveDraggedComponent = false;
            for (let c of this.selectedProject.components) {
                if (c.isBeingDragged) {
                    c.isBeingDragged = false;
                    c.onDragFinished();
                }
            }
            this.isDragged = false;
            this.render();
        };

        /**
         * On définit l'event mouse move du canvas pour gérer le 'drag'
         */
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
                    this.renderOffsetY += dy;
                } else {
                    for (let c of this.selectedProject.components) {
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

        /**
         * Une fois le canvas défini, return
         */
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
        this.context.font = Renderer.FONT_SIZE + 'px mono';

        // Clearing head
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

        // Semaines
        let week = ~~(-this.renderOffsetX / (7 * Renderer.DAY_WIDTH)) - 1;
        for (let x = this.renderOffsetX % (7 * Renderer.DAY_WIDTH) - (7 * Renderer.DAY_WIDTH); x < this.canvas.width; x += 7 * Renderer.DAY_WIDTH) {
            if (week < 0) {
                this.context.fillStyle = "LightGray";
                this.context.fillRect(x, 0, Renderer.DAY_WIDTH * 7, this.context.canvas.height);
                this.context.fillStyle = "DimGray";
            } else {
                this.context.fillText("Semaine " + week, x + 7 * Renderer.DAY_WIDTH / 2 - 2 * Renderer.FONT_SIZE, Renderer.FONT_SIZE);
            }
            week += 1;
        }

        // Drawing lines
        this.context.strokeStyle = "DimGray";
        this.context.beginPath();
        this.context.moveTo(0, Renderer.LINE_HEIGHT);
        this.context.lineTo(this.canvas.width, Renderer.LINE_HEIGHT);
        this.context.stroke();
        this.context.beginPath();
        this.context.moveTo(0, 2 * Renderer.LINE_HEIGHT);
        this.context.lineTo(this.canvas.width, 2 * Renderer.LINE_HEIGHT);
        this.context.stroke();

        // Jours
        let day = ~~Math.abs(Math.abs(this.renderOffsetX) / Renderer.DAY_WIDTH);
        if (this.renderOffsetX > 0) {
            day = Math.abs(day - 7 * ~~(Math.abs(this.renderOffsetX) / Renderer.DAY_WIDTH)) % 7;
        }
        day %= 7;
        for (let x = this.renderOffsetX % Renderer.DAY_WIDTH; x < this.canvas.width; x += Renderer.DAY_WIDTH) {
            this.context.strokeStyle = (day == 0 ? "DimGray" : "LightGray");
            this.context.beginPath();
            this.context.moveTo(x, (day == 0 ? 0 : Renderer.LINE_HEIGHT));
            this.context.lineTo(x, this.canvas.height);
            this.context.stroke();
            this.context.fillText(Renderer.DAY_OF_THE_WEEK[day], x + Renderer.DAY_WIDTH / 2 - Renderer.FONT_SIZE / 4, Renderer.LINE_HEIGHT + Renderer.FONT_SIZE);
            day = (day + 1) % 7;
        }

        // Component rendering
        for (let c of this.selectedProject.components) {
            c.render(this.context, this.renderOffsetX, this.renderOffsetY);
        }

        return true;
    }
}