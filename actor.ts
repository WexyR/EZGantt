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

    public getName(){
        return this.name;
    }

    private static getIdGen(){
        let Id = Actor.IdGen;
        Actor.IdGen+=1;
        return Id;
    }

    public getBirthday(){
        return this.birthday;
    }

    public getId(){
        return this.Id ;
    }

    // setters
    public setName( n : string){
        this.name = n;
    }

    public setBirthday( birthday : Date){
        this.birthday=birthday;
    }



}
