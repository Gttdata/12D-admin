import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { UserMaster } from 'src/app/Models/usermaster';
import { LoginserviceService } from 'src/app/Services/loginservice.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
  formTitle: string = "Manage Users";
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  dataList: any = [];
  loadingRecords: boolean = true;
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  filterQuery: string = "";
  isFilterApplied: string = "default";
  columns: string[][] = [["ROLE_NAME", "Role"], ["NAME", "Name"], ["EMAIL_ID", "Email"], ["MOBILE_NUMBER", "Mobile"]]
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  drawerData: UserMaster = new UserMaster();

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

    this.api.getAllUsers(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
      if(data['code']==200){
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        this.dataList = data['data'];
      }
      else{
        this.loadingRecords = false;
        this.message.error('Failed To Get Users',`${data.code}`)
      }

    }, err => {
      
    });
  }

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.drawerTitle = "Create New User";
    this.drawerData = new UserMaster();
    this.drawerData.IS_ACTIVE = true;
    this.drawerVisible = true;
  }

  edit(data: UserMaster): void {
    this.drawerTitle = "Update User Details";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
}