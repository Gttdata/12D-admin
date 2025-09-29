import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Services/api.service';
import { ExportService } from 'src/app/Services/export.service';

@Component({
  selector: 'app-classwise-hw-completion-detailed-report',
  templateUrl: './classwise-hw-completion-detailed-report.component.html',
  styleUrls: ['./classwise-hw-completion-detailed-report.component.css'],
})
export class ClasswiseHwCompletionDetailedReportComponent implements OnInit {
  formTitle = 'Classwise Home Work Completion Report ';
  dataList: any[] = [];
  exportdataList: any[] = [];
  loadingRecords = false;
  exportLoading = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  filterClass: any = 'filter-invisible';
  isSpinning = false;
  // class: any;
  // classlist: any[] = [];
  // division: any;
  // divisionlist: any[] = [];
  // medium: any;
  // mediumlist: any[] = [];
  // year: any;
  // yearlist: any[] = [];
  // gender: any;
  screenWidth = 0;
  currentroute = '';
  date = new Date();
  fromDate: any = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  // Assuming this.date is a Date object
  toDate: any = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
  // yearFilter = '';
  // pendingFilter = '';
  // divisionFilter = '';
  // classFilter=''
  roleId = Number(sessionStorage.getItem('roleId'));
  columns: string[][] = [
    ['STUDENT_NAME', 'STUDENT_NAME'],
    ['CLASS_NAME', 'CLASS_NAME'],
    ['DIVISION_NAME', 'DIVISION_NAME'],
    ['NO_OF_TASK_ASSIGNED', 'NO_OF_TASK_ASSIGNED'],
    ['NO_OF_COMPLETED_TASK', 'NO_OF_COMPLETED_TASK'],
    ['NO_OF_INCOMPLETE_TASK', 'NO_OF_INCOMPLETE_TASK'],
  ];
  schoolid = Number(sessionStorage.getItem('schoolid'));
  constructor(
    private api: ApiService,
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private exportservice: ExportService,
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
  ngOnInit(): void {}

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    console.log(currentSort);

    console.log('sortOrder :' + sortOrder);
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

  search(reset: boolean = false, exportInExcel: boolean = false) {
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
    console.log('search text:' + this.searchText);
    if (this.searchText != '') {
      likeQuery = ' AND (';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
      // console.log('likeQuery' + likeQuery);
    }
    if (this.fromDate && this.toDate) {
      this.fromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
      this.toDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');
      this.filterQuery =
        " AND date(ASSIGNED_DATE) between ('" +
        this.fromDate +
        "'" +
        " AND '" +
        this.toDate +
        "')";
      this.isFilterApplied = 'primary';
    }
    //  console.log(extraQuery,this.pendingFilter,this.divisionFilter);

    if (exportInExcel == false) {
      this.api
        .getClasswiseHomwerk(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery + ' AND SCHOOL_ID= ' + this.schoolid
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.loadingRecords = false;
            } else {
              this.dataList = [];
              this.message.error('Something Went Wrong', '');
              this.loadingRecords = false;
              this.filterClass = 'filter-invisible';
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } else {
      this.exportLoading = true;
      this.api
        .getClasswiseHomwerk(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery + ' AND SCHOOL_ID= ' + this.schoolid
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.totalRecords = data['count'];
              this.exportdataList = data['data'];
              this.loadingRecords = false;
              this.exportLoading = false;
              this.convertInExcel();
            } else {
              this.exportdataList = [];
              this.message.error('Something Went Wrong', '');
              this.loadingRecords = false;
              this.exportLoading = false;
            }
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  keyup(event: any) {
    this.search(true);
  }

  onKeyPressEvent() {
    document.getElementById('search')!.focus();
    this.search(true);
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
    // console.log('dfghjk');
  }

  applyFilter() {
    this.loadingRecords = true;
    var ok = true;
    this.filterQuery = ''; // Reset filterQuery before applying new filters
    if (this.fromDate && this.toDate) {
      this.fromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
      this.toDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');
      this.filterQuery =
        " AND date(ASSIGNED_DATE) between ('" +
        this.fromDate +
        "'" +
        " AND '" +
        this.toDate +
        "')";
    } else {
      if (this.fromDate && !this.toDate) {
        this.message.error('Please Select To Date', '');
        ok = false;
        this.filterQuery = '';
      } else if (!this.fromDate && this.toDate) {
        this.message.error('Please Select from Date', '');
        ok = false;
        this.filterQuery = '';
      } else {
        this.message.error('Please Select From And To Date', '');
        ok = false;
        this.filterQuery = '';
      }
    }
    // console.log(this.fromDate,this.toDate);

    // if (this.class !== undefined && this.class !== null && this.class !== '') {
    //   this.filterQuery += ' AND CLASS_ID = ' + this.class;
    //   this.isFilterApplied = 'primary';
    // }

    // if (
    //   this.division !== undefined &&
    //   this.division !== null &&
    //   this.division !== ''
    // ) {
    //   this.filterQuery += ' AND DIVISION_ID =' + this.division;
    //   this.isFilterApplied = 'primary';
    // }

    // if (
    //   this.medium !== undefined &&
    //   this.medium !== null &&
    //   this.medium !== ''
    // ) {
    //   this.filterQuery += ' AND MEDIUM_ID = ' + this.medium;
    //   this.isFilterApplied = 'primary';
    // }

    // if (this.year !== undefined && this.year !== null && this.year !== '') {
    //   this.filterQuery += ' AND YEAR_ID = ' + this.year;
    //   this.isFilterApplied = 'primary';
    // }

    // if (
    //   this.gender !== undefined &&
    //   this.gender !== null &&
    //   this.gender !== ''
    // ) {
    //   this.filterQuery += ' AND GENDER = ' + this.gender;
    //   this.isFilterApplied = 'primary';
    // }
    if (this.filterQuery == '') {
      this.message.error('Please Select A Filter To Apply', '');
    }
    if (this.filterQuery !== '') {
      this.filterClass = 'filter-invisible';
      this.search(true);
      this.isFilterApplied = 'primary';
    } else {
      this.isFilterApplied = ''; // Reset isFilterApplied if no filters are applied
    }

    // if (this.filterQuery !== '') {
    //   this.isFilterApplied = 'primary';
    //   this.filterClass = 'filter-invisible';
    //   this.search(true);
    // } else {
    //   this.isFilterApplied = ''; // Reset isFilterApplied if no filters are applied
    // }

    this.loadingRecords = false;
  }

  clearFilter() {
    this.fromDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    this.toDate = new Date(
      this.date.getFullYear(),
      this.date.getMonth() + 1,
      0
    );
    this.searchText = '';
    this.filterQuery = '';
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
    this.search(true);
  }

  importInExcel() {
    this.search(true, true);
  }

  convertInExcel() {
    var arry1 = [];
    var obj1: any = new Object();
    if (this.exportdataList.length) {
      for (var i = 0; i < this.exportdataList.length; i++) {
        obj1['Student Name'] = this.exportdataList[i]['STUDENT_NAME'];
        obj1['Class'] = this.exportdataList[i]['CLASS_NAME'];
        obj1['Division'] = this.exportdataList[i]['DIVISION_NAME'];
        obj1['No Of Task Assigned'] =
          this.exportdataList[i]['NO_OF_TASK_ASSIGNED'];
        obj1['No Of Completed Task'] =
          this.exportdataList[i]['NO_OF_COMPLETED_TASK'];
        obj1['No Of Incomplete Task'] =
          this.exportdataList[i]['NO_OF_INCOMPLETE_TASK'];

        arry1.push(Object.assign({}, obj1));
        if (i == this.exportdataList.length - 1) {
          this.exportservice.exportExcel(
            arry1,
            'Class Wise Home Work Detailed Report ' +
              this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          );
        }
      }
    } else {
      this.message.error('No Data', '');
    }
  }
}
