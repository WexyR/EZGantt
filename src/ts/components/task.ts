//import {State} from "./state"

class Task implements Component {

  public width: number = 50;
  public x: number = 0;
  public y: number = 0;

  public bgColor: string = "Silver";
  public fontSize: number = 16;
  public isBeingDragged: boolean = false;
  public height: number = 80;

  private name: string;
  private clearingScore: number = 0;
  private start: Duration; // relative to parent
  private end: Duration;  //
  private timespan: Duration;
  private weight: number;
  private predecessors: Task[] = [];
  private successors: Task[] = [];
  private subTasks: Task[] = [];
  private parent: Task;
  private absoluteRef: Date;
  private absolute: boolean;

  private timeConstraint: TimeConstraint;
  private state: State;

  private saveLastValueOfStart: number;
  private saveLastValueOfEnd: number;

  public static readonly DAY_LENGTH_MILLIS = 86400000;

  constructor(parent?: Task, absoluteRef?: Date, name: string = "Task", weight: number = 1) {
    this.state = State.Not_Scheduled;
    if (this.setRef(parent, absoluteRef) === -1) {
      throw Error("Can not be relative to a parent Task and absolute at the same time.");
    }
    this.weight = weight;
    this.name = name;
  }

  onDrag(dx: number, dy: number): void {
    console.log(this.setStart(new Duration(this.getStart().valueOf() + dx / Canvas.DAY_WIDTH * Task.DAY_LENGTH_MILLIS)));
  }

  render(context: CanvasRenderingContext2D): void {
    // Background
    context.fillStyle = this.bgColor;
    context.fillRect(this.getX(), this.y, this.getWidth(), this.height);
    // Title
    context.fillStyle = "Black"
    context.font = this.fontSize + 'px mono';
    context.fillText(this.name, this.getX() + this.getWidth() / 2 - this.name.length * 4, this.y + this.fontSize);
    // Progress
    context.fillText(this.clearingScore + "%", this.getX() + this.getWidth() / 2 - 12, this.y + 2 * this.height / 3 - this.fontSize / 2, 3 * (this.fontSize / 2));
    context.fillStyle = 'Green';
    context.fillRect(this.getX(), this.y + 2 * this.height / 3, this.getWidth() / 100 * this.clearingScore, this.height / 6);
    // Stroke
    context.strokeStyle = 'Black'
    context.strokeRect(this.getX(), this.y, this.getWidth(), this.height);
    context.strokeRect(this.getX(), this.y + 2 * this.height / 3, this.getWidth(), this.height / 6);
  }

  //getters
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
    if (!this.absolute) {
      return new Date(this.end.valueOf() + this.parent.getStartDate().valueOf()); // adds up until absolute date to refer to
    } else {
      return new Date(this.end.valueOf() + this.absoluteRef.valueOf());
    }
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
  public getX(): number {
    return this.getStart().valueOf() * Canvas.DAY_WIDTH / Task.DAY_LENGTH_MILLIS;
  }
  public getWidth(): number {
    return this.getTimespan().valueOf() * Canvas.DAY_WIDTH / Task.DAY_LENGTH_MILLIS;
  }

  //setters & adders

  public setRef(parent?: Task, absoluteRef?: Date): number {
    if ((!parent && absoluteRef) || (parent && !absoluteRef)) { //xor
      if (parent) {
        this.parent = parent;
        parent.addSuccessor(this);
        this.absolute = false;
      } else {
        this.absoluteRef = absoluteRef;
        this.absolute = true;
      }
      return 0;
    } else {
      return -1;
    }
  }
  public setName(name: string) {
    this.name = name;
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
          this.timespan = new Duration(this.end.valueOf() - this.start.valueOf());
        } else {
          this.end = new Duration(this.start.valueOf() + this.timespan.valueOf());
        }
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
        if (!this.absolute) {
          if (start.valueOf() >= this.parent.timespan.valueOf()) {
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
      let d = new Duration(start.valueOf() - this.absoluteRef.valueOf());
      if (d.is_negative()) {
        return -1;
      } else {
        return this.setStart(d);
      }
    }
  }


  public setEnd(end: Duration): number {
    if (end.is_negative()) {
      return -1;
    }


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
    let args: number = 0;
    if (start && end && timespan) {
      return -1;
    }
    if (start) {
      return this.setStart(start);
    }
    if (end) {
      return this.setEnd(end);
    }
    if (timespan) {
      return this.setTimespan(timespan);
    }
  }

  public setTimeDate(start?: Date, end?: Date, timespan?: Duration): number {
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
    //TODO
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
    //TODO
  }

  //subTasks
  public addSubTask(st: Task) {
    let included: boolean = false;
    for (let subt of this.predecessors) {
      if (subt === st) {
        included = true;
      }
    }
    if (!included) {
      this.subTasks.push(st);
      st.setRef(this, undefined);
    }
  }
  public removeSubTask(p: Task) {
    //TODO
  }



  //timeConstraint
  public setTimeConstraint(c: TimeConstraint) {
    this.timeConstraint = c;
  }

  //methods
  public saveTime() {
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


  public skip() {
    this.state = State.Skipped;
  }
  public is_active(): boolean {
    return (this.state === State.Active || this.state === State.In_Progress || this.state === State.Alongside || this.state === State.Urgent);
  }

}
/*
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
*/