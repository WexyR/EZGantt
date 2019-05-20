//import {State} from "./state"

class Task {
  private name: string;
  private start: Date;
  private end: Date;
  private timespan: Duration;
  private weight: number;
  private predecessors: Task[]=[];
  private successors: Task[]=[];
  private subTasks: Task[]=[];
  private parent: Task;

  private timeConstraint: TimeConstraint;
  private state: State;

  private saveLastValueOfStart: number;
  private saveLastValueOfEnd: number;

  constructor(name: string, weight: number, start?: Date, end?: Date, timespan?: Duration, predecessors: Task[]=[], successors: Task[]=[], subTasks: Task[]=[], parent?:Task){
    this.state = State.Not_Scheduled;
    if (start === undefined && end === undefined && timespan === undefined){
      this.state = State.Alongside;
    }else{
      this.state = State.Scheduled;
      if (start === undefined){
        this.end = end;
        this.timespan = timespan;
        this.start = new Date(end.valueOf() - timespan.valueOf());
      }else if (end === undefined){
        this.start = start;
        this.timespan = timespan;
        this.end = new Date(start.valueOf() + timespan.valueOf());
      }else{ //Default: recalculation de timespan
        this.start = start;
        this.end = end;
        this.timespan = new Duration(end.valueOf()-start.valueOf());
      }
    }

    this.name = name;
    this.weight = weight;
    for (let pred of predecessors){
      this.addPredecessor(pred);
    }
    for (let st of subTasks){
      this.addPredecessor(st);
    }
    this.parent=parent;
  }

  //getters
  public getName():string{
    return this.name;
  }
  public getStart():Date{
    return this.start;
  }
  public getEnd():Date{
    return this.end;
  }
  public getTimespan():Duration{
    return this.timespan;
  }
  public getWeight():number{
    return this.weight;
  }
  public getPredecessors():Task[]{
    return this.predecessors;
  }
  public getSubTasks():Task[]{
    return this.subTasks;
  }
  public getTimeConstraint():TimeConstraint{
    return this.timeConstraint;
  }

  //setters & adders
  public setName(name: string){
    this.name = name;
  }
  public setStart(start: Date):number{
    //If the start is not constrained
    if(this.timeConstraint !== TimeConstraint.All && this.timeConstraint !== TimeConstraint.Start){
      //delta calculation
      let d:Duration = new Duration(start.valueOf()-this.start.valueOf());

      if (d.is_negative()){
        //We try to move each predecessor
        for (let pred of this.predecessors){
          let newEnd = new Date(pred.end.valueOf()+d.valueOf());
          //And if it's not possible, we break on -1
          if (pred.setEnd(newEnd) === -1){
            return -1;
          }
        }
      }

      //We also try to move each subTask
      for (let st of this.subTasks){
        let newStart:Date = new Date(st.start.valueOf()+d.valueOf());
        if (st.setStart(newStart) === -1){
          return -1;
        }
      }
      //if the timespan is a constant, the end is moved
      if(this.timeConstraint === TimeConstraint.Timespan){
        let newEnd:Date = new Date(this.end.valueOf()+d.valueOf());
        if (d.is_negative()){
          this.end = newEnd; //no collisions with successors
        }else{
          if (this.setEnd(newEnd)){ //test collisions
            return -1;
          }
        }
      }else{
        //else, the timespan is recalculated
        this.timespan = new Duration(this.end.valueOf()-start.valueOf());
        if(this.timespan.is_negative()){
          return -1;
        }
      }
      //finally the start is modified
      this.start = start;
    }else{
      return -1;
    }
    return 0;
  }
  public setEnd(end: Date):number{
    if(this.timeConstraint !== TimeConstraint.All && this.timeConstraint !== TimeConstraint.End){
      //delta calculation
      let d:Duration = new Duration(end.valueOf()-this.end.valueOf());

      console.log(d);
      if (!d.is_negative()){
        //We try to move each sucessor
        for (let succ of this.successors){
          let newStart = new Date(succ.start.valueOf()+d.valueOf());
          //And if it's not possible, we break on -1
          if (succ.setStart(newStart) === -1){
            return -1;
          }
        }
      }

      //We also try to move each subTask
      for (let st of this.subTasks){
        let newStart:Date = new Date(st.start.valueOf()+d.valueOf());
        if (st.setStart(newStart) === -1){
          return -1;
        }
      }
      //if the timespan is a constant, the start is moved
      if(this.timeConstraint === TimeConstraint.Timespan){
        let newStart:Date = new Date(this.start.valueOf()+d.valueOf());
        if (!d.is_negative()){
          this.start = newStart; //no collisions with successors
        }else{
          if(this.setStart(newStart) === -1){ //test collisions
            return -1;
          }
        }
      }else{
        //else, the timespan is recalculated
        this.timespan = new Duration(end.valueOf()-this.start.valueOf());
        if(this.timespan.is_negative()){
          return -1;
        }
      }
      //finally the end is modified
      this.end = end;
    }else{
      return -1;
    }
    return 0;
  }
  public setTimespan(timespan: Duration):number{
    if(this.timeConstraint !== TimeConstraint.All && this.timeConstraint !== TimeConstraint.Timespan && !timespan.is_negative()){
      let d: Duration = new Duration(this.timespan.valueOf() - timespan.valueOf());
      if(this.timeConstraint === TimeConstraint.End){
        let newStart:Date = new Date(this.start.valueOf() - d.valueOf());
        if (this.setStart(newStart) === -1){
          return -1;
        };
      }else{ //By default, moves the end
        let newEnd:Date = new Date(this.end.valueOf() - d.valueOf());
        if (this.setEnd(newEnd) === -1){
          return -1;
        };
      }
    }else{
      return -1;
    }
    return 0;
  }



  public setWeight(weight: number){
    this.weight = weight;
  }
  //predecessors
  public addPredecessor(p:Task){
    let included:boolean = false;
    for(let pred of this.predecessors){
      if (pred === p){
        included = true;
      }
    }
    if(!included){
      this.predecessors.push(p);
      p.addSuccessor(this);
    }
  }
  public removePredecessor(p:Task){
    //TODO
  }
  //successors
  public addSuccessor(s:Task){
    let included:boolean = false;
    for(let succ of this.successors){
      if (succ === s){
        included = true;
      }
    }
    if(!included){
      this.successors.push(s);
      s.addPredecessor(this);
    }
  }
  public removeSuccessor(p:Task){
    //TODO
  }

  //subTasks
  public addSubTask(st:Task){
    let included:boolean = false;
    for(let subt of this.predecessors){
      if (subt === st){
        included = true;
      }
    }
    if(!included){
      this.subTasks.push(st);
      st.addParent(this);
    }
  }
  public removeSubTask(p:Task){
    //TODO
  }

  //parent
  public addParent(p:Task){
    this.parent = p;
    p.addSubTask(this);
  }
  public removeParent(p:Task){
    //TODO
  }



  //timeConstraint
  public setTimeConstraint(c:TimeConstraint){
    this.timeConstraint = c;
  }

  //methods
  public saveTime(){
    this.saveLastValueOfStart=this.start.valueOf();
    this.saveLastValueOfEnd=this.end.valueOf();
    console.log(this.saveLastValueOfEnd);
    this.predecessors.forEach( pred => {
      pred.saveTime();
    })
    this.subTasks.forEach( st => {
      st.saveTime();
    })
  }
  public restoreTime(){
    this.start = new Date(this.saveLastValueOfStart);
    this.end = new Date(this.saveLastValueOfEnd);
    console.log(this.saveLastValueOfEnd);
    this.predecessors.forEach( pred => {
      pred.restoreTime();
    })
    this.subTasks.forEach( st => {
      st.restoreTime();
    })
  }


  public skip(){
    this.state = State.Skipped;
  }

}

//function test() {
var t0:Task = new Task("t0", 1, new Date("2019-05-6"), new Date("2019-05-13"));
t0.setTimeConstraint(TimeConstraint.End);
var t1:Task = new Task("t1", 1, new Date("2019-05-13"), new Date("2019-05-20"), undefined, [t0], undefined);
t1.setTimeConstraint(TimeConstraint.Start);
var t2:Task = new Task("t2", 1, new Date("2019-05-20"), new Date("2019-05-27"), undefined, [t1], undefined);
t2.setTimeConstraint(TimeConstraint.Timespan);
var t3:Task = new Task("t3", 1, new Date("2019-05-20"), new Date("2019-05-27"), undefined, undefined, [t2]);
t2.setTimeConstraint(TimeConstraint.Timespan);

t2.saveTime();
let ok = t2.setEnd(new Date("2019-05-28"));
console.log(ok)
if (ok==-1){
  console.log("Nope!!!")
  t2.restoreTime();
}
console.log(t0);
console.log(t1);
console.log(t2);

/*};
test();*/
