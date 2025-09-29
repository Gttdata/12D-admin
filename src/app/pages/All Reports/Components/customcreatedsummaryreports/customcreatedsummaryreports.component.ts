import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Services/api.service';
import { ExportService } from 'src/app/Services/export.service';

@Component({
  selector: 'app-customcreatedsummaryreports',
  templateUrl: './customcreatedsummaryreports.component.html',
  styleUrls: ['./customcreatedsummaryreports.component.css']
})
export class CustomcreatedsummaryreportsComponent implements OnInit {

  formTitle = 'Custom Created Workout Summary Report';
  dataList: any[] = [];
  exportdataList: any[] = [];
  loadingRecords = false;
  exportLoading = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'USER_ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  filterClass: any = 'filter-invisible';
  isSpinning = false;
  screenWidth = 0;
  yearId: any;
  currentroute = '';
  yearlist: any[] = [];
  isyearLoad: boolean = false;
  schoolid = Number(sessionStorage.getItem('schoolid'));
  roleId = Number(sessionStorage.getItem('roleId'));
  columns: string[][] = [
    // ['NAME', 'NAME'],
    ['USER_NAME', 'USER_NAME'],
    // ['MOBILE_NUMBER', 'MOBILE_NUMBER'],
    // ['DEVICE_NAME', 'DEVICE_NAME'],

    // ['STUDENT_COUNT', 'STUDENT_COUNT'],
    // ['TEACHERS_COUNT', 'STUDENT_COUNT'],
  ];

  // androidVersionList=[]
  // androidVersionLoad=false
  constructor(
    private api: ApiService,
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private exportservice: ExportService
  ) {}

  ngOnInit(): void {}

  fromDate: any;
  toDate: any;
  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'USER_ID';
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
    if (exportInExcel == false) {
      this.api
        .getCustomCreatedsummaryReport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery
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
              this.filterClass = 'filter-visible';
              this.isFilterApplied = 'default';
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } else {
      this.exportLoading = true;
      this.api
        .getCustomCreatedsummaryReport(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery
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
  onChange(event) {
    // console.log(this.lastVisitDatetime)
  }
  applyFilter() {
    this.loadingRecords = true;

    this.filterQuery = '';

    // if (
    //   this.yearId !== undefined &&
    //   this.yearId !== null &&
    //   this.yearId !== ''
    // ) {
    //   this.filterQuery += ' AND YEAR_ID =' + this.yearId;
    // }

    if (
      (this.fromDate != undefined || this.fromDate != null) &&
      (this.toDate == undefined || this.toDate == null)
    ) {
      this.message.error('Please Select To Date', '');
      this.isFilterApplied = 'default';
      this.filterClass = 'filter-visible';
    } else if (
      (this.fromDate == undefined || this.fromDate == null) &&
      (this.toDate != undefined || this.toDate != null)
    ) {
      this.message.error('Please Select From Date', '');
      this.isFilterApplied = 'default';
      this.filterClass = 'filter-visible';
    }
    if (this.fromDate && this.toDate) {
      this.filterQuery =
        " AND CREATED_MODIFIED_DATE between '" +
        this.datePipe.transform(this.fromDate, 'yyyy-MM-dd') +
        "' and '" +
        this.datePipe.transform(this.toDate, 'yyyy-MM-dd') +
        "'";
    } else if (
      (this.filterQuery == '' ||
        this.filterQuery == null ||
        this.filterQuery == undefined) &&
      !this.fromDate &&
      !this.toDate
    ) {
      // if (this.activateDate && this.activateDate.length > 0) {
      //   this.activateDate[0] = this.datePipe.transform(
      //     this.activateDate[0],
      //     'yyyy-MM-dd'
      //   );
      //   this.activateDate[1] = this.datePipe.transform(
      //     this.activateDate[1],
      //     'yyyy-MM-dd'
      //   );
      //   this.filterQuery +=
      //     " AND ACTIVATE_DATE between '" +
      //     this.activateDate[0] +
      //     "' AND '" +
      //     this.activateDate[1] +
      //     "'";
      //   // console.log(this.filterQuery)
      // }

      this.message.error('', 'Please Select Filter Value');
      this.loadingRecords = false;
      this.isSpinning = false;
      this.isFilterApplied = 'default';
      this.filterClass = 'filter-visible';
    }
    if (this.filterQuery != '') {
      this.isFilterApplied = 'primary';
      this.filterClass = 'filter-invisible';
      this.search();
    }

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
    this.fromDate = null;
    this.toDate = null;
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';

    this.search(true);
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'USER_ID';
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
    if (this.dataList.length > 0) {
      this.search(true, true);
    } else {
      this.message.error('No Data ....', '');
    }
  }

  convertInExcel() {
    var arry1 = [];
    var obj1: any = new Object();
    for (var i = 0; i < this.exportdataList.length; i++) {
      obj1['User Name'] = this.exportdataList[i]['USER_NAME'];
      // obj1['Workout Name'] = this.exportdataList[i]['HEAD_NAME'];
      // obj1['Created Datetime'] = this.exportdataList[i]['CREATED_MODIFIED_DATE']
      //   ? this.datePipe.transform(
      //       this.exportdataList[i]['CREATED_MODIFIED_DATE'],
      //       'dd/MMM/yyyy HH:mm'
      //     )
      //   : this.exportdataList[i]['CREATED_MODIFIED_DATE'];
      // obj1['Total Amount'] = this.exportdataList[i]['AMOUNT'];
      obj1['Number Of Custom Workouts'] =
        this.exportdataList[i]['NUMBER_OF_ACTIVITIES'] 

      arry1.push(Object.assign({}, obj1));
      if (i == this.exportdataList.length - 1) {
        this.exportservice.exportExcel(
          arry1,
          'Custom Created Workout Summary Report ' +
            this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        );
      }
    }
  }
}
