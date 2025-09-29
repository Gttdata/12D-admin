import { Component, OnInit } from '@angular/core';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { RoleMaster } from 'src/app/Models/role-master';
import { LoginserviceService } from 'src/app/Services/loginservice.service';



@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})

export class RolesComponent implements OnInit {
  formTitle = "Manage Roles";
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList = [];
  loadingRecords = true;
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  filterQuery: string = "";
  isFilterApplied: string = "default";
  columns: string[][] = [["PARENT_NAME", "Parent"], ["NAME", "Name"], ["DESCRIPTION", "Description"], ["TYPE", "Type"]]
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  drawerData: RoleMaster = new RoleMaster();
  drawerVisible1: boolean = false;
  drawerTitle1: string = '';
  drawerData1: RoleMaster = new RoleMaster();
  drawerData2: string[] = [];
  constructor(private api: LoginserviceService,private message:NzNotificationService) { }

  ngOnInit() {
    // this.search();
  }

  // Basic Methods
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

  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }

    this.loadingRecords = true;
    var sort: string;

    try {
      sort = this.sortValue.startsWith("a") ? "asc" : "desc";

    } catch (error) {
      sort = "";
    }

    var likeQuery = "";

    if (this.searchText != "") {
      likeQuery = " AND";
      
      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }

    this.api.getAllRoles(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
      if(data['code']==200){
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        this.dataList = data['data'];
      }
      else{
        this.message.error('Failed To Get Roles',`${data.code}`)
        this.loadingRecords = false;

      }

    }, err => {
      
    });
  }

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }

  add(): void {
    this.drawerTitle = "Create New Roles";
    this.drawerData = new RoleMaster();
    this.drawerVisible = true;
  }

  edit(data: RoleMaster): void {
    this.drawerTitle = "Update Roles Details";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }

  MapForms(data: RoleMaster): void {
    this.api.getRoleDetails(data.ID).subscribe(data => {
      this.drawerData2 = data['data'];

    }, err => {
      
    });

    this.drawerTitle1 = "Forms assign for " + data.NAME + "";
    this.drawerData1 = Object.assign({}, data);
    this.drawerVisible1 = true;
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  drawerClose1(): void {
    this.drawerVisible1 = false;
  }
}
