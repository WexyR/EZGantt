class Actor {
    //class Actor which represent someone
    private Id : number ;
    private static IdGen : number = 0 ;
    private  name : string;
    private birthday : Date;

    constructor( name : string, birthday : Date ) {
        this.name = name;
        this.birthday = birthday;
        this.Id = Actor.getIdGen();
       }

    //getters 

    public getName() : string{
        return this.name;
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

    // setters
    public setName( n : string) : void{
        this.name = n;
    }

    public setBirthday( birthday : Date) : void{
        this.birthday=birthday;
    }



}
