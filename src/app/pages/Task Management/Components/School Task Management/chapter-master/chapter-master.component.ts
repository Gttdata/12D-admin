import { Component, OnInit } from '@angular/core';
import { ChapterMaster } from '../../../Models/ChapterMaster';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-chapter-master',
  templateUrl: './chapter-master.component.html',
  styleUrls: ['./chapter-master.component.css']
})
export class ChapterMasterComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  isSpinning = false;
  isOk = true;
  drawerData: ChapterMaster = new ChapterMaster();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage Chapters';
  dataList: any[] = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  subjects: [] = [];
  subjectsload: boolean = false;
  drawerClose2!: Function;
  roleId: any;
  Subject_ID: any
  Questionclasses: [] = [];
  classesload = false;
  boarddataLoad: boolean;
  boardmediumload: boolean;
  board: any;
  boardmedium: any;


  columns: string[][] = [
    ['NAME', ' Name '],
    ['CLASS_NAME', ' CLASS_NAME '],
    ['BOARD_MEDIUM_NAME', ' BOARD_MEDIUM_NAME '],
    ['BOARD_NAME', ' BOARD_NAME '],
    ['SUBJECT_NAME', ' SUBJECT_NAME '],
    ['SEQ_NO', 'Sequence No'],
  ];

  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.roleId = Number(sessionStorage.getItem('roleId'));
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
        (err) => {
          this.boardmediumload = false;

        }
      );
  }



  getallSubjects(event: any) {

    if (this.drawerData.SUBJECT_ID != null) {
      this.drawerData.SUBJECT_ID = 0;
    } else {
    }
    if (this.roleId == 2) {
      var extraFilter: any = ''
      extraFilter = "AND SCHOOL_ID = " + Number(sessionStorage.getItem('schoolid'))
    } else {
      extraFilter = " "
    }
    var boardid=''
    if(this.drawerData.BOARD_ID){
        boardid=" AND BOARD_ID= "+this.drawerData.BOARD_ID
    }
    else{
      boardid=''
    }
    if (event != undefined && event != null) {
      this.subjectsload = true;

      this.api.getAllQuestionSubject(0, 0, '', '', ' AND STATUS!=false AND CLASS_ID = ' + event + extraFilter+boardid).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.subjects = data['data'];
            this.subjectsload = false;
          } else {
            this.subjects = [];
            this.subjectsload = false;
          }
        },
        (err) => {

          this.subjectsload = false;
        }
      );
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
    if (this.roleId == 2) {
      var extraFilter: any = ''
      extraFilter = "AND SCHOOL_ID = " + Number(sessionStorage.getItem('schoolid'))
    } else {
      extraFilter = " "
    }

    this.api
      .getAllChapterMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + extraFilter
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.loadingRecords = false;

          } else {
            this.message.error('Something Went Wrong', '');
            this.dataList = [];
            this.loadingRecords = false;
          }
        },
        (err) => {

        }
      );
  }

  add(): void {
    this.drawerTitle = ' Create New Chapter ';
    this.drawerData = new ChapterMaster();
    if (this.roleId == 2) {
      var extraFilter: any = ''
      extraFilter = "AND SCHOOL_ID = " + Number(sessionStorage.getItem('schoolid'))
    } else {
      extraFilter = " "
    }
    this.api.getAllChapterMaster(1, 1, 'SEQ_NO', 'desc', extraFilter).subscribe(
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
      (err) => {

      }
    );
  }
  edit(data: ChapterMaster): void {
    // console.log(data);
    this.drawerTitle = ' Update Chapter';
    var filterboard=''
    if(data['BOARD_ID'] != 0 && data['BOARD_ID'] != undefined && data['BOARD_ID'] != null){
      filterboard= ' AND BOARD_ID= '+data['BOARD_ID']
    }
    else{
      filterboard=''
    }
    if(data['CLASS_ID'] != 0 && data['CLASS_ID'] != undefined && data['CLASS_ID'] != null)
    {
      this.api.getAllQuestionSubject(0, 0, '', '', ' AND STATUS!=false AND CLASS_ID = ' + data['CLASS_ID']+ filterboard).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.subjects = data['data'];
            this.subjectsload = false;
          } else {
            this.subjects = [];
            this.subjectsload = false;
          }
        },
        (err) => {
  
          this.subjectsload = false;
        }
      );
    }
  
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

  close(): void {
    this.drawerClose();
  }

  //save
  save(addNew: boolean, chapterpage: NgForm): void {
    // 
    this.isSpinning = false;
    this.isOk = true;

    if ((this.drawerData.NAME == undefined || this.drawerData.NAME == null || this.drawerData.NAME.trim() == '')
      && (this.drawerData.BOARD_ID <= 0 || this.drawerData.BOARD_ID == null || this.drawerData.BOARD_ID == undefined)
      && (this.drawerData.BOARD_MEDIUM_ID <= 0 || this.drawerData.BOARD_MEDIUM_ID == null || this.drawerData.BOARD_MEDIUM_ID == undefined)
      && (this.drawerData.CLASS_ID <= 0 || this.drawerData.CLASS_ID == null || this.drawerData.CLASS_ID == undefined)
      && (this.drawerData.SUBJECT_ID <= 0 || this.drawerData.SUBJECT_ID == null || this.drawerData.SUBJECT_ID == undefined)
      && (this.drawerData.SEQ_NO <= 0 || this.drawerData.SEQ_NO == null || this.drawerData.SEQ_NO == undefined)) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.drawerData.BOARD_ID == undefined ||
      this.drawerData.BOARD_ID == null ||
      this.drawerData.BOARD_ID <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Board ', '');
    } else if (
      this.drawerData.BOARD_MEDIUM_ID == undefined ||
      this.drawerData.BOARD_MEDIUM_ID == null ||
      this.drawerData.BOARD_MEDIUM_ID <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Board Medium ', '');
    }
    else if (
      this.drawerData.CLASS_ID == undefined ||
      this.drawerData.CLASS_ID == null ||
      this.drawerData.CLASS_ID <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Class  ', '');
    }
    else if (
      this.drawerData.SUBJECT_ID == undefined ||
      this.drawerData.SUBJECT_ID == null ||
      this.drawerData.SUBJECT_ID <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Subject  ', '');
    }
    else if (
      this.drawerData.NAME == null ||
      this.drawerData.NAME.trim() == '' ||
      this.drawerData.NAME == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Chapter Name', '');
    }
    else if (
      this.drawerData.SEQ_NO == undefined ||
      this.drawerData.SEQ_NO == null ||
      this.drawerData.SEQ_NO <= 0 ||
      this.drawerData.SEQ_NO <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Sequence Number ', '');
    }

    if (this.isOk) {
      // this.isSpinning=false;

      this.isSpinning = true;
      if (this.roleId == 2) {
        this.drawerData.SCHOOL_ID = Number(sessionStorage.getItem('schoolid'))
      }


      if (this.drawerData.ID) {
        this.api.updateChapterMaster(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(' Chapter Information Updated Successfully...', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update Chapter Information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api
          .createChapterMaster(this.drawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(' Chapter Information Saved Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.drawerData = new ChapterMaster();
                this.resetDrawer(chapterpage);
                if (this.roleId == 2) {
                  var extraFilter: any = ''
                  extraFilter = "AND SCHOOL_ID = " + Number(sessionStorage.getItem('schoolid'))
                } else {
                  extraFilter = " "
                }
                this.api.getAllChapterMaster(1, 1, '', 'desc', extraFilter).subscribe(
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
                  (err) => {

                  }
                );
              }
              this.isSpinning = false;
            } else {
              this.message.error(' Failed To Save Chapter Information...', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }
  resetDrawer(chapterpage: NgForm) {
    this.drawerData = new ChapterMaster();
    chapterpage.form.markAsPristine();
    chapterpage.form.markAsUntouched();
  }
}
