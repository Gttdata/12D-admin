import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Services/api.service';
import { ExportService } from 'src/app/Services/export.service';

@Component({
  selector: 'app-subscriptionreport',
  templateUrl: './subscriptionreport.component.html',
  styleUrls: ['./subscriptionreport.component.css'],
})
export class SubscriptionreportComponent implements OnInit {
  formTitle = 'Subscription Detailed Report';
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
    ['USER_NAME', 'USER_NAME'],
    ['SUBSCRIPTION_NAME', 'SUBSCRIPTION_NAME'],
    // ['COUPON_CODE', 'COUPON_CODE'],
    // ['MOBILE_NUMBER', 'MOBILE_NUMBER'],
    // ['DEVICE_NAME', 'DEVICE_NAME'],

    // ['STUDENT_COUNT', 'STUDENT_COUNT'],
    // ['TEACHERS_COUNT', 'STUDENT_COUNT'],
  ];
  purchaseDate: any[] = [];
  activateDate: any[] = [];
  planDaysid = 0;
  planDayslist = [];
  Type = '';
  CouponCodeid = 0;
  CouponsList = [];
  CouponLoading=false
  // androidVersionList=[]
  // androidVersionLoad=false
  constructor(
    private api: ApiService,
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private exportservice: ExportService
  ) {}

  ngOnInit(): void {
    this.getCouponFilterValues()
  }
  getCouponFilterValues(){
    this.CouponLoading=true
    this.api.getAllCoupon(0,0,'id','desc',' AND STATUS=1').subscribe(data=>{
     if(data['code']==200){
       this.CouponLoading=false
       this.CouponsList=data['data']
     }
     else{
      this.CouponLoading=false
      this.CouponsList=[]
     }
    })
 }
  search(reset: boolean = false, exportInExcel: boolean = false) {
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
        .getSubscriptionReport(
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
              this.isFilterApplied='default'
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } else {
      this.exportLoading = true;
      this.api
        .getSubscriptionReport(
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

    if (this.purchaseDate && this.purchaseDate.length > 0) {
      this.purchaseDate[0] = this.datePipe.transform(
        this.purchaseDate[0],
        'yyyy-MM-dd'
      );
      this.purchaseDate[1] = this.datePipe.transform(
        this.purchaseDate[1],
        'yyyy-MM-dd'
      );
      this.filterQuery +=
        " AND PURCHASE_DATE between '" +
        this.purchaseDate[0] +
        "' AND '" +
        this.purchaseDate[1] +
        "'";
      // console.log(this.filterQuery)
    }
    if (this.activateDate && this.activateDate.length > 0) {
      this.activateDate[0] = this.datePipe.transform(
        this.activateDate[0],
        'yyyy-MM-dd'
      );
      this.activateDate[1] = this.datePipe.transform(
        this.activateDate[1],
        'yyyy-MM-dd'
      );
      this.filterQuery +=
        " AND ACTIVATE_DATE between '" +
        this.activateDate[0] +
        "' AND '" +
        this.activateDate[1] +
        "'";
      // console.log(this.filterQuery)
    }
    if (this.planDaysid && this.planDaysid > 0) {
      this.filterQuery += ' AND PLAN_DAYS_ID = ' + this.planDaysid;
    }
    if (this.Type && this.Type != '') {
      this.filterQuery += " AND TYPE = '" + this.Type + "'";
    }
    if (this.CouponCodeid && this.CouponCodeid > 0) {
      this.filterQuery += ' AND COUPON_ID= ' + this.CouponCodeid;
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
    this.Type = '';
    this.CouponCodeid=null;
    this.purchaseDate=[]
    this.filterQuery = '';
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';

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
      obj1['Subscription Name'] = this.exportdataList[i]['SUBSCRIPTION_NAME'];
      obj1['Purchase Date'] = this.exportdataList[i]['PURCHASE_DATE']?this.datePipe.transform(this.exportdataList[i]['PURCHASE_DATE'],'dd/MMM/yyyy'):'';
      // obj1['Activation Date'] = this.exportdataList[i]['ACTIVATE_DATE']?this.datePipe.transform(this.exportdataList[i]['ACTIVATE_DATE'],'dd/MM/yyyy'):'';
      obj1['Deactivation Date'] = this.exportdataList[i]['EXPIRE_DATE']?this.datePipe.transform(this.exportdataList[i]['EXPIRE_DATE'],'dd/MMM/yyyy'):'';
      obj1['Plan Days'] = this.exportdataList[i]['DAYS'];
      if (this.exportdataList[i]['TYPE'] == 'M') {
        obj1['Type'] = 'Monthly';
      } else {
        obj1['Type'] = 'Yearly';
      }
      obj1['Total Amount'] = this.exportdataList[i]['PRICE'];
      obj1['Paid Amount'] = this.exportdataList[i]['PAID_AMOUNT'];
      obj1['Coupon Code'] = this.exportdataList[i]['COUPON_CODE'];
      obj1['Coupon Amount'] = this.exportdataList[i]['VALUE'];

      arry1.push(Object.assign({}, obj1));
      if (i == this.exportdataList.length - 1) {
        this.exportservice.exportExcel(
          arry1,
          "Subscription Report " + this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        );
      }
    }
  }
}
