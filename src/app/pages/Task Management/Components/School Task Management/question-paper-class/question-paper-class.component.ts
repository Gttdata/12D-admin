import { Component, OnInit } from '@angular/core';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Services/api.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NgForm } from '@angular/forms';
import { QuestionPaperClassMaster } from '../../../Models/Question-Paper-Class';

@Component({
  selector: 'app-question-paper-class',
  templateUrl: './question-paper-class.component.html',
  styleUrls: ['./question-paper-class.component.css'],
})
export class QuestionPaperClassComponent implements OnInit {
  isSpinning = false;
  isOk = true;
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: QuestionPaperClassMaster = new QuestionPaperClassMaster();
  formTitle = 'Manage Question Paper Classes';
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
    ['BOARD_NAME', 'BOARD_NAME'],
    ['SEQ_NO', 'SEQ_NO'],
    ['STATUS', 'STATUS'],
  ];
  boarddataLoad: boolean;
  boardmediumload: boolean;
  board: any;

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
    this.getallBoardType()
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
      .getAllQuestionPaperClassMaster(
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
    this.drawerTitle = 'Create New Question Class ';
    this.drawerData = new QuestionPaperClassMaster();
    this.api
      .getAllQuestionPaperClassMaster(1, 1, 'SEQ_NO', 'desc', '  ')
      .subscribe(
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
  }
  edit(data: QuestionPaperClassMaster): void {
    this.drawerTitle = 'Update Question Class ';
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
  resetDrawer(Qclassdata: NgForm) {
    this.drawerData = new QuestionPaperClassMaster();
    Qclassdata.form.markAsPristine();
    Qclassdata.form.markAsUntouched();
  }
  close(): void {
    this.drawerClose();
  }

  save(addNew: boolean, Qclassdata: NgForm): void {
    this.isOk = true;
    this.isSpinning = false;
    if (
      (this.drawerData.NAME == undefined ||
        this.drawerData.NAME == null ||
        this.drawerData.NAME == '') &&
      (this.drawerData.SEQ_NO <= 0 ||
        this.drawerData.SEQ_NO == null ||
        this.drawerData.SEQ_NO == undefined) &&
      (this.drawerData.BOARD_ID <= 0 ||
        this.drawerData.BOARD_ID == null ||
        this.drawerData.BOARD_ID == undefined)
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.drawerData.NAME == null ||
      this.drawerData.NAME == undefined ||
      this.drawerData.NAME == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Question Class Name.', '');
    } else if (
      this.drawerData.BOARD_ID == undefined ||
      this.drawerData.BOARD_ID == null ||
      this.drawerData.BOARD_ID <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Board ', '');
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
      // this.drawerData.SCHOOL_ID = Number(sessionStorage.getItem('schoolid'))
      if (this.drawerData.ID) {
        this.api
          .updateQuestionPaperClass(this.drawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(' Master Data Updated Successfully...', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error(' Master Data Updation Failed...', '');
              this.isSpinning = false;
            }
          });
      } else {
        this.api
          .createQuestionPaperClass(this.drawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(' Master Data Created Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.drawerData = new QuestionPaperClassMaster();
                this.resetDrawer(Qclassdata);
                this.api
                  .getAllQuestionPaperClassMaster(1, 1, '', 'desc', ' ')
                  .subscribe(
                    (data) => {
                      if (data['code'] == 200) {
                        if (data['count'] == 0) {
                          this.drawerData.SEQ_NO = 1;
                        } else {
                          this.drawerData.SEQ_NO =
                            data['data'][0]['SEQ_NO'] + 1;
                        }
                      } else {
                      }
                    },
                    (err) => {}
                  );
              }
              this.isSpinning = false;
            } else {
              this.message.error(' Master Data Creation Failed...', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }
}
