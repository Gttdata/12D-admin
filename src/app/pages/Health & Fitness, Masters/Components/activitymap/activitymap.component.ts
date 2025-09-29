import { Component, Input, OnInit } from '@angular/core';
import { activitymaster } from '../../Models/activityheadmaster';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Services/api.service';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';

@Component({
  selector: 'app-activitymap',
  templateUrl: './activitymap.component.html',
  styleUrls: ['./activitymap.component.css'],
})
export class ActivitymapComponent implements OnInit {
  @Input()
  drawerVisible!: boolean;
  @Input()
  drawerTitle!: string;
  @Input()
  HEAD_ID;
  isSpinning = false;
  isOk = true;
  @Input()
  drawerData: activitymaster = new activitymaster();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage Activity Mapping';
  dataList: any[] = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  activitylist: any[] = [];
  drawerClose2!: Function;
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  filterClass: string = 'filter-invisible';
  columns: string[][] = [
    ['ACTIVITY_NAME', 'ACTIVITY_NAME'],
    ['ACTIVITY_TYPE', ' ACTIVITY_TYPE '],
    ['ACTIVITY_VALUE ', ' ACTIVITY_VALUE  '],
    // ['SEQ_NO', 'Sequence No'],
  ];

  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    // if(this.drawerData.ID && ACTIVITY_ID){
    this.getAllActivities();
    // }
    this.getActivityCategory();
  }
  getActivitieswithFilter(dataoffilter?: any) {
    // if(!dataoffilter){
    //   this.drawerData['ACTIVITY_ID']=null
    // }
    if (this.drawerData.ACTIVITY_CATEGORY_ID) {
      this.api
        .getActivityMaster(
          0,
          0,
          'id',
          'desc',
          ' AND ACTIVITY_CATEGORY_ID=' + this.drawerData.ACTIVITY_CATEGORY_ID
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            // if (!this.drawerData.ID) {
            // this.drawerData['ACTIVITY_ID'] = null;
            // }
            this.activitylist = data['data'];
          } else {
            this.activitylist = [];
            this.drawerData['ACTIVITY_ID'] = null;
          }
        });
    } else {
      this.drawerData['ACTIVITY_ID'] = null;
    }
  }
  onChangeevent(event) {
    if (event) {
      this.drawerData['ACTIVITY_ID'] = null;
    }
  }
  activityload=false
  getAllActivities() {
    this.activityload=true
    this.api.getActivityMaster(0, 0, 'id', 'desc', '').subscribe((data) => {
      if (data['code'] == 200) {
        this.activityload=false
        this.activitylist = data['data'];
      } else {
        this.activityload=false
        this.activitylist = [];
      }
    });
  }
  activitycategorylist: any[] = [];
  activitycategoryload = false;

  getActivityCategory() {
    this.activitycategoryload = true;
    this.api
      .getActivityCategoryMaster(0, 0, 'id', 'asc', ' AND STATUS=1')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.activitycategorylist = data['data'];
          this.activitycategoryload = false;
        } else {
          this.activitycategoryload = false;
          this.activitycategorylist = [];
        }
      });
  }
  keyup(event: any) {
    this.search();
  }
  CATEGORY: any;
  ACTIVITY_ID: any;
  showFilter(): void {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  applyFilter() {
    this.isSpinning = true;
    this.loadingRecords = true;
    this.filterQuery = '';

    // if(this.ACTIVITY_CATEGORY_ID){
    //   this.filterQuery=' AND ACTIVITY_CATEGORY_ID = '+ this.ACTIVITY_CATEGORY_ID
    // }
    // if(this.ACTIVITY_SUB_CATEGORY_ID){
    //   this.filterQuery+=' AND ACTIVITY_SUB_CATEGORY_ID = '+ this.ACTIVITY_SUB_CATEGORY_ID
    // }
    if (this.CATEGORY) {
      this.filterQuery += " AND CATEGORY = '" + this.CATEGORY + "'";
    }
    if (this.ACTIVITY_ID) {
      this.filterQuery += ' AND ACTIVITY_ID = ' + this.ACTIVITY_ID;
    }
    // console.log(this.ACTIVITY_CATEGORY_ID,this.ACTIVITY_SUB_CATEGORY_ID)
    // if(this.ACTIVITY_SUB_CATEGORY_ID){
    //   this.filterQuery+=' AND ACTIVITY_CATEGORY_ID = '+ this.ACTIVITY_CATEGORY_ID
    // }
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
      this.filterClass = 'filter-invisible';
      this.search();
    }
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.CATEGORY = null;
    this.ACTIVITY_ID=null
    // this.ACTIVITY_SUB_CATEGORY_ID=null
    // this.filterdata.CLASS_ID = null;
    // this.filterdata.QUESTION_TYPE = null;
    // this.filterdata.CHAPTER_ID = null;
    // this.filterdata.SUBJECT_ID = null;
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
      .getAllactivityheadmapping(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + ' AND HEAD_ID= ' + this.HEAD_ID + this.filterQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.loadingRecords = false;
            this.isSpinning = false;
          } else {
            this.message.error('Something Went Wrong', '');
            this.dataList = [];
            this.loadingRecords = false;
            this.isSpinning = false;
          }
        },
        (err) => {}
      );
  }
  TIMING_TYPE: any = 'Sec';
  DISTANCE_TYPE: any = 'mtr';
  WEIGHT_TYPE = 'kg';
  onTypeChange(type) {
    // if (type == 'T') {
    //   this.drawerData.ACTIVITY_VALUE = '';
    // } else {
    //   this.drawerData.ACTIVITY_VALUE = '';
    // }
  }
  onTimeTypeChange(time: string): void {}

  onActivityTimingChange(): void {}
  add(): void {
    this.drawerTitle = 'Create New Activity Mapping';
    this.drawerVisible = true;
    this.TIMING_TYPE = 'Sec';
    this.DISTANCE_TYPE = 'mtr';
    this.drawerData = new activitymaster();
    // this.api.getAllactivityheadmapping(1, 1, 'id', 'desc', ' AND HEAD_ID= '+ this.HEAD_ID).subscribe(
    //   (data) => {
    //     if (data['code'] == 200) {
    //       if (data['count'] == 0) {
    //         this.drawerData.SEQ_NO = 1;
    //       } else {
    //         this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
    //       }

    //       this.drawerVisible = true;
    //     }
    //   },
    //   (err) => {}
    // );
  }
  edit(data: activitymaster): void {
    this.drawerTitle = ' Update Activity Mapping';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
    this.TIMING_TYPE = 'Sec';
    this.DISTANCE_TYPE = 'mtr';
    this.WEIGHT_TYPE = 'kg';
    // if(data.ACTIVITY_TYPE=='W'){
    //   this.drawerData.ACTIVITY_VALUE=Number(data.ACTIVITY_VALUE)
    // }
    this.getActivitieswithFilter();
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
  save(addNew: boolean, statepage: NgForm): void {
    //
    this.isSpinning = false;
    this.isOk = true;

    if (
      (this.drawerData.ACTIVITY_CATEGORY_ID == undefined ||
        this.drawerData.ACTIVITY_CATEGORY_ID == null) &&
      (this.drawerData.CATEGORY == undefined ||
        this.drawerData.CATEGORY == null ||
        this.drawerData.CATEGORY.trim() == '') &&
      (this.drawerData['ACTIVITY_ID'] == undefined ||
        this.drawerData['ACTIVITY_ID'] == null) &&
      (this.drawerData.ACTIVITY_TYPE == null ||
        this.drawerData.ACTIVITY_TYPE.trim() == '' ||
        this.drawerData.ACTIVITY_TYPE == undefined)
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.drawerData.ACTIVITY_CATEGORY_ID == null ||
      this.drawerData.ACTIVITY_CATEGORY_ID == undefined
    ) {
      this.isOk = false;
      // console.log(this.drawerData);
      this.message.error('Please Select Activity Category', '');
    } else if (
      this.drawerData.CATEGORY == null ||
      this.drawerData.CATEGORY == undefined ||
      this.drawerData.CATEGORY.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Difficulty', '');
    } else if (
      this.drawerData['ACTIVITY_ID'] == null ||
      this.drawerData['ACTIVITY_ID'] == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Activity Name', '');
    } else if (
      this.drawerData.ACTIVITY_TYPE == null ||
      this.drawerData.ACTIVITY_TYPE == '' ||
      this.drawerData.ACTIVITY_TYPE == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Activity Type .', '');
    } else if (
      this.drawerData.ACTIVITY_TYPE == 'T' &&
      (this.drawerData.ACTIVITY_VALUE == null ||
        this.drawerData.ACTIVITY_VALUE == undefined ||
        this.drawerData.ACTIVITY_VALUE == '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Activity Timing .', '');
    } else if (
      this.drawerData.ACTIVITY_TYPE == 'S' &&
      (this.drawerData.ACTIVITY_VALUE == null ||
        this.drawerData.ACTIVITY_VALUE == undefined ||
        this.drawerData.ACTIVITY_VALUE == '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Activity Repetition .', '');
    } else if (
      this.drawerData.ACTIVITY_TYPE == 'D' &&
      (this.drawerData.ACTIVITY_VALUE == null ||
        this.drawerData.ACTIVITY_VALUE == undefined ||
        this.drawerData.ACTIVITY_VALUE == '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Distance .', '');
    } else if (
      this.drawerData.ACTIVITY_TYPE == 'W' &&
      (this.drawerData.ACTIVITY_VALUE == null ||
        this.drawerData.ACTIVITY_VALUE == undefined ||
        this.drawerData.ACTIVITY_VALUE == '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Weight .', '');
    }
    // else if (
    //   this.drawerData.SEQ_NO == undefined ||
    //   this.drawerData.SEQ_NO == null ||
    //   this.drawerData.SEQ_NO <= 0
    // ) {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Sequence Number ', '');
    // }

    if (this.isOk) {
      this.drawerData['HEAD_ID'] = this.HEAD_ID;
      // this.isSpinning=false;
      if (this.TIMING_TYPE === 'Min') {
        this.drawerData.ACTIVITY_VALUE *= 60;
      }
      if (this.DISTANCE_TYPE === 'km') {
        this.drawerData.ACTIVITY_VALUE *= 1000;
      }
      if (this.WEIGHT_TYPE === 'gm') {
        this.drawerData.ACTIVITY_VALUE /= 1000;
      }
      // if (this.drawerData.ACTIVITY_TYPE === 'S') {
      //   this.drawerData.ACTIVITY_VALUE = null;
      // } else {
      //   this.drawerData.ACTIVITY_VALUE = null;
      // }
      this.isSpinning = true;
      // this.drawerData.CATEGORY_ID = this.CATEGORY_ID;
      this.drawerData.SEQ_NO = Number(this.drawerData.SEQ_NO);
      if (this.drawerData.ID) {
        this.api
          .updateActivityheadMapping(this.drawerData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(
                ' Activity Mapping Information Updated Successfully...',
                ''
              );
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error(
                ' Failed To Update Activity Mapping Information...',
                ''
              );
              this.isSpinning = false;
            }
          });
      } else {
        this.api
          .createActivityheadMapping(this.drawerData)
          // this.type=.TYPE_ID
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(
                ' Activity Mapping Information Saved Successfully...',
                ''
              );
              if (!addNew) this.drawerClose();
              else {
                this.drawerData = new activitymaster();
                this.resetDrawer(statepage);
                this.api
                  .getAllactivitysubcateogary(1, 1, '', 'desc', '')
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
              this.message.error(
                ' Failed To Save Activity Mapping Information...',
                ''
              );
              this.isSpinning = false;
            }
          });
      }
    }
  }
  resetDrawer(statepage: NgForm) {
    this.drawerData = new activitymaster();
    statepage.form.markAsPristine();
    statepage.form.markAsUntouched();
  }
}
