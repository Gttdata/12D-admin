import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Services/api.service';
import { ExportService } from 'src/app/Services/export.service';

@Component({
  selector: 'app-classwise-attendance-report',
  templateUrl: './classwise-attendance-report.component.html',
  styleUrls: ['./classwise-attendance-report.component.css'],
})
export class ClasswiseAttendanceReportComponent implements OnInit {
  formTitle = ' Class Wise Weekly Attendance Report ';
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
  class: any;
  classlist: any[] = [];
  division: any;
  divisionlist: any[] = [];
  medium: any;
  mediumlist: any[] = [];
  year: any;
  yearlist: any[] = [];
  gender: any;
  screenWidth = 0;
  currentroute = '';
  type = '';
  classes = '';
  division2;
  year2;
  extraQuery = '';
  roleId = Number(sessionStorage.getItem('roleId'));
  columns: string[][] = [
    ['CLASS_NAME', 'CLASS_NAME'],
    ['DIVISION_NAME', 'DIVISION_NAME'],
    // ['YEAR', 'YEAR'],
    // ['PRESENT_COUNT', 'PRESENT_COUNT'],
    // ['ABSENT_COUNT', 'ABSENT_COUNT']
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
  ngOnInit(): void {
    this.getclassList();
    this.screenWidth = window.innerWidth;
    if (sessionStorage.getItem('Count Type')) {
      this.type = sessionStorage.getItem('Count Type');
    }
    if (sessionStorage.getItem('Class')) {
      this.classes = sessionStorage.getItem('Class');
    }
    if (sessionStorage.getItem('divisionFilter')) {
      this.division2 = sessionStorage.getItem('divisionFilter');
    }
    if (sessionStorage.getItem('YearFilter')) {
      this.year2 = sessionStorage.getItem('YearFilter');
    }
    // console.log(this.type,this.classes);
  }
  // ngOnDestroy(){
  //   sessionStorage.removeItem('Class')
  //   sessionStorage.removeItem('Count Type')
  // }
  getclassList() {
    this.api
      .getAllClassMaster(
        0,
        0,
        'ID',
        'asc',
        ' AND STATUS = 1 AND SCHOOL_ID= ' + this.schoolid
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.classlist = data['data'];
          } else {
            this.classlist = [];
          }
        },
        (err) => {
          console.log(err);
        }
      );
    this.api
      .getAllDivisions(
        0,
        0,
        'ID',
        'asc',
        ' AND STATUS = 1 AND SCHOOL_ID= ' + this.schoolid
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.divisionlist = data['data'];
          } else {
            this.divisionlist = [];
          }
        },
        (err) => {
          console.log(err);
        }
      );
    // this.api.getAllMediumMaster(0, 0, 'ID', 'asc', ' AND STATUS = 1 AND SCHOOL_ID= '+this.schoolid).subscribe(
    //   (data) => {
    //     if (data['code'] == 200) {
    //       this.mediumlist = data['data'];
    //     }
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
    // this.api.getAllYearMaster(0, 0, 'ID', 'asc', ' AND STATUS = 1 AND SCHOOL_ID= '+this.schoolid).subscribe(
    //   (data) => {
    //     if (data['code'] == 200) {
    //       this.yearlist = data['data'];
    //     }
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
  }
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'CLASS_ID';
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
      this.sortKey = 'CLASS_ID';
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
    var extraQuery = '';
    if (this.classes) {
      extraQuery = " AND CLASS_ID = '" + this.classes + "'";
    }
    if (this.year2) {
      extraQuery += ' AND YEAR_ID= ' + this.year2;
    }
    if (this.division2) {
      extraQuery += ' AND DIVISION_ID= ' + this.division2;
    }

    if (exportInExcel == false) {
      this.api
        .getClassWiseAttendanceReport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery +
            this.filterQuery +
            ' AND SCHOOL_ID= ' +
            this.schoolid +
            extraQuery
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
        .getClassWiseAttendanceReport(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery +
            this.filterQuery +
            ' AND SCHOOL_ID= ' +
            this.schoolid +
            extraQuery
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

    this.filterQuery = ''; // Reset filterQuery before applying new filters

    if (this.class !== undefined && this.class !== null && this.class !== '') {
      this.filterQuery += ' AND CLASS_ID = ' + this.class;
      this.isFilterApplied = 'primary';
    }

    if (
      this.division !== undefined &&
      this.division !== null &&
      this.division !== ''
    ) {
      this.filterQuery += ' AND DIVISION_ID =' + this.division;
      this.isFilterApplied = 'primary';
    }

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
    this.class = null;
    this.division = null;
    this.medium = null;
    this.year = null;
    this.gender = null;
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
    if (this.exportdataList.length > 0) {
      for (var i = 0; i < this.exportdataList.length; i++) {
        obj1['Class'] = this.exportdataList[i]['CLASS_NAME'];
        obj1['Division'] = this.exportdataList[i]['DIVISION_NAME'];
        // obj1['Year'] = this.exportdataList[i]['YEAR'];
        obj1['Present Count'] = this.exportdataList[i]['PRESENT_COUNT'];
        obj1['Absent Count'] = this.exportdataList[i]['ABSENT_COUNT'];

        arry1.push(Object.assign({}, obj1));
        if (i == this.exportdataList.length - 1) {
          this.exportservice.exportExcel(
            arry1,
            'Classwise Attendance Report ' +
              this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          );
        }
      }
    } else {
      this.message.error('No Data', '');
    }
  }
}
