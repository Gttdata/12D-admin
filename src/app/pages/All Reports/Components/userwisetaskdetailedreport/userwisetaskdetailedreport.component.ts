import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Services/api.service';
import { ExportService } from 'src/app/Services/export.service';

@Component({
  selector: 'app-userwisetaskdetailedreport',
  templateUrl: './userwisetaskdetailedreport.component.html',
  styleUrls: ['./userwisetaskdetailedreport.component.css'],
})
export class UserwisetaskdetailedreportComponent implements OnInit {
  formTitle = 'Userwise Task Detailed Report';
  dataList: any[] = [];
  exportdataList: any[] = [];
  loadingRecords = false;
  exportLoading = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  filterClass: any = 'filter-invisible';
  isSpinning = false;
  screenWidth = 0;
  yearId: any;
  currentroute = '';
  yearlist: any[] = [];
  isyearLoad: boolean = false;
  schoolid = Number(sessionStorage.getItem('schoolid'));
  roleId = Number(sessionStorage.getItem('roleId'));
  disableTime = [];

  columns: string[][] = [
    // ['NAME', 'NAME'],
    ['USER_NAME', 'USER_NAME'],
    ['LABEL', 'LABEL'],

    // ['QUESTION', 'QUESTION'],
    // ['MOBILE_NUMBER', 'MOBILE_NUMBER'],
    // ['DEVICE_NAME', 'DEVICE_NAME'],
    // ['STUDENT_COUNT', 'STUDENT_COUNT'],
    // ['TEACHERS_COUNT', 'STUDENT_COUNT'],
  ];

  // androidVersionList=[]
  // androidVersionLoad=false
  constructor(
    private api: ApiService,
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private exportservice: ExportService
  ) {}

  timeStringToDate(timeStr) {
    const today = new Date();
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    today.setHours(hours, minutes, seconds, 0);
    return today;
  }
  ngOnInit(): void {
    this.getALLusersList()
  }
  userid:any
  userlist=[]
  loadingUsers=false
  getALLusersList(){
    this.api.getUsersReport(0,0,'id','desc',' AND STATUS=1').subscribe(data=>{
      this.loadingUsers=true
      if(data['code']==200){
         this.loadingUsers=false
         this.userlist=data['data']
      }
      else{
        this.loadingUsers=false
         this.userlist=[]
      }
    })
  }
  assignedDate: any = [];
  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'ID';
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
    console.log('search text:' + this.searchText);
    if (this.searchText != '') {
      likeQuery = ' AND (';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    // var extraQuery=''
    // if(this.classes){
    //      extraQuery=" AND CLASS_ID = '" +this.classes+ "'"
    // }
    // if(this.year2){
    //     extraQuery+= " AND YEAR_ID= "+this.year2
    // }
    // if(this.division2){
    //   extraQuery+= " AND DIVISION_ID= "+this.division2
    // }
    // ' AND SCHOOL_ID= '+this.schoolid + extraQuery
    if (exportInExcel == false) {
      this.api
        .getuserWiseTaskCompletionDetailedReport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.loadingRecords = false;
            } else {
              this.dataList = [];
              this.message.error('Something Went Wrong', '');
              this.loadingRecords = false;
              this.filterClass = 'filter-visible';
              this.isFilterApplied = 'default';
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } else {
      this.exportLoading = true;
      this.api
        .getuserWiseTaskCompletionDetailedReport(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.totalRecords = data['count'];
              this.exportdataList = data['data'];
              this.loadingRecords = false;
              this.exportLoading = false;
              this.convertInExcel();
            } else {
              this.exportdataList = [];
              this.message.error('Something Went Wrong', '');
              this.loadingRecords = false;
              this.exportLoading = false;
            }
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
  onChange(event) {
    // console.log(this.lastVisitDatetime)
  }
  applyFilter() {
    this.loadingRecords = true;

    this.filterQuery = '';
    // console.log(this.disableTime,this.assignedDate)
    // if (
    //   this.yearId !== undefined &&
    //   this.yearId !== null &&
    //   this.yearId !== ''
    // ) {
    //   this.filterQuery += ' AND YEAR_ID =' + this.yearId;
    // }

    if (this.assignedDate.length > 0) {
      this.filterQuery =
        " AND ASSIGNED_DATE between '" +
        this.datePipe.transform(this.assignedDate[0], 'yyyy-MM-dd') +
        "' and '" +
        this.datePipe.transform(this.assignedDate[1], 'yyyy-MM-dd') +
        "'";
    }
    if (this.disableTime.length > 0) {
      if (this.disableTime[0] && this.disableTime[1]) {
        this.filterQuery +=
          " AND DISABLE_TIMING between '" +
          this.datePipe.transform(this.disableTime[0], 'HH:mm:ss') +
          "' and '" +
          this.datePipe.transform(this.disableTime[1], 'HH:mm:ss') +
          "'";
      } else if (!this.disableTime[0] && this.disableTime[1]) {
        this.message.error('Please Select From Disable Time', '');
        this.loadingRecords = false;
        this.isSpinning = false;
        this.filterQuery=''
        this.isFilterApplied = 'default';
        this.filterClass = 'filter-visible';
      } else if (this.disableTime[0] && !this.disableTime[1]) {
        this.message.error('Please Select To Disable Time', '');
        this.loadingRecords = false;
        this.isSpinning = false
        this.filterQuery=''
        this.isFilterApplied = 'default';
        this.filterClass = 'filter-visible';
      }
    } 
    if(this.userid){
      this.filterQuery+=' AND USER_ID= '+this.userid
   }
    if (
      (this.filterQuery == '' ||
        this.filterQuery == null ||
        this.filterQuery == undefined) &&
      !this.assignedDate.length && !this.disableTime.length && !this.userid
    ) {
      // if (this.activateDate && this.activateDate.length > 0) {
      //   this.activateDate[0] = this.datePipe.transform(
      //     this.activateDate[0],
      //     'yyyy-MM-dd'
      //   );
      //   this.activateDate[1] = this.datePipe.transform(
      //     this.activateDate[1],
      //     'yyyy-MM-dd'
      //   );
      //   this.filterQuery +=
      //     " AND ACTIVATE_DATE between '" +
      //     this.activateDate[0] +
      //     "' AND '" +
      //     this.activateDate[1] +
      //     "'";
      //   // console.log(this.filterQuery)
      // }

      this.message.error('', 'Please Select Filter Value');
      this.loadingRecords = false;
      this.isSpinning = false;
      this.isFilterApplied = 'default';
      this.filterClass = 'filter-visible';
    }
    else if (this.filterQuery != '') {
      this.isFilterApplied = 'primary';
      this.filterClass = 'filter-invisible';
      this.search();
    }

    this.loadingRecords = false;
  }

  keyup(event: any) {
    this.search(true);
  }

  onKeyPressEvent() {
    document.getElementById('search')!.focus();
    this.search(true);
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  clearFilter() {
    this.searchText = '';
    this.filterQuery = '';
    this.userid=null
    this.assignedDate = [];
    this.disableTime = [];
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';

    this.search(true);
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    console.log(currentSort);

    console.log('sortOrder :' + sortOrder);
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
  importInExcel() {
    if (this.dataList.length > 0) {
      this.search(true, true);
    } else {
      this.message.error('No Data ....', '');
    }
  }

  convertInExcel() {
    var arry1 = [];
    var obj1: any = new Object();
    for (var i = 0; i < this.exportdataList.length; i++) {
      obj1['User Name'] = this.exportdataList[i]['USER_NAME'];
      obj1['Task Name'] = this.exportdataList[i]['LABEL'];
      obj1['Assigned DateTime'] = this.exportdataList[i]['ASSIGNED_DATE']
        ? this.datePipe.transform(
            this.exportdataList[i]['ASSIGNED_DATE'],
            'dd/MMM/yyyy HH:mm'
          )
        : this.exportdataList[i]['ASSIGNED_DATE'];
      obj1['Enable Time'] = this.exportdataList[i]['ENABLE_TIME'];
      obj1['Disable Time'] = this.exportdataList[i]['DISABLE_TIMING'];

      // obj1['Total Amount'] = this.exportdataList[i]['AMOUNT'];
      // obj1['Number Of Custom Workouts'] =
      //   this.exportdataList[i]['NUMBER_OF_ACTIVITIES']

      arry1.push(Object.assign({}, obj1));
      if (i == this.exportdataList.length - 1) {
        this.exportservice.exportExcel(
          arry1,
          'Userwise Task Completion Detailed Report ' +
            this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        );
      }
    }
  }
}
