export class SchoolMaster {
  ID: number = 0;
  STATE_ID: any = 0;
  COUNTRY_ID: any = 1;
  YEAR_ID: number = 0;
  STEP_NO: any = 0;
  SHORT_CODE=''
  DISTRICT_ID: any = 0;
  BOARD_ID: number = 0;
  SCHOOL_STATUS: any = 'A';
  CITY_ID: number = 0;
  UPI_ID: any;

  STATE_NAME: string = '';
  CITY_NAME: string = '';
  COUNTRY_NAME: string = '';
  DISTRICT_NAME: string = '';

  SCHOOL_NAME: string = '';
  PRINCIPLE_NAME: string = '';
  ROLE_ID: number = 0;
  BOARD_MEDIUM_ID: number = 0;
  ADDRESS: string = '';
  DESCRIPTION: string = '';
  IFSC_CODE:any;
  BANK_NAME:any;
  ACC_NO:any;
  ACC_HOLDER_NAME:any;
  SLOGAN='';
  INSTITUTE_LOGO=''
  PINCODE: number;
  PHONE_NUMBER: number;
  SEQ_NO: number = 0;
  EMAIL_ID: string = '';
  PASSWORD: any = '12345678';
  STATUS: boolean = true;
  IS_ERP_MAPPED: boolean = false;
  S_TEACHER_ATTENDANCE_ENABLED:boolean
  C_TEACHER_ATTENDANCE_ENABLED:boolean=true
  REJECT_BLOCKED_REMARK: string = '';
}
