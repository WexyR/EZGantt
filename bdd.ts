import Dexie from 'dexie';
import "dexie-export-import";
import { saveAs } from 'file-saver';

/* import { TimeConstraint } from './timeConstraint';
import { State } from './state';
import { Duration } from './duration';
import { Ressource } from './ressource';
import { Assignment } from './assignment';
import { Actor } from './actor';
import { Task } from './task'; */

class Duration {
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  millis: number;

  constructor(millis: number=0, seconds: number=0, minutes: number=0, hours: number=0, days: number=0, weeks: number=0){
      this.weeks = weeks;
      this.days = days;
      this.hours = hours;
      this.minutes = minutes;
      this.seconds = seconds;
      this.millis = millis;
      this.update_param();
  }

  //getters
  public getWeeks():number{
    return this.weeks;
  }
  public getDays():number{
    return this.days;
  }
  public getHours():number{
    return this.hours;
  }
  public getMinutes():number{
    return this.minutes;
  }
  public getSeconds():number{
    return this.seconds;
  }
  public getMillis():number{
    return this.millis;
  }

  //setters
  public setWeeks(weeks: number){
    this.weeks = weeks;
  }
  public setDays(days: number){
    this.days = days;
    this.update_param();
  }
  public setHours(hours: number){
    this.hours = hours;
    this.update_param();
  }
  public setMinutes(minutes: number){
    this.minutes = minutes;
    this.update_param();
  }
  public setSeconds(seconds: number){
    this.seconds = seconds;
    this.update_param();
  }
  public setMillis(millis: number){
    this.millis = millis;
    this.update_param();
  }

  //methods
  public update_param(){
    this.millis = this.valueOf();
    this.weeks = 0;
    this.days = 0;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;


    if (Math.abs(this.millis) >= 1000){
      this.seconds += ~~(this.millis/1000);
      this.millis = this.millis%1000;
    }

    if (Math.abs(this.seconds) >= 60){
      this.minutes += ~~(this.seconds/60);
      this.seconds = this.seconds%60;
    }

    if (Math.abs(this.minutes) >= 60){
      this.hours += ~~(this.minutes/60);
      this.minutes = this.minutes%60;
    }

    if (Math.abs(this.hours) >= 24){
      this.days += ~~(this.hours/24);
      this.hours = this.hours%24;
    }

    if (Math.abs(this.days) >= 7){
      this.weeks += ~~(this.days/7);
      this.days = this.days%7;
    }
  }

  public add(d:Duration){
    this.weeks += d.getWeeks();
    this.days += d.getDays();
    this.hours += d.getHours();
    this.minutes += d.getMinutes();
    this.seconds += d.getSeconds();
    this.millis += d.getMillis();
    this.update_param();
  }

  public sub(d:Duration){
    this.weeks -= d.getWeeks();
    this.days -= d.getDays();
    this.hours -= d.getHours();
    this.minutes -= d.getMinutes();
    this.seconds -= d.getSeconds();
    this.millis -= d.getMillis();
    this.update_param();
  }

  public is_negative():boolean{
    return this.valueOf()<0;
  }

  public valueOf():number{
      return this.millis + 1000*(this.seconds + 60*(this.minutes + 60*(this.hours + 24*(this.days + 7*this.weeks))));
  }

}

export class EZGanttDatabase extends Dexie {
    //task: Dexie.Table<ITask, number>;
    duration: Dexie.Table<IDuration, number>;
    /*actor: Dexie.Table<IActor, number>;
    assignment: Dexie.Table<IAssignment, number>;
    ressource: Dexie.Table<IRessource, number>;*/

  
  constructor() {  
    super("EZGanttDatabase");
    
    //
    // Define tables and indexes
    // (Here's where the implicit table props are dynamically created)
    //
    this.version(1).stores({
        //task: '++id, name, start, end, timespan, weight, predecessors, successors, subTasks, parent, absoluteRef, absolute, timeConstraint, state, saveLastValueOfStart, saveLastValueOfEnd',
        duration: '++id, weeks, days, hours, minutes, seconds, millis'/*,
        actor: '++id, IdGen, name, birthday, assignments',
        assignment: '++id, estimatedTime, timeCost, time, actor, ressources, task',
        ressource: '++Id, IdGen, name, amount, cost, assignments'*/
    });
  }
}

/*
export interface ITask {
  id?: number; // Primary key. Optional (autoincremented)
  name: string; // First name
  start: Duration; // Last name
  end: Duration;
  timespan: Duration;
  weight: number;
  predecessors: Task[];
  successors: Task[];
  subTasks: Task[];
  parent: Task;
  absoluteRef: Date;
  absolute: boolean;
  timeConstraint: TimeConstraint;
  state: State;
  saveLastValueOfStart: number;
  saveLastValueofEnd: number;
}
 */

export interface IDuration {
  id?: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  millis: number;
}

/*
export interface IActor {
  id?: number;
  IdGen: number;
  name: string;
  birthday: Date;
  assignments: Array<Assignment> = [];
}

export interface IRessource {
  id?: number;
  IdGen: number;
  name: string;
  amount: number;
  cost: number
  assignments: Array<Assignment> = [];
}

export interface IAssignment {
  id?: number;
  estimatedTime: Duration;
  timeCost: number;
  time: Duration;
  actor: Actor;
  ressources: Array<[Ressource | UnexpendableRessource, number]> = [];
}
 */

var db = new EZGanttDatabase();
db.duration.mapToClass(Duration);

var dur = new Duration(8, 6, 5, 4, 3, 2);
console.log(dur);
console.log(JSON.stringify(dur));
db.duration.put(dur).then( function(x) {
    console.log(x);
    db.duration.get(x).then( function(dur) {
        console.log(dur);
        console.log(JSON.stringify(dur));
    });
});
db.duration.update(8, {weeks: 10}).then( function(x) {
    console.log(x);
    db.duration.get(8).then( function(dur) {
        console.log(dur);
        console.log(JSON.stringify(dur));
    });
});

const blob = db.export().then( function(blob) {
    saveAs(blob,"EZGanttDB.json");
})
