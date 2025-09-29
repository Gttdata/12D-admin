import { Component, OnInit } from '@angular/core';
import { SubscriptionMaster } from '../../Models/SubscriptionMaster';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-subscription-master',
  templateUrl: './subscription-master.component.html',
  styleUrls: ['./subscription-master.component.css'],
})
export class SubscriptionMasterComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  isSpinning = false;
  isOk = true;
  drawerData: SubscriptionMaster = new SubscriptionMaster();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage Subscription Details';
  dataList: any[] = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';


  columns: string[][] = [
    ['DAYS', ' DAYS '],
    ['MONTHLY_FEE', 'MONTHLY_FEE'],
    ['TOTAL', 'TOTAL'],
    ['YEARLY_FEE', 'YEARLY_FEE'],
    ['TAX_PERCENTAGE', 'TAX_PERCENTAGE'],
    ['MODULES', 'MODULES'],
    ['SEQ_NO', 'SEQ_NO'],

  ];
  drawerClose2!: Function;

  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void { }

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
    this.api
      .getSuscription(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.loadingRecords = false;
          } else {
            this.message.error('Something Went Wrong', '');
            this.dataList = [];
            this.loadingRecords = false;
          }
        },
        (err) => { }
      );
  }

  add(): void {
    this.drawerTitle = ' Add New Subscription Details ';
    this.drawerData = new SubscriptionMaster();
    this.api.getSuscription(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {

        if (data['code'] == 200) {
          if (data['count'] == 0) {
            this.drawerData.SEQ_NO = 1;
          } else {
            this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
          }
          this.drawerVisible = true;

        }

      },
      (err) => { }
    );
  }
  edit(data: SubscriptionMaster): void {
    this.drawerTitle = ' Update Subscription Details Information';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
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
  close(): void {
    this.drawerClose();
  }

  //save
  save(addNew: boolean, subscriptionmaster: NgForm): void {
    this.isOk = true;

    if (
      (this.drawerData.SEQ_NO == undefined ||
        this.drawerData.SEQ_NO == null ||
        this.drawerData.SEQ_NO <= 0) &&
      (this.drawerData.DAYS == undefined ||
        this.drawerData.DAYS == null ||
        this.drawerData.DAYS <= 0) &&
      (this.drawerData.MONTHLY_FEE == undefined ||
        this.drawerData.MONTHLY_FEE == null ||
        this.drawerData.MONTHLY_FEE <= 0) &&
      (this.drawerData.TAX_PERCENTAGE == undefined ||
        this.drawerData.TAX_PERCENTAGE == null ||
        this.drawerData.TAX_PERCENTAGE <= 0) &&
      (this.drawerData.TOTAL == undefined ||
        this.drawerData.TOTAL == null ||
        this.drawerData.TOTAL <= 0) &&
      (this.drawerData.YEARLY_FEE == undefined ||
        this.drawerData.YEARLY_FEE == null ||
        this.drawerData.YEARLY_FEE <= 0) &&
      (this.drawerData.MODULES == undefined ||
        this.drawerData.MODULES == null ||
        this.drawerData.MODULES == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.drawerData.DAYS == undefined ||
      this.drawerData.DAYS == null ||
      this.drawerData.DAYS <= 0
    ) {
      this.message.error('Please Enter No. Of Days', '');
      this.isOk = false;
    } else if (
      this.drawerData.MONTHLY_FEE == undefined ||
      this.drawerData.MONTHLY_FEE == null ||
      this.drawerData.MONTHLY_FEE <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Monthly Fees (₹)', '');
    } else if (
      this.drawerData.TAX_PERCENTAGE == undefined ||
      this.drawerData.TAX_PERCENTAGE == null ||
      this.drawerData.TAX_PERCENTAGE <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Tax(%)', '');
    } else if (
      this.drawerData.TOTAL == undefined ||
      this.drawerData.TOTAL == null ||
      this.drawerData.TOTAL <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Total Amount (₹)', '');
    } else if (
      this.drawerData.YEARLY_FEE == undefined ||
      this.drawerData.YEARLY_FEE == null ||
      this.drawerData.YEARLY_FEE <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Yearly Fees (₹)', '');
    } else if (
      this.drawerData.MODULES == undefined ||
      this.drawerData.MODULES == null ||
      this.drawerData.MODULES == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Modules', '');
    } else if (
      this.drawerData.SEQ_NO == null ||
      this.drawerData.SEQ_NO <= 0 ||
      this.drawerData.SEQ_NO == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No.', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      if (this.drawerData.ID) {
        this.api.UpdateSubscription(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' Subscription Details Information Updated Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(
              ' Failed To Update Subscription Details Information...',
              ''
            );
            this.isSpinning = false;
          }
        });
      } else {
        this.api.CreateSubscription(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' Subscription Details Information Save Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            else {
              this.drawerData = new SubscriptionMaster();
              this.resetDrawer(subscriptionmaster);
              this.api.getSuscription(1, 1, '', 'desc', '').subscribe(
                (data) => {

                  if(data['code'] == 200)
                  {
                    if (data['count'] == 0) {
                      this.drawerData.SEQ_NO = 1;
                    } else {
                      this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
                    }
                  }
             
                },
                (err) => { }
              );
            }
            this.isSpinning = false;
          } else {
            this.message.error(
              ' Failed To Save Subscription Details Information...',
              ''
            );
            this.isSpinning = false;
          }
        });
      }
    }
  }
  resetDrawer(subscriptionmaster: NgForm) {
    this.drawerData = new SubscriptionMaster();
    subscriptionmaster.form.markAsPristine();
    subscriptionmaster.form.markAsUntouched();
  }
}
