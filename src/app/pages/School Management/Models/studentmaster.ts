export class studentmaster {
  ID: any;
  YEAR_ID: number;
  STATE_ID: any = 0;
  DIVISION_ID: number;
  SCHOOL_ID: number;
  ADDRESS:string=''
  CLASS_ID: number;
  COUNTRY_ID: number = 0;
  DISTRICT_ID: any = 0;
  CITY_ID: number;
  STUDENT_NAME: string;
  DOB: any;
  SEQ_NO:number;
  ROLE : 'S'
  GENDER: any;
  ROLE_NUMBER: number;
  PRN_NO: number;
  IDENTITY_NUMBER: any;
  MOBILE_NUMBER: number;
  EMAIL_ID: string;
  PASSWORD: any = 12345678;
  IS_STUDENT_MEMBER: boolean;
  PROFILE_PHOTO:string
  IS_VERIFIED:any
  STATUS: any = true;
  ROLE_ID=4
  REJECT_BLOCKED_REMARK:string=''
  APPROVAL_STATUS:string='A'
  STATE_NAME:string='';
  CITY_NAME:string='';
  COUNTRY_NAME:string='';
  DISTRICT_NAME:string=''
  ROLL_NUMBER: number;
  NAME:any
  MEDIUM_ID:any
}
export class studentmapping{
  STUDENT_ID:number = 0;
  YEAR_ID:number
  CLASS_ID:number
  ROLL_NUMBER: number;
  DIVISION_ID:any;
  MEDIUM_ID:any
}