export class activityhead {
  ID: number;
  HEAD_NAME: string = '';
  HEAD_IMAGE: string = '';
  SEQ_NO: number;
  REST_TIME:number;
  STATUS: boolean = true;
  USER_ID : number ;

}
export class activitymaster {
  ID: number;
  ACTIVITY_CATEGORY_ID:number;
  ACTIVITY_SUB_CATEGORY_ID:number;
  ACTIVITY_NAME:string='';
  ACTIVITY_GIF:string='';
  ACTIVITY_THUMBNAIL_GIF:string=''
  ACTIVITY_TYPE:string='';
  // ACTIVITY_TIMING:any;
  ACTIVITY_VALUE:any;
  CATEGORY:string=''
  DESCRIPTION:string=''
  SEQ_NO: number;
  STATUS:boolean=true
}
