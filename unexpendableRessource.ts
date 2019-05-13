class UnexpendableRessource {
    private ressource : Ressource;
    private usedPeriods : Array<Array<[Date, Date]>> = [] ; //which and when
    
    constructor(name : string, cost : number, amount : number = 1){
        this.ressource = new Ressource(name,cost,amount) //heritage fait avec une composition
        for(let i : number = 0; i<this.getAmount();i++) {this.usedPeriods.push([]);} //chronogramme d'un objet matériel
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
    
    //setters
    public setName(name : string) :void{
        this.ressource.setName(name);
    }

    //to change
    public setAmount(amount : number) : void{
        this.ressource.setAmount(amount);
    }
    public setCost(cost : number) : void{
        this.ressource.setCost(cost);
    }    

    //indirect setter

    public use( period : [Date,Date]) : void {
        let pStart : number = period[0].getTime();
        let pEnd : number =period[1].getTime();
        let available : Array<number> = []; //the amount of period available
        for(let i = 0; i<this.usedPeriods.length ;i++) {    
            let chronos : Array<[Date,Date]> = this.usedPeriods[i];
            if (chronos !== undefined && chronos.length === 0 ) {available.push(i);} // if the material object is not used
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
                    available.push(i);       
                });
            });
        }
        if(available.length != 0) {this.usedPeriods[available[0]].push(period);}
    }

    public is_available( n : number = 1, usePeriod : [Date,Date] )  {
        let pStart : number = usePeriod[0].getTime();
        let pEnd : number = usePeriod[1].getTime();
        let amount : number = 0; //the amount of period available
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
        if (amount >=n) {return true;}
        return false;
        }

}