import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Services/api.service';
import { ExportService } from 'src/app/Services/export.service';


@Component({
  selector: 'app-schoolwiseattendancetaken',
  templateUrl: './schoolwiseattendancetaken.component.html',
  styleUrls: ['./schoolwiseattendancetaken.component.css']
})
export class SchoolwiseattendancetakenComponent implements OnInit {


  formTitle = ' School Wise Attendance Report';
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
  class: any

  gender: any
  screenWidth = 0
  currentroute = '';

  roleId = Number(sessionStorage.getItem('roleId'))
  columns: string[][] = [

    ['SCHOOL_NAME', 'SCHOOL_NAME'],
    ['ATTENDANCE_COUNT', 'ATTENDANCE_COUNT'],

  ];
  schoolid = Number(sessionStorage.getItem('schoolid'))
  constructor(
    private api: ApiService,
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private exportservice: ExportService,


  ) {

  }

  ngOnInit(): void {


  }

  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'CLASS_ID';
      this.sortValue = 'desc';
    }
    // this.loadingRecords = true;
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
    }
    // var extraQuery=''
    // if(this.classes){
    //      extraQuery=" AND CLASS_ID = '" +this.classes+ "'"
    // }
    // if(this.year2){
    //     extraQuery+= " AND YEAR_ID= "+this.year2
    // }
    // if(this.division2){
    //   extraQuery+= " AND DIVISION_ID= "+this.division2
    // }
    // ' AND SCHOOL_ID= '+this.schoolid + extraQuery
    // if (exportInExcel == false) {
    //   this.api
    //     .getClassWiseAttendanceReport(
    //       this.pageIndex,
    //       this.pageSize,
    //       this.sortKey,
    //       sort,
    //       likeQuery + this.filterQuery
    //     )
    //     .subscribe(
    //       (data) => {
    //         if (data['code'] == 200) {
    //           this.totalRecords = data['count'];
    //           this.dataList = data['data'];
    //           this.loadingRecords = false;
    //         } else {
    //           this.dataList = [];
    //           this.message.error('Something Went Wrong', '');
    //           this.loadingRecords = false;
    //           this.filterClass = 'filter-invisible';
    //         }
    //       },
    //       (err) => {
    //         console.log(err);
    //       }
    //     );
    // } else {
    //   this.exportLoading = true;
    //   this.api
    //     .getClassWiseAttendanceReport(
    //       0,
    //       0,
    //       this.sortKey,
    //       sort,
    //       likeQuery + this.filterQuery
    //     )
    //     .subscribe(
    //       (data) => {
    //         if (data['code'] == 200) {
    //           this.totalRecords = data['count'];
    //           this.exportdataList = data['data'];
    //           this.loadingRecords = false;
    //           this.exportLoading = false;
    //           this.convertInExcel();
    //         } else {
    //           this.exportdataList = [];
    //           this.message.error('Something Went Wrong', '');
    //           this.loadingRecords = false;
    //           this.exportLoading = false;
    //         }
    //       },
    //       (err) => {
    //         console.log(err);
    //       }
    //     );
    // }
  }

  applyFilter() {
    this.loadingRecords = true;

    this.filterQuery = ''; // Reset filterQuery before applying new filters

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
    // if (this.filterQuery !== '') {
    //   this.filterClass = 'filter-invisible';
    //   this.search(true);
    //   this.isFilterApplied = 'primary';
    // } else {
    //   this.isFilterApplied = ''; // Reset isFilterApplied if no filters are applied
    // }

    // if (this.filterQuery !== '') {
    //   this.isFilterApplied = 'primary';
    //   this.filterClass = 'filter-invisible';
    //   this.search(true);
    // } else {
    //   this.isFilterApplied = ''; // Reset isFilterApplied if no filters are applied
    // }

    this.loadingRecords = false;
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
  }


  clearFilter() {
    this.searchText = '';
    this.filterQuery = '';
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
    this.search(true);
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
  importInExcel() {
    this.search(true, true);
  }

  convertInExcel() {
    var arry1 = [];
    var obj1: any = new Object();
    for (var i = 0; i < this.exportdataList.length; i++) {
      obj1['School Name'] = this.exportdataList[i]['SCHOOL_NAME'];
      obj1['Attendance Count'] = this.exportdataList[i]['ATTENDANCE_COUNT'];
      

      arry1.push(Object.assign({}, obj1));
      if (i == this.exportdataList.length - 1) {
        this.exportservice.exportExcel(
          arry1,
          'School Wise Attendance Report ' +
          this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        );
      }
    }
  }


}

