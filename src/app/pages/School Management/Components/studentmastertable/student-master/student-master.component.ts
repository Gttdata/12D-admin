import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { studentmapping, studentmaster } from '../../../Models/studentmaster';
import * as XLSX from 'xlsx';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/Services/api.service';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { appkeys } from 'src/app/app.constant';
import { Router } from '@angular/router';
@Component({
  selector: 'app-student-master',
  templateUrl: './student-master.component.html',
  styleUrls: ['./student-master.component.css'],
})
export class StudentMasterComponent implements OnInit {
  formTitle = 'Manage Students ';
  public commonFunction = new CommomFunctionsService();

  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList = [];
  loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: studentmaster = new studentmaster();
  dataMapping: studentmapping = new studentmapping();
  divisionload: boolean = false;
  divisionlist: any[] = [];
  columns: string[][] = [
    ['NAME', 'Name'],
    ['MOBILE_NUMBER', 'Mobile Number'],
    ['EMAIL_ID', 'Email Id'],
    ['GENDER', 'Gender'],
    ['DOB', 'Birth Date'],
    ['DISTRICT_NAME', 'state'],
    ['PASSWORD', 'Password'],
    ['IDENTITY_NUMBER', 'Identity Number'],
    ['ADDRESS', 'ADDRESS'],
    ['STATE_NAME', 'state'],
    ['COUNTRY_NAME', 'country'],
    ['APPROVAL_STATUS', 'Student Status'],
  ];
  taskurl: any;
  imgUrl = appkeys.retriveimgUrl;
  districts: any = [];
  districtload: boolean;
  isSpinning = false;
  countrys: any;
  roleId: number;
  currentroute = '';

  constructor(
    private api: ApiService,
    private message: NzNotificationService,
    private datePipe: DatePipe, // private cookie: CookieService,
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
  pendingscounts: any;
  registercounts: any;
  approvedcounts: any;
  rejectscounts: any;
  blockedcounts: any;
  APPROVAL_STATUS: any = 'ALL';
  showcolor0 = 1;
  showcolor1 = 0;
  showcolor2 = 0;
  showcolor3 = 0;
  showcolor4 = 0;
  screenwidth: any;
  employee = 0;
  yearlist = [];
  classlist = [];
  step_no: number;
  isAdd = false;
  ngOnInit() {
    this.screenwidth = window.innerWidth;
    this.step_no = Number(sessionStorage.getItem('stepid'));

    if (this.step_no >= 0 && this.step_no < 6) {
      this.router.navigate(['/help1']);
    }
    // console.log(this.screenwidth);

    // if (this.screenwidth > 500) {
    //   this.employee = 1300;
    // } else {
    //   this.employee = 380;
    // }
    this.roleId = Number(sessionStorage.getItem('roleId'));

    this.drawerData.SCHOOL_ID = Number(sessionStorage.getItem('schoolid'));
    this.getYearClassforExcel();
    this.getDivision();
    this.GetMediumData();
  }
  countryWithStatesAvailable: any;
  showDistrictByState: any = 0;

  Mediumlist: any = [];
  GetMediumData() {
    this.api
      .getAllMediumMaster(
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
  getYearClassforExcel() {
    var extraFilter: any = '';
    if (this.roleId == 3 || this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = '';
    }
    this.api
      .getAllYearMaster(0, 0, 'id', 'asc', 'AND STATUS!=false ')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.yearlist = data['data'];
        } else {
          this.message.error('Failed to Get Year List', ``);
        }
      });
    this.api
      .getAllClassMaster(0, 0, '', '', 'AND STATUS!=false' + extraFilter)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.classlist = data['data'];
        } else {
          this.message.error('Failed to Get Class List', ``);
        }
      });
  }
  getDivision() {
    this.divisionload = true;
    var extraFilter: any = '';
    // if(
    //   this.roleId==3 || this.roleId==2
    //       ){
    //         extraFilter=" AND SCHOOL_ID = "+ Number(sessionStorage.getItem('schoolid'))
    //       }
    //       else{
    //         extraFilter=''
    //       }
    this.api
      .getAllDivisions(
        0,
        0,
        '',
        '',
        ' AND STATUS=1 AND SCHOOL_ID = ' +
          Number(sessionStorage.getItem('schoolid'))
      )
      .subscribe(
        (division) => {
          if (division.code == 200) {
            this.divisionlist = division['data'];
            this.divisionload = false;
          } else {
            this.message.error('Failed To Get division', '');
            this.divisionload = false;

            this.divisionlist = [];
          }
        },
        (err) => {}
      );
  }
  keyup(event: any) {
    this.search();
  }
  clickevent(data: any) {
    this.APPROVAL_STATUS = data;
    this.pageIndex = 1;
    this.pageSize = 10;
    if (this.APPROVAL_STATUS == 'ALL') {
      this.showcolor0 = 1;
      this.showcolor1 = 0;
      this.showcolor2 = 0;
      this.showcolor3 = 0;
      this.showcolor4 = 0;
    } else if (this.APPROVAL_STATUS == 'A') {
      this.showcolor0 = 0;
      this.showcolor1 = 1;
      this.showcolor2 = 0;
      this.showcolor3 = 0;
      this.showcolor4 = 0;
    } else if (this.APPROVAL_STATUS == 'R') {
      this.showcolor0 = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 1;
      this.showcolor3 = 0;
      this.showcolor4 = 0;
    } else if (this.APPROVAL_STATUS == 'P') {
      this.showcolor0 = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 0;
      this.showcolor3 = 1;
      this.showcolor4 = 0;
    } else if (this.APPROVAL_STATUS == 'B') {
      this.showcolor0 = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 0;
      this.showcolor3 = 0;
      this.showcolor4 = 1;
    }
    this.applyFilter();
  }
  applyFilter() {
    this.search(true);
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
    var statusFilter = '';
    if (this.APPROVAL_STATUS != undefined && this.APPROVAL_STATUS != 'ALL') {
      statusFilter = ' AND APPROVAL_STATUS=' + "'" + this.APPROVAL_STATUS + "'";
    } else {
      statusFilter = '';
    }
    var likeQuery = '';
    if (this.searchText != '') {
      likeQuery = ' AND (';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    var extraFilter: any = '';
    if (this.roleId == 3 || this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' +
        Number(sessionStorage.getItem('schoolid')) +
        this.filterQuery;
    } else {
      extraFilter = '';
    }
    this.api
      .getAllstudents(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery +
          extraFilter +
          statusFilter +
          " AND ROLE='S' " +
          this.filterQuery +
          ' AND STATUS=1'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.loadingRecords = false;
            // for (var i = 0; i < this.dataList.length; i++) {
            // }
            this.api
              .getStudentsCount(0, 0, '', '', extraFilter + ' AND STATUS=1')
              .subscribe((data) => {
                if (data['code'] == 200) {
                  this.pendingscounts = data['data'][0]['PENDING'];
                  this.rejectscounts = data['data'][0]['REJECTED'];
                  this.registercounts = data['data'][0]['ALL_COUNT'];
                  this.approvedcounts = data['data'][0]['APPROVED'];
                  this.blockedcounts = data['data'][0]['BLOCKED'];
                } else {
                }
              });
          } else {
            this.dataList = [];
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
          }
        },
        (err) => {}
      );
  }

  filterClass: any = 'filter-invisible';
  ClassID: any;
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  applyFilterClass() {
    this.loadingRecords = true;
    this.filterQuery = '';

    if (this.ClassID != null && this.ClassID != undefined && this.ClassID > 0) {
      this.filterQuery = ' AND CLASS_ID =' + this.ClassID;
    }

    if (
      this.filterQuery == null ||
      this.filterQuery == undefined ||
      this.filterQuery == ''
    ) {
      this.message.error('Please Select Value To Filter Data ..', '');
      this.isFilterApplied = 'default';
      this.filterClass = 'filter-visible';
    } else {
      this.isFilterApplied = 'primary';
      this.search();
    }
  }

  clearFilter() {
    this.searchText = '';
    this.ClassID = '';
    this.filterQuery = '';
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
    this.search(true);
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.isShowBlocked = false;
    this.isAdd = true;
    this.drawerTitle = 'Create New Student';
    this.drawerData = new studentmaster();
    this.drawerVisible = true;
    var extraFilter: any = '';
    if (this.roleId == 3 || this.roleId == 2) {
      extraFilter =
        ' AND SCHOOL_ID = ' + Number(sessionStorage.getItem('schoolid'));
    } else {
      extraFilter = '';
    }
    // this.api.getAllstudents(1, 1, 'SEQ_NO', 'desc', extraFilter).subscribe(
    //   (data) => {
    //     if (data['code'] == 200) {
    //       this.loadingRecords = false;
    //       this.totalRecords = data['count'];

    //       if (data['count'] == 0) {
    //         this.drawerData.SEQ_NO = 1;
    //       } else {
    //         this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
    //       }
    //       this.showDistrictByState = 1;
    //       this.drawerVisible = true;
    //     } else {
    //       this.loadingRecords = false;
    //       this.dataList = [];
    //     }
    //   },
    //   (err) => {}
    // );
    this.showDistrictByState = 1;
    this.drawerVisible = true;
  }
  isShowBlocked = false;
  States: [] = [];
  countries: any = [];
  showState: any = 0;
  stateload: boolean = false;

  edit(data: studentmaster): void {
    this.isShowBlocked = true;
    this.isAdd = false;
    this.drawerTitle = 'Update Student';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
    if (this.drawerData.PROFILE_PHOTO) {
      this.taskurl =
        this.imgUrl + 'appUserProfile/' + this.drawerData.PROFILE_PHOTO;
    } else {
      this.taskurl = '';
    }
    if (
      data.COUNTRY_ID != null &&
      data.COUNTRY_ID != undefined &&
      data.COUNTRY_ID != 0
    ) {
      this.countries = [];
      this.showState = 0;
      this.api
        .getALLCountry(0, 0, '', '', ' AND ID =' + this.drawerData.COUNTRY_ID)
        .subscribe(
          (responseCountryData) => {
            if (responseCountryData['code'] == 200) {
              if (responseCountryData['data'].length == 0) {
                this.countries = [];
              } else {
                this.countries = responseCountryData['data'];
                if (this.countries[0]?.['IS_STATE_AVALIBLE'] == 0) {
                  this.showState = 0;
                  this.showDistrictByState = 0;
                  this.drawerVisible = true;
                } else if (this.countries[0]?.['IS_STATE_AVALIBLE'] == 1) {
                  this.showState = 1;
                  this.showDistrictByState = 1;

                  this.api
                    .getAllStateMaster(
                      0,
                      0,
                      '',
                      '',
                      ' AND STATUS!=false AND COUNTRY_ID = ' +
                        this.drawerData.COUNTRY_ID
                    )
                    .subscribe(
                      (responseStateData) => {
                        if (responseStateData['code'] == 200) {
                          if (responseStateData['data'].length != 0) {
                            this.States = responseStateData['data'];
                            var stateWithDistrictsAvailable = '';
                            stateWithDistrictsAvailable = this.States.find(
                              (state) => state['ID'] === data.STATE_ID
                            );

                            if (
                              stateWithDistrictsAvailable?.[
                                'IS_DISTRICT_AVALIBLE'
                              ] == 0
                            ) {
                              this.showDistrictByState = 0;
                              this.drawerVisible = true;
                            } else if (
                              stateWithDistrictsAvailable?.[
                                'IS_DISTRICT_AVALIBLE'
                              ] == 1
                            ) {
                              this.showDistrictByState = 1;

                              this.api
                                .getAllDistrict(
                                  0,
                                  0,
                                  '',
                                  '',
                                  ' AND STATUS!=false AND STATE_ID = ' +
                                    this.drawerData.STATE_ID
                                )
                                .subscribe(
                                  (responseData) => {
                                    if (responseData['code'] == 200) {
                                      this.districts = responseData['data'];
                                      this.drawerVisible = true;
                                    } else {
                                      this.districts = [];
                                    }
                                  },
                                  (err) => {}
                                );
                            }
                          } else {
                            this.drawerVisible = true;
                            this.States = [];
                          }
                        } else {
                          this.States = [];
                        }
                        this.stateload = false;
                      },
                      (err) => {
                        this.stateload = false;
                      }
                    );
                }
              }
            } else {
              this.countries = [];
            }
          },
          (err) => {
            // Handle error if necessary
          }
        );
    } else {
    }
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

  exceldraweropen() {
    this.exceldrawervisible = true;
    this.dataMapping = new studentmapping();
    this.dataMapping.YEAR_ID = Number(sessionStorage.getItem('yearId'));
    this.exceldrawerTitle = `Import Students`;
  }

  exceldrawervisible = false;
  exceldrawerTitle = '';
  exceldrawerClose() {
    this.exceldrawervisible = false;
    this.clear();
    this.search();
  }
  OnConfirmDelete(data) {
    this.loadingRecords = true;
    data.STATUS = 0;
    this.api.updateStudent(data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success(' Student Deleted Successfully...', '');
        this.drawerClose();
        this.isSpinning = false;
      } else {
        this.message.error(' Student Deletion Failed', '');
        this.isSpinning = false;
      }
    });
  }
  arrayofheader: any;
  arrayofData: any;
  // loadingRecords = false;
  ExcelData: any;
  FinalFileurl: any;
  FILE_NAME: any;
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
        //
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
          if (this.ExcelData.length == 0) {
            this.message.warning('Excel Is Empty', '');
            this.FILE_NAME = null;
          }
          // this.isSpinning = true;
        }
      };
    } else {
      this.message.error('Please Select Only Excel File', '');
      this.FinalFileurl = null;
      this.FILE_NAME = null;
    }
  }

  @ViewChild('fileInput') myFileInput!: ElementRef;
  clear() {
    this.myFileInput.nativeElement.value = '';
    this.FILE_NAME = null;
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
              this.dataMapping.CLASS_ID,
              this.dataMapping.YEAR_ID,
              Number(sessionStorage.getItem('schoolid')),
              this.dataMapping.DIVISION_ID,
              this.dataMapping.MEDIUM_ID
            )
            .subscribe(
              (data) => {
                if (data['code'] == 200) {
                  this.message.success(' Data Uploaded Successfully ', '');
                  this.isSpinning = false;
                  this.excelLoading = false;

                  // this.search();
                  this.exceldrawerClose();
                } else if (data['code'] == 300) {
                  this.message.error(' Duplicate Mobile Number', '');
                  this.excelLoading = false;
                } else if (data['code'] == 302) {
                  this.message.error('No Data In Excel .. ', '');
                  this.excelLoading = false;
                } else {
                  this.message.error(data['message'], '');
                }
              },
              (err) => {
                this.message.error(' Failed To Upload Data ', '');
                this.isSpinning = false;
              }
            );
        } else {
          this.message.error(' Failed To Upload Data ', '');
          this.isSpinning = false;
        }
      });
  }

  cancel() {
    //
  }

  // Model Data
  StudentData: number = 0;
  isVisible12 = false;
  nzOkLoading = false;
  modelLoading = false;
  showMapandClosebutton: boolean = true;
  showData: any;
  MapClass(data: studentmaster) {
    this.showData = '';
    this.StudentData = data.ID;
    this.modelLoading = true;
    this.api
      .getallMappedClass(
        0,
        0,
        '',
        '',
        ' AND STUDENT_ID = ' + data.ID + ' AND STATUS=1'
      )
      .subscribe((data) => {
        if (data['code'] == 200 && data['count'] > 0) {
          //
          this.modelLoading = false;
          this.showData = Object.assign({}, data['data'][0]);
          //
          if (
            (this.dataMapping.CLASS_ID != undefined ||
              this.dataMapping.CLASS_ID != null) &&
            (this.dataMapping.ROLL_NUMBER != undefined ||
              this.dataMapping.ROLL_NUMBER != null) &&
            (this.dataMapping.YEAR_ID != undefined ||
              this.dataMapping.YEAR_ID != null) &&
            (this.dataMapping.DIVISION_ID != undefined ||
              this.dataMapping.DIVISION_ID != null)
          ) {
            this.showMapandClosebutton = false;
            // if(this.dataMapping.DIVISION_ID==0){
            //   this.dataMapping.DIVISION_ID=this.dataMapping.DIVISION_ID.toString()
            // }
            // else{
            //   this.dataMapping.DIVISION_ID=this.dataMapping.DIVISION_ID
            // }
            this.modelLoading = false;
          } else {
            this.showMapandClosebutton = true;
            this.modelLoading = false;
          }
        } else if (data['count'] == 0) {
          this.modelLoading = false;
          this.showMapandClosebutton = true;
        } else if (data['code'] != 200) {
          this.message.error(
            'Something Went Wrong While Getting Mapped Data',
            ''
          );
          this.modelLoading = false;
        }
      });

    this.isVisible12 = true;
  }

  isOk = true;
  drawerVisibleMap!: boolean;
  drawerTitleMap!: string;
  classId;
  classNAME;
  addFeeMap(data): void {
    this.drawerTitleMap = 'Student Wise Fee Mapping';
    this.classId = data.ID;
    this.classNAME = data.NAME;
    this.drawerVisibleMap = true;
  }

  drawerCloseMap(): void {
    this.clickevent('ALL');
    this.drawerVisibleMap = false;
  }
  get closeCallbackMap() {
    return this.drawerCloseMap.bind(this);
  }

  switchValue = true;

  handleOk(): void {
    this.switchValue = true;

    this.isOk = true;
    if (
      (this.dataMapping.YEAR_ID == undefined ||
        this.dataMapping.YEAR_ID == null ||
        this.dataMapping.YEAR_ID <= 0) &&
      (this.dataMapping.CLASS_ID == undefined ||
        this.dataMapping.CLASS_ID == null ||
        this.dataMapping.CLASS_ID <= 0) &&
      (this.dataMapping.DIVISION_ID == undefined ||
        this.dataMapping.DIVISION_ID == null ||
        this.dataMapping.DIVISION_ID < 0) &&
      (this.dataMapping.ROLL_NUMBER == null ||
        this.dataMapping.ROLL_NUMBER == undefined ||
        this.dataMapping.ROLL_NUMBER <= 0)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All Required Information', '');
    } else if (
      this.dataMapping.YEAR_ID == undefined ||
      this.dataMapping.YEAR_ID == null ||
      this.dataMapping.YEAR_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Year', '');
    } else if (
      this.dataMapping.CLASS_ID == undefined ||
      this.dataMapping.CLASS_ID == null ||
      this.dataMapping.CLASS_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Class', '');
    } else if (
      this.dataMapping.DIVISION_ID == undefined ||
      this.dataMapping.DIVISION_ID == null ||
      this.dataMapping.DIVISION_ID < 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Division', '');
    } else if (
      this.dataMapping.MEDIUM_ID == undefined ||
      this.dataMapping.MEDIUM_ID == null ||
      this.dataMapping.MEDIUM_ID < 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Medium', '');
    } else if (
      this.dataMapping.ROLL_NUMBER == null ||
      this.dataMapping.ROLL_NUMBER == undefined ||
      this.dataMapping.ROLL_NUMBER <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Roll Number.', '');
    } else {
      this.switchValue = false;
    }
  }
  finalconfirm() {
    if (this.isOk) {
      this.nzOkLoading = true;

      const data = {
        STUDENT_ID: this.StudentData,
        CLASS_ID: this.dataMapping.CLASS_ID,
        YEAR_ID: this.dataMapping.YEAR_ID,
        ROLL_NUMBER: Number(this.dataMapping.ROLL_NUMBER),
        DIVISION_ID: Number(this.dataMapping.DIVISION_ID),
        MEDIUM_ID: Number(this.dataMapping.MEDIUM_ID),
        // SCHOOL_ID:Number(sessionStorage.getItem('schoolid'))
      };
      this.api.MapClass(data).subscribe(
        (successCode) => {
          if (successCode.code == 200) {
            this.message.success(' Class Mapping Completed', '');
            this.isVisible12 = false;
            this.close();
            this.nzOkLoading = false;
          } else if (successCode.code == 300) {
            this.message.error('Fee Details For Given Student Not Found', '');
            this.isVisible12 = true;
            this.nzOkLoading = false;
          } else {
            this.message.error(' Class Mapping Failed', '');
            this.isVisible12 = true;
            this.nzOkLoading = false;
          }
        },
        (err) => {
          this.nzOkLoading = false;
        }
      );
    }
  }
  close() {
    this.dataMapping = new studentmapping();
    this.search();
  }
  handleCancel(): void {
    this.close();
    this.isVisible12 = false;
  }
  isVisible = false;
  STUDENT_DATALIST: any;
  // APPROVAL_STATUS: any = 'A';
  submitstatusisSpinning: boolean = false;
  StatusButton: any;

  Preview(data1: studentmaster) {
    console.log(data1);

    this.StatusButton = data1.APPROVAL_STATUS;

    this.STUDENT_DATALIST = Object.assign({}, data1);
    console.log(this.STUDENT_DATALIST);

    //
    if (data1.PROFILE_PHOTO) {
      this.taskurl = this.imgUrl + 'appUserProfile/' + data1.PROFILE_PHOTO;
      //
    }
    this.isVisible = true;
  }

  SubmitStatus() {
    let isOk = true;

    if (
      this.STUDENT_DATALIST.APPROVAL_STATUS == undefined ||
      this.STUDENT_DATALIST.APPROVAL_STATUS == null ||
      this.STUDENT_DATALIST.APPROVAL_STATUS == 'P'
    ) {
      isOk = false;
      this.message.error('Please Select Student Status', '');
    } else if (
      this.STUDENT_DATALIST.APPROVAL_STATUS == 'R' &&
      (this.STUDENT_DATALIST.REJECT_BLOCKED_REMARK == undefined ||
        this.STUDENT_DATALIST.REJECT_BLOCKED_REMARK == '' ||
        this.STUDENT_DATALIST.REJECT_BLOCKED_REMARK.trim() == '')
    ) {
      isOk = false;
      this.message.error('Please Enter Reject Remark', '');
    }

    if (isOk) {
      //
      this.STUDENT_DATALIST['YEAR_ID'] = Number(
        sessionStorage.getItem('yearId')
      );
      this.api.studentAprroveReject(this.STUDENT_DATALIST).subscribe((data) => {
        if (data['code'] == 200) {
          this.message.success(' Student Status Submitted successfully...', '');
          this.clickevent('ALL');
          this.submitstatusisSpinning = false;
          this.isVisible = false;
        } else if (data['code'] == 300) {
          this.message.error('Fee Details For Given Student Not Found', '');
          this.submitstatusisSpinning = false;
          this.isVisible = false;
        } else {
          this.message.error('Student Status Submission Failed...', '');
          this.submitstatusisSpinning = false;
        }
      });
    } else {
      // this.message.error('No Data To Submit ...', '');

      this.submitstatusisSpinning = false;
    }
  }
  handleCancel2() {
    this.isVisible = false;
  }
}
