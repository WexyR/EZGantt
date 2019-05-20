class Task {
    private start : Date;
    private end : Date;
    private assignments : Array<Assignment> = [];
    constructor(start : Date, end : Date){
        this.start = start;
        this.end = end;
    }
    public getStart() : Date{return this.start;}
    public getEnd() : Date{return this.end;}
    public getAssignments(): Array<Assignment>{
        return this.assignments;
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
}
