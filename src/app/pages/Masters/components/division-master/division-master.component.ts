import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { divisionmaster } from '../../Models/divisionmaster';
import { ApiService } from 'src/app/Services/api.service';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-division-master',
  templateUrl: './division-master.component.html',
  styleUrls: ['./division-master.component.css'],
})
export class DivisionMasterComponent {
  isLoading: boolean = false;
  formTitle: string = 'Manage Divisions';
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: divisionmaster = new divisionmaster();
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
    ['NAME', 'NAME'],
    ['SEQ_NO', 'SEQ_NO'],
    ['STATUS', 'STATUS'],
  ];
  currentroute = '';

  classList: any[] = [];
  isSpinning: boolean = false;
  public commonFunction = new CommomFunctionsService();
  isOk: boolean = true;
  roleId: number;
  step_no: number;

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
  // data:any=new divisionmaster()
  ngOnInit(): void {
    // this.getClass()
    this.step_no = Number(sessionStorage.getItem('stepid'));

    this.roleId = Number(sessionStorage.getItem('roleId'));
    if (this.step_no >= 0 && this.step_no < 6) {
      this.router.navigate(['/help1']);
    }
  }

  getClass() {
    var extraFilter: any = '';
    if (this.roleId == 3 || this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = '';
    }
    this.api.getAllClassMaster(0, 0, '', '', extraFilter).subscribe((data) => {
      if (data['code'] == 200) {
        this.classList = data['data'];
      } else {
        this.message.error('Failed To Get Classes', '');
      }
    });
  }
  close(): void {
    this.drawerClose();
  }
  keyup(event: any) {
    this.search();
  }
  OnConfirmDelete(data) {
    this.loadingRecords = true;
    data.STATUS = 0;
    this.api.updateDivision(data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Division Deleted Successfully', '');
        this.drawerClose();
        this.loadingRecords = false;
      } else {
        this.message.error('Division Deletion Failed', '');
        this.loadingRecords = false;
      }
    });
  }

  onStatusChange(data, event) {
    data.STATUS = event;
    this.loadingRecords = true;
    this.api.updateDivision(data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Division Status Changed Successfully', '');
        this.search();
        this.loadingRecords = false;
      } else {
        this.loadingRecords = true;
        this.message.error('Failed To Change Division Status', '');
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
      likeQuery = ' AND(';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    var extraFilter: any = '';
    if (this.roleId == 3 || this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = '';
    }
    this.api
      .getAllDivisions(
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

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.drawerTitle = 'Create New Division';
    this.drawerData = new divisionmaster();
    var extraFilter: any = '';
    if (this.roleId == 3 || this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = '';
    }
    this.api.getAllDivisions(1, 1, 'SEQ_NO', 'desc', extraFilter).subscribe(
      (data) => {
        if (data['code'] == 200) {
          if (data['count'] == 0) {
            this.drawerData.SEQ_NO = 1;
          } else {
            this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
          }
        } else {
          this.message.error('Something Went Wrong', '');
        }
      },
      (err) => {}
    );
    // this.drawerData.IS_ACTIVE=true;
    this.drawerVisible = true;
  }
  edit(data: any): void {
    this.drawerTitle = 'Update Division';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  resetDrawer(websitebannerPage: NgForm) {
    // this.data=new PostMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
  //save
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (this.drawerData.NAME == '' && this.drawerData.SEQ_NO == undefined) {
      this.isOk = false;
      this.message.error('Please Fill All Required Fields', '');
    } else if (
      this.drawerData.NAME == '' ||
      this.drawerData.NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Division Name', '');
    } else if (
      this.drawerData.SEQ_NO == null ||
      this.drawerData.SEQ_NO == undefined ||
      this.drawerData.SEQ_NO <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No', '');
    }

    if (this.isOk) {
      // this.isSpinning=false;
      this.drawerData.SCHOOL_ID = Number(sessionStorage.getItem('schoolid'));
      this.isSpinning = true;
      if (this.drawerData.ID) {
        this.api.updateDivision(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' Division Information Updated Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update Division Information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createDivision(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' Division Information Saved Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            else {
              this.drawerData = new divisionmaster();
              this.resetDrawer(websitebannerPage);
              this.api
                .getAllDivisions(
                  1,
                  1,
                  '',
                  'desc',
                  ' AND SCHOOL_ID = ' +
                    Number(sessionStorage.getItem('schoolid'))
                )
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
            this.message.error(' Failed To Save Division Information...', '');
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
