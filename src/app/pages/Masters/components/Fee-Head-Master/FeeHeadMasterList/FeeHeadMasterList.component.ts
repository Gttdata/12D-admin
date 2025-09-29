import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HeadMasterData } from '../../../Models/HeadMasterData';
import { ApiService } from 'src/app/Services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-FeeHeadMasterList',
  templateUrl: './FeeHeadMasterList.component.html',
  styleUrls: ['./FeeHeadMasterList.component.css'],
})
export class FeeHeadMasterListComponent implements OnInit {
  drawerVisible: boolean = false;
  drawerTitle!: string;
  drawerData: HeadMasterData = new HeadMasterData();
  formTitle = 'Manage Fee Heads';
  dataList: any = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'NAME';
  searchText: string = '';
  currentroute = '';

  columns: string[][] = [['NAME', 'NAME']];
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
  roleId: any;
  step_no: number;

  ngOnInit(): void {
    this.roleId = Number(sessionStorage.getItem('roleId'));
    this.step_no = Number(sessionStorage.getItem('stepid'));

    if (this.step_no >= 0 && this.step_no < 6) {
      this.router.navigate(['/help1']);
    }
  }
  redirectToAdminDashboard() {
    window.location.href = '/admindashboard';
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
    this.loadingRecords = true;
    var extraFilter: any = '';
    if (this.roleId == 3 || this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = '';
    }
    this.api
      .getHeadData(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        extraFilter + likeQuery + ' AND STATUS = 1'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
          } else {
            this.loadingRecords = false;
            this.dataList = [];
            this.message.error('Something Went Wrong ...', '');
          }
        },
        (err) => {}
      );
  }

  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
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

  add(): void {
    this.drawerTitle = 'Create New Fee Head';
    this.drawerData = new HeadMasterData();
    this.drawerVisible = true;
  }

  itemTypeVisible;
  edit(data: HeadMasterData): void {
    this.drawerTitle = 'Update Fee Head';
    this.drawerData = Object.assign({}, data);

    this.drawerVisible = true;
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  cancel() {}
  detailsList1: any;
  delete(data: HeadMasterData) {
    // console.log(data);

    if (data !== null && data !== undefined) {
      if (data.ID) {
        data.STATUS = false;
        this.api.updateHead(data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('Fee Head Deleted Successfully...', '');
            this.search()
          } else {
            this.message.error('Data Deletion Failed...', '');
          }
        });
      }
    }
  }
}
