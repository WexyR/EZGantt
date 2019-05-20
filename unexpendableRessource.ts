class UnexpendableRessource {
    private ressource : Ressource;
    private usedPeriods : Array<Array<[Date, Date]>> = [] ; //which and when
    //assignment by ressource ?
    constructor(name : string, cost : number, amount : number = 1){
        this.ressource = new Ressource(name,cost,amount) //heritage fait avec une composition / Inheritance with composition
        for(let i : number = 0; i<this.getAmount();i++) {this.usedPeriods.push([]);} //Timetable of an object
    }

    //getters
    public getUsedPeriods() : Array<Array<[Date,Date]>>{
        return this.usedPeriods;
    }

    public getName() : string {
        return this.ressource.getName();
    }
    public getAmount() : number {
        return this.ressource.getAmount();
    }
    public getCost() : number {
        return this.ressource.getCost();
    }
    public getId() : number {
        return this.ressource.getId();
    }
    public getAssignments(): Array<Assignment>{
        return this.ressource.getAssignments();
    }
    
    //setters
    public setName(name : string) :void{
        this.ressource.setName(name);
    }

    public add(amount : number) : void{
        for(let i=0;i<amount;i++) {this.usedPeriods.push([]);}
        this.ressource.setAmount(this.getAmount()+amount);
    }

    public consume(Id? : number) : void{ //Id == index of the material object
        if( Id === undefined){
            if (confirm("Voulez-vous consommer entièrement toutes ces ressources ?")) {  //temporary
                this.usedPeriods = [];
                this.ressource.setAmount(0);
            }
            else {return;}
        }
        else{
            this.usedPeriods.splice(Id,1);
            this.ressource.setAmount(this.getAmount()-1);
            // if there is an futur assignment re-assign it or raise problem
        }
    }

    public setCost(cost : number) : void{
        this.ressource.setCost(cost);
    }

    public addAssignment(a :Assignment, n : number) : number {
        let count = this.nAvailable(n,[a.getTask().getStart(),a.getTask().getEnd()]);
        this.ressource.addAssignment(a,0);
        if(count< n) {alert("Nombre insuffisant de cette ressource, le maximum a été alouer");}
        for(let k = 0; k<count;k++) {this.use([a.getTask().getStart(),a.getTask().getEnd()]);}
        return count;
    }

    public removeAssignment( a : Assignment,n : number) : void{
        this.ressource.removeAssignment(a,0);
        this.removeUsedPeriod([a.getTask().getStart(),a.getTask().getEnd()],n);
    }    

    //indirect setter

    public use( period : [Date,Date]) : void {
        let pStart : number = period[0].getTime();
        let pEnd : number =period[1].getTime();
        let available : Array<number> = []; //the amount of period available
        for(let i = 0; i<this.usedPeriods.length ;i++) {    
            let chronos : Array<[Date,Date]> = this.usedPeriods[i];
            if (chronos !== undefined && chronos.length === 0 ) {available.push(i);} // if the material object is not used
            chronos.forEach( e => { //for each UsedPeriod : Are the 2 date of the usePeriod in an usedPeriod ?
                let dEnd : number = e[1].getTime();
                let dStart : number = e[0].getTime();
                //Is the pTime in the used period ?
                if( (pStart<dEnd) && (pStart>=dStart) ) {return;} 
                if( (pEnd<=dEnd) && (pEnd>dStart) ) {return;}
                chronos.forEach( time => { // for each UsedPeriod : Is there an usedPeriod in the usePeriod ?
                    let dEnd : number = time[1].getTime();
                    let dStart : number = time[0].getTime();
                    if((pStart<dStart) && (pEnd>dEnd)) {return;} //if usedPeriod in use Period
                    available.push(i);       
                });
            });
        }
        if(available.length > 0) {this.usedPeriods[available[0]].push(period);}
    }

    public is_available( n : number = 1, usePeriod? : [Date,Date] )  {
        let amount : number = 0; //the amount of period available
        if(usePeriod === undefined) { amount = this.getAmount();}
        else{        
            let pStart : number = usePeriod[0].getTime();
            let pEnd : number = usePeriod[1].getTime();
            
            for(let i = 0; i<this.usedPeriods.length ;i++) {    
                let chronos : Array<[Date,Date]> = this.usedPeriods[i];
                if (chronos !== undefined && chronos.length === 0 ) {amount+=1;} // if the material object is not used
                chronos.forEach( e => { //for each UsedPeriod : Are the 2 date of the usePeriod in an usedPeriod
                    let dEnd : number = e[1].getTime();
                    let dStart : number = e[0].getTime();
                    //Is the pTime is the used period
                    if( (pStart<dEnd) && (pStart>=dStart) ) {return;} 
                    if( (pEnd<=dEnd) && (pEnd>dStart) ) {return;}
                    chronos.forEach( time => { // for each UsedPeriod : Is there an usedPeriod in the usePeriod
                        let dEnd : number = time[1].getTime();
                        let dStart : number = time[0].getTime();
                        if((pStart<dStart) && (pEnd>dEnd)) {return;} //if usedPeriod in use Period
                        amount+=1;       
                    });
                });
            }
        }
        if (amount >=n) {return true;}
        return false;
    }

    public nAvailable( n : number = 1, usePeriod? : [Date,Date] ) : number  {
        let amount : number = 0; //the amount of period available
        if(usePeriod === undefined) { amount = this.getAmount();}
        else{        
            let pStart : number = usePeriod[0].getTime();
            let pEnd : number = usePeriod[1].getTime();
            
            for(let i = 0; i<this.usedPeriods.length ;i++) {    
                let chronos : Array<[Date,Date]> = this.usedPeriods[i];
                if (chronos !== undefined && chronos.length === 0 ) {amount+=1;} // if the material object is not used
                chronos.forEach( e => { //for each UsedPeriod : Are the 2 date of the usePeriod in an usedPeriod
                    let dEnd : number = e[1].getTime();
                    let dStart : number = e[0].getTime();
                    //Is the pTime is the used period
                    if( (pStart<dEnd) && (pStart>=dStart) ) {return;} 
                    if( (pEnd<=dEnd) && (pEnd>dStart) ) {return;}
                    chronos.forEach( time => { // for each UsedPeriod : Is there an usedPeriod in the usePeriod
                        let dEnd : number = time[1].getTime();
                        let dStart : number = time[0].getTime();
                        if((pStart<dStart) && (pEnd>dEnd)) {return;} //if usedPeriod in use Period
                        amount+=1;       
                    });
                });
            }
        }
        return amount;
    }

    public removeUsedPeriod(period : [Date,Date], n : number ) : void {
        let count = 0;
        for(let i = 0; i<this.usedPeriods.length; i++){
            for( let k  = 0; k<this.usedPeriods[i].length;i++){
                if (period[0].getTime() === this.usedPeriods[i][k][0].getTime()) {
                    if(period[1].getTime() === this.usedPeriods[i][k][1].getTime())
                    {
                        if(count<n) {
                            this.usedPeriods[i].splice(k,1);
                            count++;
                        }
                    }
                }
            }
        }
    }

}