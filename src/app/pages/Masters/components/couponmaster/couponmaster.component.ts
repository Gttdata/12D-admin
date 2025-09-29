import { Component, OnInit } from '@angular/core';
import { couponmaster } from '../../Models/Coupounmaster';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Services/api.service';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-couponmaster',
  templateUrl: './couponmaster.component.html',
  styleUrls: ['./couponmaster.component.css'],
})
export class CouponmasterComponent implements OnInit {
  isLoading: boolean = false;
  formTitle: string = 'Manage Coupons';
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: couponmaster = new couponmaster();
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
  columns: string[][] = [
    ['COUPON_CODE'],
    ['VALUE'],
    ['EXPIRE_DATE'],
    ['CREATED_DATE'],
    ['STATUS'],
  ];
  subscriptionlist: any[] = [];
  isSpinning: boolean = false;
  public commonFunction = new CommomFunctionsService();
  isOk: boolean = true;
  subscriptions: [] = [];
  subscriptionsload: boolean = true;
  Teachers: [] = [];
  Teachersload: boolean = true;
  Students: [] = [];
  Studentsload: boolean = true;

  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) // private router: Router
  {}
  ngOnInit(): void {}

  close(): void {
    this.drawerClose();
  }
  keyup(event: any) {
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
      likeQuery = ' AND';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }
    var extraFilter: any = '';

    this.api
      .getAllCoupon(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + extraFilter
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
          } else {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
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
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.drawerData.EXPIRE_DATE) {
      return false;
    }
    return startValue.getTime() > this.drawerData.EXPIRE_DATE.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.drawerData.CREATED_DATE) {
      return false;
    }
    return endValue.getTime() <= this.drawerData.CREATED_DATE.getTime();
  };
  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.drawerTitle = 'Create New Coupon ';
    this.drawerData = new couponmaster();
    this.drawerVisible = true;
  }
  edit(data: any): void {
    this.drawerTitle = 'Update Coupon ';

    // console.log(enableTime,disableTime);

    this.drawerData = Object.assign({}, data);
    var enableTime = new Date(this.drawerData.CREATED_DATE);
    var disableTime = new Date(this.drawerData.EXPIRE_DATE);
    this.drawerData.CREATED_DATE = enableTime;
    this.drawerData.EXPIRE_DATE = disableTime;
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  resetDrawer(subscriptionspage: NgForm) {
    // this.data=new PostMaster();
    subscriptionspage.form.markAsPristine();
    subscriptionspage.form.markAsUntouched();
  }
  //save
  save(addNew: boolean, subscriptionspage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      (this.drawerData.COUPON_CODE == null ||
        this.drawerData.COUPON_CODE == undefined ||
        this.drawerData.COUPON_CODE.trim() == '') &&
      (this.drawerData.VALUE == null ||
        this.drawerData.VALUE == undefined ||
        this.drawerData.VALUE <= 0) &&
      (this.drawerData.CREATED_DATE == null ||
        this.drawerData.CREATED_DATE == undefined) &&
      (this.drawerData.EXPIRE_DATE == null ||
        this.drawerData.EXPIRE_DATE == undefined)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All Required Fields', '');
    } else if (
      this.drawerData.COUPON_CODE == null ||
      this.drawerData.COUPON_CODE == undefined ||
      this.drawerData.COUPON_CODE.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Coupon Code', '');
    } else if (
      this.drawerData.VALUE == null ||
      this.drawerData.VALUE == undefined ||
      this.drawerData.VALUE <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Value', '');
    } else if (
      this.drawerData.CREATED_DATE == null ||
      this.drawerData.CREATED_DATE == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Created Date Time', '');
    } else if (
      this.drawerData.EXPIRE_DATE == null ||
      this.drawerData.EXPIRE_DATE == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Expire Date Time', '');
    }
    if (this.isOk) {
      this.drawerData.CREATED_DATE = this.datePipe.transform(
        new Date(this.drawerData?.CREATED_DATE),
        ' yyyy-MM-dd HH:mm:ss'
      );
      this.drawerData.EXPIRE_DATE = this.datePipe.transform(
        new Date(this.drawerData?.EXPIRE_DATE),
        ' yyyy-MM-dd HH:mm:ss'
      );

      // this.drawerData.SCHOOL_ID=Number(sessionStorage.getItem('schoolid'))
      this.isSpinning = true;
      if (this.drawerData.ID) {
        this.api.updateCoupon(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' Coupon Information Updated Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update Coupon Information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createCoupon(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' Coupon Information Saved Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            else {
              this.drawerData = new couponmaster();
              this.resetDrawer(subscriptionspage);
            }
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Save Coupon Information...', '');
            this.isSpinning = false;
          }
        });
      }
    }
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
}
