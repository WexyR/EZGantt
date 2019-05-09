class Task {
  private name: string;
  private start: Date;
  private end: Date;
  private timespan: Duration;
  private weight: number;
  private predecessors: Task[];
  private subTasks: Task[];

  constructor(name: string, weight: number, start?: Date, end?: Date, timespan?: Duration, predecessors: Task[]=[], subTasks: Task[]=[]){
    if (start === undefined){
      this.end = end;
      this.timespan = timespan;
      this.start = new Date(end.valueOf() - timespan.valueOf())
    } else if (end === undefined){
      this.start = start;
      this.timespan = timespan;
      this.end = new Date(start.valueOf() + timespan.valueOf())
    }else{
      this.start = start;
      this.end = end;
      this.timespan = new Duration(0, 0, 0, 0, 0, end.valueOf()-start.valueOf());
    }

    this.name = name;
    this.weight = weight;
    this.predecessors = predecessors;
    this.subTasks = subTasks;
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

  //setters & adders
  public setName(name: string){
    this.name = name;
  }
  public setStart(start: Date){
    this.start = start;
  }
  public setEnd(end: Date){
    this.end = end;
  }
  public setTimespan(timespan: Duration){
    this.timespan = timespan;
  }
  public setWeight(weight: number){
    this.weight = weight;
  }
  /*
  public getPredecessors(){
    this.predecessors;
  }
  public getSubTasks(){
    this.subTasks;
  }
  */
}
