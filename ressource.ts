class Ressource{
    //class Ressource represent a ressource
    private Id : number;
    private static IdGen : number = 0;
    private name : string;
    private amount : number;
    private cost : number;
    
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
    
    //function

    public consume(n : number = 1){
        if(n<=0){throw new Error("Consume can't be 0 or negative");}
        this.amount -= n;
        if(this.amount < 0){this.amount = 0} //Is not an Error for me
    }

    public is_available(n : number = 1) : boolean {
        let available : boolean = false;
        if(this.amount > n){available = true;}
        return available;
    }
}

//export{Ressource};