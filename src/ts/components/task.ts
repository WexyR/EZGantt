class Task extends Component {

  private width: number = 50;
  private height: number = 80;
  private x: number = 0;
  private y: number = 0;

  public bgColor: string = "Silver";
  public fontSize: number = 16;
  public isBeingDragged: boolean = false;

  private name: string; // name of the task
  private clearingScore: number = 0;
  private weight: number;

  private start: Duration; // relative to parent
  private end: Duration;  //
  private timespan: Duration;

  private predecessors: Task[] = [];
  private successors: Task[] = [];
  private subTasks: Task[] = [];

  private parent: Task;
  private absoluteRef: Date;
  private absolute: boolean;

  private assignments: Array<Assignment> = [];

  private timeConstraint: TimeConstraint;
  private state: State;

  private saveLastValueOfStart: number; // local save of start and end value
  private saveLastValueOfEnd: number; // useful for restore last time state
                                      // when time setting errors occur

  public static readonly DAY_LENGTH_MILLIS = 86400000; // milliseconds in a day

  constructor(parent?: Task, absoluteRef?: Date, name: string = "Task", weight: number = 1) {
    super();
    this.state = State.Not_Scheduled; // a Task is first not scheduled
    if (this.setRef(parent, absoluteRef) === -1) {
      throw Error("Can not be relative to a parent Task and absolute at the same time.");
    }
    this.weight = weight;
    this.name = name;
  }

  private dx = 0;
  private dLength = 0;
  onDrag(dx: number, dy: number): void {
    if (this.timeConstraint == TimeConstraint.All) return;
    if (!(this.timeConstraint == TimeConstraint.Timespan)) {
      this.dLength += dx;
    } else {
      this.dx += dx;
    }
  }

  onDragFinished(): void {
    if (this.timeConstraint == TimeConstraint.All) return;
    if (this.timeConstraint == TimeConstraint.Timespan || this.timeConstraint == TimeConstraint.None) {
      this.setStart(new Duration(this.getStart().valueOf() + this.dx / Canvas.DAY_WIDTH * Task.DAY_LENGTH_MILLIS));
    } else {
      console.log(this.timeConstraint);
      console.log(this.setTimespan(new Duration(this.getTimespan().valueOf() + this.dLength / Canvas.DAY_WIDTH * Task.DAY_LENGTH_MILLIS)));
    }
    this.dx = 0;
    this.dLength = 0;
  };

  render(context: CanvasRenderingContext2D, offsetX: number, offsetY: number): void {
    // Background
    context.fillStyle = this.bgColor;
    let x = this.getX() + this.dx + offsetX;
    let y = this.getY() + offsetY;
    context.fillRect(x, y, (this.getWidth() + this.dLength), this.height);
    // Title
    context.fillStyle = "Black"
    context.font = this.fontSize + 'px mono';
    context.fillText(this.name, x + (this.getWidth() + this.dLength) / 2 - this.name.length * 4, y + this.fontSize);
    // Progress
    context.fillText(this.clearingScore + "%", x + (this.getWidth() + this.dLength) / 2 - 12, y + 2 * this.height / 3 - this.fontSize / 2, 3 * (this.fontSize / 2));
    context.fillStyle = 'Green';
    context.fillRect(x, y + 2 * this.height / 3, (this.getWidth() + this.dLength) / 100 * this.clearingScore, this.height / 6);
    // Stroke
    context.strokeStyle = 'Black'
    context.strokeRect(x, y, (this.getWidth() + this.dLength), this.height);
    context.strokeRect(x, y + 2 * this.height / 3, (this.getWidth() + this.dLength), this.height / 6);
    // Line
    context.strokeStyle = "LightGray";
    context.beginPath();
    context.moveTo(0, y + this.getHeight());
    context.lineTo(context.canvas.width, y + this.getHeight());
    context.stroke();
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(context.canvas.width, y);
    context.stroke();
  }

  public getName(): string {
    return this.name;
  }
  public getStart(): Duration {
    return this.start;
  }
  public getStartDate(): Date {
    if (!this.absolute) {
      return new Date(this.start.valueOf() + this.parent.getStartDate().valueOf()); // adds up until absolute date to refer to
    } else {
      return new Date(this.start.valueOf() + this.absoluteRef.valueOf());
    }
  }
  public getEnd(): Duration {
    return this.end;
  }
  public getEndDate(): Date {
    if (!this.absolute) { //if relative to a task, trying recursively to get an absolute reference (date)
      return new Date(this.end.valueOf() + this.parent.getStartDate().valueOf()); // adds up until absolute date to refer to
    } else {
      return new Date(this.end.valueOf() + this.absoluteRef.valueOf());
    }
  }

  public getX(): number {
    return this.getStart().valueOf() * Canvas.DAY_WIDTH / Task.DAY_LENGTH_MILLIS;
  }
  public setX(x: number) {
    // Not implemented
  }

  public getY(): number {
    return this.y;
  }
  public setY(y: number) {
    this.y = y;
  }

  public getWidth(): number {
    return this.getTimespan().valueOf() * Canvas.DAY_WIDTH / Task.DAY_LENGTH_MILLIS;
  }
  public getHeight(): number {
    return this.height;
  }

  public getTimespan(): Duration {
    return this.timespan;
  }
  public getWeight(): number {
    return this.weight;
  }
  public getPredecessors(): Task[] {
    return this.predecessors;
  }
  public getSubTasks(): Task[] {
    return this.subTasks;
  }
  public getTimeConstraint(): TimeConstraint {
    return this.timeConstraint;
  }
  public getAssignments(): Array<Assignment> {
    return this.assignments;
  }
  public getClearingScore(): number {
    return this.clearingScore;
  }

  // setters & adders

  public addAssignment(a: Assignment): void {
    this.assignments.push(a);
  }

  public removeAssignment(a: Assignment): void {
    let k = 0;
    for (let i = 0; i < this.assignments.length; i++) {
      if (a === this.assignments[i]) {
        break;
      }
      k += 1;
    }
    this.assignments.splice(k, 1);
  }

  public setRef(parent?: Task, absoluteRef?: Date): number {
    if ((!parent && absoluteRef) || (parent && !absoluteRef)) { //xor
      if (parent) { // set a task reference as a parent
        this.parent = parent;
        parent.addSubTask(this);
        this.absolute = false;
      } else { // set a date reference
        this.absoluteRef = absoluteRef;
        this.absolute = true;
      }
      return 0;
    } else {
      return -1; // can't be both relative and absolute
    }
  }
  public setName(name: string) {
    this.name = name;
  }
  public setClearingScore(cs:number) {
    this.clearingScore = cs;
  }
  public addSubClearingScore(cs:number){
    if(this.clearingScore + cs > 100){
      this.clearingScore = 100;
    }else if(this.clearingScore + cs < 0){
      this.clearingScore = 0;
    }else{
      this.clearingScore = this.clearingScore + cs;
    }
  }

  public setStart(start: Duration): number {
    if (start.is_negative()) {
      return -1;
    }
    //first, fix the value if undefined
    if (this.start === undefined) {
      this.start = start;
      if (this.end || this.timespan) {
        if (this.end) {
          //if end is undefined, timespan can be calculated
          this.timespan = new Duration(this.end.valueOf() - this.start.valueOf());
        } else {
          //vice versa
          this.end = new Duration(this.start.valueOf() + this.timespan.valueOf());
        }
        //now the task is scheduled
        this.state = State.Scheduled;
      } else {
        return 0;
      }
    }

    //If the start is not constrained
    if (this.timeConstraint !== TimeConstraint.All && this.timeConstraint !== TimeConstraint.Start) {

      //delta calculation
      let d: Duration = new Duration(start.valueOf() - this.start.valueOf());

      if (d.is_negative()) {
        //We try to move each predecessor
        for (let pred of this.predecessors) {
          console.log(pred);
          let newEnd: Duration = new Duration(pred.end.valueOf() + d.valueOf());
          //And if it's not possible, we break on -1
          if (newEnd.is_negative()) {
            if (pred.setEnd(newEnd) === -1) {
              return -1;
            }
          }
        }
      } else {
        if (!this.absolute) { // if relative
          if (start.valueOf() >= this.parent.timespan.valueOf()) {
            //can't start before its parent
            return -1;
          }
        }
      }

      //if the timespan is a constant, the end is moved
      if (this.timeConstraint === TimeConstraint.Timespan) {
        let newEnd: Duration = new Duration(this.end.valueOf() + d.valueOf());
        if (d.is_negative()) {
          this.end = newEnd; //no collisions with successors
        } else {
          if (this.setEnd(newEnd)) { //test collisions
            return -1;
          }
        }
      } else {
        //else, the timespan is recalculated
        this.timespan = new Duration(this.end.valueOf() - start.valueOf());
        if (this.timespan.is_negative()) {
          return -1;
        }
      }
      //finally the start is modified
      this.start = start;
    } else {
      return -1;
    }
    return 0;
  }

  public setStartDate(start: Date): number {
    if (this.absolute) {
      //calculate the duration relative to its parent from the date given
      let d = new Duration(start.valueOf() - this.absoluteRef.valueOf());
      if (d.is_negative()) {
        return -1;
      } else {
        return this.setStart(d);
      }
    }
  }


  public setEnd(end: Duration): number {
    if (end.is_negative()) { //can't end before start
      return -1;
    }

    //For more explanations, check out setStart (similar function)

    //first, fix the value if undefined
    if (this.end === undefined) {
      this.end = end;
      if (this.start || this.timespan) {
        if (this.start) {
          this.timespan = new Duration(this.end.valueOf() - this.start.valueOf());
        } else {
          this.start = new Duration(this.end.valueOf() - this.timespan.valueOf());
        }
        this.state = State.Scheduled;
      } else {
        return 0;
      }
    }

    if (this.timeConstraint !== TimeConstraint.All && this.timeConstraint !== TimeConstraint.End) {

      //delta calculation
      let d: Duration = new Duration(end.valueOf() - this.end.valueOf());

      if (!d.is_negative()) {
        //We try to move each sucessor
        for (let succ of this.successors) {
          let newStart: Duration = new Duration(succ.start.valueOf() + d.valueOf());
          //And if it's not possible, we break on -1
          if (!newStart.is_negative()) {
            if (succ.setStart(newStart) === -1) {
              return -1;
            }
          }
        }
      } else {
        if (!this.absolute) {
          if (end.valueOf() >= this.parent.timespan.valueOf()) {
            return -1;
          }
        }
      }

      //if the timespan is a constant, the start is moved
      if (this.timeConstraint === TimeConstraint.Timespan) {
        let newStart: Duration = new Duration(this.start.valueOf() + d.valueOf());
        if (!d.is_negative()) {
          this.start = newStart; //no collisions with successors
        } else {
          if (this.setStart(newStart) === -1) { //test collisions
            return -1;
          }
        }
      } else {
        //else, the timespan is recalculated
        this.timespan = new Duration(end.valueOf() - this.start.valueOf());
        if (this.timespan.is_negative()) {
          return -1;
        }
      }
      //finally the end is modified
      this.end = end;
    } else {
      return -1;
    }
    return 0;
  }

  public setEndDate(end: Date): number {
    // For more explanations, check out setStartDate (similar function)
    if (this.absolute) {
      let d = new Duration(end.valueOf() - this.absoluteRef.valueOf());
      if (d.is_negative()) {
        return -1;
      } else {
        return this.setEnd(d);
      }
    }
  }

  public setTimespan(timespan: Duration): number {
    //first, fix the value if undefined
    if (this.timespan === undefined) {
      // For more explanations, check out setStart (similar function)
      this.timespan = timespan;
      if (this.start || this.end) {
        if (this.start) {
          this.end = new Duration(this.start.valueOf() + this.timespan.valueOf());
        } else {
          this.start = new Duration(this.end.valueOf() - this.timespan.valueOf());
        }
        this.state = State.Scheduled;
      } else {
        return 0;
      }
    }

    if (this.timeConstraint !== TimeConstraint.All && this.timeConstraint !== TimeConstraint.Timespan && !timespan.is_negative()) {

      let d: Duration = new Duration(this.timespan.valueOf() - timespan.valueOf());
      if (this.timeConstraint === TimeConstraint.End) {
        // if the end is fixed and we change the timespan, the start has to be recalculated
        let newStart: Duration = new Duration(this.start.valueOf() - d.valueOf());
        if (this.setStart(newStart) === -1) {
          return -1;
        };
      } else { //By default, moves the end
        let newEnd: Duration = new Duration(this.end.valueOf() - d.valueOf());
        if (this.setEnd(newEnd) === -1) {
          return -1;
        };
      }
    } else {
      return -1;
    }
    return 0;
  }

  public setTime(start?: Duration, end?: Duration, timespan?: Duration): number {
    if (start && end && timespan) {
      return -1; //can't for all three arguments together
    }
    //set one by one up to 2 arguments
    // if a setting can't be done, automatically breaks on -1
    let still_ok = true;
    if (start) {
      if (this.setStart(start) !== 0) {
        still_ok = false;
      }
    }
    if (end && still_ok) {
      if (this.setEnd(end) !== 0) {
        still_ok = false;
      }
    }
    if (timespan && still_ok) {
      if (this.setTimespan(timespan)) {
        still_ok = false;
      }
    }
    if (!still_ok) {
      return -1;
    } else {
      return 0;
    }
  }

  public setTimeDate(start?: Date, end?: Date, timespan?: Duration): number {
    // For more explanations, check out setTime (similar function)
    if (start && end && timespan) {
      return -1;
    }
    let still_ok = true;
    if (start) {
      if (this.setStartDate(start) !== 0) {
        still_ok = false;
      }
    }
    if (end && still_ok) {
      if (this.setEndDate(end) !== 0) {
        still_ok = false;
      }
    }
    if (timespan && still_ok) {
      if (this.setTimespan(timespan)) {
        still_ok = false;
      }
    }
    if (!still_ok) {
      return -1;
    } else {
      return 0;
    }
  }

  public setWeight(weight: number) {
    this.weight = weight;
  }
  //predecessors
  public addPredecessor(p: Task) {
    let included: boolean = false;
    for (let pred of this.predecessors) {
      if (pred === p) {
        included = true;
      }
    }
    if (!included) {
      this.predecessors.push(p);
      p.addSuccessor(this);
    }
  }
  public removePredecessor(p: Task) {
    let index:number = this.predecessors.indexOf(p, 0);
    if (index !== -1) { // if found
       let pred:Task = this.predecessors.splice(index, 1)[0]; //remove the predecessor and return it
       pred.removeSuccessor(this) //if pred isn't a predecessor anymore, this is not a successor thereby
    }else{
      return; // avoid infinity callback
    }
  }
  //successors
  public addSuccessor(s: Task) {
    let included: boolean = false;
    for (let succ of this.successors) {
      if (succ === s) {
        included = true;
      }
    }
    if (!included) {
      this.successors.push(s);
      s.addPredecessor(this);
    }
  }
  public removeSuccessor(p: Task) {
    let index:number = this.successors.indexOf(p, 0);
    if (index !== -1) { // if found
       let pred:Task = this.successors.splice(index, 1)[0]; //remove the successor and return it
       pred.removePredecessor(this) //if pred isn't a successor anymore, this is not a predecessor thereby
    }else{
      return; // avoid infinity callback
    }
  }

  //subTasks
  public addSubTask(st: Task) {
    let included: boolean = false;
    for (let subt of this.subTasks) {
      if (subt === st) {
        included = true;
      }
    }
    if (!included) {
      this.subTasks.push(st);
      st.setRef(this, undefined);
    }
  }
  public removeSubTask(p: Task):number {
    let index:number = this.subTasks.indexOf(p, 0);
    if (index !== -1) { // if found
       this.subTasks.splice(index, 1)[0].removeAll();
       //remove the subTasks and delete all references
       return 0;
    }else{
      return -1; // failed
    }
  }



  //timeConstraint
  public setTimeConstraint(c: TimeConstraint) {
    this.timeConstraint = c;
  }

  //methods
  public saveTime() {
    //save recursively all task which can be modified by changing time settings
    //if the time changement aborts, it's possible to restore the former state
    //with restoreTime to undo all modifications
    this.saveLastValueOfStart = this.start.valueOf();
    this.saveLastValueOfEnd = this.end.valueOf();
    console.log(this.saveLastValueOfEnd);
    this.predecessors.forEach(pred => {
      pred.saveTime();
    })
    /*this.subTasks.forEach( st => {
      st.saveTime();
    })*/
    if (!this.absolute) {
      this.parent.saveTime();
    }
  }
  public restoreTime() {
    //restore recursively all task which can be modified by changing time settings
    this.start = new Duration(this.saveLastValueOfStart);
    this.end = new Duration(this.saveLastValueOfEnd);
    console.log(this.saveLastValueOfEnd);
    this.predecessors.forEach(pred => {
      pred.restoreTime();
    })
    /*this.subTasks.forEach( st => {
      st.restoreTime();
    })*/
    if (!this.absolute) {
      this.parent.restoreTime();
    }
  }

  public removeAll(){
    //remove all predecessors, all successors, all subTasks
    for (let st of this.subTasks) {
      this.removeSubTask(st); //remove dependencies
    }
    for (let pred of this.predecessors) {
      this.removePredecessor(pred); //remove dependencies
    }
    for (let succ of this.successors) {
      this.removeSuccessor(succ); //remove dependencies
    }
    this.parent = undefined;
    this.absoluteRef = undefined;
    this.absolute = undefined;
  }

  public skip() {
    this.state = State.Skipped;
  }
  public is_active(): boolean {
    return (this.state === State.Active || this.state === State.In_Progress || this.state === State.Alongside || this.state === State.Urgent);
  }

}

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
var st1_1 = new Task(t1, undefined, "st1_1");
st1_1.setTime(new Duration(0), undefined, new Duration(0, 0, 0, 0, 3, 0));
