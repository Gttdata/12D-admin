import { Component, Input, OnInit } from '@angular/core';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { TaskMaster } from '../../Models/TaskMaster';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/Services/api.service';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpEventType } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-task-master',
  templateUrl: './task-master.component.html',
  styleUrls: ['./task-master.component.css'],
})
export class TaskMasterComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  isSpinning = false;
  isOk = true;
  drawerData: TaskMaster = new TaskMaster();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage ClassWise Tasks  ';
  dataList: any[] = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'STATUS';
  searchText: string = '';
  Classes: any[] = [];
  classload: boolean = false;
  yearlist = [];
  yearload: boolean = false;
  subjects: [] = [];
  subjectsload: boolean = false;
  imgUrl = appkeys.retriveimgUrl;
  roleId: any;
  classId: any;
  SchoolId:any
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  filterClass: string = 'filter-invisible';
  TaskStatus: any;
  YearStatus: any;
  divisionload: boolean = false;
  divisionlist: any[] = [];

  columns: string[][] = [
    ['CLASS_NAME', ' CLASS_NAME '],
    ['DATE', 'DATE'],
    ['APPLIED_TIME', 'APPLIED_TIME'],
    ['DESCRIPTION', 'DESCRIPTION'],
    ['SUBMISSION_DATE', 'SUBMISSION_DATE'],
    ['SUBJECT_NAME', 'SUBJECT_NAME'],
    ['YEAR', 'YEAR'],
    ['TYPE', 'TYPE'],
    ['DIVISION_NAME', 'DIVISION_NAME'],
  ];

  showFilter(): void {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  drawerClose2!: Function;

  constructor(
    private api: ApiService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private cookies: CookieService
  ) {}

  ngOnInit(): void {
    this.roleId = Number(sessionStorage.getItem('roleId'));
    // 

    this.classId = Number(sessionStorage.getItem('classid'));
    this.SchoolId = Number(sessionStorage.getItem('schoolID'));

    this.YearStatus = Number(sessionStorage.getItem('yearId'));
    this.getDivision();
    this.getAllClasses();
    this.getAllYear();
    if (this.roleId == 3) {
      this.getallSubjects();
    }
    this.getDivision();
  }
  getDivision() {
    this.divisionload = true;
    this.api.getAllDivisions(0, 0, '', '', ' AND STATUS=1 AND SCHOOL_ID ='+ this.SchoolId).subscribe(
      (division) => {
        if (division.code == 200) {
          this.divisionlist = division['data'];
          this.divisionload = false;
        } else {
          this.message.error('Failed To Get Division', '');
          this.divisionload = false;

          this.divisionlist = [];
        }
      },
      (err) => {}
    );
  }
  applyFilter() {
    this.isSpinning = true;
    this.loadingRecords = true;
    this.isFilterApplied = 'primary';
    if (this.TaskStatus == undefined && this.YearStatus == undefined) {
      this.message.error('', 'Please Select Info to Filter');
      this.loadingRecords = false;
      this.isSpinning = false;
      this.isFilterApplied = 'default';
      this.filterClass = 'filter-visible';
      this.isOk = false;
      this.filterQuery = '';
    } else {
      this.search();
    }
  }
  // Disable Date

  disabledEndDate = (endValue: Date): boolean => {
    if (
      !endValue ||
      !this.drawerData ||
      !this.drawerData.DATE ||
      !(this.drawerData.DATE instanceof Date)
    ) {
      return false;
    }
    return endValue.getTime() <= this.drawerData.DATE.getTime();
  };

  getAllYear() {
    this.yearload = true;
    this.api
      .getAllYearMaster(0, 0, 'id', 'asc', ' AND STATUS!=false ')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.yearlist = data['data'];
            this.yearload = false;
          } else {
            this.yearlist = [];
            this.yearload = false;
          }
        },
        (err) => {
          this.yearload = false;
        }
      );
  }

  getallSubjects() {
    this.subjectsload = true;
    if (this.roleId == 3) {
      var extraGetFilter =
        ' AND CLASS_ID = ' +
        Number(sessionStorage.getItem('classid')) +
        ' AND DIVISION_ID = ' +
        Number(sessionStorage.getItem('divisionId'));
    } else {
      extraGetFilter = '';
    }
    this.api
      .getAllSubjectMaster(0, 0, '', '', ' AND STATUS!=false' + extraGetFilter + ' AND SCHOOL_ID ='+ this.SchoolId)
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
          this.subjectsload = false;
        }
      );
  }

  subjectData(event) {
    if (event != null && event !== undefined && event != '') {
      this.subjectsload = true;
      this.api
        .getAllSubjectMaster(
          0,
          0,
          '',
          '',
          ' AND STATUS!=false' + ' AND CLASS_ID = ' + event + 'AND SCHOOL_ID ='+ this.SchoolId
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
            this.subjectsload = false;
          }
        );
    } else {
      this.subjects = [];
      this.subjectsload = false;
    }
  }
  getAllClasses() {
    this.classload = true;
    this.api.getAllClasses(0, 0, '', '', ' AND STATUS!=false AND SCHOOL_ID ='+ this.SchoolId).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.Classes = data['data'];
          this.classload = false;
        } else {
          this.Classes = [];
          this.classload = false;
        }
      },
      (err) => {
        this.classload = false;
      }
    );
  }
  onKeypressEvent(reset: boolean = false) {
    // document.getElementById("button").focus();
    document.getElementById('button')?.focus();
    this.search();
  }
  keyup(event: any) {
    this.search();
  }
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'STATUS';
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
      var extraFilter =
        ' AND CLASS_ID = ' +
        Number(sessionStorage.getItem('classid')) +
        ' AND DIVISION_ID = ' +
        Number(sessionStorage.getItem('divisionId'));
    } else {
      extraFilter = '';
    }

    if (this.TaskStatus != undefined && this.YearStatus != undefined) {
      this.isFilterApplied = 'primary';

      this.filterQuery =
        " AND STATUS = '" +
        this.TaskStatus +
        "' " +
        " AND YEAR_ID = '" +
        this.YearStatus +
        "' ";
      this.isOk = true;
    } else if (this.TaskStatus != undefined) {
      this.isFilterApplied = 'primary';

      this.filterQuery = " AND Status ='" + this.TaskStatus + "'";
      this.isOk = true;
    } else if (this.YearStatus != undefined) {
      this.isFilterApplied = 'primary';

      this.filterQuery = " AND YEAR_ID ='" + this.YearStatus + "'";
      this.isOk = true;
    }
    // else if(likeQuery){
    this.isOk = true;
    // }

    var filter = '';

    if (this.searchText != '') {
      filter = this.filterQuery + likeQuery;
    } else {
      filter = this.filterQuery;
    }
    
    if (this.isOk) {
      this.api
        .getALLTask(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          extraFilter + filter + ' AND SCHOOL_ID ='+ this.SchoolId
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.loadingRecords = false;
              this.isSpinning = false;

              this.filterClass = 'filter-invisible';
            } else {
              this.message.error('Something Went Wrong', '');
              this.dataList = [];
              this.loadingRecords = false;
              this.isSpinning = false;

              this.filterClass = 'filter-invisible';
            }
          },
          (err) => {}
        );
    }
  }
  taskurl: any = '';

  add(): void {
    this.drawerTitle = ' Create New Task ';
    this.taskurl = '';

    this.drawerData = new TaskMaster();
    if (this.roleId == 3) {
      this.drawerData.CLASS_ID = Number(sessionStorage.getItem('classid'));
      this.drawerData.YEAR_ID = Number(sessionStorage.getItem('yearId'));
      this.drawerData.DIVISION_ID = Number(
        sessionStorage.getItem('divisionId')
      );
    }
    this.drawerVisible = true;
  }

  edit(data: TaskMaster): void {
    this.drawerTitle = ' Update Task';
    this.drawerData = Object.assign({}, data);
    this.loadingRecords = true;
    if (
      data.ATTACMENT != null &&
      data.ATTACMENT != undefined &&
      data.ATTACMENT != ''
    ) {
      this.taskurl = appkeys.retriveimgUrl + 'classWiseTask/' + data.ATTACMENT;
    } else {
      this.taskurl = '';
    }

    if (
      data.CLASS_ID != null &&
      data.CLASS_ID != undefined &&
      data.CLASS_ID != 0
    ) {
      this.subjectsload = true;
      this.api
        .getAllSubjectMaster(
          0,
          0,
          '',
          '',
          ' AND STATUS!=false' + ' AND CLASS_ID = ' + data.CLASS_ID + 'AND SCHOOL_ID ='+ this.SchoolId
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.subjects = data['data'];
              this.subjectsload = false;
              this.loadingRecords = false;
              this.drawerVisible = true;
            } else {
              this.subjects = [];
              this.loadingRecords = false;
              this.subjectsload = false;
            }
          },
          (err) => {
            this.subjectsload = false;
          }
        );
    }
  }

  // Student Publish

  confirm(data: TaskMaster): void {
    
    this.api.assignTask(data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success(' Task Assigned  Successfully...', '');
        this.isSpinning = false;
        this.search();
      } else if (successCode.code == '300') {
        this.message.error(' Student Not Found...', '');
      } else {
        this.message.error(' Failed To Assign Task Information...', '');
        this.isSpinning = false;
      }
    });
  }
  cancel() {
    // 
    // this.excelLoading=false
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
    const sortField = (currentSort && currentSort.key) || 'STATUS';
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
  save(addNew: boolean, websitebannerPage: NgForm): void {
    
    this.isOk = true;

    if (
      (this.drawerData.CLASS_ID == undefined ||
        this.drawerData.CLASS_ID == null ||
        this.drawerData.CLASS_ID <= 0) &&
      (this.drawerData.YEAR_ID == undefined ||
        this.drawerData.YEAR_ID == null ||
        this.drawerData.YEAR_ID <= 0) &&
      (this.drawerData.DIVISION_ID == undefined ||
        this.drawerData.DIVISION_ID == null ||
        this.drawerData.DIVISION_ID < 0) &&
      (this.drawerData.SUBJECT_ID == undefined ||
        this.drawerData.SUBJECT_ID == null ||
        this.drawerData.SUBJECT_ID <= 0) &&
      (this.drawerData.TYPE == undefined ||
        this.drawerData.TYPE == null ||
        (this.drawerData.TYPE == '' &&
          (this.drawerData.APPLIED_TIME == undefined ||
            this.drawerData.APPLIED_TIME == null ||
            this.drawerData.APPLIED_TIME == '') &&
          (this.drawerData.DATE == undefined ||
            this.drawerData.DATE == null ||
            this.drawerData.DATE == '') &&
          (this.drawerData.SUBMISSION_DATE == undefined ||
            this.drawerData.SUBMISSION_DATE == null ||
            this.drawerData.SUBMISSION_DATE == '')))
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    }
    // else if (
    //   this.drawerData.YEAR_ID == null ||
    //   this.drawerData.YEAR_ID <= 0 ||
    //   this.drawerData.YEAR_ID == undefined
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Select Year', '');
    // }
    else if (
      this.drawerData.CLASS_ID == null ||
      this.drawerData.CLASS_ID <= 0 ||
      this.drawerData.CLASS_ID == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Class', '');
    } else if (
      this.drawerData.DIVISION_ID == null ||
      this.drawerData.DIVISION_ID < 0 ||
      this.drawerData.DIVISION_ID == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Division', '');
    } else if (
      this.drawerData.SUBJECT_ID == null ||
      this.drawerData.SUBJECT_ID <= 0 ||
      this.drawerData.SUBJECT_ID == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Subject', '');
    } else if (
      this.drawerData.TYPE == null ||
      this.drawerData.TYPE == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Task Type', '');
    } else if (
      this.drawerData.DATE == null ||
      this.drawerData.DATE == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Assign  Date', '');
    } else if (
      this.drawerData.SUBMISSION_DATE == null ||
      this.drawerData.SUBMISSION_DATE == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Submission Date', '');
    } else if (
      this.drawerData.APPLIED_TIME == undefined ||
      this.drawerData.APPLIED_TIME == null ||
      this.drawerData.APPLIED_TIME == ''
    ) {
      this.message.error('Please Select Applied Time', '');
      this.isOk = false;
      // } else if (
      //   this.drawerData.ATTACMENT == null ||
      //   this.drawerData.ATTACMENT == ''
      // ) {
      //   this.isOk = false;
      //   this.message.error('Please Upload Attachment', '');
    }

    if (this.isOk) {
      this.drawerData.TEACHER_ID = sessionStorage.getItem('userId');
      this.drawerData.YEAR_ID = Number(sessionStorage.getItem('yearId'));
      this.drawerData.SCHOOL_ID = sessionStorage.getItem('schoolID');

      this.drawerData.DIVISION_ID = Number(
        sessionStorage.getItem('divisionId')
      );
      this.drawerData.CLASS_ID = Number(sessionStorage.getItem('classid'));

      this.drawerData.DATE = this.datePipe.transform(
        this.drawerData.DATE,
        'yyyy-MM-dd  HH:mm:ss'
      );
      this.drawerData.SUBMISSION_DATE = this.datePipe.transform(
        this.drawerData.SUBMISSION_DATE,
        'yyyy-MM-dd  HH:mm:ss'
      );
      this.drawerData.APPLIED_TIME = this.datePipe.transform(
        this.drawerData.APPLIED_TIME,
        'yyyy-MM-dd  HH:mm:ss'
      );
      this.drawerData.STATUS = 'D';
      this.isSpinning = true;
      if (this.drawerData.ID) {
        this.api.updateTask(this.drawerData).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              ' Task Information Updated Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update Task Information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api
          .createTask(this.drawerData)
          // this.type=.TYPE_ID
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(
                ' Task Information Save Successfully...',
                ''
              );
              if (!addNew) this.drawerClose();
              else {
                this.drawerData = new TaskMaster();
                this.resetDrawer(websitebannerPage);
              }
              this.isSpinning = false;
            } else {
              this.message.error(' Failed To Save Task Information...', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }
  resetDrawer(websitebannerPage: NgForm) {
    this.drawerData = new TaskMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  // ImageCode
  //Choose Image

  fileList2: any;
  progressBarProfilePhoto: boolean = false;
  percentProfilePhoto = 0;
  timerThree: any;
  onFileSelected(event: any) {
    this.fileList2 = <File>event.target.files[0];

    if (
      (event.target.files[0].type == 'image/jpeg' ||
        event.target.files[0].type == 'image/jpg' ||
        event.target.files[0].type == 'image/png') &&
      event.target.files[0].size < 10240000
    ) {
      const img = new Image();
      const reader = new FileReader();

      img.src = window.URL.createObjectURL(event.target.files[0]);

      img.onload = () => {
        if (img.width < 832 && img.height < 596) {
          const number = Math.floor(100000 + Math.random() * 900000);
          const fileExt = this.fileList2.name.split('.').pop();
          const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
          let url: any = '';
          url = d == null ? '' : d + number + '.' + fileExt.toLowerCase();
          if (
            this.drawerData.ATTACMENT != undefined &&
            this.drawerData.ATTACMENT.trim() != ''
          ) {
            const arr = this.drawerData.ATTACMENT.split('/');
            if (arr.length > 1) {
              url = arr[5];
            }
          }

          this.isSpinning = true;
          this.progressBarProfilePhoto = true;
          this.timerThree = this.api
            .onUpload('classWiseTask', this.fileList2, url)
            .subscribe((res) => {
              if (res.type === HttpEventType.Response) {
              }
              if (res.type === HttpEventType.UploadProgress) {
                const percentDone = Math.round((100 * res.loaded) / res.total);
                this.percentProfilePhoto = percentDone;
                if (this.percentProfilePhoto == 100) {
                  this.isSpinning = false;
                }
              } else if (res.type == 2 && res.status != 200) {
                this.message.error('Failed To Upload Image...', '');
                this.isSpinning = false;
                this.progressBarProfilePhoto = false;
                this.percentProfilePhoto = 0;
                this.drawerData.ATTACMENT = null;
                this.taskurl = '';
              } else if (res.type == 4 && res.status == 200) {
                if (res.body['code'] == 200) {
                  this.message.success('Image Uploaded Successfully...', '');
                  this.isSpinning = false;
                  this.drawerData.ATTACMENT = url;
                  this.taskurl =
                    this.imgUrl + 'classWiseTask/' + this.drawerData.ATTACMENT;
                } else {
                  this.isSpinning = false;
                }
              }
            });
        } else {
          this.message.error(
            'Image dimensions must be less than 832 x 596 pixels.',
            ''
          );
          this.fileList2 = null;
          this.drawerData.ATTACMENT = null;
        }
      };
    } else {
      this.message.error(
        'Please Select Only JPEG/JPG/PNG Extension and file size less than 10MB.',
        ''
      );
      this.fileList2 = null;
    }
  }

  imageshow: any;
  printOrderModalVisible = false;
  view = 0;
  sanitizedLink: any = '';
  getS(link: string) {
    this.imageshow = '';
    if (this.view == 1) {
      var a: any = this.api.retriveimgUrl + 'classWiseTask/' + link;
    }

    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    this.imageshow = this.sanitizedLink;
  }

  ViewModalCancel() {
    this.printOrderModalVisible = false;
    // this.checkClaimData();
  }

  ViewAdvertise(pdfURL: string): void {
    this.view = 1;
    this.printOrderModalVisible = true;
    this.getS(pdfURL);
    // window.open(this.api.retriveimgUrl + 'invoiceUrl/' + pdfURL);
  }

  deleteConfirm(data) {
    this.isSpinning = true;
    if (this.drawerData.ID) {
      this.api
        .deletePdf('classWiseTask/' + data.ATTACMENT)
        .subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.drawerData.ATTACMENT = null;
            this.api
              .updateAdvertise(this.drawerData)
              .subscribe((updateCode) => {
                if (updateCode.code == '200') {
                  this.isSpinning = false;
                } else {
                  this.message.error(' Image Has Not Saved...', '');
                  this.isSpinning = false;
                }
              });
            this.message.success(' Image deleted...', '');
          } else {
            this.message.error(' Image Has Not Deleted...', '');
            this.isSpinning = false;
          }
        });
    } else {
      this.drawerData.ATTACMENT = null;
      data.ATTACMENT = null;
      this.isSpinning = false;
    }
  }
  deleteCancel(): void {}

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.TaskStatus = null;
    this.YearStatus = Number(sessionStorage.getItem('yearId'));
    this.isOk = true;
    this.search();
  }
}
