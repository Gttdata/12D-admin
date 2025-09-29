import { Component, Input, OnInit } from '@angular/core';
// import { TeacherMaster } from '../../../Models/TeacherMaster';
import { NgForm } from '@angular/forms';
import { SchoolMaster } from '../../../Models/SchoolMaster';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { ApiService } from 'src/app/Services/api.service';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';


export class TeacherMaster1 {

  ID:number=0;
  NAME: string = '';
  SCHOOL_NAME: string = '';
  APPROVAL_STATUS: string = 'A';
  REJECT_BLOCKED_REMARK:any;
  SCHOOL_ID:any;
  // CLASS_ID: any = []
  MOBILE_NUMBER: number;
  GENDER: string = '';
  DOB: any;
  ROLE_ID:any;
  EMAIL_ID: string = '';
  PASSWORD: any = 12345678;
  STATUS:any=true;
  SEQ_NO: number = 0;
  ROLE: any ;



  
}

@Component({
  selector: 'app-add-teacher-master',
  templateUrl: './add-teacher-master.component.html',
  styleUrls: ['./add-teacher-master.component.css'],
})
export class AddTeacherMasterComponent implements OnInit {
  @Input() drawerClose!: Function;
  @Input() data: TeacherMaster1 = new TeacherMaster1();
  @Input() drawerVisible: boolean = false;
  @Input() dataList: any[] = [];
  @Input() isSpinning = false;
  @Input()
  isShowBlocked:boolean
  passwordVisible = false;
  roleid: any;
  Classes: any[] = [];
  classload: boolean = false;


  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private cookies: CookieService,
    private datepipe: DatePipe
  ) { }
  public commonFunction = new CommomFunctionsService();

  ngOnInit() {
    // this.getAllClasses()
  }

  getAllClasses() {
    this.classload = true;
    this.api.getAllClasses(0, 0, '', '', ' AND STATUS!=false AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'))).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.Classes = data['data'];
          this.classload = false;
        } else {
          this.Classes = [];
          this.classload = false;
        }
      },
      (err) => {
        this.classload = false;
      }
    );
  }

  save(addNew: boolean, form: NgForm): void {
    let isOk = true;

    if (
      (this.data.NAME == '' ||
        this.data.NAME == null ||
        this.data.NAME == undefined) &&
      (this.data.EMAIL_ID == '' ||
        this.data.EMAIL_ID == null ||
        this.data.EMAIL_ID == undefined) &&
      (this.data.MOBILE_NUMBER <= 0 ||
        this.data.MOBILE_NUMBER == null ||
        this.data.MOBILE_NUMBER == undefined) &&
      (this.data.GENDER == '' ||
        this.data.GENDER == null ||
        this.data.GENDER == undefined) &&
      (this.data.DOB == '' ||
        this.data.DOB == null ||
        this.data.DOB == undefined)
      // (this.data.PASSWORD == '' ||
      //   this.data.PASSWORD == null ||
      //   this.data.PASSWORD == undefined) &&
      // (this.data.SEQ_NO <= 0 ||
      //   this.data.SEQ_NO == null ||
      //   this.data.SEQ_NO == undefined) &&
      // (this.data.CLASS_ID <= 0 ||
      //   this.data.CLASS_ID == null ||
      //   this.data.CLASS_ID == undefined
      //   )

    ) {
      isOk = false;
      this.message.error('Please Fill All Required Fields', '');
    } else if (
      this.data.NAME == undefined ||
      this.data.NAME == null ||
      this.data.NAME.trim() == ''
    ) {
      isOk = false;
      this.message.error('Please Enter Teacher Name ', '');
    } else if (
      this.data.EMAIL_ID == undefined ||
      this.data.EMAIL_ID == null ||
      this.data.EMAIL_ID.trim() == ''
    ) {
      isOk = false;
      this.message.error('Please Enter Email Id', '');
    } else if (!this.commonFunction.emailpattern.test(this.data.EMAIL_ID)) {
      isOk = false;
      this.message.error('Please Enter Valid Email Id.', '');
    } else if (
      this.data.MOBILE_NUMBER == null ||
      this.data.MOBILE_NUMBER == undefined ||
      this.data.MOBILE_NUMBER <= 0
    ) {
      isOk = false;
      this.message.error('Please Enter Mobile Number.', '');
    } else if (
      !this.commonFunction.mobpattern.test(this.data.MOBILE_NUMBER.toString())
    ) {
      isOk = false;
      this.message.error('Please Enter Valid Mobile Number.', '');
    } else if (
      this.data.GENDER == undefined ||
      this.data.GENDER == null ||
      this.data.GENDER.trim() == ''
    ) {
      isOk = false;
      this.message.error('Please Select Gender ', '');
    } else if (this.data.DOB == undefined || this.data.DOB == null) {
      isOk = false;
      this.message.error('Please Select Birth Date ', '');
    } else if (
      this.data.PASSWORD == undefined ||
      this.data.PASSWORD == null ||
      this.data.PASSWORD == '' ||
      this.data.PASSWORD == ' '
    ) {
      isOk = false;
      this.message.error('Please Enter Password', '');
    }
    // else if (
    //   this.data.CLASS_ID == null ||
    //   this.data.CLASS_ID == undefined ||
    //   this.data.CLASS_ID <= 0
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Class.', '');
    // }

    // else if (
    //   this.data.APPROVAL_STATUS == undefined ||
    //   this.data.APPROVAL_STATUS == null ||
    //   this.data.APPROVAL_STATUS.trim() == ''
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select School Status', '');
    // } 
    
    else if (
      this.data.APPROVAL_STATUS == 'R' &&
      (this.data.REJECT_BLOCKED_REMARK == null ||
        this.data.REJECT_BLOCKED_REMARK == undefined ||
        this.data.REJECT_BLOCKED_REMARK == '')
    ) {
      isOk = false;
      this.message.error('Please Enter Reject Remark', '');
    } else if (
      this.data.APPROVAL_STATUS == 'B' &&
      (this.data.REJECT_BLOCKED_REMARK == null ||
        this.data.REJECT_BLOCKED_REMARK == undefined ||
        this.data.REJECT_BLOCKED_REMARK == '')
    ) {
      isOk = false;
      this.message.error('Please Enter Blocked Remark', '');
    }
    
    // else if (
    //   this.data.SEQ_NO == null ||
    //   this.data.SEQ_NO == undefined ||
    //   this.data.SEQ_NO <= 0
    // ) {
    //   isOk = false;
    //   this.message.error('Please Enter Sequence No', '');
    // }
    if (isOk) {
      this.isSpinning = true;
      this.data.DOB = this.datepipe.transform(
        this.data.DOB,
        'yyyy-MM-dd  HH:mm:ss'
      );
      if (this.data.APPROVAL_STATUS == 'A' || this.data.APPROVAL_STATUS == 'P') {
        this.data.REJECT_BLOCKED_REMARK = ' '
      }
      if(this.data.APPROVAL_STATUS == 'B'){
        this.data.STATUS=0
      }
      else{
        this.data.STATUS=1
      }
      this.data.ROLE_ID = 3;
      this.data.ROLE = 'T'
      // this.data.CLASS_ID = this.data.CLASS_ID.toString();
      this.data.SCHOOL_ID = Number(sessionStorage.getItem('schoolid'))

      if (this.data.ID) {
        this.api.UpdateTeacher(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('Teacher Data Updated Successfully', '');

            if (!addNew) this.drawerClose();

            this.isSpinning = false;
          } else if (successCode.code == '300') {
            this.message.error(
              'Mobile Number or Email ID Already Exist...',
              ''
            );
            this.isSpinning = false;
          }else {
            this.message.error('Teacher Data Updation Failed', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.CreateTeacher(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('Teacher Data Created Successfully', '');

            if (!addNew) this.drawerClose();
            else {
              this.data = new TeacherMaster1();
              this.resetDrawer(form);

              // this.api.getALLTeacher(1, 1, '', 'desc', ' AND SCHOOL_ID =' + Number(sessionStorage.getItem('schoolid'))).subscribe(
              //   (data) => {
              //     if (data['code'] == 200) {
              //       if (data['count'] == 0) {
              //         this.data.SEQ_NO = 1;
              //       } else {
              //         this.data.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
              //       }
              //     } else {
              //     }
              //   },
              //   (err) => { }
              // );
            }

            this.isSpinning = false;
          }else if (successCode.code == '300') {
            this.message.error(
              'Mobile Number or Email ID Already Exist...',
              ''
            );
            this.isSpinning = false;
          } else {
            this.message.error('Teacher Data Creation Failed', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }

  close(): void {
    this.drawerClose();
  }

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new TeacherMaster1();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  open18YearAgo(event) {
    if (!this.data.ID) {
      if (
        this.data.DOB == null ||
        this.data.DOB == undefined ||
        this.data.DOB == ''
      ) {
        var defaultDate = new Date();
        var bod = defaultDate.setFullYear(defaultDate.getFullYear() - 18);
        this.data.DOB = bod;
      }
    } else if (
      this.data.DOB == null ||
      this.data.DOB == undefined ||
      this.data.DOB == ''
    ) {
      var defaultDate = new Date();
      var bod = defaultDate.setFullYear(defaultDate.getFullYear() - 18);
      this.data.DOB = bod;
    }
  }
}
