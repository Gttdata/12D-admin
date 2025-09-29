import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NgForm } from '@angular/forms';
import { YearMaster } from '../../Models/YearMaster';
import { ApiService } from 'src/app/Services/api.service';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
// import { ApiServiceService } from 'src/app/Service/api-service.service';
// import { YearMaster } from 'src/app/master/Models/YearMaster';

@Component({
  selector: 'app-list-year-master',
  templateUrl: './list-year-master.component.html',
  styleUrls: ['./list-year-master.component.css'],
})
export class ListYearMasterComponent {
  isSpinning = false;
  isOk = true;
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: YearMaster = new YearMaster();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage Years ';
  dataList = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  screenwidth: any;
  YearWidth = 0;
  
  columns: string[][] = [
    ['YEAR', 'YEAR'],
    ['SEQ_NO', 'SEQ_NO'],
    ['STATUS', 'STATUS'],
  ];

  constructor(
    private message: NzNotificationService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.screenwidth = window.innerWidth;
    if (this.screenwidth > 500) {
      this.YearWidth = 380;
    } else {
      this.YearWidth = 380;
    }
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
    this.api
      .getAllYearMaster(
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
            this.loadingRecords = false;
            this.dataList = data['data'];
          } else {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
            this.dataList = [];
          }
        },
        (err) => {}
      );
  }

  add(): void {
    this.drawerTitle = 'Create New Year';
    this.drawerData = new YearMaster();
    this.api.getAllYearMaster(1, 1, 'SEQ_NO', 'desc', '').subscribe(
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
      (err) => {}
    );
  }

  edit(data: YearMaster): void {
    this.drawerTitle = 'Update Year';
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

  // Sort

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
  resetDrawer(yearpage: NgForm) {
    this.drawerData = new YearMaster();
    yearpage.form.markAsPristine();
    yearpage.form.markAsUntouched();
  }
  close(): void {
    this.drawerClose();
  }


  save(addNew: boolean, yearpage: NgForm): void {
    this.isOk = true;
    this.isSpinning = false;
    if (
      (this.drawerData.YEAR == undefined ||
        this.drawerData.YEAR == null ||
        this.drawerData.YEAR == '') &&
      (this.drawerData.SEQ_NO <= 0 ||
        this.drawerData.SEQ_NO == null ||
        this.drawerData.SEQ_NO == undefined)
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.drawerData.YEAR == null ||
      this.drawerData.YEAR == undefined ||
      this.drawerData.YEAR == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Year .', '');
    } 
    else if (
      this.drawerData.YEAR && !this.commonFunction.year.test(this.drawerData.YEAR)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Year Like 2022-2023 or 2022-23', '');
    } 
    else if (
      this.drawerData.SEQ_NO == undefined ||
      this.drawerData.SEQ_NO == null ||
      this.drawerData.SEQ_NO <= 0 
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Sequence Number ', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      this.drawerData.SCHOOL_ID = Number(sessionStorage.getItem('schoolid'))
      if (this.drawerData.ID) {
        this.api.updateYear(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('Year Updated Successfully...', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error('Year Updation Failed...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createYear(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('Year Created Successfully...', '');
            if (!addNew) this.drawerClose();
            else {
              this.drawerData = new YearMaster();
              this.resetDrawer(yearpage);
              this.api.getAllYearMaster(1, 1, '', 'desc', '').subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    if (data['count'] == 0) {
                      this.drawerData.SEQ_NO = 1;
                    } else {
                      this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
                    }
                  } else {
                  }
                },
                (err) => {}
              );
            }
            this.isSpinning = false;
          } else {
            this.message.error('Year Creation Failed...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }
}
