import { Component, OnInit } from '@angular/core';
import { questionsubject } from '../../../Models/questionsubject';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Services/api.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-questionsubject',
  templateUrl: './questionsubject.component.html',
  styleUrls: ['./questionsubject.component.css'],
})
export class QuestionsubjectComponent implements OnInit {
  Questionclasses: [] = [];
  isSpinning = false;
  isOk = true;
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: questionsubject = new questionsubject();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage Question Subjects';
  dataList = [];
  loadingRecords = false;
  classesload = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  screenwidth: any;
  YearWidth = 0;

  roleId = Number(sessionStorage.getItem('roleId'));

  columns: string[][] = [
    ['NAME', 'NAME'],
    ['CLASS_NAME', 'CLASS_NAME'],
    ['BOARD_NAME', 'BOARD_NAME'],
    ['BOARD_MEDIUM_NAME', 'BOARD_MEDIUM_NAME'],
    ['STATUS', 'STATUS'],
  ];
  boarddataLoad: boolean;
  boardmediumload: boolean;
  board: any;
  boardmedium: any;

  constructor(
    private message: NzNotificationService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.screenwidth = window.innerWidth;
    if (this.screenwidth > 500) {
      this.YearWidth = 600;
    } else {
      this.YearWidth = 380;
    }

    
    this.getallBoardType();
    this.getAllClasses();
  }

  getAllClasses() {
    this.classesload = true;
    this.api
      .getAllQuestionPaperClassMaster(0, 0, '', '', ' AND STATUS!=false ')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.Questionclasses = data['data'];
            this.classesload = false;
          } else {
            this.Questionclasses = [];
            this.classesload = false;
          }
        },
        (err) => {
          this.classesload = false;
        }
      );
  }
  getallBoardType() {
    this.boarddataLoad = true;
    this.boardmediumload = true;
    this.api.getAllBoardMaster(0, 0, '', '', ' AND STATUS!=false ').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.board = data['data'];
          this.boarddataLoad = false;
        } else {
          this.board = [];
          this.boarddataLoad = false;
        }
      },
      (err) => {
        this.boarddataLoad = false;
      }
    );
    this.api
      .getAllBoardMediumMaster(0, 0, '', '', ' AND STATUS!=false ')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.boardmedium = data['data'];
            this.boardmediumload = false;
          } else {
            this.message.error('Something Went Wrong', '');
            this.boardmediumload = false;
            this.boardmedium = [];
          }
        },
        (err) => {}
      );
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
      .getAllQuestionSubject(
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
    this.drawerTitle = 'Create New Question Subject';
    this.drawerData = new questionsubject();
    this.api.getAllQuestionSubject(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {
        if (data['count'] == 0) {
          this.drawerData.SEQ_NO = 1;
        } else {
          this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
        }
      },
      (err) => {}
    );
    this.drawerVisible = true;
  }

  edit(data: questionsubject): void {
    this.drawerTitle = 'Update Question Subject';
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

  close() {
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
  resetDrawer(questionsubjec: NgForm) {
    this.drawerData = new questionsubject();
    questionsubjec.form.markAsPristine();
    questionsubjec.form.markAsUntouched();
  }

  save(addNew: boolean, questionsubjec: NgForm): void {
    this.isOk = true;
    this.isSpinning = false;
    if (
      (this.drawerData.NAME == undefined ||
        this.drawerData.NAME == null ||
        this.drawerData.NAME.trim() == '') &&
      (this.drawerData.SEQ_NO == undefined ||
        this.drawerData.SEQ_NO == null ||
        this.drawerData.SEQ_NO <= 0)
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.drawerData.CLASS_ID == undefined ||
      this.drawerData.CLASS_ID == null ||
      this.drawerData.CLASS_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Class', '');
    } else if (
      this.drawerData.BOARD_ID == undefined ||
      this.drawerData.BOARD_ID == null ||
      this.drawerData.BOARD_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Board', '');
    }else if (
      this.drawerData.BOARD_MEDIUM_ID == undefined ||
      this.drawerData.BOARD_MEDIUM_ID == null ||
      this.drawerData.BOARD_MEDIUM_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Board Medium', '');
    } else if (
      this.drawerData.NAME == null ||
      this.drawerData.NAME.trim() == '' ||
      this.drawerData.NAME == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Question Subject Name .', '');
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
        this.api
          .updateQuestionSubject(this.drawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(
                'Question Subject Updated Successfully...',
                ''
              );
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Question Subject Updation Failed...', '');
              this.isSpinning = false;
            }
          });
      } else {
        this.api
          .createQuestionSubject(this.drawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(
                'Question Subject Created Successfully...',
                ''
              );
              if (!addNew) this.drawerClose();
              else {
                this.drawerData = new questionsubject();
                this.resetDrawer(questionsubjec);
              }
              this.isSpinning = false;
            } else {
              this.message.error('Question Subject Creation Failed...', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }
}
