class Duration {
  private weeks: number;
  private days: number;
  private hours: number;
  private minutes: number;
  private seconds: number;
  private millis: number;

  constructor(weeks: number=0, days: number=0, hours: number=0, minutes: number=0, seconds: number=0, millis: number=0){
      this.weeks = weeks;
      this.days = days;
      this.hours = hours;
      this.minutes = minutes;
      this.seconds = seconds;
      this.millis = millis;
      this.update_param();
  }

  //getters
  public getWeeks():number{
    return this.weeks;
  }
  public getDays():number{
    return this.days;
  }
  public getHours():number{
    return this.hours;
  }
  public getMinutes():number{
    return this.minutes;
  }
  public getSeconds():number{
    return this.seconds;
  }
  public getMillis():number{
    return this.millis;
  }

  //setters
  public setWeeks(weeks: number){
    this.weeks = weeks;
  }
  public setDays(days: number){
    this.days = days;
    this.update_param();
  }
  public setHours(hours: number){
    this.hours = hours;
    this.update_param();
  }
  public setMinutes(minutes: number){
    this.minutes = minutes;
    this.update_param();
  }
  public setSeconds(seconds: number){
    this.seconds = seconds;
    this.update_param();
  }
  public setMillis(millis: number){
    this.millis = millis;
    this.update_param();
  }

  //methods
  public update_param(){
    this.millis = this.valueOf();
    this.weeks = 0;
    this.days = 0;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;


    if (Math.abs(this.millis) >= 1000){
      this.seconds += ~~(this.millis/1000);
      this.millis = this.millis%1000;
    }

    if (Math.abs(this.seconds) >= 60){
      this.minutes += ~~(this.seconds/60);
      this.seconds = this.seconds%60;
    }

    if (Math.abs(this.minutes) >= 60){
      this.hours += ~~(this.minutes/60);
      this.minutes = this.minutes%60;
    }

    if (Math.abs(this.hours) >= 24){
      this.days += ~~(this.hours/24);
      this.hours = this.hours%24;
    }

    if (Math.abs(this.days) >= 7){
      this.weeks += ~~(this.days/7);
      this.days = this.days%7;
    }
  }

  public add(d:Duration){
    this.weeks += d.getWeeks();
    this.days += d.getDays();
    this.hours += d.getHours();
    this.minutes += d.getMinutes();
    this.seconds += d.getSeconds();
    this.millis += d.getMillis();
    this.update_param();
  }

  public sub(d:Duration){
    this.weeks -= d.getWeeks();
    this.days -= d.getDays();
    this.hours -= d.getHours();
    this.minutes -= d.getMinutes();
    this.seconds -= d.getSeconds();
    this.millis -= d.getMillis();
    this.update_param();
  }

  public valueOf():number{
      return this.millis + 1000*(this.seconds + 60*(this.minutes + 60*(this.hours + 24*(this.days + 7*this.weeks))));
  }

}
