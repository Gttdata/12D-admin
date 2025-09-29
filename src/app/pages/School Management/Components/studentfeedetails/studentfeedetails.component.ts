import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { studentfeedetails } from '../../Models/studentfeedetails';
import { ApiService } from 'src/app/Services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-studentfeedetails',
  templateUrl: './studentfeedetails.component.html',
  styleUrls: ['./studentfeedetails.component.css'],
})
export class StudentfeedetailsComponent implements OnInit {
  isLoading: boolean = false;
  formTitle: string = "Manage Student Fee's";
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: studentfeedetails = new studentfeedetails();
  dataList = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  filterClass: string = 'filter-invisible';
  studentlist = [];
  classlist = [];
  classload: boolean = false;
  yearload: boolean = false;
  divisionload: boolean = false;
  divisionlist: any[] = [];
  currentroute = '';

  columns: string[][] = [
    ['STUDENT_NAME', 'STUDENT_NAME'],
    ['TOTAL_FEE', 'TOTAL_FEE'],
    ['PAID_FEE', 'PAID_FEE'],
    ['PENDING_FEE', 'PENDING_FEE'],
    ['CLASS_NAME', 'CLASS_NAME'],
    ['YEAR', 'YEAR'],
    ['DIVISION_NAME', 'DIVISION_NAME'],
    ['PAID_FEE', 'PAID_FEE'],
    ['TOTAL_FEE', 'TOTAL_FEE'],
    ['PENDING_FEE', 'PENDING_FEE'],
  ];
  yearlist = [];
  isSpinning: boolean = false;
  public commonFunction = new CommomFunctionsService();
  isOk: boolean = true;
  yearLoad: boolean = false;
  roleId: number;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private router: Router
  ) {
    router.events.subscribe((val) => {
      var url = window.location.href;
      var arr = url.split('/');
      this.currentroute = arr[3];
    });
  }
  redirectToAdminDashboard() {
    window.location.href = '/admindashboard';
  }
  // data:any=new planmaster()
  YEAR_ID: any;
  ngOnInit(): void {
    this.roleId = Number(sessionStorage.getItem('roleId'));
    this.YEAR_ID = Number(sessionStorage.getItem('yearId'));
    this.getStudent();
    this.getClass();
    this.getYear();
    this.getDivision();

    this.applyFilter();
  }
  sendNotification(data) {
    // console.log(data)
    // let arrayOfdata = [];
    let obj = {
      YEAR_ID: 0,
      STUDENT_IDs: [],
    };
    if (data) {
      obj['YEAR_ID'] = data.YEAR_ID;
      obj['STUDENT_IDs'].push(data.STUDENT_ID);
      // arrayOfdata.push(data);
      this.api.sendNotification2(obj).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.message.success('Notification Sent Successfully', '');
          } else if (data['code'] == 300) {
            this.message.info("There Is a No Pending Fee's", '');
          } else {
            this.message.error('Failed To Send Notification', '');
          }
        },
        (err) => {
          this.message.error('Failed To Send Notification', '');
        }
      );
    }
    // sendNotification2
  }
  close(): void {
    this.drawerClose();
  }
  keyup(event: any) {
    this.search();
  }
  getStudent() {
    var extraFilter: any = '';
    if (this.roleId == 3 || this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = '';
    }
    this.api
      .getAllstudents(0, 0, '', '', ' AND STATUS=1' + extraFilter)
      .subscribe((student) => {
        if (student.code == 200) {
          this.studentlist = student['data'];
        } else {
          this.message.error('Failed To Get Student', ``);
          this.studentlist = [];
        }
      });
  }
  getClass() {
    this.classload = true;
    var extraFilter: any = '';
    if (this.roleId == 3 || this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = '';
    }
    this.api
      .getAllClassMaster(0, 0, '', '', ' AND STATUS=1' + extraFilter)
      .subscribe((classs) => {
        if (classs.code == 200) {
          this.classlist = classs['data'];
          this.classload = false;
        } else {
          this.message.error('Failed To Get Classes', ``);
          this.classload = false;
          this.classlist = [];
        }
      });
  }
  getYear() {
    this.yearload = true;
    // var extraFilter: any = '';
    // if (this.roleId == 3 || this.roleId == 2) {
    //   extraFilter =
    //     ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    // } else {
    //   extraFilter = '';
    // }
    this.api.getAllYearMaster(0, 0, 'id', 'asc', ' AND STATUS=1').subscribe(
      (year) => {
        if (year.code == 200) {
          this.yearlist = year['data'];

          this.yearload = false;
        } else {
          this.message.error('Failed To Get Year', '');
          this.yearload = false;

          this.yearlist = [];
        }
      },
      (err) => {}
    );
  }
  getDivision() {
    var extraFilter: any = '';
    if (this.roleId == 3 || this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = '';
    }
    this.divisionload = true;
    this.api
      .getAllDivisions(0, 0, '', '', ' AND STATUS=1' + extraFilter)
      .subscribe(
        (division) => {
          if (division.code == 200) {
            this.divisionlist = division['data'];
            this.divisionload = false;
          } else {
            this.message.error('Failed To Get Year', '');
            this.divisionload = false;

            this.divisionlist = [];
          }
        },
        (err) => {}
      );
  }
  onClassSelected(id) {
    var extraFilter: any = '';
    if (this.roleId == 3 || this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = '';
    }
    this.api
      .getAllClassMaster(
        0,
        0,
        '',
        '',
        ` AND ID=${id} AND STATUS=1 ` + extraFilter
      )
      .subscribe((classs) => {
        if (classs.code == 200) {
          if (classs['data'][0]['TOTAL_FEES']) {
            this.drawerData.TOTAL_FEE = classs['data'][0]['TOTAL_FEES'];
            this.pendingFee(this.drawerData.TOTAL_FEE);
          } else {
            this.drawerData.TOTAL_FEE = 0;
          }
        } else {
          this.drawerData.TOTAL_FEE = 0;
          this.message.error('Failed To Get Class', ``);
        }
      });
  }

  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search();
  }
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND(';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
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
      .getAlFeeDetailsMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + extraFilter + this.filterQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.filterClass = 'filter-invisible';
          } else {
            this.loadingRecords = false;
            this.message.error('Something Went Wrong', '');
          }
          // if(this.totalRecords==0){
          //   data.SEQ_NO=1;
          // }else{
          //   data.SEQ_NO= this.dataList[this.dataList.length-1]['SEQ_NO']+1
          // }
        },
        (err) => {}
      );
  }

  showFilter(): void {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  CLASS_ID: any;
  DIVISION_ID: any;

  applyFilter() {
    this.isSpinning = true;
    this.loadingRecords = true;

    this.filterQuery = '';
    if (
      this.YEAR_ID != undefined &&
      this.YEAR_ID != null &&
      this.YEAR_ID != '' &&
      this.CLASS_ID != undefined &&
      this.CLASS_ID != null &&
      this.CLASS_ID != '' &&
      this.DIVISION_ID != undefined &&
      this.DIVISION_ID != null &&
      this.DIVISION_ID != ''
    ) {
      this.filterQuery =
        ' AND YEAR_ID = ' +
        this.YEAR_ID +
        ' AND CLASS_ID=' +
        this.CLASS_ID +
        ' AND DIVISION_ID = ' +
        this.DIVISION_ID;
    } else if (
      (this.YEAR_ID == undefined ||
        this.YEAR_ID == null ||
        this.YEAR_ID == '') &&
      this.CLASS_ID != undefined &&
      this.CLASS_ID != null &&
      this.CLASS_ID != '' &&
      this.DIVISION_ID != undefined &&
      this.DIVISION_ID != null &&
      this.DIVISION_ID != ''
    ) {
      this.filterQuery =
        ' AND CLASS_ID=' +
        this.CLASS_ID +
        ' AND DIVISION_ID = ' +
        this.DIVISION_ID;
    } else if (
      this.YEAR_ID != undefined &&
      this.YEAR_ID != null &&
      this.YEAR_ID != '' &&
      (this.CLASS_ID == undefined ||
        this.CLASS_ID == null ||
        this.CLASS_ID == '') &&
      this.DIVISION_ID != undefined &&
      this.DIVISION_ID != null &&
      this.DIVISION_ID != ''
    ) {
      this.filterQuery =
        ' AND YEAR_ID = ' +
        this.YEAR_ID +
        ' AND DIVISION_ID = ' +
        this.DIVISION_ID;
    } else if (
      this.YEAR_ID != undefined &&
      this.YEAR_ID != null &&
      this.YEAR_ID != '' &&
      this.CLASS_ID != undefined &&
      this.CLASS_ID != null &&
      this.CLASS_ID != '' &&
      (this.DIVISION_ID == undefined ||
        this.DIVISION_ID == null ||
        this.DIVISION_ID == '')
    ) {
      this.filterQuery =
        ' AND YEAR_ID = ' + this.YEAR_ID + ' AND CLASS_ID=' + this.CLASS_ID;
    } else if (
      this.YEAR_ID != undefined &&
      this.YEAR_ID != null &&
      this.YEAR_ID != '' &&
      (this.CLASS_ID == undefined ||
        this.CLASS_ID == null ||
        this.CLASS_ID == '') &&
      (this.DIVISION_ID == undefined ||
        this.DIVISION_ID == null ||
        this.DIVISION_ID == '')
    ) {
      this.filterQuery = ' AND YEAR_ID = ' + this.YEAR_ID;
    } else if (
      (this.YEAR_ID == undefined ||
        this.YEAR_ID == null ||
        this.YEAR_ID == '') &&
      this.CLASS_ID != undefined &&
      this.CLASS_ID != null &&
      this.CLASS_ID != '' &&
      (this.DIVISION_ID == undefined ||
        this.DIVISION_ID == null ||
        this.DIVISION_ID == '')
    ) {
      this.filterQuery = ' AND CLASS_ID=' + this.CLASS_ID;
    } else if (
      (this.YEAR_ID == undefined ||
        this.YEAR_ID == null ||
        this.YEAR_ID == '') &&
      (this.CLASS_ID == undefined ||
        this.CLASS_ID == null ||
        this.CLASS_ID == '') &&
      this.DIVISION_ID != undefined &&
      this.DIVISION_ID != null &&
      this.DIVISION_ID != ''
    ) {
      this.filterQuery = ' AND DIVISION_ID = ' + this.DIVISION_ID;
    }
    if (
      this.filterQuery == '' ||
      this.filterQuery == null ||
      this.filterQuery == undefined
    ) {
      this.message.error('', 'Please Select Any Filter Value');
      this.loadingRecords = false;
      this.isSpinning = false;
      this.isFilterApplied = 'default';
      this.filterClass = 'filter-visible';
    } else {
      this.isFilterApplied = 'primary';
      this.search();
    }
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.isOk = true;
    this.CLASS_ID = null;
    this.DIVISION_ID = null;
    this.YEAR_ID = Number(sessionStorage.getItem('yearId'));
    this.filterQuery = ' AND YEAR_ID = ' + this.YEAR_ID;

    this.search();
  }
  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.drawerTitle = 'Create Student Fees';
    this.drawerData = new studentfeedetails();

    this.drawerVisible = true;
  }
  edit(data: any): void {
    this.drawerTitle = 'Update Student Fees';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
    this.onClassSelected(data.CLASS_ID);
    this.pendingFee(data.TOTAL_FEE);
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.pageSize != pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
  }

  //save
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      (this.drawerData.STUDENT_ID == undefined ||
        this.drawerData.STUDENT_ID == null) &&
      (this.drawerData.YEAR_ID == undefined ||
        this.drawerData.YEAR_ID == null) &&
      (this.drawerData.CLASS_ID == undefined ||
        this.drawerData.CLASS_ID == null) &&
      (this.drawerData.DIVISION_ID == undefined ||
        this.drawerData.DIVISION_ID == null) &&
      (this.drawerData.TOTAL_FEE == undefined ||
        this.drawerData.TOTAL_FEE == null) &&
      (this.drawerData.PAID_FEE == undefined ||
        this.drawerData.PAID_FEE == null) &&
      (this.drawerData.PENDING_FEE == undefined ||
        this.drawerData.PENDING_FEE == null)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All Required Fields', '');
    } else if (
      this.drawerData.STUDENT_ID == undefined ||
      this.drawerData.STUDENT_ID == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Student', '');
    } else if (
      this.drawerData.YEAR_ID == undefined ||
      this.drawerData.YEAR_ID == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Year', '');
    } else if (
      this.drawerData.CLASS_ID == undefined ||
      this.drawerData.CLASS_ID == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Class', '');
    } else if (
      this.drawerData.DIVISION_ID == undefined ||
      this.drawerData.DIVISION_ID == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Division', '');
    } else if (
      this.drawerData.TOTAL_FEE == undefined ||
      this.drawerData.TOTAL_FEE == null
    ) {
      this.isOk = false;
      this.message.error('Please Enter Total Fees', '');
    } else if (
      this.drawerData.PAID_FEE == undefined ||
      this.drawerData.PAID_FEE == null
    ) {
      this.isOk = false;
      this.message.error('Please Enter Paid Fees', '');
    } else if (this.drawerData.PAID_FEE > this.drawerData.TOTAL_FEE) {
      this.isOk = false;
      this.message.error('Paid Fees Should Be Less Than Total Fee', '');
    } else if (
      this.drawerData.PENDING_FEE == undefined ||
      this.drawerData.PENDING_FEE == null
    ) {
      this.isOk = false;
      this.message.error('Please Enter Pending Fees', '');
    }
    if (this.isOk) {
      // this.isSpinning=false;
      this.drawerData.SCHOOL_ID = Number(sessionStorage.getItem('schoolid'));
      this.isSpinning = true;

      if (this.drawerData.ID) {
        this.api
          .UpdateStudentFeeDetails(this.drawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(
                'Student Fees Details Updated Successfully',
                ''
              );
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Failed To Update Student Fees Details', '');
              this.isSpinning = false;
            }
          });
      } else {
        this.api
          .CreateStudentFeeDetails(this.drawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(
                'Student Fees Details Created Successfully',
                ''
              );
              if (!addNew) this.drawerClose();
              else {
                this.drawerData = new studentfeedetails();
                this.resetDrawer(websitebannerPage);
              }
              this.isSpinning = false;
            } else {
              this.message.error('Fialed To Create Student Fees Details', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }
  resetDrawer(websitebannerPage: NgForm) {
    this.drawerData = new studentfeedetails();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  pendingFee(event) {
    if (event != null && event != undefined && event != '') {
      if (
        this.drawerData.PAID_FEE != null &&
        this.drawerData.PAID_FEE != undefined &&
        this.drawerData.PAID_FEE != ''
      ) {
        var pendingFee = 0;
        pendingFee = Number(event) - Number(this.drawerData.PAID_FEE);
        this.drawerData.PENDING_FEE = Number(pendingFee);
      } else {
        this.drawerData.PENDING_FEE = 0;
      }
    } else {
      this.drawerData.PENDING_FEE = 0;
    }
  }
  totalPendingFee(event) {
    if (event != null && event != undefined && event != '') {
      if (
        this.drawerData.TOTAL_FEE != null &&
        this.drawerData.TOTAL_FEE != undefined &&
        this.drawerData.TOTAL_FEE != ''
      ) {
        var pendingFee = 0;
        pendingFee = Number(this.drawerData.TOTAL_FEE) - Number(event);
        this.drawerData.PENDING_FEE = Number(pendingFee);
      } else {
        this.drawerData.PENDING_FEE = 0;
      }
    } else {
      this.drawerData.PENDING_FEE = 0;
    }
  }
  drawerVisibleMap: boolean = false;
  Total: any = 0;
  feeData: any = [];
  drawerTitleMap: any;
  StudentID;
  StudentName;
  mapFee(data: any): void {
    // console.log(data);

    this.drawerData.DISCOUNT_AMOUNT = data['DISCOUNT_AMOUNT'];
    this.drawerData.PENDING_FEE = data['PENDING_FEE'];
    this.drawerData.PAID_FEE = data['PAID_FEE'];
    this.drawerData.TOTAL_FEE = data['TOTAL_FEE'];

    this.drawerTitleMap = " Fee Detail's";
    this.drawerData = Object.assign({}, data);
    this.drawerVisibleMap = true;
  }

  // ashag
  drawerCloseMap(): void {
    this.search();
    this.drawerVisibleMap = false;
  }
  get closeCallbackMap() {
    return this.drawerCloseMap.bind(this);
  }

  deleteCancel(): void {}
  deleteConfirm(drawerData) {
    this.loadingRecords = true;

    var data = {
      ID: drawerData.ID,
    };
    this.api.studentFeeDelete(data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Fee Details Deleted Successfully', '');
        this.search();
      } else {
        this.message.error('Fee Details Deletion Failed', '');
        this.loadingRecords = false;
      }
    });
  }
}
