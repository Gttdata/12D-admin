export class classmaster{
    ID:any
    SCHOOL_ID:number
    TOTAL_FEES:number
    QUESTION_CLASS_ID:number
    NAME:string=''
    SEQ_NO:number=0
    STATUS:boolean=true
  }

  export class classmapping{
    ID:any
    YEAR_ID:number
    DIVISION_ID:number;
    // DIVISION_ID:number;
    MEDIUM_ID:number;
  }

  export class promoteStudent{
    ID:any
    YEAR:number;
    CLASS_ID:number
    YEAR_ID:any;
    DIVISION_ID:number

  }