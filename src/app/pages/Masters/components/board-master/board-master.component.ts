import { Component, OnInit } from '@angular/core';
import { BoardMaster } from '../../Models/BoardMaster';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/Services/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-board-master',
  templateUrl: './board-master.component.html',
  styleUrls: ['./board-master.component.css']
})
export class BoardMasterComponent implements OnInit {
  isSpinning = false;
  isOk = true;
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: BoardMaster = new BoardMaster();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage Boards ';
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
      .getAllBoardMaster(
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
    this.drawerTitle = 'Create New Board';
    this.drawerData = new BoardMaster();
    this.api.getAllBoardMaster(1, 1, 'SEQ_NO', 'desc', "  " ).subscribe(
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

  edit(data: BoardMaster): void {
    this.drawerTitle = 'Update Board';
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
  resetDrawer(boarddata: NgForm) {
    this.drawerData = new BoardMaster();
    boarddata.form.markAsPristine();
    boarddata.form.markAsUntouched();
  }
  close(): void {
    this.drawerClose();
  }


  save(addNew: boolean, boarddata: NgForm): void {
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
      this.message.error('Please Enter Board Name.', '');
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
      // this.drawerData.SCHOOL_ID = Number(sessionStorage.getItem('schoolid'))
      if (this.drawerData.ID) {
        this.api.updateBoard(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('Board Updated Successfully...', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error('Board Updation Failed...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createBoard(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('Board Created Successfully...', '');
            if (!addNew) this.drawerClose();
            else {
              this.drawerData = new BoardMaster();
              this.resetDrawer(boarddata);
              this.api.getAllBoardMaster(1, 1, '', 'desc', " ").subscribe(
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
            this.message.error('Board  Creation Failed...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }
}
