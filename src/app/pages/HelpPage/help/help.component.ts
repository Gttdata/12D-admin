import {
  Component,
  ElementRef,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Services/api.service';
import { TeacherMaster } from '../../School Management/Models/TeacherMaster';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { appkeys } from 'src/app/app.constant';
import * as XLSX from 'xlsx';
import {
  studentmaster,
  studentmapping,
} from '../../School Management/Models/studentmaster';
import { HttpEventType } from '@angular/common/http';
import { HeadMasterData } from '../../Masters/Models/HeadMasterData';
import { divisionmaster } from '../../Masters/Models/divisionmaster';
import { SubjectMaster } from '../../Task Management/Models/SubjectMaster';
import { MediumMaster } from '../../Masters/Models/MediumMaster';
import {
  classmapping,
  classmaster,
  promoteStudent,
} from '../../School Management/Models/classmaster';

interface StepData {
  ID: any;
  STEP_NO: number;
}
export class TeacherMap {
  CLASS_NAME: string = '';
  DIVISION_ID: any = null;
  CLASS_ID: number;
  YEAR_ID: any = null;
  CLASS_TEACHER_ID: any;

  TEACHER_ID: number;
  SUBJECT_ID: number;
  STATUS: boolean = true;
}

export class DataArray {
  CLASS_NAME;
  HEAD_ID: any;
  CLASS_ID: number;
  YEAR_ID: any;
  AMOUNT: any;
  DIVISION_ID: any;
  YEAR_NAME: any;
  DIVISION_NAME: any;
  HEAD_NAME: any;
}
export class Teacher {
  ID: number = 0;
  NAME: string = '';
  SCHOOL_NAME: string = '';
  APPROVAL_STATUS: string = 'A';
  REJECT_BLOCKED_REMARK: any;
  SCHOOL_ID: any;
  // CLASS_ID: any = []
  MOBILE_NUMBER: number;
  GENDER: string = '';
  DOB: any;
  ROLE_ID: any;
  EMAIL_ID: string = '';
  PASSWORD: any = 12345678;
  STATUS: boolean = true;
  // SEQ_NO: number = 0;
  ROLE = 'T';
}
@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
})
export class HelpComponent implements OnInit {
  constructor(
    private api: ApiService,
    private message: NzNotificationService,
    private cookies: CookieService,
    private datePipe: DatePipe
  ) {}
  public commonFunction = new CommomFunctionsService();
  @Input()
  drawerClose!: Function;
  current: any = 0;
  schoolid: number;
  step_no: number;
  loadQuestionClass = false;
  QuestionClassList: any[] = [];
  questionsubjectList;
  questionSubjectLoad = false;
  questionsubjectid: any;

  boardId: any;

  ngOnInit(): void {
    this.roleId = Number(sessionStorage.getItem('roleId'));
    this.schoolid = Number(sessionStorage.getItem('schoolid'));
    this.step_no = Number(sessionStorage.getItem('stepid'));
    this.boardId = sessionStorage.getItem('boardId');

    this.getAllClassesForSubject();

    this.drawerDataStudent.SCHOOL_ID = Number(
      sessionStorage.getItem('schoolid')
    );
    this.getYearClassforExcel();
    this.getDivision();
    this.GetMediumData();
    this.getallCountry();
    this.GetTeachersData();
    this.getQuestionClass();

    // this.GetHeadData();

    this.drawerDataStudent.SCHOOL_ID = Number(
      sessionStorage.getItem('schoolid')
    );

    this.getAllClasses();
    this.GetDivisionData();

    this.screenwidth = window.innerWidth;
    if (this.screenwidth > 500) {
      this.YearWidth = 380;
    } else {
      this.YearWidth = 380;
    }

    setTimeout(() => {
      this.open();
    }, 100);
  }
  isVisible = false;

  open() {
    const stepId = this.step_no;

    if (stepId >= 0 && stepId < 7) {
      this.current = stepId;
    }

    this.isVisible = true;
  }
  handleOpenCancel() {
    this.isVisible = false;
    window.location.href = '/admindashboard';
    // this.drawerClose();
  }
  modalClose() {
    // this.step_no = Number(sessionStorage.getItem('stepid'));

    // sessionStorage.setItem('stepid', String(6));
    window.location.href = '/admindashboard';
    this.isVisible = false;
  }

  updateStepno(data: StepData): void {
    console.log(data);

    this.api.BasicupdateSchool(data).subscribe((successCode) => {
      console.log(successCode);

      if (successCode.code == '200') {
        // this.message.success(
        //   'Step Changed Successfully...',
        //   ''
        // );
      } else {
        // this.message.error('Step Changed Failed...', '');
      }
    });
  }

  skip() {
    if (this.current == 0) {
      this.current = 1;

      this.searchDivision();
    } else if (this.current == 1) {
      this.current = 2;
      this.searchMedium();
    } else if (this.current == 2) {
      this.current = 3;
      this.searchFeeHead();
    } else if (this.current == 3) {
      this.current = 4;
      this.Classsearch();
    } else if (this.current == 4) {
      this.current = 5;
      this.subjectSearch();
      this.getAllClasses();
    } else {
      this.current = 6;
      this.clickEventStudent('ALL');
      this.studentSearch();
    }
    sessionStorage.setItem('stepid', this.current);
  }
  next() {
    if (this.current == 0) {
      this.current = 1;

      this.updateStepno({ ID: this.schoolid, STEP_NO: this.current });
      this.searchDivision();
    } else if (this.current == 1) {
      this.current = 2;
      this.updateStepno({ ID: this.schoolid, STEP_NO: this.current });
      this.searchMedium();
    } else if (this.current == 2) {
      this.current = 3;
      this.updateStepno({ ID: this.schoolid, STEP_NO: this.current });
      this.searchFeeHead();
    } else if (this.current == 3) {
      this.current = 4;
      this.updateStepno({ ID: this.schoolid, STEP_NO: this.current });
      this.Classsearch();
      this.GetTeachersData();
      this.GetMediumData();
      this.getDivision();
      this.getAllClasses();
      this.getQuestionClass();
    } else if (this.current == 4) {
      this.current = 5;
      this.updateStepno({ ID: this.schoolid, STEP_NO: this.current });
      this.subjectSearch();
      this.getDivision();
      this.getAllClasses();
      // this.getAllClassesForSubject();
    } else {
      this.current = 6;
      this.updateStepno({ ID: this.schoolid, STEP_NO: this.current });
      this.clickEventStudent('ALL');
      this.studentSearch();
      this.GetMediumData();
      this.getDivision();
      this.getAllClasses();
    }
    sessionStorage.setItem('stepid', this.current);
  }

  pre() {
    if (this.current == 6) {
      this.current = 5;
      this.getDivision();
      this.getAllClasses();
      // this.getAllClassesForSubject();
    } else if (this.current == 5) {
      this.current = 4;
      this.Classsearch();
      this.GetTeachersData();
      this.GetMediumData();
      this.getAllClasses();
      this.getQuestionClass();

      this.getDivision();
    } else if (this.current == 4) {
      this.current = 3;
      this.searchFeeHead();
    } else if (this.current == 3) {
      this.current = 2;
      this.searchMedium();
    } else if (this.current == 2) {
      this.current = 1;
      this.searchDivision();

      // this.studentSearch();
    } else {
      this.current = 0;
      this.clickEventTeacher('ALL');
      // this.teacherSearch();
    }
  }

  formTeacherTitle = 'Manage Teacher Details ';
  isShowBlocked = false;

  teacherPageIndex = 1;
  teacherPageSize = 10;
  teacherTotalRecords = 1;
  teacherLoadingRecords: boolean = false;
  teacherSortValue = 'desc';
  teacherSortKey = 'id';
  teacherSearchText = '';
  teacherDrawerVisible: boolean = false;
  teacherDrawerTitle = '';
  teacherDrawerData: TeacherMaster = new TeacherMaster();
  teacherDataList: TeacherMaster[] = [];
  NextButton: boolean = false;
  roleId: number;

  // Tiles
  pendingscounts: any;
  registercounts: any;
  approvedcounts: any;
  rejectscounts: any;
  blockedcounts: any;
  APPROVAL_STATUS: any = 'ALL';
  showcolor0 = 1;
  showcolor1 = 0;
  showcolor2 = 0;
  showcolor3 = 0;
  showcolor4 = 0;
  teacherColumns: [string, string][] = [
    ['NAME', 'NAME'],
    ['EMAIL_ID', 'EMAIL_ID'],
    ['MOBILE_NUMBER', 'MOBILE_NUMBER'],
    ['DOB', 'DOB'],
    ['GENDER', 'GENDER'],
    // ['SEQ_NO', 'SEQ_NO'],
  ];

  teacherkeyup(event: any) {
    this.teacherSearch();
  }

  clickEventTeacher(data: any) {
    this.APPROVAL_STATUS = data;
    this.teacherPageIndex = 1;
    this.teacherPageSize = 10;
    if (this.APPROVAL_STATUS == 'ALL') {
      this.showcolor0 = 1;
      this.showcolor1 = 0;
      this.showcolor2 = 0;
      this.showcolor3 = 0;
      this.showcolor4 = 0;
    } else if (this.APPROVAL_STATUS == 'A') {
      this.showcolor0 = 0;
      this.showcolor1 = 1;
      this.showcolor2 = 0;
      this.showcolor3 = 0;
      this.showcolor4 = 0;
    } else if (this.APPROVAL_STATUS == 'R') {
      this.showcolor0 = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 1;
      this.showcolor3 = 0;
      this.showcolor4 = 0;
    } else if (this.APPROVAL_STATUS == 'P') {
      this.showcolor0 = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 0;
      this.showcolor3 = 1;
      this.showcolor4 = 0;
    } else if (this.APPROVAL_STATUS == 'B') {
      this.showcolor0 = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 0;
      this.showcolor3 = 0;
      this.showcolor4 = 1;
    }
    this.applyTeacherFilter();
  }
  applyTeacherFilter() {
    this.teacherSearch(true);
  }
  // Basic Methods

  teacherSearch(reset: boolean = false) {
    if (reset) {
      this.teacherPageIndex = 1;
      this.teacherSortKey = 'id';
      this.teacherSortValue = 'desc';
    }
    this.teacherLoadingRecords = true;
    var sort: string;
    try {
      sort = this.teacherSortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var statusFilter = '';
    if (this.APPROVAL_STATUS != undefined && this.APPROVAL_STATUS != 'ALL') {
      statusFilter = ' AND APPROVAL_STATUS=' + "'" + this.APPROVAL_STATUS + "'";
    }
    var likeQuery = '';

    if (this.teacherSearchText != '') {
      likeQuery = ' AND(';
      this.teacherColumns.forEach((column) => {
        likeQuery +=
          ' ' + column[0] + " like '%" + this.teacherSearchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    var extraFilter: any = '';
    if (this.roleId == 3 || this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = '';
    }

    this.api
      .getALLTeacher(
        this.teacherPageIndex,
        this.teacherPageSize,
        this.teacherSortKey,
        sort,
        likeQuery +
          extraFilter +
          statusFilter +
          ' AND ROLE = "T"' +
          ' AND STATUS=1'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.teacherLoadingRecords = false;
            this.teacherTotalRecords = data['count'];
            this.teacherDataList = data['data'];

            if (this.teacherDataList.length > 0) {
              this.NextButton = false;
            } else {
              this.NextButton = true;
            }

            this.api
              .getTeacherCount(0, 0, '', '', extraFilter + ' AND STATUS=1')
              .subscribe(
                (data) => {
                  this.pendingscounts = data['data'][0]['PENDING'];
                  this.rejectscounts = data['data'][0]['REJECTED'];
                  this.registercounts = data['data'][0]['ALL_COUNT'];
                  this.approvedcounts = data['data'][0]['APPROVED'];
                  this.blockedcounts = data['data'][0]['BLOCKED'];
                },
                (err) => {}
              );
          } else {
            this.message.error('Something Went Wrong', '');
            this.teacherDataList = [];
            this.teacherLoadingRecords = false;
          }
        },
        (err) => {}
      );
  }

  get closeCallbackTeacher() {
    return this.teacherDrawerClose.bind(this);
  }

  teacherAdd(): void {
    this.isShowBlocked = false;
    this.teacherDrawerTitle = 'Create New Teacher';
    this.teacherData = new Teacher();
    // this.api
    //   .getALLTeacher(
    //     1,
    //     1,
    //     'id',
    //     'desc',
    //     '  AND SCHOOL_ID =' + Number(sessionStorage.getItem('schoolid'))
    //   )
    //   .subscribe(
    //     (data) => {
    //       if (data['code'] == 200) {
    //         if (data['count'] == 0) {
    //           this.teacherData.SEQ_NO = 1;
    //         } else {
    //           this.teacherData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
    //         }
    this.teacherDrawerVisible = true;
    //       }
    //     },
    //     (err) => { }
    //   );
  }

  teacherEdit(data: Teacher): void {
    this.isShowBlocked = true;

    this.teacherDrawerTitle = 'Update Teacher Details';
    this.teacherData = Object.assign({}, data);

    this.teacherDrawerVisible = true;
  }

  teacherDrawerClose(): void {
    this.teacherSearch();
    this.teacherDrawerVisible = false;
  }
  teacherSort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.teacherPageIndex = pageIndex;
    this.teacherPageSize = pageSize;

    if (this.teacherPageSize != pageSize) {
      this.teacherPageIndex = 1;
      this.teacherPageSize = pageSize;
    }

    if (this.teacherSortKey != sortField) {
      this.teacherPageIndex = 1;
      this.teacherPageSize = pageSize;
    }

    this.teacherSortKey = sortField;
    this.teacherSortValue = sortOrder;
    this.teacherSearch();
  }

  // Teacher Details
  teacherVisible = false;
  TEACHER_DATALIST: any;
  // TEACHER_STATUS: any = 'A';
  submitstatusisSpinning: boolean = false;
  StatusButton: any;

  PreviewTeacher(data1: Teacher) {
    this.StatusButton = data1.APPROVAL_STATUS;

    this.TEACHER_DATALIST = Object.assign({}, data1);

    this.teacherVisible = true;
  }

  SubmitStatusTeacher() {
    let isOk = true;

    if (
      this.TEACHER_DATALIST.APPROVAL_STATUS == undefined ||
      this.TEACHER_DATALIST.APPROVAL_STATUS == null ||
      this.TEACHER_DATALIST.APPROVAL_STATUS == 'P'
    ) {
      isOk = false;
      this.message.error('Please Select Teacher Status', '');
    } else if (
      this.TEACHER_DATALIST.APPROVAL_STATUS == 'R' &&
      (this.TEACHER_DATALIST.REJECT_BLOCKED_REMARK == undefined ||
        this.TEACHER_DATALIST.REJECT_BLOCKED_REMARK == '' ||
        this.TEACHER_DATALIST.REJECT_BLOCKED_REMARK.trim() == '')
    ) {
      isOk = false;
      this.message.error('Please Enter Reject Remark', '');
    }

    if (isOk) {
      //
      this.api.TeacherAprroveReject(this.TEACHER_DATALIST).subscribe((data) => {
        if (data['code'] == 200) {
          this.message.success(' Teacher Status Submitted successfully...', '');
          this.teacherSearch();
          this.submitstatusisSpinning = false;
          this.teacherVisible = false;
        } else {
          this.message.error('Teacher Status  Submission Failed...', '');
          this.submitstatusisSpinning = false;
        }
      });
    } else {
      // this.message.error('No Data To Submit ...', '');

      this.submitstatusisSpinning = false;
    }
  }

  handleCancelTeacher() {
    this.teacherVisible = false;
  }

  ////////////////////////////////////////  Teacher Drawer //////////////////////////////////////////////

  passwordVisible = false;
  roleid: any;
  Classes: any[] = [];
  classload: boolean = false;
  teacherIsSpinning: boolean = false;
  teacherData: Teacher = new Teacher();

  getAllClasses() {
    this.classload = true;
    this.api
      .getAllClasses(
        0,
        0,
        '',
        '',
        ' AND STATUS!=false AND SCHOOL_ID = ' +
          Number(sessionStorage.getItem('schoolid'))
      )
      .subscribe(
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

  teacherSave(addNew: boolean, form: NgForm): void {
    console.log(form.form.value, ' ', this.teacherData);

    let isOk = true;

    if (
      (this.teacherData.NAME == '' ||
        this.teacherData.NAME == null ||
        this.teacherData.NAME == undefined) &&
      (this.teacherData.EMAIL_ID == '' ||
        this.teacherData.EMAIL_ID == null ||
        this.teacherData.EMAIL_ID == undefined) &&
      (this.teacherData.MOBILE_NUMBER <= 0 ||
        this.teacherData.MOBILE_NUMBER == null ||
        this.teacherData.MOBILE_NUMBER == undefined) &&
      (this.teacherData.GENDER == '' ||
        this.teacherData.GENDER == null ||
        this.teacherData.GENDER == undefined) &&
      (this.teacherData.DOB == '' ||
        this.teacherData.DOB == null ||
        this.teacherData.DOB == undefined)
    ) {
      isOk = false;
      this.message.error('Please Fill All Required Fields', '');
    } else if (
      this.teacherData.NAME == undefined ||
      this.teacherData.NAME == null ||
      this.teacherData.NAME.trim() == ''
    ) {
      isOk = false;
      this.message.error('Please Enter Teacher Name ', '');
    } else if (
      this.teacherData.EMAIL_ID == undefined ||
      this.teacherData.EMAIL_ID == null ||
      this.teacherData.EMAIL_ID.trim() == ''
    ) {
      isOk = false;
      this.message.error('Please Enter Email Id', '');
    } else if (
      !this.commonFunction.emailpattern.test(this.teacherData.EMAIL_ID)
    ) {
      isOk = false;
      this.message.error('Please Enter Valid Email Id.', '');
    } else if (
      this.teacherData.MOBILE_NUMBER == null ||
      this.teacherData.MOBILE_NUMBER == undefined ||
      this.teacherData.MOBILE_NUMBER <= 0
    ) {
      isOk = false;
      this.message.error('Please Enter Mobile Number.', '');
    } else if (
      !this.commonFunction.mobpattern.test(
        this.teacherData.MOBILE_NUMBER.toString()
      )
    ) {
      isOk = false;
      this.message.error('Please Enter Valid Mobile Number.', '');
    } else if (
      this.teacherData.GENDER == undefined ||
      this.teacherData.GENDER == null ||
      this.teacherData.GENDER.trim() == ''
    ) {
      isOk = false;
      this.message.error('Please Select Gender ', '');
    } else if (
      this.teacherData.DOB == undefined ||
      this.teacherData.DOB == null
    ) {
      isOk = false;
      this.message.error('Please Select Birth Date ', '');
    } else if (
      this.teacherData.PASSWORD == undefined ||
      this.teacherData.PASSWORD == null ||
      this.teacherData.PASSWORD == '' ||
      this.teacherData.PASSWORD == ' '
    ) {
      isOk = false;
      this.message.error('Please Enter Password', '');
    } else if (
      this.teacherData.APPROVAL_STATUS == 'R' &&
      (this.teacherData.REJECT_BLOCKED_REMARK == null ||
        this.teacherData.REJECT_BLOCKED_REMARK == undefined ||
        this.teacherData.REJECT_BLOCKED_REMARK == '')
    ) {
      isOk = false;
      this.message.error('Please Enter Reject Remark', '');
    } else if (
      this.teacherData.APPROVAL_STATUS == 'B' &&
      (this.teacherData.REJECT_BLOCKED_REMARK == null ||
        this.teacherData.REJECT_BLOCKED_REMARK == undefined ||
        this.teacherData.REJECT_BLOCKED_REMARK == ' ')
    ) {
      isOk = false;
      this.message.error('Please Enter Blocked Remark', '');
    }
    // else if (
    //   this.teacherData.SEQ_NO == null ||
    //   this.teacherData.SEQ_NO == undefined ||
    //   this.teacherData.SEQ_NO <= 0
    // ) {
    //   isOk = false;
    //   this.message.error('Please Enter Sequence No', '');
    // }
    if (isOk) {
      this.teacherIsSpinning = true;
      this.teacherData.DOB = this.datePipe.transform(
        this.teacherData.DOB,
        'yyyy-MM-dd  HH:mm:ss'
      );
      if (
        this.teacherData.APPROVAL_STATUS == 'A' ||
        this.teacherData.APPROVAL_STATUS == 'P'
      ) {
        this.teacherData.REJECT_BLOCKED_REMARK = ' ';
      }
      this.teacherData.ROLE_ID = 3;
      // this.teacherData.CLASS_ID = this.teacherData.CLASS_ID.toString();
      this.teacherData.SCHOOL_ID = Number(sessionStorage.getItem('schoolid'));

      if (this.teacherData.ID) {
        this.api.UpdateTeacher(this.teacherData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('Teacher Data Updated Successfully', '');

            if (!addNew) this.teacherDrawerClose();

            this.teacherIsSpinning = false;
          } else if (successCode.code == '300') {
            this.message.error(
              'Mobile Number or Email ID Already Exist...',
              ''
            );
            this.teacherIsSpinning = false;
          } else {
            this.message.error('Teacher Data Updation Failed', '');
            this.teacherIsSpinning = false;
          }
        });
      } else {
        this.api.CreateTeacher(this.teacherData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('Teacher Data Created Successfully', '');

            if (!addNew) this.teacherDrawerClose();
            else {
              this.teacherData = new Teacher();
              this.teacherresetDrawer(form);

              // this.api
              //   .getALLTeacher(
              //     1,
              //     1,
              //     '',
              //     'desc',
              //     ' AND SCHOOL_ID =' +
              //     Number(sessionStorage.getItem('schoolid'))
              //   )
              //   .subscribe(
              //     (data) => {
              //       if (data['code'] == 200) {
              //         if (data['count'] == 0) {
              //           this.teacherData.SEQ_NO = 1;
              //         } else {
              //           this.teacherData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
              //         }
              //       } else {
              //       }
              //     },
              //     (err) => { }
              //   );
            }

            this.teacherIsSpinning = false;
          } else if (successCode.code == '300') {
            this.message.error(
              'Mobile Number or Email ID Already Exist...',
              ''
            );
            this.teacherIsSpinning = false;
          } else {
            this.message.error('Teacher Data Creation Failed', '');
            this.teacherIsSpinning = false;
          }
        });
      }
    }
  }

  closeTeacher(): void {
    this.teacherDrawerClose();
  }

  teacherresetDrawer(teacherDrawerPage: NgForm) {
    this.teacherData = new Teacher();
    teacherDrawerPage.form.markAsPristine();
    teacherDrawerPage.form.markAsUntouched();
  }

  open18YearAgo(event) {
    if (!this.teacherData.ID) {
      if (
        this.teacherData.DOB == null ||
        this.teacherData.DOB == undefined ||
        this.teacherData.DOB == ''
      ) {
        var defaultDate = new Date();
        var bod = defaultDate.setFullYear(defaultDate.getFullYear() - 18);
        this.teacherData.DOB = bod;
      }
    } else if (
      this.teacherData.DOB == null ||
      this.teacherData.DOB == undefined ||
      this.teacherData.DOB == ''
    ) {
      var defaultDate = new Date();
      var bod = defaultDate.setFullYear(defaultDate.getFullYear() - 18);
      this.teacherData.DOB = bod;
    }
  }
  ////////////////////////////////////////  Teacher Drawer //////////////////////////////////////////////
  ////////////////////////////////////////  Student Table //////////////////////////////////////////////

  formTitleStudent = 'Manage Students ';

  pageIndexStudent = 1;
  pageSizeStudent = 10;
  totalRecordsStudent = 1;
  dataListStudent = [];
  loadingRecordsStudent = false;
  sortValueStudent: string = 'desc';
  sortKeyStudent: string = 'id';
  searchTextStudent: string = '';
  filterQueryStudent: string = '';
  isFilterAppliedStudent: string = 'default';
  drawerVisibleStudent!: boolean;
  drawerTitleStudent!: string;
  drawerDataStudent: studentmaster = new studentmaster();
  dataMappingStudent: studentmapping = new studentmapping();
  divisionload: boolean = false;
  divisionlist: any[] = [];
  columnsStudent: string[][] = [
    ['NAME', 'Name'],
    ['MOBILE_NUMBER', 'Mobile Number'],
    ['EMAIL_ID', 'Email Id'],
    ['GENDER', 'Gender'],
    ['DOB', 'Birth Date'],
    ['DISTRICT_NAME', 'state'],
    ['PASSWORD', 'Password'],
    ['IDENTITY_NUMBER', 'Identity Number'],
    ['ADDRESS', 'ADDRESS'],
    ['STATE_NAME', 'state'],
    ['COUNTRY_NAME', 'country'],
    ['APPROVAL_STATUS', 'Student Status'],
  ];
  taskurl: any;
  imgUrl = appkeys.retriveimgUrl;
  districts: any = [];
  districtload: boolean;
  isSpinning = false;
  countrys: any;

  pendingsCountsStudent: any;
  registerCountsStudent: any;
  approvedCountsStudent: any;
  rejectsCountsStudent: any;
  blockedCountsStudent: any;
  APPROVAL_STATUS_STUDENT: any = 'ALL';
  showstudentcolor0 = 1;
  showstudentcolor1 = 0;
  showstudentcolor2 = 0;
  showstudentcolor3 = 0;
  showstudentcolor4 = 0;
  screenwidth: any;
  employee = 0;
  yearlist = [];
  classlist = [];
  isAdd = false;
  countryWithStatesAvailable: any;
  showDistrictByState: any = 0;

  Mediumlist: any = [];
  GetMediumData() {
    this.api
      .getAllMediumMaster(
        0,
        0,
        '',
        'asc',
        ' AND STATUS=1  AND SCHOOL_ID = ' +
          Number(sessionStorage.getItem('schoolid'))
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.Mediumlist = data['data'];
          } else {
            this.Mediumlist = [];
          }
        } else {
          this.message.error('Failed To Get Medium Data.', '');
          this.Mediumlist = [];
        }
      });
  }
  getYearClassforExcel() {
    var extraFilter: any = '';
    if (this.roleId == 3 || this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = '';
    }
    this.api
      .getAllYearMaster(0, 0, 'id', 'asc', 'AND STATUS!=false ')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.yearlist = data['data'];
        } else {
          this.message.error('Failed to Get Year List', ``);
        }
      });
    this.api
      .getAllClassMaster(0, 0, '', '', 'AND STATUS!=false' + extraFilter)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.classlist = data['data'];
          // console.log(this.classlist);
        } else {
          this.message.error('Failed to Get Class List', ``);
        }
      });
  }
  Teacherlist: any = [];
  loadTeacher: boolean = false;
  GetTeachersData() {
    this.loadTeacher = true;
    this.api
      .getALLTeacher(
        0,
        0,
        '',
        '',
        ' AND STATUS=1  AND SCHOOL_ID = ' +
          Number(sessionStorage.getItem('schoolid')) +
          ' AND ROLE = "T"'
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.Teacherlist = data['data'];
            this.loadTeacher = false;
          } else {
            this.Teacherlist = [];
            this.loadTeacher = false;
          }
        } else {
          this.message.error('Failed To Get Division Data.', '');
          this.Teacherlist = [];
          this.loadTeacher = false;
        }
      });
  }
  getDivision() {
    this.divisionload = true;
    var extraFilter: any = '';
    // if(
    //   this.roleId==3 || this.roleId==2
    //       ){
    //         extraFilter=" AND SCHOOL_ID = "+ Number(sessionStorage.getItem('schoolid'))
    //       }
    //       else{
    //         extraFilter=''
    //       }
    this.api
      .getAllDivisions(
        0,
        0,
        '',
        '',
        ' AND STATUS=1 AND SCHOOL_ID = ' +
          Number(sessionStorage.getItem('schoolid'))
      )
      .subscribe(
        (division) => {
          if (division.code == 200) {
            this.divisionlist = division['data'];
            this.divisionload = false;
          } else {
            this.message.error('Failed To Get division', '');
            this.divisionload = false;

            this.divisionlist = [];
          }
        },
        (err) => {}
      );
  }
  getQuestionClass() {
    var filterForQuestionClass = '';
    this.loadQuestionClass = true;
    if (this.boardId) {
      filterForQuestionClass = ' AND BOARD_ID= ' + this.boardId;
    } else filterForQuestionClass = '';
    this.api
      .getAllQuestionPaperClassMaster(0, 0, 'id', 'asc', filterForQuestionClass)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.loadQuestionClass = false;
          this.QuestionClassList = data['data'];
        } else {
          this.loadQuestionClass = false;
          this.QuestionClassList = [];
        }
      });
  }

  studentkeyup(event: any) {
    this.studentSearch();
  }
  clickEventStudent(data: any) {
    this.APPROVAL_STATUS_STUDENT = data;
    this.pageIndexStudent = 1;
    this.pageSizeStudent = 10;
    if (this.APPROVAL_STATUS_STUDENT == 'ALL') {
      this.showstudentcolor0 = 1;
      this.showstudentcolor1 = 0;
      this.showstudentcolor2 = 0;
      this.showstudentcolor3 = 0;
      this.showstudentcolor4 = 0;
    } else if (this.APPROVAL_STATUS_STUDENT == 'A') {
      this.showstudentcolor0 = 0;
      this.showstudentcolor1 = 1;
      this.showstudentcolor2 = 0;
      this.showstudentcolor3 = 0;
      this.showstudentcolor4 = 0;
    } else if (this.APPROVAL_STATUS_STUDENT == 'R') {
      this.showstudentcolor0 = 0;
      this.showstudentcolor1 = 0;
      this.showstudentcolor2 = 1;
      this.showstudentcolor3 = 0;
      this.showstudentcolor4 = 0;
    } else if (this.APPROVAL_STATUS_STUDENT == 'P') {
      this.showstudentcolor0 = 0;
      this.showstudentcolor1 = 0;
      this.showstudentcolor2 = 0;
      this.showstudentcolor3 = 1;
      this.showstudentcolor4 = 0;
    } else if (this.APPROVAL_STATUS_STUDENT == 'B') {
      this.showstudentcolor0 = 0;
      this.showstudentcolor1 = 0;
      this.showstudentcolor2 = 0;
      this.showstudentcolor3 = 0;
      this.showstudentcolor4 = 1;
    }
    this.applyFilterStudent();
  }
  applyFilterStudent() {
    this.studentSearch(true);
  }

  studentSearch(reset: boolean = false) {
    if (reset) {
      this.pageIndexStudent = 1;
      this.sortKeyStudent = 'id';
      this.sortValueStudent = 'desc';
    }
    this.loadingRecordsStudent = true;
    var sort: string;
    try {
      sort = this.sortValueStudent.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var statusFilter = '';
    if (
      this.APPROVAL_STATUS_STUDENT != undefined &&
      this.APPROVAL_STATUS_STUDENT != 'ALL'
    ) {
      statusFilter =
        ' AND APPROVAL_STATUS=' + "'" + this.APPROVAL_STATUS_STUDENT + "'";
    } else {
      statusFilter = '';
    }
    var likeQuery = '';
    if (this.searchTextStudent != '') {
      likeQuery = ' AND (';
      this.columnsStudent.forEach((column) => {
        likeQuery +=
          ' ' + column[0] + " like '%" + this.searchTextStudent + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    var extraFilter: any = '';
    if (this.roleId == 3 || this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' +
        Number(sessionStorage.getItem('schoolid')) +
        this.StudentfilterQuery;
    } else {
      extraFilter = '';
    }
    this.api
      .getAllstudents(
        this.pageIndexStudent,
        this.pageSizeStudent,
        this.sortKeyStudent,
        sort,
        likeQuery +
          extraFilter +
          statusFilter +
          " AND ROLE='S'" +
          this.StudentfilterQuery +
          ' AND STATUS=1'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecordsStudent = data['count'];
            this.dataListStudent = data['data'];
            this.loadingRecordsStudent = false;
            // for (var i = 0; i < this.dataListStudent.length; i++) {
            // }
            if (this.dataListStudent.length > 0) {
              this.NextButton = false;
            } else {
              this.NextButton = true;
            }
            if (this.totalRecordsStudent == 0) {
              data.SEQ_NO = 1;
              // this.drawerDataStudent.EMPLOYEE_CODE = '0001';
            } else {
              data.SEQ_NO =
                this.dataListStudent[this.dataListStudent.length - 1][
                  'SEQ_NO'
                ] + 1;
              // let finalreq = parseInt(data['data'][0]['EMPLOYEE_CODE']) + 1;
              // this.drawerDataStudent.EMPLOYEE_CODE = finalreq
              //   .toString()
              //   .padStart(4, '0');
              this.api
                .getStudentsCount(0, 0, '', '', extraFilter + ' AND STATUS=1')
                .subscribe((data) => {
                  if (data['code'] == 200) {
                    this.pendingsCountsStudent = data['data'][0]['PENDING'];
                    this.rejectsCountsStudent = data['data'][0]['REJECTED'];
                    this.registerCountsStudent = data['data'][0]['ALL_COUNT'];
                    this.approvedCountsStudent = data['data'][0]['APPROVED'];
                    this.blockedCountsStudent = data['data'][0]['BLOCKED'];
                  } else {
                  }
                });
            }
          } else {
            this.dataListStudent = [];
            this.message.error('Something Went Wrong', '');
            this.loadingRecordsStudent = false;
          }
        },
        (err) => {}
      );
  }
  filterClassStudent: any = 'filter-invisible';
  StudentfilterQuery: string = '';
  StudentisFilterApplied: string = 'default';
  ClassID: any;
  showFilter() {
    if (this.filterClassStudent === 'filter-visible')
      this.filterClassStudent = 'filter-invisible';
    else this.filterClassStudent = 'filter-visible';
  }
  applyFilterClass() {
    this.loadingRecords = true;
    this.StudentfilterQuery = '';

    if (this.ClassID != null && this.ClassID != undefined && this.ClassID > 0) {
      this.StudentfilterQuery = ' AND CLASS_ID =' + this.ClassID;
    }

    if (
      this.StudentfilterQuery == null ||
      this.StudentfilterQuery == undefined ||
      this.StudentfilterQuery == ''
    ) {
      this.message.error('Please Select Value To Filter Data ..', '');
      this.StudentisFilterApplied = 'default';
      this.filterClassStudent = 'filter-visible';
    } else {
      this.StudentisFilterApplied = 'primary';
      this.studentSearch();
    }
  }

  clearFilter() {
    this.searchTextStudent = '';
    this.ClassID = '';
    this.filterQuery = '';
    this.isFilterApplied = 'default';
    this.filterClassStudent = 'filter-invisible';
    this.studentSearch(true);
  }

  get closeCallback() {
    return this.drawerCloseStudent.bind(this);
  }
  addStudent(): void {
    this.isAdd = true;
    this.isShowBlockedStudent = false;
    this.drawerTitleStudent = 'Create New Student';
    this.drawerDataStudent = new studentmaster();
    this.drawerVisibleStudent = true;
    var extraFilter: any = '';
    if (this.roleId == 3 || this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = '';
    }
    // this.api.getAllstudents(1, 1, 'id', 'desc', extraFilter).subscribe(
    //   (data) => {
    //     if (data['code'] == 200) {
    //       this.loadingRecordsStudent = false;
    //       this.totalRecordsStudent = data['count'];

    //       if (data['count'] == 0) {
    //         this.drawerDataStudent.SEQ_NO = 1;
    //       } else {
    //         this.drawerDataStudent.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
    //       }
    //       this.showDistrictByState = 1;
    //       this.drawerVisibleStudent = true;
    //     } else {
    //       this.loadingRecordsStudent = false;
    //       this.dataListStudent = [];
    //     }
    //   },
    //   (err) => { }
    // );
  }
  isShowBlockedStudent = false;
  States: [] = [];
  countries: any = [];
  showState: any = 0;
  stateload: boolean = false;

  editStudent(data: studentmaster): void {
    this.isAdd = false;
    this.isShowBlockedStudent = true;
    this.drawerTitleStudent = 'Update Student';
    this.drawerDataStudent = Object.assign({}, data);
    this.drawerVisibleStudent = true;
    if (this.drawerDataStudent.PROFILE_PHOTO) {
      this.taskurl =
        this.imgUrl + 'appUserProfile/' + this.drawerDataStudent.PROFILE_PHOTO;
    } else {
      this.taskurl = '';
    }
    if (
      data.COUNTRY_ID != null &&
      data.COUNTRY_ID != undefined &&
      data.COUNTRY_ID != 0
    ) {
      this.countries = [];
      this.showState = 0;
      this.api
        .getALLCountry(
          0,
          0,
          '',
          '',
          ' AND ID =' + this.drawerDataStudent.COUNTRY_ID
        )
        .subscribe(
          (responseCountryData) => {
            if (responseCountryData['code'] == 200) {
              if (responseCountryData['data'].length == 0) {
                this.countries = [];
              } else {
                this.countries = responseCountryData['data'];
                if (this.countries[0]?.['IS_STATE_AVALIBLE'] == 0) {
                  this.showState = 0;
                  this.showDistrictByState = 0;
                  this.drawerVisibleStudent = true;
                } else if (this.countries[0]?.['IS_STATE_AVALIBLE'] == 1) {
                  this.showState = 1;
                  this.showDistrictByState = 1;

                  this.api
                    .getAllStateMaster(
                      0,
                      0,
                      '',
                      '',
                      ' AND STATUS!=false AND COUNTRY_ID = ' +
                        this.drawerDataStudent.COUNTRY_ID
                    )
                    .subscribe(
                      (responseStateData) => {
                        if (responseStateData['code'] == 200) {
                          if (responseStateData['data'].length != 0) {
                            this.States = responseStateData['data'];
                            var stateWithDistrictsAvailable = '';
                            stateWithDistrictsAvailable = this.States.find(
                              (state) => state['ID'] === data.STATE_ID
                            );

                            if (
                              stateWithDistrictsAvailable?.[
                                'IS_DISTRICT_AVALIBLE'
                              ] == 0
                            ) {
                              this.showDistrictByState = 0;
                              this.drawerVisibleStudent = true;
                            } else if (
                              stateWithDistrictsAvailable?.[
                                'IS_DISTRICT_AVALIBLE'
                              ] == 1
                            ) {
                              this.showDistrictByState = 1;

                              this.api
                                .getAllDistrict(
                                  0,
                                  0,
                                  '',
                                  '',
                                  ' AND STATUS!=false AND STATE_ID = ' +
                                    this.drawerDataStudent.STATE_ID
                                )
                                .subscribe(
                                  (responseData) => {
                                    if (responseData['code'] == 200) {
                                      this.districts = responseData['data'];
                                      this.drawerVisibleStudent = true;
                                    } else {
                                      this.districts = [];
                                    }
                                  },
                                  (err) => {}
                                );
                            }
                          } else {
                            this.drawerVisibleStudent = true;
                            this.States = [];
                          }
                        } else {
                          this.States = [];
                        }
                        this.stateload = false;
                      },
                      (err) => {
                        this.stateload = false;
                      }
                    );
                }
              }
            } else {
              this.countries = [];
            }
          },
          (err) => {
            // Handle error if necessary
          }
        );
    } else {
    }
  }

  drawerCloseStudent(): void {
    this.studentSearch();
    this.drawerVisibleStudent = false;
  }

  sortStudent(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

    this.pageIndexStudent = pageIndex;
    this.pageSizeStudent = pageSize;

    if (this.pageSizeStudent != pageSize) {
      this.pageIndexStudent = 1;
      this.pageSizeStudent = pageSize;
    }

    if (this.sortKeyStudent != sortField) {
      this.pageIndexStudent = 1;
      this.pageSizeStudent = pageSize;
    }

    this.sortKeyStudent = sortField;
    this.sortValueStudent = sortOrder;
    this.studentSearch();
  }

  exceldraweropen() {
    this.exceldrawervisible = true;
    this.dataMappingStudent = new studentmapping();
    this.exceldrawerTitle = `Import Students`;
  }

  exceldrawervisible = false;
  exceldrawerTitle = '';
  exceldrawerClose() {
    this.exceldrawervisible = false;
    this.clear();
    this.studentSearch();
  }

  arrayofheader: any;
  arrayofData: any;
  // loadingRecordsStudent = false;
  ExcelData: any;
  FinalFileurl: any;
  FILE_NAME: any;
  FileSelect(event: any) {
    this.loadingRecordsStudent = true;

    if (
      event.target.files[0].type == 'application/excel' ||
      event.target.files[0].type == 'application/x-excel' ||
      event.target.files[0].type == 'application/x-msexcel' ||
      event.target.files[0].type == 'application/vnd.ms-excel' ||
      event.target.files[0].type ==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      // let file = event.target.files[0];

      this.FinalFileurl = <File>event.target.files[0];

      let fileReader = new FileReader();

      fileReader.readAsBinaryString(this.FinalFileurl);
      this.loadingRecordsStudent = true;
      fileReader.onload = (e) => {
        var workBook = XLSX.read(fileReader.result, { type: 'binary' });
        var sheetName = workBook.SheetNames;
        var headers = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName[0]], {
          header: 1,
        });
        const json = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName[0]]);
        this.ExcelData = [...json];
        this.arrayofheader = headers[0];
        //
        this.loadingRecordsStudent = false;

        if (this.FinalFileurl != null) {
          var number = Math.floor(100000 + Math.random() * 900000);
          var fileExt = this.FinalFileurl.name.split('.').pop();
          var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
          var url = '';
          url = d == null ? '' : d + number + '.' + fileExt;
          if (this.FILE_NAME != undefined && this.FILE_NAME.trim() != '') {
            var arr = this.FILE_NAME.split('/');
            if (arr.length > 1) {
              url = arr[5];
            }
          }
          this.FILE_NAME = url;
          if (this.ExcelData.length == 0) {
            this.message.warning('Excel Is Empty', '');
            this.FILE_NAME = null;
          }
          // this.isSpinning = true;
        }
      };
    } else {
      this.message.error('Please Select Only Excel File', '');
      this.FinalFileurl = null;
      this.FILE_NAME = null;
    }
  }

  @ViewChild('fileInput') myFileInput!: ElementRef;
  clear() {
    this.myFileInput.nativeElement.value = '';
    this.FILE_NAME = null;
  }
  excelLoading: boolean = false;
  confirmStudentData() {
    this.excelLoading = true;
    this.api
      .ExcelonUpload('studentExcel', this.FinalFileurl, this.FILE_NAME)
      .subscribe((successCode) => {
        if (successCode.code == 200) {
          this.api
            .importStudent(
              this.FILE_NAME,
              this.dataMappingStudent.CLASS_ID,
              this.dataMappingStudent.YEAR_ID,
              Number(sessionStorage.getItem('schoolid')),
              this.dataMappingStudent.DIVISION_ID,
              this.dataMappingStudent.MEDIUM_ID
            )
            .subscribe(
              (data) => {
                if (data['code'] == 200) {
                  this.message.success(' Data Uploaded Successfully ', '');
                  this.isSpinning = false;
                  this.excelLoading = false;

                  // this.studentSearch();
                  this.exceldrawerClose();
                } else if (data['code'] == 300) {
                  this.message.error(' Duplicate Mobile Number', '');
                  this.excelLoading = false;
                } else if (data['code'] == 302) {
                  this.message.error('No Data In Excel .. ', '');
                  this.excelLoading = false;
                } else {
                  this.message.error(' Failed To Upload Data ', '');
                }
              },
              (err) => {
                this.message.error(' Failed To Upload Data ', '');
                this.isSpinning = false;
              }
            );
        } else {
          this.message.error(' Failed To Upload Data ', '');
          this.isSpinning = false;
        }
      });
  }

  cancel() {
    //
  }

  // Model Data
  StudentData: number = 0;
  isVisible12 = false;
  nzOkLoading = false;
  modelLoading = false;
  showMapandClosebutton: boolean = true;
  showData: any;
  MapClass(data: studentmaster) {
    this.showData = '';
    this.StudentData = data.ID;
    this.modelLoading = true;
    this.api
      .getallMappedClass(
        0,
        0,
        '',
        '',
        ' AND STUDENT_ID = ' + data.ID + ' AND STATUS=1'
      )
      .subscribe((data) => {
        if (data['code'] == 200 && data['count'] > 0) {
          //
          this.modelLoading = false;
          this.showData = Object.assign({}, data['data'][0]);
          //
          if (
            (this.dataMappingStudent.CLASS_ID != undefined ||
              this.dataMappingStudent.CLASS_ID != null) &&
            (this.dataMappingStudent.ROLL_NUMBER != undefined ||
              this.dataMappingStudent.ROLL_NUMBER != null) &&
            (this.dataMappingStudent.YEAR_ID != undefined ||
              this.dataMappingStudent.YEAR_ID != null) &&
            (this.dataMappingStudent.DIVISION_ID != undefined ||
              this.dataMappingStudent.DIVISION_ID != null)
          ) {
            this.showMapandClosebutton = false;
            // if(this.dataMappingStudent.DIVISION_ID==0){
            //   this.dataMappingStudent.DIVISION_ID=this.dataMappingStudent.DIVISION_ID.toString()
            // }
            // else{
            //   this.dataMappingStudent.DIVISION_ID=this.dataMappingStudent.DIVISION_ID
            // }
            this.modelLoading = false;
          } else {
            this.showMapandClosebutton = true;
            this.modelLoading = false;
          }
        } else if (data['count'] == 0) {
          this.modelLoading = false;
          this.showMapandClosebutton = true;
        } else if (data['code'] != 200) {
          this.message.error(
            'Something Went Wrong While Getting Mapped Data',
            ''
          );
          this.modelLoading = false;
        }
      });

    this.isVisible12 = true;
  }

  isOk = true;
  drawerVisibleMap!: boolean;
  drawerTitleMap!: string;
  classId;
  classNAME;
  addFeeMap(data): void {
    this.drawerTitleMap = 'Student Wise Fee Mapping';
    this.classId = data.ID;
    this.classNAME = data.NAME;
    this.drawerVisibleMap = true;
  }

  drawerCloseMap(): void {
    this.clickEventStudent('ALL');
    this.drawerVisibleMap = false;
  }
  get closeCallbackMap() {
    return this.drawerCloseMap.bind(this);
  }

  switchValue = true;

  handleOk(): void {
    this.switchValue = true;

    this.isOk = true;
    if (
      (this.dataMappingStudent.YEAR_ID == undefined ||
        this.dataMappingStudent.YEAR_ID == null ||
        this.dataMappingStudent.YEAR_ID <= 0) &&
      (this.dataMappingStudent.CLASS_ID == undefined ||
        this.dataMappingStudent.CLASS_ID == null ||
        this.dataMappingStudent.CLASS_ID <= 0) &&
      (this.dataMappingStudent.DIVISION_ID == undefined ||
        this.dataMappingStudent.DIVISION_ID == null ||
        this.dataMappingStudent.DIVISION_ID < 0) &&
      (this.dataMappingStudent.ROLL_NUMBER == null ||
        this.dataMappingStudent.ROLL_NUMBER == undefined ||
        this.dataMappingStudent.ROLL_NUMBER <= 0)
    ) {
      this.isOk = false;
      this.message.error('Please Input All Required Data', '');
    } else if (
      this.dataMappingStudent.YEAR_ID == undefined ||
      this.dataMappingStudent.YEAR_ID == null ||
      this.dataMappingStudent.YEAR_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Year', '');
    } else if (
      this.dataMappingStudent.CLASS_ID == undefined ||
      this.dataMappingStudent.CLASS_ID == null ||
      this.dataMappingStudent.CLASS_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Class', '');
    } else if (
      this.dataMappingStudent.DIVISION_ID == undefined ||
      this.dataMappingStudent.DIVISION_ID == null ||
      this.dataMappingStudent.DIVISION_ID < 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Division', '');
    } else if (
      this.dataMappingStudent.MEDIUM_ID == undefined ||
      this.dataMappingStudent.MEDIUM_ID == null ||
      this.dataMappingStudent.MEDIUM_ID < 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Medium', '');
    } else if (
      this.dataMappingStudent.ROLL_NUMBER == null ||
      this.dataMappingStudent.ROLL_NUMBER == undefined ||
      this.dataMappingStudent.ROLL_NUMBER <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Roll Number.', '');
    } else {
      this.switchValue = false;
    }
  }
  finalstudentconfirm() {
    if (this.isOk) {
      this.nzOkLoading = true;

      const data = {
        STUDENT_ID: this.StudentData,
        CLASS_ID: this.dataMappingStudent.CLASS_ID,
        YEAR_ID: this.dataMappingStudent.YEAR_ID,
        ROLL_NUMBER: Number(this.dataMappingStudent.ROLL_NUMBER),
        DIVISION_ID: Number(this.dataMappingStudent.DIVISION_ID),
        MEDIUM_ID: Number(this.dataMappingStudent.MEDIUM_ID),
        // SCHOOL_ID:Number(sessionStorage.getItem('schoolid'))
      };
      this.api.MapClass(data).subscribe(
        (successCode) => {
          if (successCode.code == 200) {
            this.message.success(' Class Mapping Completed', '');
            this.isVisible12 = false;
            this.close();
            this.nzOkLoading = false;
          } else if (successCode.code == 300) {
            this.message.error('Fee Details For Given Student Not Found', '');
            this.isVisible12 = true;
            this.nzOkLoading = false;
          } else {
            this.message.error(' Class Mapping Failed', '');
            this.isVisible12 = true;
            this.nzOkLoading = false;
          }
        },
        (err) => {
          this.nzOkLoading = false;
        }
      );
    }
  }
  close() {
    this.dataMappingStudent = new studentmapping();
  }
  mapClassHandleCancel(): void {
    this.close();
    this.isVisible12 = false;
  }
  studentPreviewVisible = false;
  STUDENT_DATALIST: any;
  APPROVAL_STATUS1: any = 'A';
  submitstudentstatusisSpinning: boolean = false;
  StudentStatusButton: any;

  studentPreview(data1: studentmaster) {
    this.StudentStatusButton = data1.APPROVAL_STATUS;

    this.STUDENT_DATALIST = Object.assign({}, data1);
    //
    if (data1.PROFILE_PHOTO) {
      this.taskurl = this.imgUrl + 'appUserProfile/' + data1.PROFILE_PHOTO;
      //
    }
    this.studentPreviewVisible = true;
  }

  SubmitStudentStatus() {
    let isOk = true;

    if (
      this.STUDENT_DATALIST.APPROVAL_STATUS == undefined ||
      this.STUDENT_DATALIST.APPROVAL_STATUS == null ||
      this.STUDENT_DATALIST.APPROVAL_STATUS == 'P'
    ) {
      isOk = false;
      this.message.error('Please Select Student Status', '');
    } else if (
      this.STUDENT_DATALIST.APPROVAL_STATUS == 'R' &&
      (this.STUDENT_DATALIST.REJECT_BLOCKED_REMARK == undefined ||
        this.STUDENT_DATALIST.REJECT_BLOCKED_REMARK == '' ||
        this.STUDENT_DATALIST.REJECT_BLOCKED_REMARK.trim() == '')
    ) {
      isOk = false;
      this.message.error('Please Enter Reject Remark', '');
    }

    if (isOk) {
      //
      this.STUDENT_DATALIST['YEAR_ID'] = Number(
        sessionStorage.getItem('yearId')
      );
      this.api.studentAprroveReject(this.STUDENT_DATALIST).subscribe((data) => {
        if (data['code'] == 200) {
          this.message.success(' Student Status Submitted successfully...', '');
          this.clickEventStudent('ALL');
          this.submitstudentstatusisSpinning = false;
          this.studentPreviewVisible = false;
        } else if (data['code'] == 300) {
          this.message.error('Fee Details For Given Student Not Found', '');
          this.submitstudentstatusisSpinning = false;
          this.studentPreviewVisible = false;
        } else {
          this.message.error('Student Status Submission Failed...', '');
          this.submitstudentstatusisSpinning = false;
        }
      });
    } else {
      // this.message.error('No Data To Submit ...', '');

      this.submitstudentstatusisSpinning = false;
    }
  }
  studentHandleCancel() {
    this.studentPreviewVisible = false;
  }

  ////////////////////////////////////////  Student Table //////////////////////////////////////////////
  ////////////////////////////////////////  Student Drawer //////////////////////////////////////////////
  drawerVisible: boolean = false;
  studentIsSpinning: boolean = false;
  // cities = [];
  // districts = [];
  // countries = [];
  // states = [];
  countryload: boolean;

  cityload: boolean;
  citys: any;

  closeStudent(): void {
    this.studentSearch();
    this.drawerVisibleStudent = false;
  }

  getallCountry() {
    this.countryload = true;
    this.api.getALLCountry(0, 0, '', '', ' AND STATUS!=false ').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.countrys = data['data'];
          this.countryload = false;
          // this.getallStates(this.data.COUNTRY_ID);
        } else {
          this.countrys = [];
          this.countryload = false;
        }
      },
      (err) => {
        this.countryload = false;
      }
    );
  }

  showDistrictByCountry: any = 0;

  getallStates(data: any) {
    if (this.drawerDataStudent.STATE_ID != null) {
      this.drawerDataStudent.STATE_ID = '0';
      this.drawerDataStudent.DISTRICT_ID = '0';
      this.drawerDataStudent.DISTRICT_NAME = '';
      this.drawerDataStudent.STATE_NAME = '';
    } else {
    }
    if (data) {
      this.countryWithStatesAvailable = this.countrys.find(
        (country) => country['ID'] === data
      );
      if (this.countryWithStatesAvailable['IS_STATE_AVALIBLE'] == 0) {
        this.showState = 0;
        this.showDistrictByState = 0;
      } else if (this.countryWithStatesAvailable['IS_STATE_AVALIBLE'] == 1) {
        this.showState = 1;

        this.showDistrictByState = 1;
      }
    }

    // console.log(this.countrys);

    if (
      !this.countryWithStatesAvailable ||
      this.countryWithStatesAvailable['IS_STATE_AVALIBLE'] === false
    ) {
    } else {
      this.stateload = true;
      this.api
        .getAllStateMaster(
          0,
          0,
          '',
          '',
          ' AND STATUS!=false AND COUNTRY_ID = ' + data
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.States = data['data'];
              this.stateload = false;
              this.getALlDistrict(this.drawerDataStudent.STATE_ID);
            } else {
              this.States = [];
              this.stateload = false;
            }
          },
          (err) => {
            this.stateload = false;
          }
        );
    }
  }

  stateWithDistrictsAvailable: any;
  getALlDistrict(data: any) {
    if (this.drawerDataStudent.DISTRICT_ID != null) {
      this.drawerDataStudent.DISTRICT_ID = '0';
      this.drawerDataStudent.DISTRICT_NAME = '';
    } else {
    }
    this.stateWithDistrictsAvailable = this.States.find(
      (state) => state['ID'] === data
    );
    if (this.stateWithDistrictsAvailable['IS_DISTRICT_AVALIBLE'] == 0) {
      this.showDistrictByState = 0;
    } else if (this.stateWithDistrictsAvailable['IS_DISTRICT_AVALIBLE'] == 1) {
      this.showDistrictByState = 1;
    }

    if (
      !this.stateWithDistrictsAvailable ||
      this.stateWithDistrictsAvailable['IS_DISTRICT_AVALIBLE'] === false
    ) {
    } else {
      this.districtload = true;
      this.api
        .getAllDistrict(
          0,
          0,
          '',
          '',
          ' AND STATUS!=false AND STATE_ID = ' + data
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.districts = data['data'];
              this.districtload = false;
            } else {
              this.districts = [];
              this.districtload = false;
            }
          },
          (err) => {
            this.districtload = false;
          }
        );
    }
  }
  // getAllCity(data: any) {
  //   console.log(data.ID);

  //   this.cityload = true;
  //   this.api
  //     .getAllCityMaster(
  //       0,
  //       0,
  //       '',
  //       '',
  //       ' AND STATUS!=false AND DISTRICT_ID = ' + data
  //     )
  //     .subscribe(
  //       (data) => {
  //         if (data['code'] == 200) {
  //           this.citys = data['data'];
  //           this.cityload = false;
  //         } else {
  //           this.citys = [];
  //           this.cityload = false;
  //         }
  //       },
  //       (err) => {
  //         this.cityload = false;
  //       }
  //     );
  // }
  fileList2: any;
  progressBarProfilePhoto: boolean = false;
  percentProfilePhoto = 0;
  timerThree: any;
  onFileSelectedProfile(event: any) {
    this.fileList2 = <File>event.target.files[0];

    if (
      (event.target.files[0].type == 'image/jpeg' ||
        event.target.files[0].type == 'image/jpg' ||
        event.target.files[0].type == 'image/png') &&
      event.target.files[0].size < 10240000
    ) {
      const img = new Image();
      const reader = new FileReader();

      img.src = window.URL.createObjectURL(event.target.files[0]);

      img.onload = () => {
        // console.log(img.width,img.height)
        if (img.width < 400 && img.height < 400) {
          const number = Math.floor(100000 + Math.random() * 900000);
          const fileExt = this.fileList2.name.split('.').pop();
          const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
          let url: any = '';
          url = d == null ? '' : d + number + '.' + fileExt.toLowerCase();
          if (
            this.drawerDataStudent.PROFILE_PHOTO != undefined &&
            this.drawerDataStudent.PROFILE_PHOTO.trim() != ''
          ) {
            const arr = this.drawerDataStudent.PROFILE_PHOTO.split('/');
            if (arr.length > 1) {
              url = arr[5];
            }
          }

          this.studentIsSpinning = true;
          this.progressBarProfilePhoto = true;
          this.timerThree = this.api
            .onUpload('appUserProfile', this.fileList2, url)
            .subscribe((res) => {
              if (res.type === HttpEventType.Response) {
              }
              if (res.type === HttpEventType.UploadProgress) {
                const percentDone = Math.round((100 * res.loaded) / res.total);
                this.percentProfilePhoto = percentDone;
                if (this.percentProfilePhoto == 100) {
                  this.studentIsSpinning = false;
                }
              } else if (res.type == 2 && res.status != 200) {
                this.message.error('Failed To Upload Image...', '');
                this.studentIsSpinning = false;
                this.progressBarProfilePhoto = false;
                this.percentProfilePhoto = 0;
                this.drawerDataStudent.PROFILE_PHOTO = null;
                this.taskurl = '';
              } else if (res.type == 4 && res.status == 200) {
                if (res.body['code'] == 200) {
                  this.message.success('Image Uploaded Successfully...', '');
                  this.studentIsSpinning = false;
                  this.drawerDataStudent.PROFILE_PHOTO = url;
                  this.taskurl =
                    this.imgUrl +
                    'appUserProfile/' +
                    this.drawerDataStudent.PROFILE_PHOTO;
                } else {
                  this.studentIsSpinning = false;
                }
              }
            });
        } else {
          this.message.error(
            'Image dimensions must be less than 400 x 400 pixels.',
            ''
          );
          this.fileList2 = null;
          this.drawerDataStudent.PROFILE_PHOTO = null;
        }
      };
    } else {
      this.message.error(
        'Please Select Only JPEG/JPG/PNG Extension and file size less than 10MB.',
        ''
      );
      this.fileList2 = null;
    }
  }
  deleteProfileConfirm(data) {
    this.studentIsSpinning = true;
    if (this.drawerDataStudent.ID) {
      this.api
        .deletePdf('appUserProfile/' + data.PROFILE_PHOTO)
        .subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.drawerDataStudent.PROFILE_PHOTO = null;
            this.api
              .updateStudent(this.drawerDataStudent)
              .subscribe((updateCode) => {
                if (updateCode.code == '200') {
                  this.studentIsSpinning = false;
                } else {
                  this.message.error(' Image Has Not Saved...', '');
                  this.studentIsSpinning = false;
                }
              });
            this.message.success(' Image deleted...', '');
          } else {
            this.message.error(' Image Has Not Deleted...', '');
            this.studentIsSpinning = false;
          }
        });
    } else {
      this.drawerDataStudent.PROFILE_PHOTO = null;
      data.PROFILE_PHOTO = null;
      this.studentIsSpinning = false;
    }
  }
  deleteProfileCancel(): void {}
  studentSave(addNew: boolean, studentPage: NgForm): void {
    this.studentIsSpinning = false;
    this.isOk = true;
    if (this.drawerDataStudent.DOB) {
      this.drawerDataStudent.DOB = this.datePipe.transform(
        this.drawerDataStudent.DOB,
        'yyyy-MM-dd'
      );
    }
    if (
      (this.drawerDataStudent.NAME == undefined ||
        this.drawerDataStudent.NAME == null ||
        this.drawerDataStudent.NAME.trim() == '') &&
      (this.drawerDataStudent.DOB == undefined ||
        this.drawerDataStudent.DOB == null) &&
      (this.drawerDataStudent.MOBILE_NUMBER <= 0 ||
        this.drawerDataStudent.MOBILE_NUMBER == null ||
        this.drawerDataStudent.MOBILE_NUMBER == undefined) &&
      (this.drawerDataStudent.GENDER == '' ||
        this.drawerDataStudent.GENDER == null ||
        this.drawerDataStudent.GENDER == undefined) &&
      // (this.drawerDataStudent.SEQ_NO != undefined ||
      //   this.drawerDataStudent.SEQ_NO != null ||
      //   this.drawerDataStudent.SEQ_NO <= 0) &&
      (this.drawerDataStudent.ADDRESS == undefined ||
        this.drawerDataStudent.ADDRESS == null ||
        this.drawerDataStudent.ADDRESS.trim() == '') &&
      (this.drawerDataStudent.STATE_ID == undefined ||
        this.drawerDataStudent.STATE_ID == null ||
        this.drawerDataStudent.STATE_NAME == '') &&
      (this.drawerDataStudent.DISTRICT_ID == undefined ||
        this.drawerDataStudent.DISTRICT_ID == null ||
        this.drawerDataStudent.DISTRICT_NAME == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.drawerDataStudent.NAME == null ||
      this.drawerDataStudent.NAME.trim() == '' ||
      this.drawerDataStudent.NAME == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Student Name', '');
    } else if (
      this.drawerDataStudent.MOBILE_NUMBER == null ||
      this.drawerDataStudent.MOBILE_NUMBER == undefined ||
      this.drawerDataStudent.MOBILE_NUMBER <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Mobile Number.', '');
    } else if (
      !this.commonFunction.mobpattern.test(
        this.drawerDataStudent.MOBILE_NUMBER.toString()
      )
    ) {
      this.isOk = false;
      this.message.error('Please Enter Valid Mobile Number.', '');
    } else if (
      this.drawerDataStudent.PASSWORD == undefined ||
      this.drawerDataStudent.PASSWORD == null ||
      this.drawerDataStudent.PASSWORD == '' ||
      this.drawerDataStudent.PASSWORD == ' '
    ) {
      this.isOk = false;
      this.message.error('Please Enter Password', '');
    } else if (
      this.drawerDataStudent.DOB == undefined ||
      this.drawerDataStudent.DOB == null
    ) {
      this.isOk = false;
      this.message.error(' Please Select Birth Date ', '');
    } else if (
      this.drawerDataStudent.GENDER == undefined ||
      this.drawerDataStudent.GENDER == null ||
      this.drawerDataStudent.GENDER.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Gender ', '');

      // } else if (
      //   this.drawerDataStudent.IDENTITY_NUMBER == '' ||
      //   this.drawerDataStudent.IDENTITY_NUMBER == null ||
      //   this.drawerDataStudent.IDENTITY_NUMBER == undefined
      // ) {
    }
    // else if (
    //   this.drawerDataStudent.SEQ_NO == undefined ||
    //   this.drawerDataStudent.SEQ_NO == null ||
    //   this.drawerDataStudent.SEQ_NO <= 0
    // ) {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Sequence Number ', '');
    // }
    // else if (
    //   this.isShowBlocked &&
    //   this.drawerDataStudent.APPROVAL_STATUS == undefined ||
    //   this.drawerDataStudent.APPROVAL_STATUS == null
    // ) {
    //   this.isOk = false;
    //   this.message.error(' Please Select Student Status ', '');
    // }
    else if (
      this.drawerDataStudent.APPROVAL_STATUS == 'R' &&
      (this.drawerDataStudent.REJECT_BLOCKED_REMARK == null ||
        this.drawerDataStudent.REJECT_BLOCKED_REMARK == undefined ||
        this.drawerDataStudent.REJECT_BLOCKED_REMARK == '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Reject Remark', '');
    } else if (
      this.drawerDataStudent.APPROVAL_STATUS == 'B' &&
      (this.drawerDataStudent.REJECT_BLOCKED_REMARK == null ||
        this.drawerDataStudent.REJECT_BLOCKED_REMARK == undefined ||
        this.drawerDataStudent.REJECT_BLOCKED_REMARK == '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Blocked Remark', '');
    } else if (
      this.drawerDataStudent.ADDRESS == undefined ||
      this.drawerDataStudent.ADDRESS == null ||
      this.drawerDataStudent.ADDRESS.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Address ', '');
    } else if (
      this.drawerDataStudent.COUNTRY_ID == undefined ||
      this.drawerDataStudent.COUNTRY_ID == null ||
      this.drawerDataStudent.COUNTRY_ID <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Country', '');
    } else if (
      (this.drawerDataStudent.STATE_ID == undefined ||
        this.drawerDataStudent.STATE_ID == null ||
        this.drawerDataStudent.STATE_ID <= 0) &&
      this.showState == 1
    ) {
      this.isOk = false;
      this.message.error(' Please Select State', '');
    } else if (
      (this.drawerDataStudent.STATE_NAME == undefined ||
        this.drawerDataStudent.STATE_NAME == null ||
        this.drawerDataStudent.STATE_NAME == '') &&
      this.showState == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Enter State', '');
    } else if (
      (this.drawerDataStudent.DISTRICT_ID == undefined ||
        this.drawerDataStudent.DISTRICT_ID == null ||
        this.drawerDataStudent.DISTRICT_ID <= 0) &&
      this.showDistrictByState == 1
    ) {
      this.isOk = false;
      this.message.error(' Please Select District', '');
    } else if (
      (this.drawerDataStudent.DISTRICT_NAME == undefined ||
        this.drawerDataStudent.DISTRICT_NAME == null ||
        this.drawerDataStudent.DISTRICT_NAME == '') &&
      this.showDistrictByState == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Enter District', '');
    } else if (
      (this.drawerDataStudent.YEAR_ID == undefined ||
        this.drawerDataStudent.YEAR_ID == null ||
        this.drawerDataStudent.YEAR_ID <= 0) &&
      this.isAdd
    ) {
      this.isOk = false;
      this.message.error('Please Select Year', '');
    } else if (
      (this.drawerDataStudent.CLASS_ID == undefined ||
        this.drawerDataStudent.CLASS_ID == null ||
        this.drawerDataStudent.CLASS_ID <= 0) &&
      this.isAdd
    ) {
      this.isOk = false;
      this.message.error('Please Select Class', '');
    } else if (
      (this.drawerDataStudent.DIVISION_ID == undefined ||
        this.drawerDataStudent.DIVISION_ID == null ||
        this.drawerDataStudent.DIVISION_ID < 0) &&
      this.isAdd
    ) {
      this.isOk = false;
      this.message.error('Please Select Division', '');
    } else if (
      (this.drawerDataStudent.MEDIUM_ID == undefined ||
        this.drawerDataStudent.MEDIUM_ID == null ||
        this.drawerDataStudent.MEDIUM_ID < 0) &&
      this.isAdd
    ) {
      this.isOk = false;
      this.message.error('Please Select Medium', '');
    } else if (
      (this.drawerDataStudent.ROLL_NUMBER == null ||
        this.drawerDataStudent.ROLL_NUMBER == undefined ||
        this.drawerDataStudent.ROLL_NUMBER <= 0) &&
      this.isAdd
    ) {
      this.isOk = false;
      this.message.error('Please Enter Roll Number.', '');
    }

    if (this.isOk) {
      this.studentIsSpinning = true;

      this.drawerDataStudent.SCHOOL_ID = Number(
        sessionStorage.getItem('schoolid')
      );

      if (this.drawerDataStudent.ID) {
        this.api
          .updateStudent(this.drawerDataStudent)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(
                ' Student Information Updated Successfully...',
                ''
              );
              if (!addNew) this.drawerCloseStudent();
              this.studentIsSpinning = false;
            } else if (successCode.code == '300') {
              this.message.error(
                'Mobile Number or Email ID Already Exist...',
                ''
              );
              this.studentIsSpinning = false;
            } else {
              this.message.error(
                ' Failed To Update Student Information...',
                ''
              );
              this.studentIsSpinning = false;
            }
          });
      } else {
        var data = {
          studentData: [this.drawerDataStudent],
          ROLE: 'S',
          CLASS_ID: this.drawerDataStudent.CLASS_ID,
          YEAR_ID: this.drawerDataStudent.YEAR_ID,
          SCHOOL_ID: this.drawerDataStudent.SCHOOL_ID,
          DIVISION_ID: this.drawerDataStudent.DIVISION_ID,
          MEDIUM_ID: this.drawerDataStudent.MEDIUM_ID,
        };
        this.api.createStudent(data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' Student Information Save Successfully...',
              ''
            );
            if (!addNew) this.drawerCloseStudent();
            else {
              this.drawerDataStudent = new studentmaster();
              this.resetDrawerStudent(studentPage);
              // this.api
              //   .getAllstudents(
              //     1,
              //     1,
              //     '',
              //     'desc',
              //     'AND SCHOOL_ID =' +
              //     Number(sessionStorage.getItem('schoolid'))
              //   )
              //   .subscribe(
              //     (data) => {
              //       if (data['code'] == 200) {
              //         if (data['count'] == 0) {
              //           this.drawerDataStudent.SEQ_NO = 1;
              //         } else {
              //           this.drawerDataStudent.SEQ_NO =
              //             data['data'][0]['SEQ_NO'] + 1;
              //         }
              //       } else {
              //       }
              //     },
              //     (err) => { }
              //   );
            }
            this.studentIsSpinning = false;
          } else if (successCode.code == '300') {
            this.message.error(
              'Mobile Number or Email ID Already Exist...',
              ''
            );
            this.studentIsSpinning = false;
          } else {
            this.message.error(' Failed To Save Student Information...', '');
            this.studentIsSpinning = false;
          }
        });
      }
    }
  }

  open5YearAgo(event) {
    if (!this.drawerDataStudent.ID) {
      if (
        this.drawerDataStudent.DOB == null ||
        this.drawerDataStudent.DOB == undefined ||
        this.drawerDataStudent.DOB == ''
      ) {
        var defaultDate = new Date();
        var bod = defaultDate.setFullYear(defaultDate.getFullYear() - 5);
        this.drawerDataStudent.DOB = bod;
      }
    } else if (
      this.drawerDataStudent.DOB == null ||
      this.drawerDataStudent.DOB == undefined ||
      this.drawerDataStudent.DOB == ''
    ) {
      var defaultDate = new Date();
      var bod = defaultDate.setFullYear(defaultDate.getFullYear() - 5);
      this.drawerDataStudent.DOB = bod;
    }
  }
  resetDrawerStudent(studentPage: NgForm) {
    this.drawerDataStudent = new studentmaster();
    studentPage.form.markAsPristine();
    studentPage.form.markAsUntouched();
  }

  ////////////////////////////////////////  Student Drawer //////////////////////////////////////////////
  ////////////////////////////////////////  Fee Head Table //////////////////////////////////////////////

  drawerVisibleFeeHead: boolean = false;
  drawerTitleFeeHead!: string;
  feeHeadDrawerData: HeadMasterData = new HeadMasterData();
  formTitle = 'Manage Fee Head';
  feeHeaddataList: any = [];
  feeHeadloadingRecords = false;
  feeHeadtotalRecords = 1;
  feeHeadpageIndex = 1;
  feeHeadpageSize = 10;
  feeHeadsortValue: string = 'desc';
  feeHeadsortKey: string = 'NAME';
  feeHeadsearchText: string = '';
  feeHeadColumns: string[][] = [['NAME', 'NAME']];

  feeHeadKeyUp(event: any) {
    this.searchFeeHead();
  }
  searchFeeHead(reset: boolean = false) {
    if (reset) {
      this.feeHeadpageIndex = 1;
      this.feeHeadsortKey = 'id';
      this.feeHeadsortValue = 'desc';
    }
    var sort: string;
    try {
      sort = this.feeHeadsortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';
    if (this.feeHeadsearchText != '') {
      likeQuery = ' AND(';
      this.feeHeadColumns.forEach((column) => {
        likeQuery +=
          ' ' + column[0] + " like '%" + this.feeHeadsearchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    this.feeHeadloadingRecords = true;
    var extraFilter: any = '';
    if (this.roleId == 3 || this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = '';
    }
    this.api
      .getHeadData(
        this.feeHeadpageIndex,
        this.feeHeadpageSize,
        this.feeHeadsortKey,
        sort,
        extraFilter + likeQuery + ' AND STATUS=1'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.feeHeadloadingRecords = false;
            this.feeHeadtotalRecords = data['count'];
            this.feeHeaddataList = data['data'];
            if (this.feeHeaddataList.length > 0) {
              this.NextButton = false;
            } else {
              this.NextButton = true;
            }
          } else {
            this.feeHeadloadingRecords = false;
            this.feeHeaddataList = [];
            this.message.error('Something Went Wrong ...', '');
          }
        },
        (err) => {}
      );
  }

  feeHeadSort(params: NzTableQueryParams) {
    this.feeHeadloadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.feeHeadpageIndex = pageIndex;
    this.feeHeadpageSize = pageSize;

    if (this.feeHeadpageSize != pageSize) {
      this.feeHeadpageIndex = 1;
      this.feeHeadpageSize = pageSize;
    }

    if (this.feeHeadsortKey != sortField) {
      this.feeHeadpageIndex = 1;
      this.feeHeadpageSize = pageSize;
    }

    this.feeHeadsortKey = sortField;
    this.feeHeadsortValue = sortOrder;
    this.searchFeeHead();
  }

  addFeeHead(): void {
    this.drawerTitleFeeHead = 'Create New Fee Head';
    this.feeHeadDrawerData = new HeadMasterData();
    this.drawerVisibleFeeHead = true;
  }

  itemTypeVisible;
  editFeeHead(data: HeadMasterData): void {
    this.drawerTitleFeeHead = 'Update Fee Head';
    this.feeHeadDrawerData = Object.assign({}, data);

    this.drawerVisibleFeeHead = true;
  }

  feeHeadDrawerClose(): void {
    this.searchFeeHead();
    this.drawerVisibleFeeHead = false;
  }

  get closeCallbackfeehead() {
    return this.feeHeadDrawerClose.bind(this);
  }

  ////////////////////////////////////////  Fee Head Table //////////////////////////////////////////////
  ////////////////////////////////////////  Fee Head Drawer //////////////////////////////////////////////
  isSpinningFeeHead = false;
  isOkFeeHead = true;
  ParentData: any = [];

  feeHeadResetDrawer(feeHeadPage: NgForm) {
    this.feeHeadDrawerData = new HeadMasterData();
    feeHeadPage.form.markAsPristine();
    feeHeadPage.form.markAsUntouched();
  }
  feeHeadClose() {
    this.feeHeadDrawerClose();
  }

  feeHeadsave(addNew: boolean, feeHeadPage: NgForm): void {
    this.isSpinningFeeHead = false;
    this.isOkFeeHead = true;
    if (
      this.feeHeadDrawerData.NAME == null ||
      this.feeHeadDrawerData.NAME == undefined ||
      this.feeHeadDrawerData.NAME.trim() == ''
    ) {
      this.isOkFeeHead = false;
      this.message.error(' Please Enter Fee Head Name.', '');
    }

    if (this.isOkFeeHead) {
      this.isSpinningFeeHead = true;
      this.feeHeadDrawerData.SCHOOL_ID = Number(
        sessionStorage.getItem('schoolid')
      );
      {
        if (this.feeHeadDrawerData.ID) {
          this.api
            .updateHead(this.feeHeadDrawerData)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Fee Head Updated Successfully...', '');
                if (!addNew) this.feeHeadDrawerClose();
                this.isSpinningFeeHead = false;
              } else {
                this.message.error('Fee Head Updation Failed...', '');
                this.isSpinningFeeHead = false;
              }
            });
        } else {
          this.api
            .createHead(this.feeHeadDrawerData)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Fee Head Created  Successfully...', '');
                if (!addNew) this.feeHeadDrawerClose();
                else {
                  this.feeHeadDrawerData = new HeadMasterData();
                  this.feeHeadResetDrawer(feeHeadPage);
                }
                this.isSpinningFeeHead = false;
              } else {
                this.message.error(' Fee Head Creation Failed...', '');
                this.isSpinningFeeHead = false;
              }
            });
        }
      }
    }
  }
  ////////////////////////////////////////  Fee Head Drawer //////////////////////////////////////////////
  ////////////////////////////////////////  Division Table //////////////////////////////////////////////
  isOkDivision = true;
  isSpinningDivision: boolean = false;
  divisionFormTitle: string = 'Division List';
  divisionDrawerVisible!: boolean;
  divisionDrawerTitle!: string;
  divisionDrawerData: divisionmaster = new divisionmaster();
  divisionDataList = [];
  divisionLoadingRecords = false;
  divisionTotalRecords = 1;
  divisionPageIndex = 1;
  divisionPageSize = 10;
  divisionSortValue: string = 'desc';
  divisionSortKey: string = 'id';
  divisionSearchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  divisionColumns: string[][] = [
    ['NAME', 'NAME'],
    ['SEQ_NO', 'SEQ_NO'],
    ['STATUS', 'STATUS'],
  ];
  classList: any[] = [];

  getClass() {
    var extraFilter: any = '';
    if (this.roleId == 3 || this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = '';
    }
    this.api.getAllClassMaster(0, 0, '', '', extraFilter).subscribe((data) => {
      if (data['code'] == 200) {
        this.classList = data['data'];
      } else {
        this.message.error('Failed To Get Classes', '');
      }
    });
  }
  divisionClose(): void {
    this.drawerCloseDivision();
  }
  divisionkeyup(event: any) {
    this.searchDivision();
  }

  searchDivision(reset: boolean = false) {
    if (reset) {
      this.divisionPageIndex = 1;
      this.divisionSortKey = 'id';
      this.divisionSortValue = 'desc';
    }
    this.divisionLoadingRecords = true;
    var sort: string;
    try {
      sort = this.divisionSortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';

    if (this.divisionSearchText != '') {
      likeQuery = ' AND(';
      this.divisionColumns.forEach((column) => {
        likeQuery +=
          ' ' + column[0] + " like '%" + this.divisionSearchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    var extraFilter: any = '';
    if (this.roleId == 3 || this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = '';
    }
    this.api
      .getAllDivisions(
        this.divisionPageIndex,
        this.divisionPageSize,
        this.divisionSortKey,
        sort,
        likeQuery + extraFilter + ' AND STATUS=1'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.divisionLoadingRecords = false;
            this.divisionTotalRecords = data['count'];
            this.divisionDataList = data['data'];
            if (this.divisionDataList.length > 0) {
              this.NextButton = false;
            } else {
              this.NextButton = true;
            }
          } else {
            this.message.error('Something Went Wrong', '');
            this.divisionLoadingRecords = false;
          }
          // if(this.divisionTotalRecords==0){
          //   data.SEQ_NO=1;
          // }else{
          //   data.SEQ_NO= this.divisionDataList[this.divisionDataList.length-1]['SEQ_NO']+1
          // }
        },
        (err) => {}
      );
  }

  //Drawer Methods
  get closeCallbackdivision() {
    return this.drawerCloseDivision.bind(this);
  }
  addDivision(): void {
    this.divisionDrawerTitle = 'Add Division';
    this.divisionDrawerData = new divisionmaster();
    var extraFilter: any = '';
    if (this.roleId == 3 || this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = '';
    }
    this.api.getAllDivisions(1, 1, 'SEQ_NO', 'desc', extraFilter).subscribe(
      (data) => {
        if (data['code'] == 200) {
          if (data['count'] == 0) {
            this.divisionDrawerData.SEQ_NO = 1;
          } else {
            this.divisionDrawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
          }
        } else {
          this.message.error('Something Went Wrong', '');
        }
      },
      (err) => {}
    );
    // this.divisionDrawerData.IS_ACTIVE=true;
    this.divisionDrawerVisible = true;
  }
  editDivision(data: any): void {
    this.divisionDrawerTitle = 'Update Division';
    this.divisionDrawerData = Object.assign({}, data);
    this.divisionDrawerVisible = true;
  }
  drawerCloseDivision(): void {
    this.searchDivision();
    this.divisionDrawerVisible = false;
  }

  sortDivision(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

    this.divisionPageIndex = pageIndex;
    this.divisionPageSize = pageSize;

    if (this.divisionPageSize != pageSize) {
      this.divisionPageIndex = 1;
      this.divisionPageSize = pageSize;
    }

    if (this.divisionSortKey != sortField) {
      this.divisionPageIndex = 1;
      this.divisionPageSize = pageSize;
    }

    this.divisionSortKey = sortField;
    this.divisionSortValue = sortOrder;
    this.searchDivision();
  }
  ////////////////////////////////////////  Division Table //////////////////////////////////////////////
  ////////////////////////////////////////  Division Drawer //////////////////////////////////////////////
  resetDivisionDrawer(divisionPage: NgForm) {
    // this.data=new PostMaster();
    divisionPage.form.markAsPristine();
    divisionPage.form.markAsUntouched();
  }
  //save
  saveDivision(addNew: boolean, divisionPage: NgForm): void {
    this.isSpinningDivision = false;
    this.isOkDivision = true;

    if (
      this.divisionDrawerData.NAME == '' &&
      this.divisionDrawerData.SEQ_NO == undefined
    ) {
      this.isOkDivision = false;
      this.message.error('Please Fill All Required Fields', '');
    } else if (
      this.divisionDrawerData.NAME == '' ||
      this.divisionDrawerData.NAME.trim() == ''
    ) {
      this.isOkDivision = false;
      this.message.error('Please Enter Division Name', '');
    } else if (
      this.divisionDrawerData.SEQ_NO == null ||
      this.divisionDrawerData.SEQ_NO == undefined ||
      this.divisionDrawerData.SEQ_NO <= 0
    ) {
      this.isOkDivision = false;
      this.message.error('Please Enter Sequence No', '');
    }

    if (this.isOkDivision) {
      // this.isSpinningDivision=false;
      this.divisionDrawerData.SCHOOL_ID = Number(
        sessionStorage.getItem('schoolid')
      );
      this.isSpinningDivision = true;
      if (this.divisionDrawerData.ID) {
        this.api
          .updateDivision(this.divisionDrawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(
                ' Division Information Updated Successfully...',
                ''
              );
              if (!addNew) this.drawerCloseDivision();
              this.isSpinningDivision = false;
            } else {
              this.message.error(
                ' Failed To Update Division Information...',
                ''
              );
              this.isSpinningDivision = false;
            }
          });
      } else {
        this.api
          .createDivision(this.divisionDrawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(
                ' Division Information Saved Successfully...',
                ''
              );
              if (!addNew) this.drawerCloseDivision();
              else {
                this.divisionDrawerData = new divisionmaster();
                this.resetDivisionDrawer(divisionPage);
                this.api
                  .getAllDivisions(
                    1,
                    1,
                    '',
                    'desc',
                    ' AND SCHOOL_ID = ' +
                      Number(sessionStorage.getItem('schoolid'))
                  )
                  .subscribe(
                    (data) => {
                      if (data['code'] == 200) {
                        if (data['count'] == 0) {
                          this.divisionDrawerData.SEQ_NO = 1;
                        } else {
                          this.divisionDrawerData.SEQ_NO =
                            data['data'][0]['SEQ_NO'] + 1;
                        }
                      } else {
                      }
                    },
                    (err) => {}
                  );
              }
              this.isSpinningDivision = false;
            } else {
              this.message.error(' Failed To Save Division Information...', '');
              this.isSpinningDivision = false;
            }
          });
      }
    }
  }
  ////////////////////////////////////////  Division Drawer //////////////////////////////////////////////
  ////////////////////////////////////////  Subject Table //////////////////////////////////////////////
  subjectDrawerVisible!: boolean;
  subjectDrawerTitle!: string;
  isSpinningSubject = false;
  isOkSubject = true;
  subjectDrawerData: SubjectMaster = new SubjectMaster();
  formTitleSubject = 'Manage Subjects ';
  subjectDataList: any[] = [];
  loadingRecordsSubject = false;
  subjectTotalRecords = 1;
  subjectPageIndex = 1;
  subjectPageSize = 10;
  subjectSortValue: string = 'desc';
  subjectSortKey: string = 'id';
  subjectSearchText: string = '';
  classes: [] = [];
  classesload: boolean = true;
  drawerClose2!: Function;

  subjectColumns: string[][] = [
    ['NAME', ' Name '],
    ['CLASS_NAME', ' CLASS_NAME '],
    ['DIVISION_NAME', 'DIVISION_NAME'],
    ['SEQ_NO', 'Sequence No'],
  ];

  Divisionlist: any = [];
  GetDivisionData() {
    if (this.roleId == 2) {
      var extraFilter: any = '';
      extraFilter =
        'AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = ' ';
    }
    this.api
      .getAllDivisions(0, 0, '', 'asc', ' AND STATUS=1 ' + extraFilter)
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.Divisionlist = data['data'];
          } else {
            this.Divisionlist = [];
          }
        } else {
          this.message.error('Failed To Get Division Data.', '');
          this.Divisionlist = [];
        }
      });
  }
  subjectkeyup(event: any) {
    this.subjectSearch();
  }
  subjectSearch(reset: boolean = false) {
    if (reset) {
      this.subjectPageIndex = 1;
      this.subjectSortKey = 'id';
      this.subjectSortValue = 'desc';
    }
    this.loadingRecordsSubject = true;
    var sort: string;
    try {
      sort = this.subjectSortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';

    if (this.subjectSearchText != '') {
      likeQuery = ' AND (';
      this.subjectColumns.forEach((column) => {
        likeQuery +=
          ' ' + column[0] + " like '%" + this.subjectSearchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    if (this.roleId == 2) {
      var extraFilter: any = '';
      extraFilter =
        'AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = ' ';
    }
    this.api
      .getAllSubjectMaster(
        this.subjectPageIndex,
        this.subjectPageSize,
        this.subjectSortKey,
        sort,
        likeQuery + extraFilter + ' AND STATUS=1'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.subjectTotalRecords = data['count'];
            this.subjectDataList = data['data'];

            if (this.subjectDataList.length > 0) {
              this.NextButton = false;
            } else {
              this.NextButton = true;
            }
            this.loadingRecordsSubject = false;
          } else {
            this.message.error('Something Went Wrong', '');
            this.subjectDataList = [];
            this.loadingRecordsSubject = false;
          }
        },
        (err) => {}
      );
  }

  addSubject(): void {
    this.subjectDrawerTitle = ' Add New Subject ';
    this.subjectDrawerData = new SubjectMaster();
    if (this.roleId == 2) {
      var extraFilter: any = '';
      extraFilter =
        'AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = ' ';
    }

    this.api.getAllSubjectMaster(1, 1, 'SEQ_NO', 'desc', extraFilter).subscribe(
      (data) => {
        if (data['code'] == 200) {
          if (data['count'] == 0) {
            this.subjectDrawerData.SEQ_NO = 1;
          } else {
            this.subjectDrawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
          }
          this.subjectDrawerVisible = true;
        }
      },
      (err) => {}
    );
  }
  editSubject(data: SubjectMaster): void {
    this.subjectDrawerTitle = ' Update Subject Information';
    this.subjectDrawerData = Object.assign({}, data);
    if (
      data.QUESTION_SUBJECT_ID != undefined &&
      data.QUESTION_SUBJECT_ID != null &&
      data.QUESTION_SUBJECT_ID > 0
    ) {
      this.api
        .getAllQuestionSubject(
          0,
          0,
          '',
          '',
          ' AND ID = ' + data.QUESTION_SUBJECT_ID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              // console.log(data,'vasj');

              this.questionsubjectList = data['data'];
              this.questionSubjectLoad = false;
            } else {
              this.questionsubjectList = [];
              this.questionSubjectLoad = false;
            }
          },
          (err) => {
            this.questionSubjectLoad = false;
          }
        );
    }
    this.subjectDrawerVisible = true;
  }
  //Drawer Methods
  get closeCallbacksubject() {
    return this.subjectDrawerClose.bind(this);
  }

  subjectDrawerClose(): void {
    this.subjectSearch();
    this.subjectDrawerVisible = false;
  }

  sortSubject(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

    this.subjectPageIndex = pageIndex;
    this.subjectPageSize = pageSize;

    if (this.subjectPageSize != pageSize) {
      this.subjectPageIndex = 1;
      this.subjectPageSize = pageSize;
    }

    if (this.subjectSortKey != sortField) {
      this.subjectPageIndex = 1;
      this.subjectPageSize = pageSize;
    }

    this.subjectSortKey = sortField;
    this.subjectSortValue = sortOrder;
    this.subjectSearch();
  }

  subjectClose(): void {
    this.subjectDrawerClose();
  }

  ////////////////////////////////////////  Subject Table //////////////////////////////////////////////
  ////////////////////////////////////////  Subject Drawer //////////////////////////////////////////////
  //save
  getAllClassesForSubject() {
    if (this.roleId == 2) {
      var extraFilter: any = '';
      extraFilter =
        'AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = ' ';
    }
    this.classesload = true;
    this.api
      .getAllClassMaster(0, 0, '', '', ' AND STATUS!=false ' + extraFilter)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.classes = data['data'];
            console.log(this.classes);

            this.classesload = false;
          } else {
            this.classes = [];
            this.classesload = false;
          }
        },
        (err) => {
          this.classesload = false;
        }
      );
  }

  classidchange(id: number) {
    console.log(this.classes, id);

    const filtererddata = this.classes.filter((a: any) => {
      return a.ID == id;
    });
    console.log(filtererddata);
    this.questionsubjectid = filtererddata[0]['QUESTION_CLASS_ID'];
    this.questionSubjectLoad = true;
    if (this.questionsubjectid) {
      var localFilter = ' AND CLASS_ID= ' + this.questionsubjectid;
      this.api
        .getAllQuestionSubject(0, 0, 'id', 'asc', localFilter)
        .subscribe((data) => {
          if (data['code'] == 200) {
            console.log(data);

            this.questionSubjectLoad = false;
            this.questionsubjectList = data['data'];
          } else {
            this.questionSubjectLoad = false;
            this.questionsubjectList = [];
          }
        });
    } else {
      this.questionSubjectLoad = false;
    }
  }
  subjectisSpinning = false;
  saveSubject(addNew: boolean, subjectpage: NgForm): void {
    //
    this.subjectisSpinning = false;
    this.isOkSubject = true;

    if (
      (this.subjectDrawerData.NAME == undefined ||
        this.subjectDrawerData.NAME == null ||
        this.subjectDrawerData.NAME.trim() == '') &&
      (this.subjectDrawerData.CLASS_ID <= 0 ||
        this.subjectDrawerData.CLASS_ID == null ||
        this.subjectDrawerData.CLASS_ID == undefined) &&
      (this.subjectDrawerData.DIVISION_ID < 0 ||
        this.subjectDrawerData.DIVISION_ID == null ||
        this.subjectDrawerData.DIVISION_ID == undefined) &&
      (this.subjectDrawerData.SEQ_NO <= 0 ||
        this.subjectDrawerData.SEQ_NO == null ||
        this.subjectDrawerData.SEQ_NO == undefined)
    ) {
      this.isOkSubject = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.subjectDrawerData.CLASS_ID == undefined ||
      this.subjectDrawerData.CLASS_ID == null ||
      this.subjectDrawerData.CLASS_ID <= 0
    ) {
      this.isOkSubject = false;
      this.message.error(' Please Select Class Name ', '');
    } else if (
      this.subjectDrawerData.DIVISION_ID == undefined ||
      this.subjectDrawerData.DIVISION_ID == null ||
      this.subjectDrawerData.DIVISION_ID < 0
    ) {
      this.isOkSubject = false;
      this.message.error(' Please Select Division Name ', '');
    } else if (
      this.subjectDrawerData.NAME == null ||
      this.subjectDrawerData.NAME.trim() == '' ||
      this.subjectDrawerData.NAME == undefined
    ) {
      this.isOkSubject = false;
      this.message.error('Please Enter Subject Name', '');
    } else if (
      this.subjectDrawerData.QUESTION_SUBJECT_ID == undefined ||
      this.subjectDrawerData.QUESTION_SUBJECT_ID == null ||
      this.subjectDrawerData.QUESTION_SUBJECT_ID < 0
    ) {
      this.isOkSubject = false;
      this.message.error(' Please Select Question Subject ', '');
    } else if (
      this.subjectDrawerData.SEQ_NO == undefined ||
      this.subjectDrawerData.SEQ_NO == null ||
      this.subjectDrawerData.SEQ_NO <= 0
    ) {
      this.isOkSubject = false;
      this.message.error(' Please Enter Sequence Number ', '');
    }

    if (this.isOkSubject) {
      // this.subjectisSpinning=false;

      this.subjectisSpinning = true;
      if (this.roleId == 2) {
        this.subjectDrawerData.SCHOOL_ID = Number(
          sessionStorage.getItem('schoolid')
        );
      }

      if (this.subjectDrawerData.ID) {
        this.api
          .updateSubjectMaster(this.subjectDrawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(
                ' Subject Information Updated Successfully...',
                ''
              );
              if (!addNew) this.subjectDrawerClose();
              this.subjectisSpinning = false;
            } else {
              this.message.error(
                ' Failed To Update Subject Information...',
                ''
              );
              this.subjectisSpinning = false;
            }
          });
      } else {
        this.api
          .createSubjectMaster(this.subjectDrawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(
                ' Subject Information Saved Successfully...',
                ''
              );
              if (!addNew) this.subjectDrawerClose();
              else {
                this.subjectDrawerData = new SubjectMaster();
                if (this.roleId == 2) {
                  var extraFilter: any = '';
                  extraFilter =
                    'AND SCHOOL_ID = ' +
                    Number(sessionStorage.getItem('schoolid'));
                } else {
                  extraFilter = ' ';
                }
                this.resetSubjectDrawer(subjectpage);
                this.api
                  .getAllSubjectMaster(1, 1, '', 'desc', extraFilter)
                  .subscribe(
                    (data) => {
                      if (data['code'] == 200) {
                        if (data['count'] == 0) {
                          this.subjectDrawerData.SEQ_NO = 1;
                        } else {
                          this.subjectDrawerData.SEQ_NO =
                            data['data'][0]['SEQ_NO'] + 1;
                        }
                      } else {
                      }
                    },
                    (err) => {}
                  );
              }
              this.subjectisSpinning = false;
            } else {
              this.message.error(' Failed To Save Subject Information...', '');
              this.subjectisSpinning = false;
            }
          });
      }
    }
  }
  resetSubjectDrawer(subjectpage: NgForm) {
    this.subjectDrawerData = new SubjectMaster();
    subjectpage.form.markAsPristine();
    subjectpage.form.markAsUntouched();
  }

  ////////////////////////////////////////  Class Table //////////////////////////////////////////////
  isSpinningClass = false;

  isOkClass = true;
  ClassDrawerVisible!: boolean;
  ClassDrawerTitle!: string;
  ClassDrawerData: classmaster = new classmaster();
  ClassFormTitle = 'Class List ';
  ClassDataList = [];
  ClassLoadingRecords = false;
  ClassTotalRecords = 1;
  ClassPageIndex = 1;
  ClassPageSize = 10;
  ClassSortValue: string = 'desc';
  ClassSortKey: string = 'id';
  ClassSearchText: string = '';
  // YearWidth = 0;

  Classcolumns: string[][] = [
    ['NAME', 'NAME'],
    ['SEQ_NO', 'SEQ_NO'],
    ['STATUS', 'STATUS'],
    ['TOTAL_FEES', 'TOTAL_FEES'],
  ];

  Classkeyup(event: any) {
    this.Classsearch();
  }

  Classsearch(reset: boolean = false) {
    if (reset) {
      this.ClassPageIndex = 1;
      this.ClassSortKey = 'id';
      this.ClassSortValue = 'desc';
    }
    this.ClassLoadingRecords = true;
    var sort: string;
    try {
      sort = this.ClassSortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';

    if (this.ClassSearchText != '') {
      likeQuery = ' AND(';
      this.Classcolumns.forEach((column) => {
        likeQuery +=
          ' ' + column[0] + " like '%" + this.ClassSearchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    this.api
      .getAllClassMaster(
        this.ClassPageIndex,
        this.ClassPageSize,
        this.ClassSortKey,
        sort,
        likeQuery +
          ' AND SCHOOL_ID = ' +
          Number(sessionStorage.getItem('schoolid')) +
          ' AND STATUS=1'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.ClassLoadingRecords = false;
            this.ClassTotalRecords = data['count'];
            this.ClassDataList = data['data'];

            if (this.ClassDataList.length > 0) {
              this.NextButton = false;
            } else {
              this.NextButton = true;
            }
          } else {
            this.message.error('Something Went Wrong', '');
          }
        },
        (err) => {}
      );
  }
  Classadd(): void {
    this.ClassDrawerTitle = 'Add Class';
    this.ClassDrawerData = new classmaster();
    this.ClassDrawerData.SCHOOL_ID = Number(sessionStorage.getItem('schoolid'));
    this.api
      .getAllClassMaster(
        1,
        1,
        'SEQ_NO',
        'desc',
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'))
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['count'] == 0) {
              this.ClassDrawerData.SEQ_NO = 1;
            } else {
              this.ClassDrawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
            }

            this.ClassDrawerVisible = true;
          } else {
            this.message.error('Something Went Wrong', '');
          }
        },
        (err) => {}
      );
  }
  editClassData(data: any): void {
    this.ClassDrawerTitle = 'Update Class';
    this.ClassDrawerData = Object.assign({}, data);
    this.ClassDrawerData.SCHOOL_ID = Number(sessionStorage.getItem('schoolid'));

    this.ClassDrawerVisible = true;
  }
  ClassdrawerClose(): void {
    this.Classsearch();
    this.getAllClasses();

    this.ClassDrawerVisible = false;
  }

  Classsort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

    this.ClassPageIndex = pageIndex;
    this.ClassPageSize = pageSize;

    if (this.ClassPageSize != pageSize) {
      this.ClassPageIndex = 1;
      this.ClassPageSize = pageSize;
    }

    if (this.ClassSortKey != sortField) {
      this.ClassPageIndex = 1;
      this.ClassPageSize = pageSize;
    }

    this.ClassSortKey = sortField;
    this.ClassSortValue = sortOrder;
    this.Classsearch();
  }

  ////////////////////////////////////////  Class Drawer //////////////////////////////////////////////
  classsave(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (!this.ClassDrawerData.TOTAL_FEES) {
      this.ClassDrawerData.TOTAL_FEES = 0;
    }
    if (
      (this.ClassDrawerData.NAME == undefined ||
        this.ClassDrawerData.NAME == null ||
        this.ClassDrawerData.NAME.trim() == '') &&
      (this.ClassDrawerData.SEQ_NO == undefined ||
        this.ClassDrawerData.SEQ_NO == null ||
        this.ClassDrawerData.SEQ_NO <= 0)
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else {
      if (
        this.ClassDrawerData.NAME == null ||
        this.ClassDrawerData.NAME.trim() == '' ||
        this.ClassDrawerData.NAME == undefined
      ) {
        this.isOk = false;
        this.message.error('Please Enter Class Name', '');
      } else if (
        this.ClassDrawerData.QUESTION_CLASS_ID == undefined ||
        this.ClassDrawerData.QUESTION_CLASS_ID == null ||
        this.ClassDrawerData.QUESTION_CLASS_ID < 0
      ) {
        this.isOk = false;
        this.message.error(' Please Select Question Class ', '');
      } else if (
        this.ClassDrawerData.SEQ_NO == undefined ||
        this.ClassDrawerData.SEQ_NO == null ||
        this.ClassDrawerData.SEQ_NO <= 0
      ) {
        this.isOk = false;
        this.message.error(' Please Enter Sequence Number ', '');
      }
    }
    if (this.isOk) {
      this.isSpinning = true;
      this.ClassDrawerData.SCHOOL_ID = Number(
        sessionStorage.getItem('schoolid')
      );

      if (this.ClassDrawerData.ID) {
        this.api.updateClass(this.ClassDrawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' Class Information Updated Successfully...',
              ''
            );
            if (!addNew) this.ClassdrawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update Class Information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createClass(this.ClassDrawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' Class Information Saved Successfully...',
              ''
            );
            if (!addNew) this.ClassdrawerClose();
            else {
              this.ClassDrawerData = new classmaster();
              this.ClassresetDrawer(websitebannerPage);
              this.api
                .getAllClassMaster(
                  1,
                  1,
                  '',
                  'desc',
                  ' AND SCHOOL_ID = ' +
                    Number(sessionStorage.getItem('schoolid'))
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (data['count'] == 0) {
                        this.ClassDrawerData.SEQ_NO = 1;
                      } else {
                        this.ClassDrawerData.SEQ_NO =
                          data['data'][0]['SEQ_NO'] + 1;
                      }
                    } else {
                    }
                  },
                  (err) => {}
                );
            }
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Save Class Information...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }
  ClassresetDrawer(websitebannerPage: NgForm) {
    this.ClassDrawerData = new classmaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  closeClassDrawer(): void {
    this.ClassdrawerClose();
  }

  // Student Map in  Class

  // Declared Var
  @ViewChild('fileInput1') myFileInput1!: ElementRef;
  CLASS_ID: any;
  dataMapping: classmapping = new classmapping();
  Classexceldrawervisible = false;
  ClassexcelLoading: boolean = false;

  Classexceldraweropen(data: classmapping) {
    this.CLASS_ID = data.ID;
    this.Classexceldrawervisible = true;
    this.dataMapping = new classmapping();
    this.exceldrawerTitle = 'Map Students to ' + data['NAME'];
    this.dataMapping.YEAR_ID = Number(sessionStorage.getItem('yearId'));
  }

  OnDisableExcel() {
    let showmsg = true;
    if (
      (this.dataMapping.YEAR_ID == null ||
        this.dataMapping.YEAR_ID == undefined ||
        this.dataMapping.YEAR_ID == 0) &&
      (this.dataMapping.DIVISION_ID == null ||
        this.dataMapping.DIVISION_ID == undefined ||
        this.dataMapping.DIVISION_ID == 0)
    ) {
      showmsg = false;
      this.message.error('Please fill all required fields.', '');
    } else if (
      this.dataMapping.YEAR_ID == null ||
      this.dataMapping.YEAR_ID == undefined ||
      this.dataMapping.YEAR_ID == 0
    ) {
      showmsg = false;
      this.message.error('Please Select Year.', '');
    } else if (
      this.dataMapping.DIVISION_ID == null ||
      this.dataMapping.DIVISION_ID == undefined
    ) {
      showmsg = false;
      this.message.error('Please Select Division.', '');
    }
    if (showmsg) {
      this.message.warning(
        'First, map the Fee, and then you will be able to map the Student. ',
        ''
      );
    }
  }

  onDivisionChange(selectedId: number): void {
    if (
      this.dataMapping.YEAR_ID != null &&
      this.dataMapping.YEAR_ID != undefined
    ) {
      this.api
        .getclassFeeMappingData(
          0,
          0,
          '',
          '',
          'AND CLASS_ID =' +
            this.CLASS_ID +
            ' AND YEAR_ID =' +
            this.dataMapping.YEAR_ID +
            ' AND DIVISION_ID = ' +
            selectedId
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.enableExcel = false;
              } else {
                this.enableExcel = true;
              }
            }
          },
          (err) => {}
        );
    } else {
    }
  }

  enableExcel: boolean = true;
  onYearChange(selectedId: number): void {
    if (
      this.dataMapping.DIVISION_ID != null &&
      this.dataMapping.DIVISION_ID != undefined
    ) {
      this.api
        .getclassFeeMappingData(
          0,
          0,
          '',
          '',
          'AND CLASS_ID =' +
            this.CLASS_ID +
            ' AND YEAR_ID =' +
            selectedId +
            ' AND DIVISION_ID = ' +
            this.dataMapping.DIVISION_ID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.enableExcel = false;
              } else {
                this.enableExcel = true;
              }
            }
          },
          (err) => {}
        );
    } else {
    }
  }

  ClassexceldrawerClose() {
    this.Classexceldrawervisible = false;
    this.clear1();
    this.Classsearch();
    this.FILE_NAME = null;
  }

  clear1() {
    // this.myFileInput1.nativeElement.value = '';
    this.Classexceldrawervisible = false;

    this.FILE_NAME = null;
  }

  classconfirm() {
    this.ClassexcelLoading = true;

    this.api
      .ExcelonUpload('studentExcel', this.FinalFileurl, this.FILE_NAME)
      .subscribe((successCode) => {
        if (successCode.code == 200) {
          this.api
            .importStudent(
              this.FILE_NAME,
              this.CLASS_ID,
              this.dataMapping.YEAR_ID,
              Number(sessionStorage.getItem('schoolid')),
              this.dataMapping.DIVISION_ID,
              this.dataMapping.MEDIUM_ID
            )
            .subscribe(
              (data) => {
                if (data['code'] == 200) {
                  this.message.success(' Data Uploaded Successfully ', '');
                  this.ClassexcelLoading = false;
                  this.exceldrawerClose();
                } else if (data['code'] == 300) {
                  this.message.error(' Duplicate Mobile Number', '');
                  this.ClassexcelLoading = false;
                } else if (data['code'] == 301) {
                  this.message.error('Fee Details Not Found .. ', '');
                  this.ClassexcelLoading = false;
                } else if (data['code'] == 302) {
                  this.message.error('No Data In Excel .. ', '');
                  this.ClassexcelLoading = false;
                } else {
                  this.message.error(' Failed To Upload Data ', '');
                  this.ClassexcelLoading = false;
                }
              },
              (err) => {
                this.message.error(' Failed To Upload Data ', '');
                this.ClassexcelLoading = false;
              }
            );
        } else {
          this.message.error(' Failed To Upload Data ', '');
          this.ClassexcelLoading = false;
        }
      });
  }

  classcancel() {
    this.ClassexcelLoading = false;
  }

  // Promote in  Class
  promotedata: promoteStudent = new promoteStudent();
  promotedrawerTitle!: string;
  promotedrawerVisible!: boolean;
  promoteisSpinning: boolean = false;
  Promotestudent: any[] = [];
  setOfCheckedId = new Set<number>();
  checked = false;
  indeterminate = false;
  SELECTED_RECORDS: number = 0;
  RECORDS: number = 0;
  promotestudent(data: classmaster): void {
    this.promotedrawerTitle = `Promote Student From ${data.NAME}`;
    this.ClassDrawerData = Object.assign({}, data);
    this.promotedrawerVisible = true;
  }
  promotedrawerClose(): void {
    this.promotedata = new promoteStudent();
    this.Promotestudent = [];
    this.tempdivison = null;
    this.Classsearch();
    this.promotedrawerVisible = false;
  }
  //Drawer Methods
  get promotecloseCallback() {
    return this.promotedrawerClose.bind(this);
  }

  updateTotalRecords(): void {
    this.SELECTED_RECORDS = this.setOfCheckedId.size;
  }

  onAllChecked(value: boolean): void {
    this.checked = value;
    this.indeterminate = false;

    if (value) {
      this.setOfCheckedId.clear();
      this.Promotestudent.forEach((data) => {
        data.checked = true;
        this.setOfCheckedId.add(data.ID);
      });
    } else {
      this.Promotestudent.forEach((data) => {
        data.checked = false;
      });
      this.setOfCheckedId.clear();
    }

    this.updateTotalRecords();
  }

  promoteloadingRecords: boolean = false;

  ChangeDivision(data: any) {
    this.loadingRecords = true;
    // console.log(this.data)
    if (data != null && data != undefined && data != '') {
      var filterDivision = '';
      var filterYear = '';
      if (data) {
        filterDivision = ' AND DIVISION_ID= ' + data;
      } else {
        filterDivision = '';
      }
      if (this.promotedata.YEAR) {
        filterYear = ' AND YEAR_ID = ' + this.promotedata.YEAR;
      } else {
        filterYear = '';
      }
      this.api
        .getallMappedClass(
          0,
          0,
          '',
          '',
          ' AND STATUS!=false AND CLASS_ID = ' +
            this.ClassDrawerData.ID +
            ' ' +
            filterYear +
            filterDivision
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.Promotestudent = data['data'];
              if (this.Promotestudent.length > 0) {
                this.onAllChecked(true);
              } else {
              }

              this.loadingRecords = false;
            } else {
              this.Promotestudent = [];
              this.loadingRecords = false;
            }
          },
          (err) => {}
        );
    } else {
      this.loadingRecords = false;
      this.Promotestudent = [];
      this.checked = false;
    }
  }
  tempdivison: number;
  ChangedYear(data: any) {
    this.loadingRecords = true;
    // console.log(this.data)
    if (data != null && data != undefined && data != '') {
      var filterDivision = '';
      if (this.promotedata.DIVISION_ID) {
        filterDivision = ' AND DIVISION_ID= ' + this.promotedata.DIVISION_ID;
      } else {
        filterDivision = '';
      }
      this.api
        .getallMappedClass(
          0,
          0,
          '',
          '',
          ' AND STATUS!=false AND CLASS_ID = ' +
            this.ClassDrawerData.ID +
            ' AND YEAR_ID = ' +
            data +
            filterDivision
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.Promotestudent = data['data'];
              if (this.Promotestudent.length > 0) {
                this.onAllChecked(true);
              } else {
              }

              this.loadingRecords = false;
            } else {
              this.Promotestudent = [];
              this.loadingRecords = false;
            }
          },
          (err) => {}
        );
    } else {
      this.loadingRecords = false;
      this.Promotestudent = [];
      this.checked = false;
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.updateTotalRecords();
    this.Promotestudent.forEach((data) => {
      data.checked = this.setOfCheckedId.has(data.ID);
    });
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }

    this.checked = this.Promotestudent.every((item) =>
      this.setOfCheckedId.has(item.id)
    );
    this.indeterminate = !this.checked && this.setOfCheckedId.size > 0;
  }

  clearselection() {
    this.checked = false;
    this.setOfCheckedId.clear();
    this.SELECTED_RECORDS = 0;
  }
  Promotesave(): void {
    this.isOk = true;

    if (
      this.promotedata.YEAR_ID == undefined ||
      this.promotedata.YEAR_ID == null ||
      this.promotedata.YEAR_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Promote Year', '');
    } else if (
      this.promotedata.CLASS_ID == undefined ||
      this.promotedata.CLASS_ID == null ||
      this.promotedata.CLASS_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Class', '');
    } else if (
      this.tempdivison == undefined ||
      this.tempdivison == null ||
      this.tempdivison <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Division', '');
    }

    if (this.isOk) {
      const dataToSave = {
        YEAR_ID: this.promotedata.YEAR_ID,
        CLASS_ID: this.promotedata.CLASS_ID,
        DIVISION_ID: this.tempdivison,
        STUDENT_DATA: [],
        SCHOOL_ID: Number(sessionStorage.getItem('schoolid')),
      };
      //

      this.Promotestudent.forEach((student) => {
        if (student.checked) {
          dataToSave.STUDENT_DATA.push(student.STUDENT_ID);
        }
      });

      if (this.Promotestudent.length > 0) {
        this.api.PromoteData(dataToSave).subscribe((data) => {
          if (data['code'] == 200) {
            this.message.success(' Student Promoted successfully...', '');
            this.promoteisSpinning = false;

            this.Promoteclose();
          } else if (data['code'] == 300) {
            this.message.error(' Fee Details Not Found......', '');
            this.promoteisSpinning = false;
          } else {
            this.message.error('Student Promotion Failed...', '');
            this.promoteisSpinning = false;
          }
        });
      } else {
        this.message.error('No Student Data For Promote ...', '');
        this.promoteisSpinning = false;
      }
    }
  }

  Promoteclose(): void {
    this.promotedrawerClose();
  }

  //  Teacher Map

  TeacherdrawerTitle!: string;
  TeacherdrawerVisible!: boolean;
  TeachermapisSpinning: boolean = false;
  TeacherMap: [] = [];
  Class_ID: number;
  CLASS_NAME: any;
  MapTeacherData: any[] = [];
  TeacherMapData: TeacherMap = new TeacherMap();
  MapTeacherDATA: any[] = [];
  TeacherloadingRecords: boolean = false;

  MapTeacher(data: classmaster): void {
    this.TeacherMapData.YEAR_ID = Number(sessionStorage.getItem('yearId'));
    this.Class_ID = data.ID;
    this.TeacherMapData.CLASS_ID = data.ID;
    this.TeacherMapData.CLASS_NAME = data.NAME;
    this.MapTeacherDATA = [];
    this.TeacherMapData.CLASS_TEACHER_ID = 0;
    this.TeacherMapData.DIVISION_ID = 0;

    this.TeacherdrawerTitle = `Map Teacher To ${data.NAME}`;

    this.TeacherdrawerVisible = true;
  }
  TeacherMapdrawerClose(): void {
    this.Classsearch();
    this.TeacherdrawerVisible = false;
  }
  //Drawer Methods
  get TeacherMapcloseCallback() {
    return this.TeacherMapdrawerClose.bind(this);
  }

  ChangedDivision(data: any) {
    if (data != null && data != undefined && data != '') {
      // if (this.TeacherMapData.DIVISION_ID != null && this.TeacherMapData.DIVISION_ID != undefined) {
      this.api
        .getSubjectTeacherMappingData(
          0,
          0,
          '',
          '',
          'AND CLASS_ID = ' +
            this.Class_ID +
            ' AND DIVISION_ID = ' +
            data +
            ' AND YEAR_ID = ' +
            this.TeacherMapData.YEAR_ID
        )
        .subscribe(
          (datateacher) => {
            if (datateacher['code'] == 200) {
              if (datateacher['data'].length > 0) {
                this.MapTeacherData = datateacher['data'];

                this.MapTeacherDATA = this.MapTeacherData.map((item) => {
                  item.NAME = item.SUBJECT_NAME;
                  delete item.SUBJECT_NAME;
                  return item;
                });
                this.MapTeacherDATA = this.MapTeacherData;

                // this.loadClassTeachersMapping(data);
                this.loadClassTeachersMapping(data, 'CLASS_TEACHER_ID');
              } else {
                this.loadSubjects(data, 'CLASS_TEACHER_ID');
              }
            }
          },
          (err) => {}
        );
      // } else { }
    } else {
    }
  }

  ChangedYearTeacher(data: any) {
    if (data != null && data != undefined && data != '') {
      // if (this.TeacherMapData.YEAR_ID != null && this.TeacherMapData.YEAR_ID != undefined) {
      this.api
        .getSubjectTeacherMappingData(
          0,
          0,
          '',
          '',
          'AND CLASS_ID = ' +
            this.Class_ID +
            ' AND DIVISION_ID = ' +
            this.TeacherMapData.DIVISION_ID +
            ' AND YEAR_ID = ' +
            data
        )
        .subscribe(
          (datateacher) => {
            if (datateacher['code'] == 200) {
              if (datateacher['data'].length > 0) {
                this.MapTeacherData = datateacher['data'];

                this.MapTeacherDATA = this.MapTeacherData.map((item) => {
                  item.NAME = item.SUBJECT_NAME;
                  delete item.SUBJECT_NAME;
                  return item;
                });
                this.MapTeacherDATA = this.MapTeacherData;

                this.loadClassTeachersMapping(data, 'TEACHER_ID');
              } else {
                this.loadSubjects(data, 'TEACHER_ID');
              }
            }
          },
          (err) => {}
        );
      // } else { }
    } else {
    }
  }

  loadClassTeachersMapping(data: any, teacherType: string) {
    let extrafilter = '';
    if (teacherType == 'CLASS_TEACHER_ID') {
      extrafilter =
        ' AND STATUS!=false  AND DIVISION_ID =' +
        data +
        ' AND CLASS_ID =' +
        this.Class_ID +
        ' AND YEAR_ID = ' +
        this.TeacherMapData.YEAR_ID;
    } else {
      extrafilter =
        ' AND STATUS!=false  AND DIVISION_ID =' +
        this.TeacherMapData.DIVISION_ID +
        ' AND CLASS_ID =' +
        this.Class_ID +
        ' AND YEAR_ID = ' +
        data;
    }
    this.api
      .getALLClassTeacherMappingMaster(0, 0, '', '', extrafilter)
      .subscribe(
        (data) => {
          if (data['code'] == 200 && data['count'] > 0) {
            // this.MapTeacherDATA = data['data'];

            this.TeacherMapData.CLASS_TEACHER_ID =
              data['data'][0]['TEACHER_ID'];

            this.TeacherloadingRecords = false;
            //
          } else {
            this.TeacherMapData.CLASS_TEACHER_ID = '';
            this.TeacherloadingRecords = false;
          }
        },
        (err) => {}
      );
  }

  loadSubjects(data: any, teacherType: string) {
    let extrafilter = '';

    if (teacherType == 'CLASS_TEACHER_ID') {
      extrafilter =
        ' AND STATUS!=false  AND DIVISION_ID =' +
        data +
        ' AND CLASS_ID =' +
        this.Class_ID +
        ' AND SCHOOL_ID = ' +
        Number(sessionStorage.getItem('schoolid'));
    } else {
      extrafilter =
        ' AND STATUS!=false  AND DIVISION_ID =' +
        this.TeacherMapData.DIVISION_ID +
        ' AND CLASS_ID =' +
        this.Class_ID +
        ' AND SCHOOL_ID = ' +
        Number(sessionStorage.getItem('schoolid'));
    }
    this.api.getAllSubjectMaster(0, 0, '', '', extrafilter).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.MapTeacherDATA = data['data'];
          console.log(data['data'], 'Map Teacher Data');
          this.TeacherloadingRecords = false;
          this.MapTeacherDATA.forEach((teacher) => {
            teacher.TEACHER_ID = null;
          });
          this.TeacherMapData.CLASS_TEACHER_ID = null;

          //
        } else {
          this.MapTeacherDATA = [];

          this.TeacherloadingRecords = false;
        }
      },
      (err) => {}
    );
  }

  MapTeacherToClass(): void {
    this.isOk = true;
    this.switchValue = true;

    if (
      this.TeacherMapData.DIVISION_ID == undefined ||
      this.TeacherMapData.DIVISION_ID == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Division', '');
    } else if (
      this.TeacherMapData.YEAR_ID == undefined ||
      this.TeacherMapData.YEAR_ID == null ||
      this.TeacherMapData.YEAR_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Year', '');
    } else if (
      this.TeacherMapData.CLASS_TEACHER_ID == undefined ||
      this.TeacherMapData.CLASS_TEACHER_ID == null ||
      this.TeacherMapData.CLASS_TEACHER_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Class Teacher', '');
    } else if (this.MapTeacherDATA.length === 0) {
      this.isOk = false;
      this.message.error('No Subjects To Map Teacher...', '');
    } else if (this.MapTeacherDATA.some((item) => !item.TEACHER_ID)) {
      this.isOk = false;
      this.message.error("Please Assign Teacher To All Subject's", '');
    } else {
      this.switchValue = false;
    }
  }
  isTeacherMapSpinning = false;
  confirmMap() {
    if (this.isOk) {
      this.isTeacherMapSpinning = true;
      const dataToSave = {
        YEAR_ID: this.TeacherMapData.YEAR_ID,
        CLASS_ID: this.TeacherMapData.CLASS_ID,
        DIVISION_ID: this.TeacherMapData.DIVISION_ID,
        CLASS_TEACHER_ID: this.TeacherMapData.CLASS_TEACHER_ID,
        SUBJECT_DETAILS: [],
      };
      var subjectId: any;
      this.MapTeacherDATA.forEach((item) => {
        if (item.SUBJECT_ID) {
          subjectId = item.SUBJECT_ID;
        } else {
          subjectId = item.ID;
        }
        const teacherId = item.TEACHER_ID;
        const teacherName = item.NAME;
        dataToSave.SUBJECT_DETAILS.push({
          SUBJECT_ID: subjectId,
          TEACHER_ID: teacherId,
          NAME: teacherName,
          STATUS: 1,
        });
      });
      // console.log(this.MapTeacher, dataToSave)
      this.api.ClassTeacherMap(dataToSave).subscribe((data) => {
        if (data['code'] == 200) {
          this.message.success(' Teacher Mapping successfully...', '');
          this.isTeacherMapSpinning = false;
          this.close11();
        } else {
          this.message.error('Teacher Mapping Failed...', '');
          this.isTeacherMapSpinning = false;
        }
      });
    }
  }
  close11() {
    this.TeacherdrawerVisible = false;
    this.MapTeacherDATA = [];
    console.log('this.close11()');
  }
  closeMapteacher(): void {
    this.TeacherMapdrawerClose();
  }
  // Add Class Drawer Subject

  ClassdrawerDataSubject: SubjectMaster = new SubjectMaster();
  drawerTitle1: string;
  drawerVisible11: boolean = false;

  addClassSubject(): void {
    console.log(this.TeacherMapData, 'sdhghg');

    this.drawerTitle1 = ' Add Subject ';
    this.ClassdrawerDataSubject = new SubjectMaster();
    this.ClassdrawerDataSubject.CLASS_ID = this.TeacherMapData.CLASS_ID;
    this.ClassdrawerDataSubject.DIVISION_ID = this.TeacherMapData.DIVISION_ID;
    this.ClassdrawerDataSubject.YEAR_ID = this.TeacherMapData.YEAR_ID;
    this.getAllClasses();
    this.api.getAllSubjectMaster(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          if (data['count'] == 0) {
            this.ClassdrawerDataSubject.SEQ_NO = 1;
          } else {
            this.ClassdrawerDataSubject.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
          }
          this.drawerVisible11 = true;
        }
      },
      (err) => {}
    );
  }

  isOk1 = true;
  ClassSubjectisSpinning = false;

  save2(addNew: boolean, websitebannerPage: NgForm) {
    this.isOk1 = true;
    this.ClassSubjectisSpinning = true;
    if (
      this.ClassdrawerDataSubject.CLASS_ID <= 0 ||
      this.ClassdrawerDataSubject.CLASS_ID == null ||
      this.ClassdrawerDataSubject.CLASS_ID == undefined
    ) {
      this.isOk1 = false;
      this.message.error('Class Not Selected', '');
      this.ClassSubjectisSpinning = false;
    } else if (
      this.ClassdrawerDataSubject.DIVISION_ID <= 0 ||
      this.ClassdrawerDataSubject.DIVISION_ID == null ||
      this.ClassdrawerDataSubject.DIVISION_ID == undefined
    ) {
      this.isOk1 = false;
      this.message.error('Division Not Selected', '');
      this.ClassSubjectisSpinning = false;
    } else if (
      this.ClassdrawerDataSubject.NAME == '' ||
      this.ClassdrawerDataSubject.NAME.trim() == ''
    ) {
      this.isOk1 = false;
      this.message.error('Please Enter Subject Name', '');
      this.ClassSubjectisSpinning = false;
    } else if (
      this.ClassdrawerDataSubject.TEACHER_ID <= 0 ||
      this.ClassdrawerDataSubject.TEACHER_ID == null ||
      this.ClassdrawerDataSubject.TEACHER_ID == undefined
    ) {
      this.isOk1 = false;
      this.message.error('Please Select Teacher', '');
      this.ClassSubjectisSpinning = false;
    } else {
      this.api
        .mapSubject(this.ClassdrawerDataSubject)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' Subject Information Saved Successfully...',
              ''
            );
            this.ClassSubjectisSpinning = false;

            if (!addNew) this.drawerClose1();
            else {
              this.ClassdrawerDataSubject = new SubjectMaster();

              this.ClassSubjectresetDrawer(websitebannerPage);
              this.api.getAllSubjectMaster(1, 1, '', 'desc', '').subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    if (data['count'] == 0) {
                      this.ClassdrawerDataSubject.SEQ_NO = 1;
                    } else {
                      this.ClassdrawerDataSubject.SEQ_NO =
                        data['data'][0]['SEQ_NO'] + 1;
                    }
                  } else {
                  }
                },
                (err) => {}
              );
            }
            this.ClassSubjectisSpinning = false;
          } else {
            this.message.error(' Failed To Save Subject Information...', '');
            this.ClassSubjectisSpinning = false;
          }
        });
    }
  }

  closemap() {
    this.ClassdrawerDataSubject.DIVISION_ID = this.TeacherMapData.DIVISION_ID;
    this.ClassdrawerDataSubject.CLASS_ID = this.TeacherMapData.CLASS_ID;
    this.ClassdrawerDataSubject.YEAR_ID = this.TeacherMapData.YEAR_ID;

    this.drawerClose1();
  }
  drawerClose1(): void {
    if (
      this.ClassdrawerDataSubject.DIVISION_ID != null &&
      this.ClassdrawerDataSubject.CLASS_ID != null &&
      this.ClassdrawerDataSubject.YEAR_ID != null
    ) {
      // if (this.TeacherMapData.DIVISION_ID != null && this.TeacherMapData.DIVISION_ID != undefined) {
      this.api
        .getSubjectTeacherMappingData(
          0,
          0,
          '',
          '',
          'AND CLASS_ID = ' +
            this.ClassdrawerDataSubject.CLASS_ID +
            ' AND DIVISION_ID = ' +
            this.ClassdrawerDataSubject.DIVISION_ID +
            ' AND YEAR_ID = ' +
            this.ClassdrawerDataSubject.YEAR_ID
        )
        .subscribe(
          (datateacher) => {
            if (datateacher['code'] == 200) {
              if (datateacher['data'].length > 0) {
                this.MapTeacherData = datateacher['data'];

                this.MapTeacherDATA = this.MapTeacherData.map((item) => {
                  item.NAME = item.SUBJECT_NAME;
                  delete item.SUBJECT_NAME;
                  return item;
                });
                this.MapTeacherDATA = this.MapTeacherData;

                // this.loadClassTeachersMapping(data);
                this.loadClassTeachersMapping(
                  this.ClassdrawerDataSubject.DIVISION_ID,
                  'CLASS_TEACHER_ID'
                );
              } else {
                this.loadSubjects(
                  this.ClassdrawerDataSubject.DIVISION_ID,
                  'CLASS_TEACHER_ID'
                );
              }
            }
          },
          (err) => {}
        );
      // } else { }
    } else {
    }
    this.drawerVisible11 = false;
  }
  ClassSubjectresetDrawer(websitebannerPage: NgForm) {
    this.ClassdrawerDataSubject = new SubjectMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  // Class Fee Map
  drawerVisibleClassMap!: boolean;
  drawerTitleClassMap!: string;
  MapData: DataArray = new DataArray();
  HeadDatalist: any = [];
  loadHeadData: boolean = false;
  tableData: Array<{
    IS_MAPPED: boolean;
    NAME: string;
    AMOUNT: number;
    ID: number;
  }> = [];

  addClassFeeMap(data): void {
    this.drawerTitleClassMap = 'Class Wise Fee Mapping';
    this.classId = data.ID;
    this.MapData.CLASS_NAME = data.NAME;
    this.MapData.DIVISION_ID = [];
    this.MapData.YEAR_ID = Number(sessionStorage.getItem('yearId'));

    this.tableData = [];

    this.api
      .getHeadData(
        0,
        0,
        '',
        'asc',
        ' AND STATUS=1 AND SCHOOL_ID = ' +
          Number(sessionStorage.getItem('schoolid'))
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.drawerVisibleClassMap = true;

          if (data['data'].length > 0) {
            this.DataTable = data['data'];
            this.DataTable.forEach((dataItem) => {
              const tableRecord = {
                IS_MAPPED:
                  dataItem.IS_MAPPED !== undefined ? dataItem.IS_MAPPED : false,
                NAME: dataItem.NAME || '', // Add a default value if CLASS_NAME is undefined
                AMOUNT: dataItem.AMOUNT !== undefined ? dataItem.AMOUNT : 0,
                ID: dataItem.ID,
              };
              this.tableData.push(tableRecord);
            });

            this.loadHeadData = false;
          } else {
            this.HeadDatalist = [];
            this.loadHeadData = false;
          }
        } else {
          this.message.error('Failed To Get Head Data.', '');
          this.HeadDatalist = [];
          this.loadHeadData = false;
        }
      });
  }

  DataTable: Array<{
    ID: any;
    NAME: string;
    IS_MAPPED: boolean;
    CLASS_NAME: string;
    AMOUNT: number;
  }> = [];
  // isOk: boolean = true;
  // isSpinning: boolean = false;
  Data: any = [];

  Total: any = 0;
  loadingRecords = false;

  onAmountChange(event: any) {
    // Assuming this.tableData is the array containing your data
    this.Total = this.tableData.reduce((sum, item) => {
      // Only add the amount if IS_MAPPED is true
      if (item.IS_MAPPED) {
        const amount = Number(item.AMOUNT) || 0; // Convert to number, use 0 if conversion fails
        return sum + amount;
      }
      return sum;
    }, 0); // Initial value of sum is 0
  }

  onIsMappedChange(newIsMappedValue: boolean, rowData: any) {
    // If IS_MAPPED is set to false, then Amount Should be clear
    if (!newIsMappedValue) {
      if (
        rowData.AMOUNT != null &&
        rowData.AMOUNT != undefined &&
        rowData.AMOUNT != ''
      ) {
        var total: any = 0;
        total = Number(this.Total) - Number(rowData.AMOUNT);
        this.Total = Number(total);
        rowData.AMOUNT = 0;
      }
    }
  }
  onYearChangeFee(selectedId: number): void {
    if (
      this.MapData.DIVISION_ID != null &&
      this.MapData.DIVISION_ID != undefined
    ) {
      this.api
        .getclassFeeMappingData(
          0,
          0,
          '',
          '',
          'AND CLASS_ID =' +
            this.classId +
            ' AND DIVISION_ID =' +
            this.MapData.DIVISION_ID +
            ' AND YEAR_ID = ' +
            selectedId
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.Data = data['data'];

              // Initialize Total
              this.Total = 0;

              // Reset all IS_MAPPED to false before processing the new data
              this.tableData.forEach((item) => {
                item.IS_MAPPED = false;
                item.AMOUNT = 0;
              });

              if (this.Data.length > 0) {
                for (let i = 0; i < this.Data.length; i++) {
                  this.Total += this.Data[i]['AMOUNT'];

                  // Find the corresponding Head in tableData
                  const correspondingItemIndex = this.tableData.findIndex(
                    (item) => item.ID === this.Data[i].HEAD_ID
                  );

                  if (correspondingItemIndex !== -1) {
                    // Update IS_MAPPED, AMOUNT, and NAME if HEAD_ID matches ID
                    this.tableData[correspondingItemIndex].IS_MAPPED = true;
                    this.tableData[correspondingItemIndex].AMOUNT =
                      this.Data[i].AMOUNT;
                    this.tableData[correspondingItemIndex].NAME =
                      this.Data[i].HEAD_NAME;
                    this.tableData[correspondingItemIndex].ID =
                      this.Data[i].HEAD_ID;
                  } else {
                    // If there is no corresponding Head, add a new record
                    const tableRecord = {
                      IS_MAPPED: false,
                      NAME: this.Data[i].HEAD_NAME,
                      AMOUNT: this.Data[i].AMOUNT,
                      ID: this.Data[i].HEAD_ID,
                    };
                    this.tableData.push(tableRecord);
                  }
                }
              } else {
                // If Data length is 0, set all amounts to null and IS_MAPPED to false
                this.tableData.forEach((item) => {
                  item.IS_MAPPED = false;
                  item.AMOUNT = null;
                });
                this.Total = 0;
              }
            } else {
              this.Data = [];
            }
          },
          (err) => {}
        );
    } else {
    }
  }

  onDivisionChangeFee(selectedId: any): void {
    if (this.MapData.YEAR_ID != null && this.MapData.YEAR_ID != undefined) {
      var filter = '';
      if (selectedId.length) {
        filter = ' AND DIVISION_ID in (' + selectedId + ')';
        this.api
          .getclassFeeMappingData(
            0,
            0,
            '',
            '',
            'AND CLASS_ID =' +
              this.classId +
              ' AND YEAR_ID =' +
              this.MapData.YEAR_ID +
              filter
          )
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.Data = data['data'];

                // Initialize Total
                this.Total = 0;

                if (this.Data.length > 0) {
                  for (let i = 0; i < this.Data.length; i++) {
                    this.Total += this.Data[i]['AMOUNT'];

                    // Find the corresponding Head in tableData
                    const correspondingItemIndex = this.tableData.findIndex(
                      (item) => item.ID === this.Data[i].HEAD_ID
                    );

                    if (correspondingItemIndex !== -1) {
                      // Update IS_MAPPED, AMOUNT, and NAME if HEAD_ID matches ID
                      this.tableData[correspondingItemIndex].IS_MAPPED = true;
                      this.tableData[correspondingItemIndex].AMOUNT =
                        this.Data[i].AMOUNT;
                      this.tableData[correspondingItemIndex].NAME =
                        this.Data[i].HEAD_NAME;
                      this.tableData[correspondingItemIndex].ID =
                        this.Data[i].HEAD_ID;
                    } else {
                      // If there is no corresponding Head, add a new record
                      const tableRecord = {
                        IS_MAPPED: false,
                        NAME: this.Data[i].HEAD_NAME,
                        AMOUNT: this.Data[i].AMOUNT,
                        ID: this.Data[i].HEAD_ID,
                      };
                      this.tableData.push(tableRecord);
                    }
                  }
                } else {
                  // If Data length is 0, set all amounts to null and IS_MAPPED to false
                  this.tableData.forEach((item) => {
                    item.IS_MAPPED = false;
                    item.AMOUNT = null;
                  });
                  this.Total = 0;
                }
              } else {
                this.Data = [];
              }
            },
            (err) => {}
          );
      }
    } else {
    }
    // console.log(this.tableData);
  }

  drawerCloseMapClass(): void {
    // this.GetHeadData()
    this.Classsearch();
    this.drawerVisibleClassMap = false;
  }
  switchValue2 = true;

  FeeMapsave() {
    this.isOk = true;
    this.switchValue2 = true;

    if (
      (this.MapData.DIVISION_ID == undefined ||
        this.MapData.DIVISION_ID == null) &&
      (this.MapData.YEAR_ID == undefined || this.MapData.YEAR_ID == null)
    ) {
      this.isOk = false;
      this.message.error(
        'Please Select Division & Year for Mapped Heads. ',
        ''
      );
    } else if (
      this.MapData.DIVISION_ID == undefined ||
      this.MapData.DIVISION_ID == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Division.', '');
    } else if (
      this.MapData.YEAR_ID == undefined ||
      this.MapData.YEAR_ID == null ||
      this.MapData.YEAR_ID == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Year.', '');
    } else if (
      this.tableData.some(
        (item) => item.IS_MAPPED && (!item.AMOUNT || item.AMOUNT === 0)
      )
    ) {
      this.isOk = false;
      this.message.error('Please fill in the Amount for mapped Heads.', '');
    } else {
      this.switchValue2 = false;
    }
  }
  isFeeMapSpinning = false;
  FeeMapconfirm() {
    if (this.isOk) {
      this.isFeeMapSpinning = true;
      let formattedData = this.tableData
        .filter((item: any) => item.IS_MAPPED)
        .map((item: any) => ({
          HEAD_ID: item.ID,
          AMOUNT: item.AMOUNT,
          // DIVISION_ID: this.MapData.DIVISION_ID,
        }));

      const dataToSave = {
        CLASS_ID: this.classId,
        YEAR_ID: this.MapData.YEAR_ID,
        TOTAL_FEES: this.Total,
        feeDetails: [],
        // DIVISION_ID: this.MapData.DIVISION_ID,
      };

      let len = this.MapData.DIVISION_ID.length;
      for (let i = 0; i < len; i++) {
        // Create a deep copy of formattedData
        let deepCopyFormattedData = JSON.parse(JSON.stringify(formattedData));
        for (let j = 0; j < deepCopyFormattedData.length; j++) {
          deepCopyFormattedData[j]['DIVISION_ID'] = this.MapData.DIVISION_ID[i];
        }
        dataToSave.feeDetails.push(...deepCopyFormattedData);
      }
      dataToSave['DIVISION_ID'] = this.MapData.DIVISION_ID;
      // console.log(dataToSave);

      if (dataToSave.feeDetails.length > 0) {
        this.api.mapClassBulk(dataToSave).subscribe((data) => {
          if (data['code'] == 200) {
            this.message.success(
              'Information has been Added successfully...',
              ''
            );
            this.isFeeMapSpinning = false;
            this.drawerCloseMapClass();
          } else {
            this.isFeeMapSpinning = false;
            this.message.error('Information creation failed...', '');
          }
        });
      } else {
        this.isFeeMapSpinning = false;
        this.message.error(
          'Please map at least one Head before proceeding...',
          ''
        );
      }
    }
  }

  ////////////////////////////////////////  Subject Drawer //////////////////////////////////////////////
  ////////////////////////////////////////  Medium Table //////////////////////////////////////////////
  isSpinningMedium = false;

  isOkMedium = true;
  mediumDrawerVisible!: boolean;
  mediumDrawerTitle!: string;
  mediumDrawerData: MediumMaster = new MediumMaster();
  mediumFormTitle = 'Manage Mediums ';
  mediumDataList = [];
  mediumLoadingRecords = false;
  mediumTotalRecords = 1;
  mediumPageIndex = 1;
  mediumPageSize = 10;
  mediumSortValue: string = 'desc';
  mediumSortKey: string = 'id';
  mediumSearchText: string = '';
  YearWidth = 0;

  mediumColumns: string[][] = [
    ['NAME', 'NAME'],
    ['SEQ_NO', 'SEQ_NO'],
    ['STATUS', 'STATUS'],
  ];

  mediumkeyup(event: any) {
    this.searchMedium();
  }

  searchMedium(reset: boolean = false) {
    if (reset) {
      this.mediumPageIndex = 1;
      this.mediumSortKey = 'id';
      this.mediumSortValue = 'desc';
    }
    this.mediumLoadingRecords = true;
    var sort: string;
    try {
      sort = this.mediumSortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var extraFilter = '';

    if (this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = ' ';
    }
    var likeQuery = '';

    if (this.mediumSearchText != '') {
      likeQuery = ' AND(';
      this.mediumColumns.forEach((column) => {
        likeQuery +=
          ' ' + column[0] + " like '%" + this.mediumSearchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    this.api
      .getAllMediumMaster(
        this.mediumPageIndex,
        this.mediumPageSize,
        this.mediumSortKey,
        sort,
        likeQuery + extraFilter + ' AND STATUS=1'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.mediumTotalRecords = data['count'];
            this.mediumLoadingRecords = false;
            this.mediumDataList = data['data'];

            if (this.mediumDataList.length > 0) {
              this.NextButton = false;
            } else {
              this.NextButton = true;
            }
          } else {
            this.message.error('Something Went Wrong', '');
            this.mediumLoadingRecords = false;
            this.mediumDataList = [];
          }
        },
        (err) => {}
      );
  }

  addMedium(): void {
    var extraFilter = '';

    if (this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = ' ';
    }
    this.mediumDrawerTitle = 'Create New Medium';
    this.mediumDrawerData = new MediumMaster();
    this.api.getAllMediumMaster(1, 1, 'SEQ_NO', 'desc', extraFilter).subscribe(
      (data) => {
        if (data['code'] == 200) {
          if (data['count'] == 0) {
            this.mediumDrawerData.SEQ_NO = 1;
          } else {
            this.mediumDrawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
          }
          this.mediumDrawerVisible = true;
        }
      },
      (err) => {}
    );
  }

  editMedium(data: MediumMaster): void {
    this.mediumDrawerTitle = 'Update Medium';
    this.mediumDrawerData = Object.assign({}, data);
    this.mediumDrawerVisible = true;
  }

  //Drawer Methods
  get closeCallbackmedium() {
    return this.mediumDrawerClose.bind(this);
  }
  mediumDrawerClose(): void {
    this.searchMedium();
    this.mediumDrawerVisible = false;
  }

  // Sort

  mediumSort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

    this.mediumPageIndex = pageIndex;
    this.mediumPageSize = pageSize;

    if (this.mediumPageSize != pageSize) {
      this.mediumPageIndex = 1;
      this.mediumPageSize = pageSize;
    }

    if (this.mediumSortKey != sortField) {
      this.mediumPageIndex = 1;
      this.mediumPageSize = pageSize;
    }

    this.mediumSortKey = sortField;
    this.mediumSortValue = sortOrder;
    this.searchMedium();
  }

  ////////////////////////////////////////  Medium Table //////////////////////////////////////////////
  ////////////////////////////////////////  Medium Drawer //////////////////////////////////////////////
  resetMediumDrawer(Mediumdata: NgForm) {
    this.mediumDrawerData = new MediumMaster();
    Mediumdata.form.markAsPristine();
    Mediumdata.form.markAsUntouched();
  }
  closeMediumDrawer(): void {
    this.mediumDrawerClose();
  }

  saveMedium(addNew: boolean, Mediumdata: NgForm): void {
    this.isOkMedium = true;
    this.isSpinningMedium = false;
    if (
      (this.mediumDrawerData.NAME == undefined ||
        this.mediumDrawerData.NAME == null ||
        this.mediumDrawerData.NAME == '') &&
      (this.mediumDrawerData.SEQ_NO <= 0 ||
        this.mediumDrawerData.SEQ_NO == null ||
        this.mediumDrawerData.SEQ_NO == undefined)
    ) {
      this.isOkMedium = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.mediumDrawerData.NAME == null ||
      this.mediumDrawerData.NAME == undefined ||
      this.mediumDrawerData.NAME == ''
    ) {
      this.isOkMedium = false;
      this.message.error('Please Enter Medium Name.', '');
    } else if (
      this.mediumDrawerData.SEQ_NO == undefined ||
      this.mediumDrawerData.SEQ_NO == null ||
      this.mediumDrawerData.SEQ_NO <= 0
    ) {
      this.isOkMedium = false;
      this.message.error(' Please Enter Sequence Number ', '');
    }

    if (this.isOkMedium) {
      this.isSpinningMedium = true;
      var extraFilter = '';

      if (this.roleId == 2) {
        this.mediumDrawerData.SCHOOL_ID = Number(
          sessionStorage.getItem('schoolid')
        );
      } else {
        this.mediumDrawerData.SCHOOL_ID = null;
      }
      if (this.mediumDrawerData.ID) {
        this.api
          .updateMedium(this.mediumDrawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(
                'Medium Master Data Updated Successfully...',
                ''
              );
              if (!addNew) this.mediumDrawerClose();
              this.isSpinningMedium = false;
            } else {
              this.message.error('Medium Master Data Updation Failed...', '');
              this.isSpinningMedium = false;
            }
          });
      } else {
        this.api
          .createMedium(this.mediumDrawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(
                'Medium Master Data Created Successfully...',
                ''
              );
              if (!addNew) this.mediumDrawerClose();
              else {
                this.mediumDrawerData = new MediumMaster();
                this.resetMediumDrawer(Mediumdata);
                var extraFilter = '';

                if (this.roleId == 2) {
                  extraFilter =
                    ' AND SCHOOL_ID = ' +
                    Number(sessionStorage.getItem('schoolid'));
                } else {
                  extraFilter = ' ';
                }
                this.api
                  .getAllMediumMaster(1, 1, '', 'desc', extraFilter)
                  .subscribe(
                    (data) => {
                      if (data['code'] == 200) {
                        if (data['count'] == 0) {
                          this.mediumDrawerData.SEQ_NO = 1;
                        } else {
                          this.mediumDrawerData.SEQ_NO =
                            data['data'][0]['SEQ_NO'] + 1;
                        }
                      } else {
                      }
                    },
                    (err) => {}
                  );
              }
              this.isSpinningMedium = false;
            } else {
              this.message.error('Medium Master Data Creation Failed...', '');
              this.isSpinningMedium = false;
            }
          });
      }
    }
  }
  //Delete Methods
  OnConfirmDeleteTeacher(data) {
    this.teacherLoadingRecords = true;
    data.STATUS = 0;
    this.api.UpdateTeacher(data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Teacher Deleted Successfully', '');
        this.teacherDrawerClose();
        this.teacherLoadingRecords = false;
      } else {
        this.message.error('Teacher Deletion Failed', '');
        this.teacherLoadingRecords = false;
      }
    });
  }
  OnConfirmDeleteDivision(data) {
    this.divisionLoadingRecords = true;
    data.STATUS = 0;
    this.api.updateDivision(data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Division Deleted Successfully', '');
        this.divisionClose();
        this.divisionLoadingRecords = false;
      } else {
        this.message.error('Division Deletion Failed', '');
        this.divisionLoadingRecords = false;
      }
    });
  }
  OnConfirmDeleteMedium(data) {
    this.mediumLoadingRecords = true;
    data.STATUS = 0;
    this.api.updateMedium(data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Medium Deleted Successfully', '');
        this.closeMediumDrawer();
        this.mediumLoadingRecords = false;
      } else {
        this.message.error('Medium Deletion Failed', '');
        this.mediumLoadingRecords = false;
      }
    });
  }
  OnConfirmDeleteFeeHead(data) {
    this.feeHeadloadingRecords = true;
    data.STATUS = 0;
    this.api.updateHead(data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Fee Head Deleted Successfully', '');
        this.feeHeadDrawerClose();
        this.feeHeadloadingRecords = false;
      } else {
        this.message.error('Fee Head Deletion Failed', '');
        this.feeHeadloadingRecords = false;
      }
    });
  }
  OnConfirmDeleteClass(data) {
    this.ClassLoadingRecords = true;
    data.STATUS = 0;
    this.api.updateClass(data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Class Deleted Successfully', '');
        this.ClassdrawerClose();
        this.ClassLoadingRecords = false;
      } else {
        this.message.error('Class Deletion Failed', '');
        this.ClassLoadingRecords = false;
      }
    });
  }
  OnConfirmDeleteSubject(data) {
    this.loadingRecordsSubject = true;
    data.STATUS = 0;
    this.api.updateSubjectMaster(data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Subject Deleted Successfully', '');
        this.subjectDrawerClose();
        this.loadingRecordsSubject = false;
      } else {
        this.message.error('Subject Deletion Failed', '');
        this.loadingRecordsSubject = false;
      }
    });
  }
  OnConfirmDeleteStudent(data) {
    this.loadingRecordsSubject = true;
    data.STATUS = 0;
    this.api.updateStudent(data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Student Deleted Successfully', '');
        this.loadingRecordsSubject = false;
        this.drawerCloseStudent();
      } else {
        this.message.error('Student Deletion Failed', '');
        this.loadingRecordsSubject = false;
      }
    });
  }
  ////////////////////////////////////////  Medium Drawer //////////////////////////////////////////////
}
