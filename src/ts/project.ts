class Project {
    /**
     * Le contenu du projet. Task implémente Component.
     * @todo Garder les variable en public est louche, repenser ça ou delete ce commentaire
     */
    public components: Task[];

    /**
     * Le début du projet. Oui, sérieusement.
     */
    public projectStart: Date;

    // La variable permettant la non-superpostion des taches
    private nextLineId: number = 0;

    /**
     * Constructeur, override le constructeur par défaut
     * @param projectStart la date de début du projet
     */
    constructor(projectStart: Date = new Date()) {
        this.projectStart = projectStart;
    }
    /**
     * Ajout d'un composant / d'une tache
     * @param c Le composant à rajouter dans le canvas
     */
    registerTask(c: Task) {
        this.components.push(c);
        c.setY(this.nextLineId * Renderer.TASK_HEIGHT + Renderer.LINE_HEIGHT * 3);
        this.nextLineId++;
    }

    clear(): void {
        this.components = [];
        this.nextLineId = 0;
    }
}



/**
 * Charge dans une variable canvas donnée le gantt par défaut
 * @todo renommer canvas en qqchose d'autre, c'est pas clair sinon
 * @param canvas Le canvas à intialiser
 */
function openTestProject(canvas: Project): void {
    canvas.clear();
    // tache debutant le 7 et durant une semaine
    var t0: Task = new Task(undefined, canvas.projectStart, "Tache demo #1");
    t0.setTimeDate(new Date("2019-05-07"), undefined, new Duration(0, 0, 0, 0, 0, 1))
    t0.setTimeConstraint(TimeConstraint.Start)

    var t1: Task = new Task(undefined, canvas.projectStart, "Tache demo #2");
    // tache debutant le 14 et durant une semaine
    t1.setTimeDate(new Date("2019-05-14"), undefined, new Duration(0, 0, 0, 0, 0, 1))
    //avec t0 comme predecessor
    t1.addPredecessor(t0);
    t1.setTimeConstraint(TimeConstraint.Timespan);

    canvas.registerTask(t0);
    canvas.registerTask(t1);
}