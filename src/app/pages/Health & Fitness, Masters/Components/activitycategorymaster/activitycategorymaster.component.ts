import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Services/api.service';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { appkeys } from 'src/app/app.constant';
import { activitycategorymaster } from '../../Models/activitycategorymaster';
import { activitysubcategory } from '../../Models/activitysubcategorymaster';

@Component({
  selector: 'app-activitycategorymaster',
  templateUrl: './activitycategorymaster.component.html',
  styleUrls: ['./activitycategorymaster.component.css'],
})
export class ActivitycategorymasterComponent implements OnInit {
  isSpinning = false;
  // TIMING_TYPE: any = 'Sec';
  // DISTANCE_TYPE: any = 'mtr';

  isOk = true;
  drawerVisible!: boolean;
  drawerTitle!: string;
  CATEGORY_ID: number;
  drawerData: activitycategorymaster = new activitycategorymaster();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage Activity Categories';
  dataList = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  screenwidth: any;
  activityheadlist: any[] = [];
  activityheadLoad = false;
  columns: string[][] = [
    ['CATEGORY_NAME', 'CATEGORY_NAME'],
    ['CATEGORY_IMAGE', 'CATEGORY_IMAGE'],
    // ['ACTIVITY_GIF', 'ACTIVITY_GIF'],
    // ['ACTIVITY_TYPE', 'ACTIVITY_TYPE'],
  ];

  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getActivityCategory();
  }
  listdata1 = [];
  listdata2 = [];
  getActivityCategory() {
    // this.activityheadLoad = true;
    this.listdata1 = [];

    this.api
      .getActivityCategoryMaster(0, 0, 'id', 'asc', '')
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['count'] > 0) {
            this.listdata1 = data['data'];
            console.log('this.listdata1 ', this.listdata1);
          } else {
            this.listdata1 = [];
          }
          // this.activityheadLoad = false;
        } else {
          // this.activityheadLoad = false;
          this.listdata1 = [];
        }
      });
  }
  close() {
    this.drawerVisible = false;
    this.drawerData = new activitycategorymaster();
    this.search();
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
    this.api
      .getActivityCategoryMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
            this.loadingRecords = false;
            this.dataList = data['data'];
          } else {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
            this.dataList = [];
          }
        },
        (err) => {}
      );
  }

  add(): void {
    this.drawerTitle = 'Create New Activity Category';
    this.drawerData = new activitycategorymaster();
    // this.TIMING_TYPE = 'Sec';
    // this.DISTANCE_TYPE = 'mtr';
    this.api
      .getActivityCategoryMaster(1, 1, '', 'desc', '')
      .subscribe((seqno) => {
        if (seqno['code'] == 200) {
          if (seqno['count'] == 0) {
            this.drawerData.SEQ_NO = 1;
          } else {
            this.drawerData.SEQ_NO = seqno['data'][0]['SEQ_NO'] + 1;
          }
        } else {
        }
      });
    this.drawerVisible = true;
  }
  isMapDrawerVisible = false;
  MapdrawerTitle = '';
  mapdrawerData: activitysubcategory = new activitysubcategory();
  MapSubCategories(data: activitycategorymaster) {
    this.MapdrawerTitle = 'Map Sub Categories';
    this.mapdrawerData.CATEGORY_ID = data.ID;
    this.CATEGORY_ID = data.ID;
    this.isMapDrawerVisible = true;
  }
  MapdrawerClose() {
    this.isMapDrawerVisible = false;
    this.search();
  }
  get closeCallbackMap() {
    return this.MapdrawerClose.bind(this);
  }

  // ChangeSeqByHeadName(data: any) {
  //   // console.log(data);

  //   if (data != undefined && data != null) {
  //     this.api
  //       .getactivitycategorymaster(
  //         1,
  //         1,
  //         'SEQ_NO',
  //         'desc',
  //         'AND HEAD_ID =' + data + ' AND USER_ID = 0 '
  //       )
  //       // .getactivitycategorymaster(1, 1, 'SEQ_NO', 'desc', 'AND ID =' + data)

  //       .subscribe(
  //         (data) => {
  //           // console.log(data, 'data');

  //           if (data['count'] == 0) {
  //             this.drawerData.SEQ_NO = 1;
  //           } else {
  //             this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
  //           }
  //         },
  //         (err) => {}
  //       );
  //   }
  // }

  edit(data: activitycategorymaster): void {
    this.drawerTitle = 'Update Activity Category';
    this.drawerData = Object.assign({}, data);
    // this.TIMING_TYPE = 'Sec';
    // this.DISTANCE_TYPE = 'mtr';

    // if (data.ACTIVITY_TYPE = 'T') {
    //   this.DISTANCE_TYPE = '';
    // } else if (data.ACTIVITY_TYPE = 'D') {
    //   this.TIMING_TYPE = '';
    // } else if(data.ACTIVITY_TYPE = 'S'){
    //   this.TIMING_TYPE = '';
    //   this.DISTANCE_TYPE = '';
    //   data['ACTIVITY_TYPE'] = 'S'

    // }

    this.drawerVisible = true;
    this.taskurl =
      this.imgUrl + 'activityCategoryImage/' + this.drawerData.CATEGORY_IMAGE;
  }

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
    this.getActivityCategory();
  }
  fileList2: any;
  progressBarProfilePhoto: boolean = false;
  percentProfilePhoto = 0;
  timerThree: any;
  taskurl: any = '';
  imgUrl = appkeys.retriveimgUrl;

  onFileSelected(event: any) {
    let isLtSize = false;
    this.fileList2 = <File>event.target.files[0];

    if (
      event.target.files[0].type == 'image/gif' ||
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png'
    ) {
      const isLt2M = event.target.files[0].size < 10240000;
      if (isLt2M) {
        const img = new Image();
        img.src = window.URL.createObjectURL(event.target.files[0]);
        img.onload = () => {
          // if (img.width <= 832 && img.height <= 596) {
          // Continue with uploading process
          const number = Math.floor(100000 + Math.random() * 900000);
          const fileExt = this.fileList2.name.split('.').pop();
          const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
          let url = '';
          url = d == null ? '' : d + number + '.' + fileExt.toLowerCase();
          if (
            this.drawerData.CATEGORY_IMAGE != undefined &&
            this.drawerData.CATEGORY_IMAGE.trim() != ''
          ) {
            const arr = this.drawerData.CATEGORY_IMAGE.split('/');
            if (arr.length > 1) {
              url = arr[5];
            }
          }

          this.isSpinning = true;
          this.progressBarProfilePhoto = true;
          this.timerThree = this.api
            .onUpload('activityCategoryImage', this.fileList2, url)
            .subscribe((res) => {
              if (res.type === HttpEventType.Response) {
              }
              if (res.type === HttpEventType.UploadProgress) {
                const percentDone = Math.round((100 * res.loaded) / res.total);
                // console.log(percentDone);

                this.percentProfilePhoto = percentDone;
                if (this.percentProfilePhoto == 100) {
                  this.isSpinning = false;
                }
              } else if (res.type == 2 && res.status != 200) {
                this.message.error('Failed to upload image.', '');
                this.isSpinning = false;
                this.progressBarProfilePhoto = false;
                this.percentProfilePhoto = 0;
                this.drawerData.CATEGORY_IMAGE = null;
                this.taskurl = '';
              } else if (res.type == 4 && res.status == 200) {
                if (res.body['code'] == 200) {
                  this.message.success('Image uploaded successfully.', '');
                  this.isSpinning = false;
                  this.drawerData.CATEGORY_IMAGE = url;
                  this.taskurl =
                    this.imgUrl +
                    'activityCategoryImage/' +
                    this.drawerData.CATEGORY_IMAGE;
                } else {
                  this.isSpinning = false;
                }
              }
            });
          // } else {
          //   this.message.error(
          //     'Gif dimensions must be between 832 x 596 pixels.',
          //     ''
          //   );
          //   this.fileList2 = null;
          //   this.drawerData.ACTIVITY_GIF = null;
          // }
        };
      } else {
        this.message.error('File size exceeds 10MB.', '');
        this.fileList2 = null;
        this.drawerData.CATEGORY_IMAGE = null;
      }
    } else {
      this.message.error('Please select only Gif extensions.', '');
      this.fileList2 = null;
    }
  }

  deleteConfirm(data) {
    this.isSpinning = true;
    if (this.drawerData.ID) {
      // this.api
      //   .deletePdf('activityHeadImage/' + data.ACTIVITY_GIF)
      //   .subscribe((successCode) => {
      //     if (successCode['code'] == '200') {
      this.drawerData.CATEGORY_IMAGE = '';
      //   this.api
      //     .updateActivityHeadMaster(this.drawerData)
      //     .subscribe((updateCode) => {
      //       if (updateCode.code == '200') {
      //         this.isSpinning = false;
      //       } else {
      //         this.message.error(' Image Has Not Saved...', '');
      //         this.isSpinning = false;
      //       }
      //     });
      //   this.message.success(' Image deleted...', '');
      // } else {
      //   this.message.error(' Image Has Not Deleted...', '');
      this.isSpinning = false;
      // }
      // });
    } else {
      this.drawerData.CATEGORY_IMAGE = null;
      data.CATEGORY_IMAGE = null;
      this.isSpinning = false;
    }
  }
  deleteCancel(): void {}
  // Sort
  // onTypeChange(type) {
  //   if (type == 'T') {
  //     this.drawerData.ACTIVITY_VALUE = '';
  //   } else {
  //     this.drawerData.ACTIVITY_VALUE = '';
  //   }
  // }

  // TIME_CHANGE: any;
  // onTimeTypeChange(time: string): void {}

  // onActivityTimingChange(): void {}
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
  resetDrawer(activityform: NgForm) {
    this.drawerData = new activitycategorymaster();
    activityform.form.markAsPristine();
    activityform.form.markAsUntouched();
    this.getActivityCategory();
  }

  save(addNew: boolean, activityform: NgForm): void {
    // console.log(activityform.form.value, this.drawerData);
    if (this.drawerData.ID) {
      this.listdata2 = [];
      this.listdata2 = this.listdata1.filter(
        (item) => item.ID !== this.drawerData.ID
      );
    } else {
      this.listdata2 = [];
    }

    this.isOk = true;
    this.isSpinning = false;
    if (
      (this.drawerData.CATEGORY_NAME == undefined ||
        this.drawerData.CATEGORY_NAME == null ||
        this.drawerData.CATEGORY_NAME.trim() == '') &&
      (this.drawerData.CATEGORY_IMAGE == undefined ||
        this.drawerData.CATEGORY_IMAGE == null ||
        this.drawerData.CATEGORY_IMAGE.trim() == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.drawerData.CATEGORY_NAME == null ||
      this.drawerData.CATEGORY_NAME.trim() == '' ||
      this.drawerData.CATEGORY_NAME == undefined
    ) {
      this.isOk = false;
      this.message.error('Please enter category name .', '');
    } else if (
      this.drawerData.CATEGORY_IMAGE == null ||
      this.drawerData.CATEGORY_IMAGE.trim() == '' ||
      this.drawerData.CATEGORY_IMAGE == undefined
    ) {
      this.isOk = false;
      this.message.error('Please upload category image .', '');
    } else if (this.isOk) {
      this.isSpinning = true;
      if (this.drawerData.ID) {
        var seqNo = this.listdata2.filter((obj) => {
          return obj.SEQ_NO == this.drawerData.SEQ_NO;
        });

        if (seqNo.length == 0) {
          this.api
            .updateActivityCategoryMaster(this.drawerData)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success(
                  'Activity Category Updated Successfully...',
                  ''
                );
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Activity Category Updation Failed...', '');
                this.isSpinning = false;
              }
            });
        } else {
          this.message.error(
            'This Sequence No. Already Exists, Please Enter Different Sequence No.',
            ''
          );
          this.isSpinning = false;
        }
      } else {
        var seqNoForCreate = this.listdata1.filter((obj) => {
          return obj.SEQ_NO == this.drawerData.SEQ_NO;
        });

        if (seqNoForCreate.length == 0) {
          this.api
            .createActivityCategoryMaster(this.drawerData)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success(
                  'Activity Category Created Successfully...',
                  ''
                );
                if (!addNew) this.drawerClose();
                else {
                  this.drawerData = new activitycategorymaster();
                  this.resetDrawer(activityform);
                }
                this.isSpinning = false;
              } else {
                this.message.error('Activity Category Creation Failed...', '');
                this.isSpinning = false;
              }
            });
        } else {
          this.message.error(
            'This Sequence No. Already Exists, Please Enter Different Sequence No.',
            ''
          );
          this.isSpinning = false;
        }
      }
      // if (this.TIMING_TYPE === 'Min') {
      //   this.drawerData.ACTIVITY_VALUE *= 60;
      // }
      // if (this.DISTANCE_TYPE === 'km') {
      //   this.drawerData.ACTIVITY_VALUE *= 1000;
    }

    // if (this.drawerData.ACTIVITY_TYPE === 'S') {
    //   this.drawerData.ACTIVITY_VALUE = null;
    // } else {
    //   this.drawerData.ACTIVITY_VALUE = null;
    // }

    // console.log(this.drawerData);
  }
}
