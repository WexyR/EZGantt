//import {Ressource} from "./ressource.js"; need webpack
class UnexpendableRessource extends Ressource{
    private usedPeriods : Array<[Date,Date]>;
    
    constructor(name : string, cost : number, amount : number = 1){
        super(name,cost,amount);
    }

    //getters
    public getUsedPeriods() : Array<[Date,Date]>{
        return this.usedPeriods;
    }

    //indirect setter

    public use( period : [Date,Date]) : void {
        this.usedPeriods.push(period);
        if(Date.now()>period[0].getTime()){this.consume();}  //if we are not in the borrowing period the ressource is still there / preliminar test
    }
    //Est ce que l'on ne metterai pas une liste de ce qui est emprenté ?

    public is_available( n : number = 1, usePeriod? : [Date,Date]) : boolean {
        let available : boolean = super.is_available(n)
        if (usePeriod === undefined || this.getAmount()>0 ){return available;} 
        else {
            let pStart : Date = usePeriod[0];
            let pEnd : Date = usePeriod[1];
            this.usedPeriods.forEach( e => {
                let dEnd : Date = e[1];
                if(dEnd.getTime()>pStart.getTime()){return true;} // if the ressource borrowed end before our Period, we will be able to borrow it
            });
            return false;
        }

    }
    
}