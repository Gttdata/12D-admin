import { Component, OnInit } from '@angular/core';
import { SubjectMaster } from '../../../Models/SubjectMaster';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { ApiService } from 'src/app/Services/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subjectmaster',
  templateUrl: './subjectmaster.component.html',
  styleUrls: ['./subjectmaster.component.css'],
})
export class SubjectmasterComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  isSpinning = false;
  isOk = true;
  drawerData: SubjectMaster = new SubjectMaster();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage Subjects ';
  dataList: any[] = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  classes: any[] = [];
  classesload: boolean = true;
  drawerClose2!: Function;
  currentroute = '';
  questionsubjectList;
  questionSubjectLoad = false;
  columns: string[][] = [
    ['NAME', ' Name '],
    ['CLASS_NAME', ' CLASS_NAME '],
    ['DIVISION_NAME', 'DIVISION_NAME'],
    ['SEQ_NO', 'Sequence No'],
  ];
  boardId;
  questionsubjectid;
  constructor(
    private api: ApiService,
    private message: NzNotificationService,
    private router: Router
  ) {
    router.events.subscribe((val) => {
      var url = window.location.href;
      var arr = url.split('/');
      this.currentroute = arr[3];
    });
  }
  redirectToAdminDashboard() {
    window.location.href = '/admindashboard';
  }
  roleId: any;
  step_no: number;

  yearId : any;
  ngOnInit(): void {
    this.roleId = Number(sessionStorage.getItem('roleId'));
    this.yearId = Number(sessionStorage.getItem('yearId'))
    this.step_no = Number(sessionStorage.getItem('stepid'));
    this.boardId = sessionStorage.getItem('boardId');

    if (this.step_no >= 0 && this.step_no < 6) {
      this.router.navigate(['/help1']);
    }
    this.getAllClasses();
    this.GetDivisionData();
  }

  classidchange(id: number) {

    if (this.drawerData.CLASS_ID != null) {
   
      this.drawerData.QUESTION_SUBJECT_ID = 0
    } else {
    }
    const filtererddata = this.classes.filter((a: any) => {
      return a.ID == id;
    });
 
    // console.log(this.classes,filtererddata);
    this.questionsubjectid = filtererddata[0]['QUESTION_CLASS_ID'];
    this.questionSubjectLoad = true;
    if (this.questionsubjectid) {
      var localFilter = ' AND CLASS_ID= ' + this.questionsubjectid;
      this.api
        .getAllQuestionSubject(0, 0, 'id', 'asc', localFilter)
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.questionSubjectLoad = false;
            this.questionsubjectList = data['data'];
          } else {
            this.questionsubjectList = [];
            this.questionSubjectLoad = false;

          }
        });
    }else
    {
      this.questionSubjectLoad = false;

    }
  }
  getAllClasses() {
    if (this.roleId == 2) {
      var extraFilter: any = '';
      extraFilter =
        'AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = ' ';
    }
    // var boardFilter = '';
    // if (this.boardId) {
    //   boardFilter = ' AND BOARD_ID= ' + this.boardId;
    // } else boardFilter = '';
    this.classesload = true;
    this.api
      .getAllClassMaster(0, 0, '', '', ' AND STATUS!=false ' + extraFilter)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.classes = data['data'];
            this.classesload = false;
          } else {
            this.classes = [];
            this.classesload = false;
          }
        },
        (err) => {
          this.classesload = false;
        }
      );
  }
  Divisionlist: any = [];
  GetDivisionData() {
    if (this.roleId == 2) {
      var extraFilter: any = '';
      extraFilter =
        'AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = ' ';
    }

    this.api
      .getAllDivisions(0, 0, '', 'asc', ' AND STATUS=1 ' + extraFilter)
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.Divisionlist = data['data'];
          } else {
            this.Divisionlist = [];
          }
        } else {
          this.message.error('Failed To Get Division Data.', '');
          this.Divisionlist = [];
        }
      });
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
      likeQuery = ' AND (';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    if (this.roleId == 2) {
      var extraFilter: any = '';
      extraFilter =
        'AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = ' ';
    }
    this.api
      .getAllSubjectMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + extraFilter + ' AND STATUS=1'
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
        (err) => {}
      );
  }

  add(): void {
    this.drawerTitle = ' Create New Subject ';
    this.drawerData = new SubjectMaster();
    if (this.roleId == 2) {
      var extraFilter: any = '';
      extraFilter =
        'AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = ' ';
    }

    this.api.getAllSubjectMaster(1, 1, 'SEQ_NO', 'desc', extraFilter).subscribe(
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
  edit(data: SubjectMaster): void {
    console.log(data);
    
    this.drawerTitle = ' Update Subject';
    this.drawerData = Object.assign({}, data);
    if (
      data.QUESTION_SUBJECT_ID != undefined &&
      data.QUESTION_SUBJECT_ID != null &&
      data.QUESTION_SUBJECT_ID > 0
    ) {
     
      this.api.getAllQuestionSubject(0, 0, '', '', ' AND ID = '+ data.QUESTION_SUBJECT_ID).subscribe((data)=>
        {
          if (data['code'] == 200) {
            // console.log(data,'vasj');
            
            this.questionsubjectList = data['data'];
            this.questionSubjectLoad = false;
          } else {
            this.questionsubjectList = [];
            this.questionSubjectLoad = false;

          }
        },
        (err) => {
          this.questionSubjectLoad = false;
        }
      );
    }
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
  OnConfirmDelete(data) {
    this.loadingRecords=true
    data.STATUS = 0;
    this.api.updateSubjectMaster(data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Subject Deleted Successfully', '');
        this.drawerClose();
        this.loadingRecords = false;
      } else {
        this.message.error('Subject Deletion Failed', '');
        this.loadingRecords = false;
      }
    });
  }
  //save
  save(addNew: boolean, subjectpage: NgForm): void {
    //
    this.isSpinning = false;
    this.isOk = true;

    if (
      (this.drawerData.NAME == undefined ||
        this.drawerData.NAME == null ||
        this.drawerData.NAME.trim() == '') &&
      (this.drawerData.CLASS_ID <= 0 ||
        this.drawerData.CLASS_ID == null ||
        this.drawerData.CLASS_ID == undefined) &&
      (this.drawerData.DIVISION_ID < 0 ||
        this.drawerData.DIVISION_ID == null ||
        this.drawerData.DIVISION_ID == undefined) &&
      (this.drawerData.QUESTION_SUBJECT_ID == null ||
        this.drawerData.QUESTION_SUBJECT_ID == undefined) &&
      (this.drawerData.SEQ_NO <= 0 ||
        this.drawerData.SEQ_NO == null ||
        this.drawerData.SEQ_NO == undefined)
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.drawerData.CLASS_ID == undefined ||
      this.drawerData.CLASS_ID == null ||
      this.drawerData.CLASS_ID <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Class Name ', '');
    } else if (
      this.drawerData.DIVISION_ID == undefined ||
      this.drawerData.DIVISION_ID == null ||
      this.drawerData.DIVISION_ID < 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Division Name ', '');
    } 
    else if (
      this.drawerData.NAME == null ||
      this.drawerData.NAME.trim() == '' ||
      this.drawerData.NAME == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Subject Name', '');
    } else if (
      this.drawerData.QUESTION_SUBJECT_ID == undefined ||
      this.drawerData.QUESTION_SUBJECT_ID == null ||
      this.drawerData.QUESTION_SUBJECT_ID < 0

    ) {
      this.isOk = false;
      this.message.error(' Please Select Question Subject ', '');
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
      // this.isSpinning=false;

      this.drawerData.YEAR_ID = this.yearId ;


      this.isSpinning = true;
      if (this.roleId == 2) {
        this.drawerData.SCHOOL_ID = Number(sessionStorage.getItem('schoolid'));
      }

      if (this.drawerData.ID) {
        this.api
          .updateSubjectMaster(this.drawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(
                ' Subject Information Updated Successfully...',
                ''
              );
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error(
                ' Failed To Update Subject Information...',
                ''
              );
              this.isSpinning = false;
            }
          });
      } else {
        this.api
          .createSubjectMaster(this.drawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(
                ' Subject Information Saved Successfully...',
                ''
              );
              if (!addNew) this.drawerClose();
              else {
                this.drawerData = new SubjectMaster();
                if (this.roleId == 2) {
                  var extraFilter: any = '';
                  extraFilter =
                    'AND SCHOOL_ID = ' +
                    Number(sessionStorage.getItem('schoolid'));
                } else {
                  extraFilter = ' ';
                }
                this.resetDrawer(subjectpage);
                this.api
                  .getAllSubjectMaster(1, 1, '', 'desc', extraFilter)
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
              this.message.error(' Failed To Save Subject Information...', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }
  resetDrawer(subjectpage: NgForm) {
    this.drawerData = new SubjectMaster();
    subjectpage.form.markAsPristine();
    subjectpage.form.markAsUntouched();
  }
}
