import { Component, OnInit } from '@angular/core';
import { BoardMedium } from '../../Models/BoardMedium';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Services/api.service';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';

@Component({
  selector: 'app-board-medium-master',
  templateUrl: './board-medium-master.component.html',
  styleUrls: ['./board-medium-master.component.css']
})
export class BoardMediumMasterComponent implements OnInit {
  isSpinning = false;
  roleId: number;

  isOk = true;
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: BoardMedium = new BoardMedium();
  formTitle = 'Manage Board Mediums ';
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

  columns: string[][] = [
    ['NAME', 'NAME'],
    ['SEQ_NO', 'SEQ_NO'],
    ['STATUS', 'STATUS'],
  ];

  constructor(
    private message: NzNotificationService,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.roleId = Number(sessionStorage.getItem('roleId'));

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
    // var extraFilter = '';


    // if (this.roleId == 2) {

    //   extraFilter = ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'))
    // } else {
    //   extraFilter = " "
    // }
    var likeQuery = '';


    if (this.searchText != '') {
      likeQuery = ' AND';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }
    this.api
      .getAllBoardMediumMaster(
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
        (err) => { }
      );
  }

  add(): void {
    // var extraFilter = '';


    // if (this.roleId == 2) {

    //   extraFilter = ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'))
    // } else {
    //   extraFilter = " "
    // }
    this.drawerTitle = 'Create New Board Medium';
    this.drawerData = new BoardMedium();
    this.api.getAllBoardMediumMaster(1, 1, 'SEQ_NO', 'desc', '').subscribe(
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
      (err) => { }
    );

  }

  edit(data: BoardMedium): void {
    this.drawerTitle = 'Update Borad Medium';
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
    this.drawerData = new BoardMedium();
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
      this.message.error('Please Enter Board Medium Name.', '');
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
      // var extraFilter = '';


      // if(this.roleId==2){
        
      //   this.drawerData['SCHOOL_ID'] = Number(sessionStorage.getItem('schoolid'))
      // }else
      // {
      //   this.drawerData['SCHOOL_ID '] = null
      // }
      if (this.drawerData.ID) {
        this.api.updateBoardMedium(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('Board Medium  Updated Successfully...', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error('Board Medium  Updation Failed...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createBoardMedium(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('Board Medium  Created Successfully...', '');
            if (!addNew) this.drawerClose();
            else {
              this.drawerData = new BoardMedium();
              this.resetDrawer(Mediumdata);
              // var extraFilter = '';


              // if (this.roleId == 2) {

              //   extraFilter = ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'))
              // } else {
              //   extraFilter = " "
              // }
              this.api.getAllBoardMediumMaster(1, 1, '', 'desc', '').subscribe(
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
                (err) => { }
              );
            }
            this.isSpinning = false;
          } else {
            this.message.error('Board Medium   Creation Failed...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }

}
