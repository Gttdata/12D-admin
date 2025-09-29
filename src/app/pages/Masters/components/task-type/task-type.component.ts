import { Component, OnInit } from '@angular/core';
import { TaskType } from '../../Models/TaskType';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Services/api.service';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-task-type',
  templateUrl: './task-type.component.html',
  styleUrls: ['./task-type.component.css']
})
export class TaskTypeComponent implements OnInit {

  isSpinning = false;
  isOk = true;
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: TaskType = new TaskType();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage Task Type ';
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
    ['NAME', 'NAME'],
    ['STATUS', 'Status'],
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
    // this.loadingRecords = true;
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
      .getALLTaskType(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
            this.loadingRecords = false;
            this.dataList = data['data'];
          } else {
            this.message.error("Something Went Wrong", "");
            this.loadingRecords = false;
            this.dataList = [];
          }
        },
        (err) => {
          
        }
      );
  }


  add(): void {
    this.drawerTitle = 'Create New Task Type';
    this.drawerData = new TaskType();
    this.api.getALLTaskType(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {
        if (data['count'] == 0) {
          this.drawerData.SEQ_NO = 1;
        } else {
          this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
        }
      },
      (err) => {
    
      }
    );
    this.drawerVisible = true;
  }

  edit(data: TaskType): void {
    this.drawerTitle = 'Update Task Type';
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
  resetDrawer(tasktype: NgForm) {
   this.drawerData = new TaskType();
    tasktype.form.markAsPristine();
    tasktype.form.markAsUntouched();
  }

  save(addNew: boolean, tasktype: NgForm): void {
    this.isOk = true;
    this.isSpinning = false;
    if (
      (this.drawerData.NAME == undefined || this.drawerData.NAME == null || this.drawerData.NAME.trim()=='') &&
      (this.drawerData.SEQ_NO == undefined || this.drawerData.SEQ_NO == null ||this.drawerData.SEQ_NO <= 0 )
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    }
    else if (
     this.drawerData.NAME == null ||
     this.drawerData.NAME.trim() == '' ||
     this.drawerData.NAME == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Task Type .', '');
    }  else if (
      this.drawerData.SEQ_NO == undefined ||
      this.drawerData.SEQ_NO == null ||
      this.drawerData.SEQ_NO <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Sequence Number ', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      if (this.drawerData.ID) {
        this.api.UpdateTaskType(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('Task Type Updated Successfully...', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error('Task Type Updation Failed...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.CreateTaskType(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('Task Type Created Successfully...', '');
            if (!addNew) this.drawerClose();
            else {
             this.drawerData = new TaskType();
              this.resetDrawer(tasktype);
            }
            this.isSpinning = false;
          } else {
            this.message.error('Task Type Creation Failed...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }
}
