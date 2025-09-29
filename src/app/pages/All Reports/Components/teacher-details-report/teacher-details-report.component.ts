import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-teacher-details-report',
  templateUrl: './teacher-details-report.component.html',
  styleUrls: ['./teacher-details-report.component.css']
})
export class TeacherDetailsReportComponent implements OnInit {
  formTitle = ' Teacher Details Report ';
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
  class: any=[];
  classlist: any[] = [];
  division:any=[]
  divisionlist:any[]=[];
  // medium:any=[]
  // mediumlist:any[]=[];
  year:any=[]
  yearlist:any[]=[];
  teachertype:any
  columns: string[][] = [
    ['NAME', 'NAME'],
    ['EMAIL_ID', 'EMAIL_ID'],
    ['MOBILE_NO', 'MOBILE_NO'],
    ['GENDER', 'GENDER'],
    ['BIRTH_DATE', 'BIRTH_DATE'],
    ['TEACHER_TYPE', 'TEACHER_TYPE'],
    ['CLASS', 'CLASS'],
    ['DIVISION', 'DIVISION'],
    ['YEAR', 'YEAR']
  ];
  screenWidth=0
  roleId=Number(sessionStorage.getItem('roleId'))

  schoolid=Number(sessionStorage.getItem('schoolid'))
  constructor(
    private api: ApiService,
    private datePipe: DatePipe,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.getclassList();
    this.screenWidth=window.innerWidth

  }

  getclassList() {
    this.api.getAllClassMaster(0, 0, 'ID', 'asc', ' AND STATUS = 1 AND SCHOOL_ID= '+this.schoolid).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.classlist = data['data'];
        }
      },
      (err) => {
        console.log(err);
      }
    );
    this.api.getAllDivisions(0, 0, 'ID', 'asc', ' AND STATUS = 1 AND SCHOOL_ID= '+this.schoolid).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.divisionlist = data['data'];
        }
      },
      (err) => {
        console.log(err);
      }
    );
    // this.api.getAllMediumMaster(0, 0, 'ID', 'asc', ' AND STATUS = 1 AND SCHOOL_ID= '+this.schoolid).subscribe(
    //   (data) => {
    //     if (data['code'] == 200) {
    //       this.mediumlist = data['data'];
    //     }
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
    this.api.getAllYearMaster(0, 0, 'ID', 'asc', ' AND STATUS = 1 AND SCHOOL_ID= '+this.schoolid).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.yearlist = data['data'];
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
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

  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }
    this.loadingRecords = false;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';
    console.log('search text:' + this.searchText);
    if (this.searchText != '') {
      likeQuery = ' AND';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      console.log('likeQuery' + likeQuery);
    }
    // if (exportInExcel == false) {
    //   this.api
    //     .getAllSchoolWise(
    //       this.pageIndex,
    //       this.pageSize,
    //       this.sortKey,
    //       sort,
    //       likeQuery + this.filterQuery
    //     )
    //     .subscribe(
    //       (data) => {
    //         if (data['code'] == 200) {
    //           this.totalRecords = data['count'];
    //           this.dataList = data['data'];
    //           this.loadingRecords = false;
    //         } else {
    //           this.message.error('Something Went Wrong', '');
    //           this.loadingRecords = false;
    //           this.filterClass = 'filter-invisible';
    //         }
    //       },
    //       (err) => {
    //         console.log(err);
    //       }
    //     );
    // } else {
    //   this.exportLoading = true;
    //   this.api
    //     .getAllSchoolWise(
    //       0,
    //       0,
    //       this.sortKey,
    //       sort,
    //       likeQuery + this.filterQuery
    //     )
    //     .subscribe(
    //       (data) => {
    //         if (data['code'] == 200) {
    //           this.totalRecords = data['count'];
    //           this.exportdataList = data['data'];
    //           this.loadingRecords = false;
    //           this.exportLoading = false;
    //           this.convertInExcel();
    //         } else {
    //           this.message.error('Something Went Wrong', '');
    //           this.loadingRecords = false;
    //           this.exportLoading = false;
    //         }
    //       },
    //       (err) => {
    //         console.log(err);
    //       }
    //     );
    // }
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
    console.log('dfghjk');
  }

  applyFilter() {
    this.loadingRecords = true;

    if (this.class != undefined && this.class != null && this.class !== '') {
      this.filterQuery = ' AND CLASS_ID IN(' + this.class + ')';
      this.isFilterApplied = 'primary';
    } else {
      this.filterQuery = '';
    }

    if (this.filterQuery !== '') {
      this.isFilterApplied = 'primary';
      this.filterClass = 'filter-invisible';
      this.search(true);
    }

    this.loadingRecords = false;
  }

  clearFilter() {
    this.class = null;
    this.filterQuery = '';
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
    this.search(true);
  }

  importInExcel() {
    this.search(true, true);
  }

  // convertInExcel() {
  //   var arry1 = [];
  //   var obj1: any = new Object();
  //   for (var i = 0; i < this.exportdataList.length; i++) {
  //     obj1['School Name'] = this.exportdataList[i]['SCHOOL_NAME'];
  //     obj1['Total members'] = this.exportdataList[i]['TOTAL_MEMBERS'];

  //     arry1.push(Object.assign({}, obj1));
  //     if (i == this.dataList.length - 1) {
  //       this._exportService.exportExcel(
  //         arry1,
  //         'school Wise Summary Report ' +
  //           this.datePipe.transform(new Date(), 'yyyy-MM-dd')
  //       );
  //     }
  //   }
  // }

}
