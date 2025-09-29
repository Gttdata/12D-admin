export class studentfeedetails{
    ID:any
    STUDENT_ID:number
    TOTAL_FEE:any
    PAID_FEE:any
    PENDING_FEE:number
    CLASS_ID:number
    YEAR_ID:number
    STATUS:boolean=true
    SCHOOL_ID:number
    DIVISION_ID:number
    STUDENT_NAME:string;
    CLASS_NAME:string;

    DIVISION_NAME:string;
    YEAR:string;



    IS_DISCOUNT_AVAILABLE:boolean=false;
    SUB_TOTAL: number = 0.0;
    DISCOUNT_TYPE: string = '';
    DISCOUNT_VALUE: any = 0.0;
    DISCOUNT_AMOUNT: number = 0.0;

}