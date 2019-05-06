let message : string = "Hello World";
console.log(message);

//NotTested

class Actor {
    //class Actor which represent someone
    private Id : number ;
    private static IdGen : number = 0 ;
    private  name : string;
    private birthday : Date;

    constructor( n : string, birthday : Date ) {
        this.name = n;
        this.birthday = birthday;
        this.Id = Actor.getIdGen();
       }

    
    public setName( n : string) {
        this.name = n;
    }
    public getName(){
        return this.name;
    }

    private static getIdGen(){
        let Id = Actor.IdGen;
        Actor.IdGen+=1;
        return Id;
    }

    public setBirthday( birthday : Date) {
        this.birthday=birthday;
    }
    public getBirthday() {
        return this.birthday;
    }

    public getId() {
        return this.Id ;
    }


}
