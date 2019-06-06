/*import Dexie from 'dexie';
import "dexie-export-import";
import { saveAs } from 'file-saver';*/

/*
export class EZGanttDatabase extends Dexie {
    //task: Dexie.Table<Task, number>;
    durations: Dexie.Table<IDuration, number>;
    actors: Dexie.Table<IActor, number>;
    assignments: Dexie.Table<IAssignment, number>;
    ressources: Dexie.Table<IRessource, number>;


  constructor() {
    super("EZGanttDatabase");

    this.version(1).stores({
        //task: '++id, name, start, end, timespan, weight, predecessors, successors, subTasks, parent, absoluteRef, absolute, timeConstraint, state, saveLastValueOfStart, saveLastValueOfEnd',
        //task: '++id, name, start, end, timespan, weight, predecessors, parent, absoluteRef, timeConstraint, state',
        durations: '++id, weeks, days, hours, minutes, seconds, millis',
        actors: '++id, IdGen, name, birthday, assignments',
        assignments: '++id, estimatedTime, timeCost, time, actor, ressources, task',
        ressources: '++Id, IdGen, name, amount, cost, assignments'
    });
  }
}
*/
/*
Pour chaque classe on définit avec l'interface ce qui est visible (public)
donc les attributs private ne peuvent être exportés.
Si on veut garder des attributs 'private', il faut faire ainsi :

    interface IModuleMenuItem{
        name: string
    }

    class ModuleMenuItem implements IModuleMenuItem {
        private _name: string;
        constructor() {
        _name = "name";
        }

        get name(){
        // your implementation to expose name
        }

        set name(value){
        // your implementation to set name
        }
     }
*/

// private attributs won't export (sic!)
export interface IDuration {
  id?: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  millis: number;
}


// private attributs won't export (sic!)
export interface IActor {
  id?: number;
  IdGen: number;
  name: string;
  birthday: Date;
  assignments: Array<Assignment>[];
}

// private attributs won't export (sic!)
export interface IRessource {
  id?: number;
  IdGen: number;
  name: string;
  amount: number;
  cost: number
  assignments: Array<Assignment>[];
}

// private attributs won't export (sic!)
export interface IAssignment {
  id?: number;
  estimatedTime: Duration;
  timeCost: number;
  time: Duration;
  actor: Actor;
  ressources: Array<[Ressource | UnexpendableRessource, number]>[];
}

// Task ???

/*
var db = new EZGanttDatabase();
db.durations.mapToClass(Duration);
db.actors.mapToClass(Actor);
db.assignments.mapToClass(Assignment);
db.ressources.mapToClass(Ressource);
*/
//db.task.mapToClass(Task);

/*
///// Exemples //////
// Crée une instance et la stocke dans la bdd //
var dur = new Duration(8, 6, 5, 4, 3, 2);
db.durations.put(dur).then( function(idx) {
    db.durations.get(idx).then( function(dur) {
        console.log(dur);
        console.log(JSON.stringify(dur));
    });
});

// Met à jour une instance //
idx = 8
db.durations.update(idx, {weeks: 10}).then( function(x) {
    if (x) {
      db.durations.get(idx).then( function(dur) {
        console.log(dur);
        console.log(JSON.stringify(dur));
    }
  });
});

// écrit la bdd dans un fichier au choix de l'utilisateur //
const blob = db.export().then( function(blob) {
    saveAs(blob,"EZGanttDB.json");
})
*/
