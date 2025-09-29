import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { ApiService } from 'src/app/Services/api.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { classmapping, classmaster } from '../../../Models/classmaster';
import { MapClassWiseFeeData } from '../../../Models/mapClassWiseFee';
import { Router } from '@angular/router';

@Component({
  selector: 'app-classmaster',
  templateUrl: './classmaster.component.html',
  styleUrls: ['./classmaster.component.css'],
})
export class ClassmasterComponent implements OnInit {
  isLoading: boolean = false;
  formTitle: string = 'Manage Classes';
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: classmaster = new classmaster();
  drawerVisibleMap!: boolean;
  drawerTitleMap!: string;
  drawerDataMap: MapClassWiseFeeData = new MapClassWiseFeeData();

  roleId = Number(sessionStorage.getItem('roleId'));
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
  yearlist = [];
  currentroute = '';
  loadQuestionClass = false;
  columns: string[][] = [
    ['NAME', 'NAME'],
    ['SEQ_NO', 'SEQ_NO'],
    ['STATUS', 'STATUS'],
    ['TOTAL_FEES', 'TOTAL_FEES'],
  ];
  boardId;
  QuestionClassList: any[] = [];
  isSpinning: boolean = false;
  public commonFunction = new CommomFunctionsService();
  isOk: boolean = true;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe,
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
  // data:any=new classmaster()
  step_no: number;  

  ngOnInit(): void {
    this.getYearClassforExcel();
    this.GetDivisionData();
    this.GetMediumData();
    this.boardId = sessionStorage.getItem('boardId');
    this.getQuestionClass();
    this.step_no = Number(sessionStorage.getItem('stepid'));

    if (this.step_no >= 0 && this.step_no < 6) {
      this.router.navigate(['/help1']);
    }
  }
  getQuestionClass() {
    var filterForQuestionClass = '';
    this.loadQuestionClass = true;
    if (this.boardId) {
      filterForQuestionClass = ' AND BOARD_ID= ' + this.boardId;
    } else filterForQuestionClass = '';
    this.api
      .getAllQuestionPaperClassMaster(0, 0, 'id', 'asc', filterForQuestionClass)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.loadQuestionClass = false;
          this.QuestionClassList = data['data'];
        } else {
          this.loadQuestionClass = false;
          this.QuestionClassList = [];
        }
      });
  }
  getYearClassforExcel() {
    this.api
      .getAllYearMaster(0, 0, 'id', 'asc', 'AND STATUS!=false')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.yearlist = data['data'];
        } else {
          this.message.error('Failed to Get Year List', ``);
        }
      });
  }
  close(): void {
    this.drawerClose();
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
      likeQuery = ' AND(';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    this.api
      .getAllClassMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery +
          ' AND SCHOOL_ID = ' +
          Number(sessionStorage.getItem('schoolid'))+
        ' AND STATUS=1'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
          } else {
            this.message.error('Something Went Wrong', '');
          }
        },
        (err) => {}
      );
  }

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  get closeCallbackMap() {
    return this.drawerCloseMap.bind(this);
  }

  add(): void {
    this.drawerTitle = 'Create New Class';
    this.drawerData = new classmaster();
    this.drawerData.SCHOOL_ID = Number(sessionStorage.getItem('schoolid'));
    this.api
      .getAllClassMaster(
        1,
        1,
        'SEQ_NO',
        'desc',
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'))
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['count'] == 0) {
              this.drawerData.SEQ_NO = 1;
            } else {
              this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
            }

            this.drawerVisible = true;
          } else {
            this.message.error('Something Went Wrong', '');
          }
        },
        (err) => {}
      );
  }
  edit(data: any): void {
    this.drawerTitle = 'Update Class';
    this.drawerData = Object.assign({}, data);
    this.drawerData.SCHOOL_ID = Number(sessionStorage.getItem('schoolid'));

    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  drawerCloseMap(): void {
    this.search();
    this.drawerVisibleMap = false;
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

  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (!this.drawerData.TOTAL_FEES) {
      this.drawerData.TOTAL_FEES = 0;
    }
    if (
      (this.drawerData.NAME == undefined ||
        this.drawerData.NAME == null ||
        this.drawerData.NAME.trim() == '') &&
      (this.drawerData.QUESTION_CLASS_ID == undefined ||
        this.drawerData.QUESTION_CLASS_ID == null ||
        this.drawerData.QUESTION_CLASS_ID.toString() == '') &&
      (this.drawerData.SEQ_NO == undefined ||
        this.drawerData.SEQ_NO == null ||
        this.drawerData.SEQ_NO <= 0)
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else {
      if (
        this.drawerData.NAME == null ||
        this.drawerData.NAME.trim() == '' ||
        this.drawerData.NAME == undefined
      ) {
        this.isOk = false;
        this.message.error('Please Enter Class Name', '');
      } else if (
        this.drawerData.QUESTION_CLASS_ID == null ||
        this.drawerData.QUESTION_CLASS_ID.toString() == '' ||
        this.drawerData.QUESTION_CLASS_ID == undefined
      ) {
        this.isOk = false;
        this.message.error('Please Select Question Class', '');
      } else if (
        this.drawerData.SEQ_NO == undefined ||
        this.drawerData.SEQ_NO == null ||
        this.drawerData.SEQ_NO <= 0
      ) {
        this.isOk = false;
        this.message.error(' Please Enter Sequence Number ', '');
      }
    }
    if (this.isOk) {
      this.isSpinning = true;
      this.drawerData.SCHOOL_ID = Number(sessionStorage.getItem('schoolid'));

      if (this.drawerData.ID) {
        this.api.updateClass(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' Class Information Updated Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update Class Information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createClass(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(' Class Information Saved Successfully...', '');
            if (!addNew) this.drawerClose();
            else {
              this.drawerData = new classmaster();
              this.resetDrawer(websitebannerPage);
              this.api
                .getAllClassMaster(
                  1,
                  1,
                  '',
                  'desc',
                  ' AND SCHOOL_ID = ' +
                    Number(sessionStorage.getItem('schoolid'))
                )
                .subscribe(
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
            this.message.error(' Failed To Save Class Information...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }
  resetDrawer(websitebannerPage: NgForm) {
    this.drawerData = new classmaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  // Import Excel

  @ViewChild('fileInput') myFileInput!: ElementRef;

  dataMapping: classmapping = new classmapping();
  exceldrawervisible = false;
  exceldrawerTitle = '';
  arrayofheader: any;
  arrayofData: any;
  // loadingRecords = false;
  ExcelData: any;
  FinalFileurl: any;
  FILE_NAME: any;
  CLASS_ID: any;

  clear() {
    this.myFileInput.nativeElement.value = '';
    this.FILE_NAME = null;
  }
  exceldraweropen(data: classmapping) {
    this.CLASS_ID = data.ID;
    this.exceldrawervisible = true;
    this.dataMapping = new classmapping();
    this.exceldrawerTitle = 'Map Students to ' + data['NAME'];
    this.dataMapping.YEAR_ID = Number(sessionStorage.getItem('yearId'));
  }
  classId;
  classNAME;
  addFeeMap(data): void {
    this.drawerTitleMap = 'Class Wise Fee Mapping';
    this.classId = data.ID;
    this.classNAME = data.NAME;
    this.drawerVisibleMap = true;
  }

  exceldrawerClose() {
    this.exceldrawervisible = false;
    this.clear();
    this.search();
  }
  FileSelect(event: any) {
    this.loadingRecords = true;
    if (
      event.target.files[0].type == 'application/excel' ||
      event.target.files[0].type == 'application/x-excel' ||
      event.target.files[0].type == 'application/x-msexcel' ||
      event.target.files[0].type == 'application/vnd.ms-excel' ||
      event.target.files[0].type ==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      // let file = event.target.files[0];

      this.FinalFileurl = <File>event.target.files[0];

      let fileReader = new FileReader();

      fileReader.readAsBinaryString(this.FinalFileurl);
      this.loadingRecords = true;
      fileReader.onload = (e) => {
        var workBook = XLSX.read(fileReader.result, { type: 'binary' });
        var sheetName = workBook.SheetNames;
        var headers = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName[0]], {
          header: 1,
        });
        const json = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName[0]]);
        this.ExcelData = [...json];
        this.arrayofheader = headers[0];

        this.loadingRecords = false;

        if (this.FinalFileurl != null) {
          var number = Math.floor(100000 + Math.random() * 900000);
          var fileExt = this.FinalFileurl.name.split('.').pop();
          var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
          var url = '';
          url = d == null ? '' : d + number + '.' + fileExt;
          if (this.FILE_NAME != undefined && this.FILE_NAME.trim() != '') {
            var arr = this.FILE_NAME.split('/');
            if (arr.length > 1) {
              url = arr[5];
            }
          }
          this.FILE_NAME = url;
          // this.isSpinning = true;
        }
      };
    } else {
      this.message.error('Please Select Only Excel File', '');
      this.FinalFileurl = null;
      this.FILE_NAME = null;
    }
  }
  OnConfirmDelete(data) {
    this.loadingRecords=true
    data.STATUS = 0;
    this.api.updateClass(data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Class Deleted Successfully', '');
        this.drawerClose();
        this.loadingRecords = false;
      } else {
        this.message.error('Class Deletion Failed', '');
        this.loadingRecords = false;
      }
    });
  }
  OnDisableExcel() {
    let showmsg = true;
    if (
      (this.dataMapping.YEAR_ID == null ||
        this.dataMapping.YEAR_ID == undefined ||
        this.dataMapping.YEAR_ID == 0) &&
      (this.dataMapping.DIVISION_ID == null ||
        this.dataMapping.DIVISION_ID == undefined ||
        this.dataMapping.DIVISION_ID == 0)
    ) {
      showmsg = false;
      this.message.error('Please fill all required fields.', '');
    } else if (
      this.dataMapping.YEAR_ID == null ||
      this.dataMapping.YEAR_ID == undefined ||
      this.dataMapping.YEAR_ID == 0
    ) {
      showmsg = false;
      this.message.error('Please Select Year.', '');
    } else if (
      this.dataMapping.DIVISION_ID == null ||
      this.dataMapping.DIVISION_ID == undefined
    ) {
      showmsg = false;
      this.message.error('Please Select Division.', '');
    }
    if (showmsg) {
      this.message.warning(
        'First, map the Fee, and then you will be able to map the Student. ',
        ''
      );
    }
  }
  excelLoading: boolean = false;

  confirm() {
    this.excelLoading = true;

    this.api
      .ExcelonUpload('studentExcel', this.FinalFileurl, this.FILE_NAME)
      .subscribe((successCode) => {
        if (successCode.code == 200) {
          this.api
            .importStudent(
              this.FILE_NAME,
              this.CLASS_ID,
              this.dataMapping.YEAR_ID,
              Number(sessionStorage.getItem('schoolid')),
              this.dataMapping.DIVISION_ID,
              this.dataMapping.MEDIUM_ID
            )
            .subscribe(
              (data) => {
                if (data['code'] == 200) {
                  this.message.success(' Data Uploaded Successfully ', '');
                  this.excelLoading = false;
                  this.exceldrawerClose();
                } else if (data['code'] == 300) {
                  this.message.error(' Duplicate Mobile Number', '');
                  this.excelLoading = false;
                } else if (data['code'] == 301) {
                  this.message.error('Fee Details Not Found .. ', '');
                  this.excelLoading = false;
                } else if (data['code'] == 302) {
                  this.message.error('No Data In Excel .. ', '');
                  this.excelLoading = false;
                } else {
                  this.message.error(' Failed To Upload Data ', '');
                  this.excelLoading = false;
                }
              },
              (err) => {
                this.message.error(' Failed To Upload Data ', '');
                this.excelLoading = false;
              }
            );
        } else {
          this.message.error(' Failed To Upload Data ', '');
          this.excelLoading = false;
        }
      });
  }

  cancel() {
    this.excelLoading = false;
  }

  // Promote Student

  promotedrawerTitle!: string;
  promotedrawerVisible!: boolean;
  promoteisSpinning: boolean = false;
  Promotestudent: [] = [];

  promotestudent(data: classmaster): void {
    this.promotedrawerTitle = `Promote Student From ${data.NAME}`;
    this.drawerData = Object.assign({}, data);
    this.promotedrawerVisible = true;
  }
  promotedrawerClose(): void {
    this.search();
    this.promotedrawerVisible = false;
  }
  //Drawer Methods
  get promotecloseCallback() {
    return this.promotedrawerClose.bind(this);
  }

  Divisionlist: any = [];
  GetDivisionData() {
    this.api
      .getAllDivisions(
        0,
        0,
        '',
        'asc',
        ' AND STATUS=1  AND SCHOOL_ID = ' +
          Number(sessionStorage.getItem('schoolid'))
      )
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

  Mediumlist: any = [];
  GetMediumData() {
    this.api
      .getAllMediumMaster(
        0,
        0,
        '',
        'asc',
        ' AND STATUS=1 AND SCHOOL_ID = ' +
          Number(sessionStorage.getItem('schoolid'))
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.Mediumlist = data['data'];
          } else {
            this.Mediumlist = [];
          }
        } else {
          this.message.error('Failed To Get Medium Data.', '');
          this.Mediumlist = [];
        }
      });
  }

  onDivisionChange(selectedId: number): void {
    if (
      this.dataMapping.YEAR_ID != null &&
      this.dataMapping.YEAR_ID != undefined
    ) {
      this.api
        .getclassFeeMappingData(
          0,
          0,
          '',
          '',
          'AND CLASS_ID =' +
            this.CLASS_ID +
            ' AND YEAR_ID =' +
            this.dataMapping.YEAR_ID +
            ' AND DIVISION_ID = ' +
            selectedId
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.enableExcel = false;
              } else {
                this.enableExcel = true;
              }
            }
          },
          (err) => {}
        );
    } else {
    }
  }

  enableExcel: boolean = true;
  onYearChange(selectedId: number): void {
    if (
      this.dataMapping.DIVISION_ID != null &&
      this.dataMapping.DIVISION_ID != undefined
    ) {
      this.api
        .getclassFeeMappingData(
          0,
          0,
          '',
          '',
          'AND CLASS_ID =' +
            this.CLASS_ID +
            ' AND YEAR_ID =' +
            selectedId +
            ' AND DIVISION_ID = ' +
            this.dataMapping.DIVISION_ID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.enableExcel = false;
              } else {
                this.enableExcel = true;
              }
            }
          },
          (err) => {}
        );
    } else {
    }
  }

  // Map Teacher's

  TeacherdrawerTitle!: string;
  TeacherdrawerVisible!: boolean;
  TeachermapisSpinning: boolean = false;
  TeacherMap: [] = [];
  Class_ID: number;
  CLASS_NAME: any;
  MapTeacherData: any[] = [];

  MapTeacher(data: classmaster): void {
    this.Class_ID = data.ID;
    this.CLASS_NAME = data.NAME;
    this.TeacherdrawerTitle = `Map Teacher To ${data.NAME}`;

    this.TeacherdrawerVisible = true;
  }
  TeacherMapdrawerClose(): void {
    this.search();
    this.TeacherdrawerVisible = false;
  }
  //Drawer Methods
  get TeacherMapcloseCallback() {
    return this.TeacherMapdrawerClose.bind(this);
  }
}
