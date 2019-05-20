class Assignment {
    private estimatedTime : Duration = new Duration(0); //waiting for last version of Duration
    private timeCost : number = 0;
    private time : Duration = new Duration(0); //waiting for last version of Duration
    private actor : Actor;
    private ressources : Array<[Ressource | UnexpendableRessource ,number]> = [];
    private task : Task;
    
    constructor(task : Task, actor : Actor, ressource? : Ressource| UnexpendableRessource | undefined, nRessource : number = 1 , time? : Duration,  estimatedTime? : Duration){
        this.task = task;
        this.actor = actor;
        if (ressource !== undefined) {this.addRessource(ressource,nRessource);}
        if (time!== undefined) {this.time = time;}
        if (estimatedTime !== undefined) {this.estimatedTime = estimatedTime;}
    }
    // estimated time and time are duration   , list ressource type of Ressource or UnexpendableRessource
    //getters

    public getTask() : Task {
        return this.task;
    }
    public getRessources() : Array<[Ressource|UnexpendableRessource,number]> {
        return this.ressources;
    }
    public getActor() : Actor {
        return this.actor;
    }
    public getTime() : Duration {
        return this.time;
    }
    public getEstimatedTime() : Duration {
        return this.estimatedTime;
    }

    //setters
    public setTime(t : Duration) : Duration {
        return this.time=t;
    }
    public setEstimatedTime( t : Duration) : Duration {
        return this.estimatedTime = t;
    }

    public setTask(task : Task) : void{
        this.task.removeAssignment(this);
        this.task = task;
        this.task.addAssignment(this);
    }

    public setActor(actor : Actor ) : void{
        this.actor.removeAssignment(this);
        this.actor = actor;
        this.actor.addAssignment(this);
    }

    public addRessource(ressource : Ressource | UnexpendableRessource , n : number = 1) : void {
        let included : boolean = false;
        let val : number = ressource.addAssignment(this,n);
        for(let i = 0; i<this.ressources.length;i++){
            if(this.ressources[i][0].getId() === ressource.getId()) {//if already in ressource
                this.ressources[i][1]+=val;
                included = true;
            }
        }
        
        if(!included) {this.ressources.push([ressource,val]);}
    }

    public removeRessource(ressource : Ressource | UnexpendableRessource , n? : number) : void { //If the ressource must be deleted, no n
        for(let i = 0; i<this.ressources.length;i++){
                if(this.ressources[i][0].getId() === ressource.getId()) {
                    if( n === undefined) { // if total remove
                        ressource.removeAssignment(this,this.ressources[i][1]);
                        this.ressources.splice(i,1);                        
                    }
                    else {
                        if(this.ressources[i][1]<=n){// if the amount is bigger than what we had --> total remove
                            this.removeRessource(ressource);
                            return;
                        } 
                        if(ressource instanceof Ressource){ressource.setAmount(ressource.getAmount()+n);}
                        else{
                            ressource.removeUsedPeriod([this.task.getStart(),this.task.getEnd()],n);
                        }
                        this.ressources[i][1]-=n;

                    }               
                }
        }
    }

    public TotalCost() : number {
        let total : number = 0;
        total += this.timeCost*toHour(this.estimatedTime.valueOf()); //work of the actor
        this.ressources.forEach( element => {
            if (element[0] instanceof Ressource) {total += element[0].getCost()*element[1];}  //cost of the Ressources
            if (element[0] instanceof UnexpendableRessource) {total += element[0].getCost()*element[1]*toHour(this.estimatedTime.valueOf());}  //cost of the unexpendableRessources
        });
        return total;
    }

    public work(hours : Duration) : void { //As hours was declared Date , I use the Duration type
        this.time.add(hours);
    }
}


function toHour(millis : number) : number {
    let hour : number = millis /(1000*60*60);
    return hour;
}