class Ressource{
    //class Ressource represent a ressource
    private Id : number;
    private static IdGen : number = 0;
    private name : string;
    private amount : number;
    private cost : number;
    private assignments : Array<Assignment> = [];
    constructor(name : string, cost : number, amount : number = 1){
        if(amount < 0 || cost < 0) {throw new Error("Can't be negative");}
        this.name = name;
        this.amount = amount;
        this.cost = cost;
        this.Id = Ressource.getIdGen();
    }
    //getters

    private static getIdGen() : number{
        let Id = Ressource.IdGen;
        Ressource.IdGen+=1;
        return Id;
    }

    public getName() : string {
        return this.name;
    }

    public getAmount() : number {
        return this.amount;
    }

    public getCost() : number {
        return this.cost;
    }
    public getId() : number {
        return this.Id;
    }
    public getAssignments(): Array<Assignment>{
        return this.assignments;
    }
    //setters

    public setName(name : string) : void{
        this.name = name;
    }

    public setAmount(amount : number) : void{
        this.amount = amount;
    }

    public setCost(cost : number) : void{
        this.cost = cost;
    }

    public addAssignment(a :Assignment, n : number) : number {
        let included : boolean = false
        for(let i of this.assignments){
            if( i === a) { included = true;}
        }
        if (!included) {this.assignments.push(a);}
        if (this.amount < n) {
            alert("Nombre insuffisant de cette ressource, le maximum a été alouer");
            n = this.amount;
        }
        this.amount -= n;
        return n;
    }

    public removeAssignment( a : Assignment, n : number) : void{
        let k = 0;
        for(let i = 0; i<this.assignments.length;i++) {
            if(a === this.assignments[i]){
                break;
            }
            k+=1;
        }
        this.assignments.splice(k,1)
        this.amount+=n;
    }
    
    //function

    public consume(n : number = 1){
        if(n<=0){throw new Error("Consume can't be 0 or negative");}
        this.amount -= n;
        if(this.amount < 0){this.amount = 0;} //Is not an Error for me
    }

    public is_available(n : number = 1) : boolean {
        let available : boolean = false;
        if(this.amount > n){available = true;}
        return available;
    }
}