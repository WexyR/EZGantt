class Actor {
    //class Actor which represent someone
    private Id : number ;
    private static IdGen : number = 0 ;
    private  name : string;
    private birthday : Date;
    private assignments : Array<Assignment> = [];
    constructor( name : string, birthday : Date ) {
        this.name = name;
        this.birthday = birthday;
        this.Id = Actor.getIdGen();
       }

    //getters 

    public getName() : string{
        return this.name;
    }
    public getAssignments(): Array<Assignment>{
        return this.assignments;
    }

    private static getIdGen() : number{
        let Id = Actor.IdGen;
        Actor.IdGen+=1;
        return Id;
    }

    public getBirthday() : Date {
        return this.birthday;
    }

    public getId() : number{
        return this.Id ;
    }
    public addAssignment(a :Assignment) : void {
        this.assignments.push(a);
    }
    public removeAssignment( a : Assignment) : void{
        let k = 0;;
        for(let i = 0; i<this.assignments.length;i++) {
            if(a === this.assignments[i]){
                break;
            }
            k+=1;
        }
        this.assignments.splice(k,1)
    }

    // setters
    public setName( n : string) : void{
        this.name = n;
    }

    public setBirthday( birthday : Date) : void{
        this.birthday=birthday;
    }



}
