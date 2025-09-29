import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { FormMaster } from 'src/app/Models/form-master';
import { LoginserviceService } from 'src/app/Services/loginservice.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})

export class FormsComponent implements OnInit {
  formTitle = "Manage Forms";
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
  columns: string[][] = [["PARENT_NAME", "Parent"], ["NAME", "Name"], ["LINK", "link"], ["ICON", "Icon"]]
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  drawerData: FormMaster = new FormMaster();

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

    this.api.getAllForms(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
      if(data['code']==200){
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        this.dataList = data['data'];
      }
      else{
        this.message.error("Failed To Get Forms", `${data.code}`);
        this.loadingRecords = false;
        
      }

    }, err => {
      
    });
  }

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.drawerTitle = "Create New Form";
    this.drawerData = new FormMaster();
    this.drawerVisible = true;
  }

  edit(data: FormMaster): void {
    this.drawerTitle = "Update Form Details";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
}
