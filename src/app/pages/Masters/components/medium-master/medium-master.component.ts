import { Component, OnInit } from '@angular/core';
import { MediumMaster } from '../../Models/MediumMaster';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Services/api.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medium-master',
  templateUrl: './medium-master.component.html',
  styleUrls: ['./medium-master.component.css'],
})
export class MediumMasterComponent implements OnInit {
  isSpinning = false;
  roleId: number;
  currentroute = '';

  isOk = true;
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: MediumMaster = new MediumMaster();
  formTitle = 'Manage Mediums ';
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
  public commonFunction = new CommomFunctionsService();
  step_no: number;

  columns: string[][] = [
    ['NAME', 'NAME'],
    ['SEQ_NO', 'SEQ_NO'],
    ['STATUS', 'STATUS'],
  ];

  constructor(
    private message: NzNotificationService,
    private api: ApiService,
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
    this.roleId = Number(sessionStorage.getItem('roleId'));
    this.step_no = Number(sessionStorage.getItem('stepid'));

    if (this.step_no >= 0 && this.step_no < 6) {
      this.router.navigate(['/help1']);
    }
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
    var extraFilter = '';

    if (this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = ' ';
    }
    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND(';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    this.api
      .getAllMediumMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + extraFilter + ' AND STATUS=1'
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
  OnConfirmDelete(data) {
    this.loadingRecords = true;
    data.STATUS = 0;
    this.api.updateMedium(data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Medium Deleted Successfully', '');
        this.drawerClose();
        this.loadingRecords = false;
      } else {
        this.message.error('Medium Deletion Failed', '');
        this.loadingRecords = false;
      }
    });
  }
  add(): void {
    var extraFilter = '';

    if (this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = ' ';
    }
    this.drawerTitle = 'Create New Medium';
    this.drawerData = new MediumMaster();
    this.api.getAllMediumMaster(1, 1, 'SEQ_NO', 'desc', extraFilter).subscribe(
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

  edit(data: MediumMaster): void {
    this.drawerTitle = 'Update Medium';
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
  resetDrawer(Mediumdata: NgForm) {
    this.drawerData = new MediumMaster();
    Mediumdata.form.markAsPristine();
    Mediumdata.form.markAsUntouched();
  }
  close(): void {
    this.drawerClose();
  }

  save(addNew: boolean, Mediumdata: NgForm): void {
    this.isOk = true;
    this.isSpinning = false;
    if (
      (this.drawerData.NAME == undefined ||
        this.drawerData.NAME == null ||
        this.drawerData.NAME == '') &&
      (this.drawerData.SEQ_NO <= 0 ||
        this.drawerData.SEQ_NO == null ||
        this.drawerData.SEQ_NO == undefined)
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.drawerData.NAME == null ||
      this.drawerData.NAME == undefined ||
      this.drawerData.NAME == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Medium Name.', '');
    } else if (
      this.drawerData.SEQ_NO == undefined ||
      this.drawerData.SEQ_NO == null ||
      this.drawerData.SEQ_NO <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Sequence Number ', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      var extraFilter = '';

      if (this.roleId == 2) {
        this.drawerData.SCHOOL_ID = Number(sessionStorage.getItem('schoolid'));
      } else {
        this.drawerData.SCHOOL_ID = null;
      }
      if (this.drawerData.ID) {
        this.api.updateMedium(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              'Medium  Data Updated Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error('Medium  Data Updation Failed...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createMedium(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              'Medium  Data Created Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            else {
              this.drawerData = new MediumMaster();
              this.resetDrawer(Mediumdata);
              var extraFilter = '';

              if (this.roleId == 2) {
                extraFilter =
                  ' AND SCHOOL_ID = ' +
                  Number(sessionStorage.getItem('schoolid'));
              } else {
                extraFilter = ' ';
              }
              this.api
                .getAllMediumMaster(1, 1, '', 'desc', extraFilter)
                .subscribe(
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
            this.message.error('Medium  Data Creation Failed...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }
}
