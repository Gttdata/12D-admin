import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Services/api.service';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { QuestionMaster } from 'src/app/pages/Task Management/Models/QuestionMaster';
import { appkeys } from 'src/app/app.constant';

export class FilterVar {
  CLASS_ID: any;
  QUESTION_TYPE: any;
  CHAPTER_ID: any;
  SUBJECT_ID: any;

}
@Component({
  selector: 'app-question-master-list',
  templateUrl: './question-master-list.component.html',
  styleUrls: ['./question-master-list.component.css'],
})
export class QuestionMasterListComponent implements OnInit {
  isLoading: boolean = false;
  formTitle: string = 'Manage Questions';
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: QuestionMaster = new QuestionMaster();
  dataList = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  filterClass: string = 'filter-invisible';
  classload: boolean = false;
  classlist = [];
  typeLoad: boolean;
  questionTypeList: any[];
  filterdata: FilterVar = new FilterVar()
  chapterList1: any[];
  chapterLoad1: boolean;
  subjects: [] = [];
  subjectsload: boolean = false;

  columns: string[][] = [
    ['QUESTION_TYPE_NAME', 'QUESTION_TYPE_NAME'],
    ['CHAPTER_NAME', 'CHAPTER_NAME'],
    ['CLASS_NAME', 'CLASS_NAME'],
    ['SUBJECT_NAME', 'SUBJECT_NAME'],
    ['QUESTION_TYPE_NAME', 'QUESTION_TYPE_NAME'],
    ['QUESTION', 'QUESTION'],
    ['MARKS', 'MARKS'],
    ['SEQ_NO', 'SEQ_NO'],
  ];

  isSpinning: boolean = false;
  public commonFunction = new CommomFunctionsService();
  isOk: boolean = true;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) { }
  // data:any=new planmaster()
  roleId: any;
  classId: any;
  ngOnInit(): void {
    this.roleId = sessionStorage.getItem('roleId');
    this.classId = Number(sessionStorage.getItem('classid'));
    this.getQuestionClass();
    this.getallQuestionType();
    this.getallChapter();
    this.getallSubjects()
  }

  getQuestionClass() {
    this.classload = true;
    this.api
      .getAllQuestionPaperClassMaster(0, 0, '', '', ' AND STATUS=1')
      .subscribe((classs) => {
        if (classs.code == 200) {
          this.classlist = classs['data'];
          this.classload = false;
        } else {
          this.message.error('Failed To Get Classes', ``);
          this.classload = false;
          this.classlist = [];
        }
      });
    this.classload = false;

  }

  getallQuestionType() {
    this.typeLoad = true;
    this.api.getAllQuestionType(0, 0, '', '', ' AND STATUS!=false').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.questionTypeList = data['data'];
          this.typeLoad = false;
        } else {
          this.questionTypeList = [];
          this.typeLoad = false;
        }
      },
      (err) => {
        this.typeLoad = false;
      }
    );
  }

  getallSubjects() {

    this.chapterLoad1 = true;
    this.api
      .getAllQuestionSubject(
        0,
        0,
        '',
        '',
        ' AND STATUS!=false '
      )
      .subscribe(
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
          this.chapterLoad1 = false;
        }
      );

  }
  getallChapter() {

    this.chapterLoad1 = true;
    this.api
      .getAllChapterMaster(
        0,
        0,
        '',
        '',
        ' AND STATUS!=false '
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.chapterList1 = data['data'];
            this.chapterLoad1 = false;
          } else {
            this.chapterList1 = [];
            this.chapterLoad1 = false;
          }
        },
        (err) => {
          this.chapterLoad1 = false;
        }
      );

  }

  close(): void {
    this.drawerClose();
  }
  keyup(event: any) {
    this.search();
  }



  // Apply Filter


  showFilter(): void {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  applyFilter() {
    this.isSpinning = true;
    this.loadingRecords = true;

    

    this.filterQuery = '';
    if ((this.filterdata.QUESTION_TYPE != undefined || this.filterdata.QUESTION_TYPE != null || this.filterdata.QUESTION_TYPE > 0) &&
      (this.filterdata.CLASS_ID != undefined || this.filterdata.CLASS_ID != null || this.filterdata.CLASS_ID > 0) &&
      (this.filterdata.SUBJECT_ID != undefined || this.filterdata.SUBJECT_ID != null || this.filterdata.SUBJECT_ID > 0) &&
      (this.filterdata.CHAPTER_ID != undefined || this.filterdata.CHAPTER_ID != null || this.filterdata.CHAPTER_ID > 0)) {
      this.filterQuery = ' AND QUESTION_TYPE = ' + this.filterdata.QUESTION_TYPE + ' AND CLASS_ID = ' + this.filterdata.CLASS_ID + ' AND SUBJECT_ID = ' + this.filterdata.SUBJECT_ID + ' AND CHAPTER_ID = ' + this.filterdata.CHAPTER_ID;
    }

    else if ((this.filterdata.QUESTION_TYPE != undefined || this.filterdata.QUESTION_TYPE != null || this.filterdata.QUESTION_TYPE > 0) &&
      (this.filterdata.CLASS_ID != undefined || this.filterdata.CLASS_ID != null || this.filterdata.CLASS_ID > 0) &&
      (this.filterdata.SUBJECT_ID != undefined || this.filterdata.SUBJECT_ID != null || this.filterdata.SUBJECT_ID > 0)) {
      this.filterQuery = ' AND QUESTION_TYPE = ' + this.filterdata.QUESTION_TYPE + ' AND CLASS_ID = ' + this.filterdata.CLASS_ID + ' AND SUBJECT_ID = ' + this.filterdata.SUBJECT_ID;
    }
    else if ((this.filterdata.QUESTION_TYPE != undefined || this.filterdata.QUESTION_TYPE != null || this.filterdata.QUESTION_TYPE > 0) &&
      (this.filterdata.CLASS_ID != undefined || this.filterdata.CLASS_ID != null || this.filterdata.CLASS_ID > 0) &&
      (this.filterdata.CHAPTER_ID != undefined || this.filterdata.CHAPTER_ID != null || this.filterdata.CHAPTER_ID > 0)) {
      this.filterQuery = ' AND QUESTION_TYPE = ' + this.filterdata.QUESTION_TYPE + ' AND CLASS_ID = ' + this.filterdata.CLASS_ID + ' AND CHAPTER_ID = ' + this.filterdata.CHAPTER_ID;
    }
    else if ((this.filterdata.QUESTION_TYPE != undefined || this.filterdata.QUESTION_TYPE != null || this.filterdata.QUESTION_TYPE > 0) &&
      (this.filterdata.SUBJECT_ID != undefined || this.filterdata.SUBJECT_ID != null || this.filterdata.SUBJECT_ID > 0) &&
      (this.filterdata.CHAPTER_ID != undefined || this.filterdata.CHAPTER_ID != null || this.filterdata.CHAPTER_ID > 0)) {
      this.filterQuery = ' AND QUESTION_TYPE = ' + this.filterdata.QUESTION_TYPE + ' AND SUBJECT_ID = ' + this.filterdata.SUBJECT_ID + ' AND CHAPTER_ID = ' + this.filterdata.CHAPTER_ID;
    }
    else if ((this.filterdata.CLASS_ID != undefined || this.filterdata.CLASS_ID != null || this.filterdata.CLASS_ID > 0) &&
      (this.filterdata.SUBJECT_ID != undefined || this.filterdata.SUBJECT_ID != null || this.filterdata.SUBJECT_ID > 0) &&
      (this.filterdata.CHAPTER_ID != undefined || this.filterdata.CHAPTER_ID != null || this.filterdata.CHAPTER_ID > 0)) {
      this.filterQuery = ' AND CLASS_ID = ' + this.filterdata.CLASS_ID + ' AND SUBJECT_ID = ' + this.filterdata.SUBJECT_ID + ' AND CHAPTER_ID = ' + this.filterdata.CHAPTER_ID;
    }
    else if ((this.filterdata.QUESTION_TYPE != undefined || this.filterdata.QUESTION_TYPE != null || this.filterdata.QUESTION_TYPE > 0) &&
      (this.filterdata.CLASS_ID != undefined || this.filterdata.CLASS_ID != null || this.filterdata.CLASS_ID > 0)) {
      this.filterQuery = ' AND QUESTION_TYPE = ' + this.filterdata.QUESTION_TYPE + ' AND CLASS_ID = ' + this.filterdata.CLASS_ID;
    }
    else if ((this.filterdata.QUESTION_TYPE != undefined || this.filterdata.QUESTION_TYPE != null || this.filterdata.QUESTION_TYPE > 0) &&
      (this.filterdata.SUBJECT_ID != undefined || this.filterdata.SUBJECT_ID != null || this.filterdata.SUBJECT_ID > 0)) {
      this.filterQuery = ' AND QUESTION_TYPE = ' + this.filterdata.QUESTION_TYPE + ' AND SUBJECT_ID = ' + this.filterdata.SUBJECT_ID;
    }
    else if ((this.filterdata.QUESTION_TYPE != undefined || this.filterdata.QUESTION_TYPE != null || this.filterdata.QUESTION_TYPE > 0) &&
      (this.filterdata.CHAPTER_ID != undefined || this.filterdata.CHAPTER_ID != null || this.filterdata.CHAPTER_ID > 0)) {
      this.filterQuery = ' AND QUESTION_TYPE = ' + this.filterdata.QUESTION_TYPE + ' AND CHAPTER_ID = ' + this.filterdata.CHAPTER_ID;
    }
    else if ((this.filterdata.CLASS_ID != undefined || this.filterdata.CLASS_ID != null || this.filterdata.CLASS_ID > 0) &&
      (this.filterdata.SUBJECT_ID != undefined || this.filterdata.SUBJECT_ID != null || this.filterdata.SUBJECT_ID > 0)) {
      this.filterQuery = ' AND CLASS_ID = ' + this.filterdata.CLASS_ID + ' AND SUBJECT_ID = ' + this.filterdata.SUBJECT_ID;
    }
    else if ((this.filterdata.CLASS_ID != undefined || this.filterdata.CLASS_ID != null || this.filterdata.CLASS_ID > 0) &&
      (this.filterdata.CHAPTER_ID != undefined || this.filterdata.CHAPTER_ID != null || this.filterdata.CHAPTER_ID > 0)) {
      this.filterQuery = ' AND CLASS_ID = ' + this.filterdata.CLASS_ID + ' AND CHAPTER_ID = ' + this.filterdata.CHAPTER_ID;
    }
    else if ((this.filterdata.SUBJECT_ID != undefined || this.filterdata.SUBJECT_ID != null || this.filterdata.SUBJECT_ID > 0) &&
      (this.filterdata.CHAPTER_ID != undefined || this.filterdata.CHAPTER_ID != null || this.filterdata.CHAPTER_ID > 0)) {
      this.filterQuery = ' AND SUBJECT_ID = ' + this.filterdata.SUBJECT_ID + ' AND CHAPTER_ID = ' + this.filterdata.CHAPTER_ID;
    }

    else if ((this.filterdata.QUESTION_TYPE != undefined || this.filterdata.QUESTION_TYPE != null || this.filterdata.QUESTION_TYPE > 0)) {
      this.filterQuery = ' AND QUESTION_TYPE = ' + this.filterdata.QUESTION_TYPE;
    } else if ((this.filterdata.CLASS_ID != undefined || this.filterdata.CLASS_ID != null || this.filterdata.CLASS_ID > 0)) {
      this.filterQuery = ' AND CLASS_ID = ' + this.filterdata.CLASS_ID;
    } else if ((this.filterdata.SUBJECT_ID != undefined || this.filterdata.SUBJECT_ID != null || this.filterdata.SUBJECT_ID > 0)) {
      this.filterQuery = ' AND SUBJECT_ID = ' + this.filterdata.SUBJECT_ID;
    } else if ((this.filterdata.CHAPTER_ID != undefined || this.filterdata.CHAPTER_ID != null || this.filterdata.CHAPTER_ID > 0)) {
      this.filterQuery = ' AND CHAPTER_ID = ' + this.filterdata.CHAPTER_ID;
    }


    if (
      this.filterQuery == '' ||
      this.filterQuery == null ||
      this.filterQuery == undefined
    ) {
      this.message.error('', 'Please Select Any Filter Value');
      this.loadingRecords = false;
      this.isSpinning = false;
      this.isFilterApplied = 'default';
      this.filterClass = 'filter-visible';
    } else {
      this.isFilterApplied = 'primary';
      this.search();
    }
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.filterdata.CLASS_ID = null;
    this.filterdata.QUESTION_TYPE = null;
    this.filterdata.CHAPTER_ID = null;
    this.filterdata.SUBJECT_ID = null;
    this.search();
  }

  onKeypressEvent(event:Event)
  {
    event.preventDefault(); 
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
      likeQuery = ' AND (';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    if (this.roleId == 3) {
      var extraFilter: any = '';
      extraFilter =
        'AND CLASS_ID = ' +
        Number(sessionStorage.getItem('classid')) +
        ' AND DIVISION_ID = ' +
        Number(sessionStorage.getItem('divisionId'));
    } else {
      extraFilter = ' ';
    }
    this.api
      .getAllQuestionMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        extraFilter + likeQuery + this.filterQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.isSpinning = false
            this.totalRecords = data['count'];
            this.dataList = data['data'];
          } else {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
            this.isSpinning = false

            this.dataList = [];
          }
          // if(this.totalRecords==0){
          //   data.SEQ_NO=1;
          // }else{
          //   data.SEQ_NO= this.dataList[this.dataList.length-1]['SEQ_NO']+1
          // }
        },
        (err) => { }
      );
  }

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  OptionList: any = [];
  chapterList: any = [];
  QuePaperSubjectList: any = [];

  add(): void {
    this.drawerTitle = 'Create New Question';
    this.drawerData = new QuestionMaster();
    this.loadingRecords = true;
    if (this.roleId == 3) {
      var extraFilter: any = '';
      extraFilter =
        'AND CLASS_ID = ' +
        Number(sessionStorage.getItem('classid')) +
        ' AND DIVISION_ID = ' +
        Number(sessionStorage.getItem('divisionId'));
    } else {
      extraFilter = '';
    }
    this.api
      .getAllQuestionMaster(1, 1, 'SEQ_NO', 'desc', extraFilter)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['count'] == 0) {
              this.drawerData.SEQ_NO = 1;
            } else {
              this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
            }
            this.OptionList = [];
            this.loadingRecords = false;
            this.answerImageUrl = '';
            this.questionImageUrl = '';
            this.chapterList = [];
            this.QuePaperSubjectList = [];
            this.drawerVisible = true;
          } else {
            this.loadingRecords = false;
            this.message.error('Something Went Wrong', '');
          }
        },
        (err) => { }
      );
    // this.drawerData.IS_ACTIVE=true;
  }
  answerImageUrl: any = '';
  questionImageUrl: any = '';
  edit(data: any): void {
    this.loadingRecords = true;
    this.drawerTitle = 'Update Question';
    this.drawerData = Object.assign({}, data);
    if (
      data.QUESTION_IMAGE != null &&
      data.QUESTION_IMAGE != undefined &&
      data.QUESTION_IMAGE != ''
    ) {
      this.questionImageUrl =
        appkeys.retriveimgUrl + 'questionImage/' + data.QUESTION_IMAGE;
    } else {
      this.questionImageUrl = '';
    }
    if (
      data.ANSWER_IMAGE != null &&
      data.ANSWER_IMAGE != undefined &&
      data.ANSWER_IMAGE != ''
    ) {
      this.answerImageUrl =
        appkeys.retriveimgUrl + 'answerImage/' + data.ANSWER_IMAGE;
    } else {
      this.answerImageUrl = '';
    }

    this.api
      .getAllMappedQuestion(0, 0, '', 'asc', ' AND QUESTION_ID = ' + data.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.OptionList = data['data'];
              this.OptionList.forEach((element) => {
                if (element['IS_CORRECT'] == 0) {
                  element['IS_CORRECT'] = false;
                } else {
                  element['IS_CORRECT'] = true;
                }
              });
            } else {
              this.OptionList = [];
            }

            this.api
              .getAllQuestionSubject(
                0,
                0,
                '',
                '',
                ' AND STATUS!=false AND CLASS_ID =' + this.drawerData.CLASS_ID
              )
              .subscribe(
                (data1) => {
                  if (data1['code'] == 200) {
                    this.QuePaperSubjectList = data1['data'];
                    this.api
                      .getAllChapterMaster(
                        0,
                        0,
                        '',
                        '',
                        ' AND STATUS!=false AND SUBJECT_ID =' +
                        this.drawerData.SUBJECT_ID
                      )
                      .subscribe(
                        (data2) => {
                          if (data2['code'] == 200) {
                            this.chapterList = data2['data'];
                            this.loadingRecords = false;
                            this.drawerVisible = true;
                          } else {
                            this.loadingRecords = false;
                            this.chapterList = [];
                          }
                        },
                        (err) => { }
                      );
                  } else {
                    this.loadingRecords = false;
                    this.QuePaperSubjectList = [];
                  }
                },
                (err) => { }
              );
          } else {
            this.loadingRecords = false;
            this.message.error('Something Went Wrong', '');
          }
        },
        (err) => { }
      );

    // if (this.roleId == 3) {
    //   var subList: any = [];
    //   this.api
    //     .getAllSubjectMaster(
    //       0,
    //       0,
    //       '',
    //       '',
    //       ' AND STATUS!=false AND CLASS_ID =' + this.classId
    //     )
    //     .subscribe(
    //       (data) => {
    //         if (data['code'] == 200) {
    //           if (data['data'].length == 0) {
    //             subList = [];
    //           } else {
    //             subList = data['data'];
    //           }
    //           if (subList.length > 0) {
    //             const uniqueSubjectIds = new Set(
    //               subList.map((subject: any) => subject.ID)
    //             );
    //             const uniqueIdsArray = Array.from(uniqueSubjectIds);

    //             this.api
    //               .getAllChapterMaster(
    //                 0,
    //                 0,
    //                 '',
    //                 '',
    //                 ' AND STATUS!=false AND SUBJECT_ID in (' +
    //                   uniqueIdsArray +
    //                   ')'
    //               )
    //               .subscribe(
    //                 (data) => {
    //                   if (data['code'] == 200) {
    //                     if (data['data'].length == 0) {
    //                       this.chapterList = [];
    //                     } else {
    //                       this.chapterList = data['data'];
    //                     }
    //                     this.drawerVisible = true;
    //                   } else {
    //                     this.chapterList = [];
    //                   }
    //                 },
    //                 (err) => {}
    //               );
    //           } else {
    //           }
    //         } else {
    //           subList = [];
    //         }
    //       },
    //       (err) => {}
    //     );
    // } else {
    //   this.drawerVisible = true;
    // }
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
}
