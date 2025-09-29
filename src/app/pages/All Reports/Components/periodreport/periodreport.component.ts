import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Services/api.service';
import { ExportService } from 'src/app/Services/export.service';

@Component({
  selector: 'app-periodreport',
  templateUrl: './periodreport.component.html',
  styleUrls: ['./periodreport.component.css'],
})
export class PeriodreportComponent implements OnInit {
  formTitle = 'Period Summary Report';
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
  screenWidth = 0;
  yearId: any;
  currentroute = '';
  yearlist: any[] = [];
  isyearLoad: boolean = false;
  schoolid = Number(sessionStorage.getItem('schoolid'));
  roleId = Number(sessionStorage.getItem('roleId'));
  columns: string[][] = [
    // ['USER_NAME', 'USER_NAME'],
    // ['ANIMATION_NAME', 'ANIMATION_NAME'],
    // ['COUPON_CODE', 'COUPON_CODE'],
    // ['MOBILE_NUMBER', 'MOBILE_NUMBER'],
    // ['DEVICE_NAME', 'DEVICE_NAME'],
    // ['STUDENT_COUNT', 'STUDENT_COUNT'],
    // ['TEACHERS_COUNT', 'STUDENT_COUNT'],
  ];
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  // purchaseDate: any[] = [];
  // activateDate: any[] = [];
  // planDaysid = 0;
  // planDayslist = [];
  // Type = '';
  // CouponCodeid = 0;
  // CouponsList = [];
  // CouponLoading = false;
  // androidVersionList=[]
  // androidVersionLoad=false
  Status: any;
  constructor(
    private api: ApiService,
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private exportservice: ExportService
  ) {}

  ngOnInit(): void {
    // this.getCouponFilterValues();
  }
  // getCouponFilterValues() {
  //   this.CouponLoading = true;
  //   this.api
  //     .getAllCoupon(0, 0, 'id', 'desc', ' AND STATUS=1')
  //     .subscribe((data) => {
  //       if (data['code'] == 200) {
  //         this.CouponLoading = false;
  //         this.CouponsList = data['data'];
  //       } else {
  //         this.CouponLoading = false;
  //         this.CouponsList = [];
  //       }
  //     });
  // }
  monthNumbers = [];
  excelMonthNumbers = [];
  search(reset: boolean = false, exportInExcel: boolean = false) {
    this.monthNumbers = [];
    this.excelMonthNumbers = [];
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'ID';
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
        .getPeriodReport(
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
              this.dataList.forEach((data) => {
                this.monthNumbers.push(Number(data['MONTH']) - 1);
              });
              // console.log(this.monthNumbers)
              this.loadingRecords = false;
            } else {
              this.dataList = [];
              this.monthNumbers = [];
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
        .getPeriodReport(0, 0, this.sortKey, sort, likeQuery + this.filterQuery)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.totalRecords = data['count'];
              this.exportdataList = data['data'];
              this.loadingRecords = false;
              this.exportLoading = false;
              this.exportdataList.forEach((data) => {
                this.excelMonthNumbers.push(Number(data['MONTH']) - 1);
                this.monthNumbers.push(Number(data['MONTH']) - 1);

              });
              this.convertInExcel();
            } else {
              this.exportdataList = [];
              this.excelMonthNumbers = [];
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

    if (
      this.Status !== undefined &&
      this.Status !== null &&
      this.Status !== ''
    ) {
      this.filterQuery += " AND STATUS ='" + this.Status + "'";
    }

    if (
      this.filterQuery == '' ||
      this.filterQuery == null ||
      this.filterQuery == undefined
    ) {
      this.message.error('', 'Please Select Filter Value');
      this.loadingRecords = false;
      this.isSpinning = false;
      this.isFilterApplied = 'default';
      this.filterClass = 'filter-visible';
    } else {
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
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
    this.Status = '';
    this.search(true);
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
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
      obj1['Month'] = this.months[this.excelMonthNumbers[i]];
      obj1['Period Days Length'] = this.exportdataList[i]['PERIOD_DAYS_LENGTH'];
      obj1['Cycle Length'] = this.exportdataList[i]['CYCLE_LENGTH'];
      if (this.exportdataList[i]['IS_REGULAR_STATUS'] == 'R') {
        obj1['Is Regular'] = 'Regular';
      } else if (this.exportdataList[i]['IS_REGULAR_STATUS'] == 'I') {
        obj1['Is Regular'] = 'Irregular';
      } else {
        obj1['Is Regular'] = 'Dont Know';
      }
      // obj1['Is Done'] = this.exportdataList[i]['IS_REGULAR'];
      if (this.exportdataList[i]['IS_DONE'] == 1) {
        obj1['Is Done'] = 'Yes';
      } else if (this.exportdataList[i]['IS_DONE'] == 0) {
        obj1['Is Done'] = 'No';
      }
      arry1.push(Object.assign({}, obj1));
      if (i == this.exportdataList.length - 1) {
        this.exportservice.exportExcel(
          arry1,
          'Period Summary Report ' +
            this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        );
      }
    }
  }
}
