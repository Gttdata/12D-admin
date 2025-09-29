import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
// import { TeacherMaster1 } from '../../../Models/TeacherMaster1';
import { ApiService } from 'src/app/Services/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { TeacherMaster1 } from '../add-teacher-master/add-teacher-master.component';

@Component({
  selector: 'app-list-teacher-master',
  templateUrl: './list-teacher-master.component.html',
  styleUrls: ['./list-teacher-master.component.css'],
})
export class ListTeacherMasterComponent implements OnInit {
  formTitle = 'Manage Teachers';
  isShowBlocked = false;

  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  loadingRecords: boolean = false;
  sortValue = 'desc';
  sortKey = 'id';
  searchText = '';
  drawerVisible: boolean = false;
  drawerTitle = '';
  drawerData: TeacherMaster1 = new TeacherMaster1();
  dataList: TeacherMaster1[] = [];
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
  columns: [string, string][] = [
    ['NAME', 'NAME'],
    ['EMAIL_ID', 'EMAIL_ID'],
    ['MOBILE_NUMBER', 'MOBILE_NUMBER'],
    ['DOB', 'DOB'],
    ['GENDER', 'GENDER'],
    // ['SEQ_NO', 'SEQ_NO'],
  ];
  screenwidth = 0;
  step_no: number;
  currentroute = '';

  constructor(
    private router: Router,
    private api: ApiService,
    private message: NzNotificationService
  ) {
    router.events.subscribe((val) => {
      var url = window.location.href;
      var arr = url.split('/');
      this.currentroute = arr[3];
    });
  }

  ngOnInit() {
    this.roleId = Number(sessionStorage.getItem('roleId'));
    this.screenwidth = window.innerWidth;
    this.step_no = Number(sessionStorage.getItem('stepid'));

    if (this.step_no >= 0 && this.step_no < 6) {
      this.router.navigate(['/help1']);
    }
  }
  redirectToAdminDashboard() {
    window.location.href = '/admindashboard';
  }
  keyup(event: any) {
    this.search();
  }
  OnConfirmDelete(data) {
    this.loadingRecords=true
    data.STATUS = 0;
    this.api.UpdateTeacher(data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Teacher Deleted Successfully', '');
        this.drawerClose();
        this.loadingRecords = false;
      } else {
        this.message.error('Teacher Deletion Failed', '');
        this.loadingRecords = false;
      }
    });
  }
  clickevent(data: any) {
    this.APPROVAL_STATUS = data;
    this.pageIndex = 1;
    this.pageSize = 10;
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
    this.applyFilter();
  }
  applyFilter() {
    this.search(true);
  }
  // Basic Methods

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
    var statusFilter = '';
    if (this.APPROVAL_STATUS != undefined && this.APPROVAL_STATUS != 'ALL') {
      statusFilter = ' AND APPROVAL_STATUS=' + "'" + this.APPROVAL_STATUS + "'";
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
      .getALLTeacher(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
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
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];

            this.api.getTeacherCount(0, 0, '', '', extraFilter + ' AND STATUS=1').subscribe(
              (data) => {
                // this.data = data['data']
                this.pendingscounts = data['data'][0]['PENDING'];
                this.rejectscounts = data['data'][0]['REJECTED'];
                this.registercounts = data['data'][0]['ALL_COUNT'];
                this.approvedcounts = data['data'][0]['APPROVED'];
                this.blockedcounts = data['data'][0]['BLOCKED'];

                // this.isSpinning=false
              },
              (err) => {
                // this.isSpinning=false
              }
            );
          } else {
            this.message.error('Something Went Wrong', '');
            this.dataList = [];
            this.loadingRecords = false;
          }
        },
        (err) => {}
      );
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.isShowBlocked = false;
    this.drawerTitle = 'Create New Teacher';
    this.drawerData = new TeacherMaster1();
    this.drawerVisible = true;

    // this.api.getALLTeacher(1, 1, ' ID ', 'desc', '  AND SCHOOL_ID =' + Number(sessionStorage.getItem('schoolid'))).subscribe(
    //   (data) => {
    //     if (data['code'] == 200) {
    //       if (data['count'] == 0) {
    //         this.drawerData.SEQ_NO = 1;
    //       } else {
    //         this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
    //       }
    //       this.drawerVisible = true;

    //     }
    //   },
    //   (err) => {

    //   }
    // );
  }

  edit(data: TeacherMaster1): void {
    this.isShowBlocked = true;

    this.drawerTitle = 'Update Teacher';
    this.drawerData = Object.assign({}, data);

    this.drawerVisible = true;
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

  // Teacher Details
  isVisible = false;
  TEACHER_DATALIST: any;
  // APPROVAL_STATUS: any = 'A';
  submitstatusisSpinning: boolean = false;
  StatusButton: any;

  Preview(data1: TeacherMaster1) {
    this.StatusButton = data1.APPROVAL_STATUS;

    this.TEACHER_DATALIST = Object.assign({}, data1);

    this.isVisible = true;
  }

  SubmitStatus() {
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
          this.search();
          this.submitstatusisSpinning = false;
          this.isVisible = false;
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

  handleCancel() {
    this.isVisible = false;
  }
}
