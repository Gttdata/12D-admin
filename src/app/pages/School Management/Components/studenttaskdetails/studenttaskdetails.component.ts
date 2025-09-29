import { Component, OnInit } from '@angular/core';
import { studenttaskdetails } from '../../Models/studenttaskdetails';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { ApiService } from 'src/app/Services/api.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ExportService } from 'src/app/Services/export.service';

@Component({
  selector: 'app-studenttaskdetails',
  templateUrl: './studenttaskdetails.component.html',
  styleUrls: ['./studenttaskdetails.component.css'],
})
export class StudenttaskdetailsComponent implements OnInit {
  isLoading: boolean = false;
  formTitle: string = 'Manage Student Tasks';
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: studenttaskdetails = new studenttaskdetails();
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
  students = [];
  roleId: any;
  taskloading: boolean = false;
  studentloading: boolean = false;
  columns: string[][] = [
    ['ASSIGNED_DATE', 'ASSIGNED_DATE'],
    ['TASK', 'TASK'],
    ['STUDENT_NAME', 'STUDENT_NAME'],
    ['COMPLETION_DATE_TIME', 'COMPLETION_DATE_TIME'],
    ['TYPE', 'TYPE'],
    ['CLASS_NAME', 'CLASS_NAME'],
    ['SUBMISSION_DATE', 'SUBMISSION_DATE'],
    ['DIVISION_NAME']
  ];
  isSpinning: boolean = false;
  public commonFunction = new CommomFunctionsService();
  isOk: boolean = true;
  tasks: any = [];
  filterClass: string = 'filter-invisible';
  counttype: string;
  classFilter: string;
  divisionFilter: string;
  yearFilter: string;
  exportdataList: any;
  exportLoading: boolean;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe,
    private router:Router,
    private exportservice:ExportService

  ) {
    router.events.subscribe((val) => {
      var url = window.location.href;
      var arr = url.split('/');
      this.currentroute = arr[3];
    });
  }
  redirectToAdminDashboard(){
    window.location.href='/admindashboard'
  }
  // data:any=new studenttaskdetails()
  ngOnInit(): void {
    this.roleId = Number(sessionStorage.getItem('roleId'));
    if(sessionStorage.getItem('Task Count')){
      this.counttype=sessionStorage.getItem('Task Count')
    }
    if(sessionStorage.getItem('Task Class')){
      this.classFilter=sessionStorage.getItem('Task Class')
    }
    if(sessionStorage.getItem('taskdivisionFilter')){
      this.divisionFilter=sessionStorage.getItem('taskdivisionFilter')
    }
    if(sessionStorage.getItem('taskYearFilter')){
      this.yearFilter=sessionStorage.getItem('taskYearFilter')
    }
    // this.getStudent();
    this.getTasks();
  }

  keyup(event: any) {
    this.search();
  }
  taskid: number;
  studentid: number;
  getStudent() {
    this.studentloading = true;
    this.api
      .getAllstudents(
        0,
        0,
        '',
        '',
        ' AND STATUS=1  AND CLASS_ID = ' +
          Number(sessionStorage.getItem('classid')) + ' AND DIVISION_ID = ' + Number(sessionStorage.getItem('divisionId'))
      )
      
      .subscribe((student) => {
        if (student.code == 200) {
          this.students = student['data'];
          this.studentloading = false;
        } else {
          this.message.error('Failed To Get Students', ``);
          this.studentloading = false;
          this.students = [];
        }
      });
  }
  getTasks() {
    this.taskloading = true;
    this.api
      .getALLTask(
        0,
        0,
        '',
        '',
        'AND CLASS_ID = ' + Number(sessionStorage.getItem('classid')) + ' AND DIVISION_ID = ' + Number(sessionStorage.getItem('divisionId'))
      )
      .subscribe((task) => {
        if (task.code == 200) {
          this.tasks = task['data'];
          this.taskloading = false;
        } else {
          this.message.error('Failed To Get tasks', ``);
          this.taskloading = false;
          this.tasks = [];
        }
      });
  }
  currentroute = '';

  showFilter(): void {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  onKeypressEvent(reset: boolean = false) {
    // document.getElementById("button").focus();
    document.getElementById('button')?.focus();
    this.search();
  }
  search(reset: boolean = false,exportInExcel:boolean=false) {
    this.isOk = true;
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
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + " )";
    }
    if (this.roleId == 3) {
      var extraFilter =
      ' AND CLASS_ID = ' + Number(sessionStorage.getItem('classid')) + ' AND DIVISION_ID = ' + Number(sessionStorage.getItem('divisionId'));
    } else {
      extraFilter = '';
    }

    // if (
    //   (this.studentid != undefined || this.studentid != null) &&
    //   (this.taskid != undefined || this.taskid != null)
    // ) {
    //   this.filterQuery =
    //     " AND STUDENT_ID = '" +
    //     this.studentid +
    //     "' " +
    //     " AND TASK_ID = '" +
    //     this.taskid +
    //     "' ";
    //   this.isOk = true;
    // } else if (this.studentid != undefined || this.studentid != null) {
    //   this.filterQuery = " AND STUDENT_ID ='" + this.studentid + "'";

    //   this.isOk = true;
    // } else 
    
    if (this.taskid != undefined || this.taskid != null) {
      this.filterQuery = " AND TASK_ID ='" + this.taskid + "'";

      this.isOk = true;
    }
    var extraQuery=''
    if(this.counttype && this.classFilter){
         extraQuery=" AND CLASS_ID = " +this.classFilter+ ""
    }
    // console.log(this.yearFilter,this.divisionFilter);
    
    if(this.yearFilter){
        extraQuery+= " AND YEAR_ID= "+this.yearFilter+""
    }
    if(this.divisionFilter){
      extraQuery+= " AND DIVISION_ID= "+this.divisionFilter
    }
    if(this.counttype){
      extraQuery+= " AND STATUS= '"+this.counttype+"'"
    }
    if (exportInExcel == false) {
      this.api
      .getAllstudentsTask(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + extraFilter + this.filterQuery + extraQuery
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
              this.filterClass = 'filter-invisible';
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } else {
      this.exportLoading = true;
      this.api
      .getAllstudentsTask(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + extraFilter + this.filterQuery + extraQuery
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
    // else if(likeQuery){
  
  }
  applyFilter() {
    this.isSpinning = true;
    this.loadingRecords = true;
    this.isFilterApplied = 'primary';
    if (this.studentid == undefined && this.taskid == undefined) {
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
  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.studentid = null;
    this.taskid = null;
    this.search();
  }
  //Drawer Methods

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
  importInExcel() {
    this.search(true, true);
  }

  convertInExcel() {
    var arry1 = [];
    var obj1: any = new Object();
    for (var i = 0; i < this.exportdataList.length; i++) {
      obj1['Assigned Date'] = this.datePipe.transform(this.exportdataList[i]['ASSIGNED_DATE'],'dd/MMM/yyyy');
      obj1['Student Name'] = this.exportdataList[i]['STUDENT_NAME'];
      obj1['Class Name'] = this.exportdataList[i]['CLASS_NAME'];
      obj1['Task'] = this.exportdataList[i]['TASK'];
      if(this.exportdataList[i]['TYPE']=='CW'){
        obj1['Task Type']='Classwork'
      }
      else if(this.exportdataList[i]['TYPE']=='HW'){
        obj1['Task Type']='Home Work'
      }
      else{
        obj1['Task Type']='Assignment'
      }
      obj1['Completion Date'] = this.datePipe.transform(this.exportdataList[i]['COMPLETION_DATE_TIME'],'dd/MMM/yyyy');
      obj1['Submission Date'] = this.datePipe.transform(this.exportdataList[i]['SUBMISSION_DATE'],'dd/MMM/yyyy');

      arry1.push(Object.assign({}, obj1));
      if (i == this.exportdataList.length - 1) {
        this.exportservice.exportExcel(
          arry1,
          'Student Task Detailed Report ' +
            this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        );
      }
    }
  }
  //save
}
