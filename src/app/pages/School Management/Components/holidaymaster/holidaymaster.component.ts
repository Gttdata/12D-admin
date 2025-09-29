import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { holidaymaster } from '../../Models/holidaymaster';
import { ApiService } from 'src/app/Services/api.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-holidaymaster',
  templateUrl: './holidaymaster.component.html',
  styleUrls: ['./holidaymaster.component.css'],
})
export class HolidaymasterComponent implements OnInit {
  isLoading: boolean = false;
  formTitle: string = 'Holiday List';
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: holidaymaster = new holidaymaster();
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
  currentroute = '';
  roleId = Number(sessionStorage.getItem('roleId'));
  schoolid = Number(sessionStorage.getItem('schoolid'));
  columns: string[][] = [
    ['DATE', 'DATE'],
    ['DESCRIPTION', 'DESCRIPTION'],
    ['STATUS', 'STATUS'],
  ];
  isSpinning: boolean = false;
  public commonFunction = new CommomFunctionsService();
  isOk: boolean = true;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe,
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
  ngOnInit(): void {}
  close(): void {
    this.drawerClose();
  }
  keyup(event: any) {
    this.search();
  }
  OnConfirmDelete(data) {
    this.loadingRecords = true;
    data.STATUS = 0;
    this.api.updateHolidayMaster(data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Holiday Details Deleted Successfully', '');
        this.drawerClose();
        this.loadingRecords = false;
      } else {
        this.message.error('Holiday Details Deletion Failed', '');
        this.loadingRecords = false;
      }
    });
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
      .getAllHolidaysMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + ' AND STATUS=1'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
          } else {
            this.message.error('Something Went Wrong', '');
          }
        },
        (err) => {}
      );
  }

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.drawerTitle = 'Add Holiday Details';
    this.drawerData = new holidaymaster();
    // this.api.getAllPostMaster(1,1,'SEQ_NO','desc','').subscribe (data =>{
    //   if(data['code']==200){
    //     if (data['count']==0){
    //       this.drawerData.SEQ_NO=1;
    //     }else
    //     {
    //       this.drawerData.SEQ_NO=data['data'][0]['SEQ_NO']+1;
    //     }
    //   }
    //   else{
    //     this.message.error('Something Went Wrong','')

    //   }
    // },err=>{

    // })
    // this.drawerData.IS_ACTIVE=true;
    this.drawerVisible = true;
  }
  edit(data: any): void {
    this.drawerTitle = 'Update Holiday Details';
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

  //save
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    this.drawerData.DATE = this.datePipe.transform(
      this.drawerData.DATE,
      'yyyy-MM-dd'
    );

    if (
      (this.drawerData.DATE == undefined || this.drawerData.DATE == null) &&
      (this.drawerData.DESCRIPTION == undefined ||
        this.drawerData.DESCRIPTION == null ||
        this.drawerData.DESCRIPTION.trim() == '')
    ) {
      this.isOk = false;
      this.message.error('Please Fill All Required Fields', '');
    } else if (
      this.drawerData.DATE == undefined ||
      this.drawerData.DATE == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Date', '');
    } else if (
      this.drawerData.DESCRIPTION == undefined ||
      this.drawerData.DESCRIPTION == null ||
      this.drawerData.DESCRIPTION.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Description', '');
    } else if (this.drawerData.DATE && !this.drawerData.ID) {
      let maketrue = false;

      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i]['DATE'] === this.drawerData.DATE) {
          maketrue = true;
          break;
        }
      }

      if (maketrue) {
        this.isOk = false;
        this.message.error(
          'An existing holiday is already scheduled for this date.',
          ''
        );
      }
    }

    if (this.isOk) {
      if (this.schoolid) {
        this.drawerData.SCHOOL_ID = this.schoolid;
      } else {
        this.drawerData.SCHOOL_ID = this.drawerData.SCHOOL_ID;
      }
      // this.isSpinning=false;
      this.drawerData.DATE = this.datePipe.transform(
        this.drawerData.DATE,
        'yyyy-MM-dd'
      );
      this.isSpinning = true;

      if (this.drawerData.ID) {
        this.api
          .updateHolidayMaster(this.drawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Holiday Details Updated Successfully', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Failed To Update Holiday Details', '');
              this.isSpinning = false;
            }
          });
      } else {
        this.api
          .createHolidayMaster(this.drawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Holiday Details Added Successfully', '');
              if (!addNew) this.drawerClose();
              else {
                this.drawerData = new holidaymaster();
                this.resetDrawer(websitebannerPage);
              }
              this.isSpinning = false;
            } else {
              this.message.error('Failed To Add Holiday Details', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }
  resetDrawer(websitebannerPage: NgForm) {
    this.drawerData = new holidaymaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
}
