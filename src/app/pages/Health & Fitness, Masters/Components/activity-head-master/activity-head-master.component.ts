import { Component, OnInit } from '@angular/core';
import { appkeys } from 'src/app/app.constant';
import { activityhead, activitymaster } from '../../Models/activityheadmaster';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Services/api.service';
import { HttpEventType } from '@angular/common/http';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-activity-head-master',
  templateUrl: './activity-head-master.component.html',
  styleUrls: ['./activity-head-master.component.css'],
})
export class ActivityHeadMasterComponent implements OnInit {
  isSpinning = false;
  isOk = true;
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: activityhead = new activityhead();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage Activity Heads';
  dataList = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  screenwidth: any;
  HEAD_ID: any;
  columns: string[][] = [
    ['HEAD_NAME', 'HEAD_NAME'],
    ['HEAD_IMAGE', 'HEAD_IMAGE'],
    ['STATUS', 'Status'],
  ];
  TIMING_TYPE: any = 'Sec';
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadAllActivityHads();
  }
  listdata1 = [];
  listdata2 = [];
  loadAllActivityHads() {
    this.api
      .getActivityHeadMaster(0, 0, 'SEQ_NO', 'desc', ' AND USER_ID = 0 ')
      .subscribe(
        (data) => {
          this.listdata1 = [];

          if (data['code'] == 200) {
            if (data['count'] > 0) {
              this.listdata1 = data['data'];
              console.log('this.listdata1 ', this.listdata1);
            } else {
              this.listdata1 = [];
            }
          } else {
            this.listdata1 = [];
          }
        },
        (err) => {}
      );
  }
  close() {
    this.drawerVisible = false;
    this.drawerData = new activityhead();
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
      .getActivityHeadMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + ' AND USER_ID = 0 '
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
    this.drawerTitle = 'Create New Activity Head';
    this.drawerData = new activityhead();
    this.api
      .getActivityHeadMaster(1, 1, 'SEQ_NO', 'desc', ' AND USER_ID = 0 ')
      .subscribe(
        (data) => {
          if (data['count'] == 0) {
            this.drawerData.SEQ_NO = 1;
          } else {
            this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
          }
        },
        (err) => {}
      );
    this.drawerVisible = true;
  }

  edit(data: activityhead): void {
    this.TIMING_TYPE = 'Sec';
    this.drawerTitle = 'Update Activity Head';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
    this.taskurl =
      this.imgUrl + 'activityHeadImage/' + this.drawerData.HEAD_IMAGE;
  }

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  drawerClose(): void {
    this.search();
    this.loadAllActivityHads();
    this.drawerVisible = false;
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
            this.drawerData.HEAD_IMAGE != undefined &&
            this.drawerData.HEAD_IMAGE.trim() != ''
          ) {
            const arr = this.drawerData.HEAD_IMAGE.split('/');
            if (arr.length > 1) {
              url = arr[5];
            }
          }

          this.isSpinning = true;
          this.progressBarProfilePhoto = true;
          this.timerThree = this.api
            .onUpload('activityHeadImage', this.fileList2, url)
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
                this.drawerData.HEAD_IMAGE = null;
                this.taskurl = '';
              } else if (res.type == 4 && res.status == 200) {
                if (res.body['code'] == 200) {
                  this.message.success('Image uploaded successfully.', '');
                  this.isSpinning = false;
                  this.drawerData.HEAD_IMAGE = url;
                  this.taskurl =
                    this.imgUrl +
                    'activityHeadImage/' +
                    this.drawerData.HEAD_IMAGE;
                } else {
                  this.isSpinning = false;
                }
              }
            });
          // } else {
          //   this.message.error(
          //     'Image dimensions must be between 832 x 596 pixels.',
          //     ''
          //   );
          //   this.fileList2 = null;
          //   this.drawerData.HEAD_IMAGE = null;
          // }
        };
      } else {
        this.message.error('File size exceeds 10MB.', '');
        this.fileList2 = null;
        this.drawerData.HEAD_IMAGE = null;
      }
    } else {
      this.message.error('Please select only JPEG/JPG/PNG extensions.', '');
      this.fileList2 = null;
    }
  }
  isMapDrawerVisible = false;
  MapdrawerTitle = '';
  mapdrawerData: activitymaster = new activitymaster();
  MapSubCategories(data: activityhead) {
    this.MapdrawerTitle = 'Map Activity';
    //  this.mapdrawerData=Object.assign()
    this.HEAD_ID = data.ID;
    this.mapdrawerData['HEAD_ID'] = data.ID;
    //  this.CATEGORY_ID=data.ID
    this.isMapDrawerVisible = true;
  }
  MapdrawerClose() {
    this.isMapDrawerVisible = false;
    this.search();
  }
  deleteConfirm(data) {
    this.isSpinning = true;
    if (this.drawerData.ID) {
      // this.api
      //   .deletePdf('activityHeadImage/' + data.HEAD_IMAGE)
      //   .subscribe((successCode) => {
      //     if (successCode['code'] == '200') {
      this.drawerData.HEAD_IMAGE = null;
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
      this.drawerData.HEAD_IMAGE = null;
      data.HEAD_IMAGE = null;
      this.isSpinning = false;
    }
  }
  deleteCancel(): void {}
  // Sort

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
    this.drawerData = new activityhead();
    activityform.form.markAsPristine();
    activityform.form.markAsUntouched();
    this.loadAllActivityHads();
  }

  save(addNew: boolean, activityform: NgForm): void {
    this.isOk = true;
    this.isSpinning = false;
    if (this.drawerData.ID) {
      this.listdata2 = [];
      this.listdata2 = this.listdata1.filter(
        (item) => item.ID !== this.drawerData.ID
      );
    } else {
      this.listdata2 = [];
    }

    if (
      (this.drawerData.HEAD_NAME == undefined ||
        this.drawerData.HEAD_NAME == null ||
        this.drawerData.HEAD_NAME.trim() == '') &&
      (this.drawerData.HEAD_IMAGE == undefined ||
        this.drawerData.HEAD_IMAGE == null ||
        this.drawerData.HEAD_IMAGE.trim() == '') &&
      (this.drawerData.REST_TIME == undefined ||
        this.drawerData.REST_TIME == null ||
        this.drawerData.REST_TIME <= 0) &&
      (this.drawerData.SEQ_NO == undefined ||
        this.drawerData.SEQ_NO == null ||
        this.drawerData.SEQ_NO <= 0)
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.drawerData.HEAD_NAME == null ||
      this.drawerData.HEAD_NAME.trim() == '' ||
      this.drawerData.HEAD_NAME == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Head Name .', '');
    } else if (
      this.drawerData.REST_TIME == undefined ||
      this.drawerData.REST_TIME == null ||
      this.drawerData.REST_TIME <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Rest Between Sets', '');
    } else if (
      this.drawerData.HEAD_IMAGE == null ||
      this.drawerData.HEAD_IMAGE.trim() == '' ||
      this.drawerData.HEAD_IMAGE == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Upload Head Image .', '');
    } else if (
      this.drawerData.SEQ_NO == undefined ||
      this.drawerData.SEQ_NO == null ||
      this.drawerData.SEQ_NO <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Sequence Number ', '');
    }

    if (this.TIMING_TYPE === 'Min') {
      this.drawerData.REST_TIME *= 60;
    }
    if (this.isOk) {
      this.drawerData.USER_ID = 0;

      this.isSpinning = true;
      if (this.drawerData.ID) {
        var seqNo = this.listdata2.filter((obj) => {
          return obj.SEQ_NO == this.drawerData.SEQ_NO;
        });

        if (seqNo.length == 0) {
          this.api
            .updateActivityHeadMaster(this.drawerData)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success(
                  'Activity Head Updated Successfully...',
                  ''
                );
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Activity Head Updation Failed...', '');
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
            .createActivityHeadMaster(this.drawerData)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success(
                  'Activity Head Created Successfully...',
                  ''
                );
                if (!addNew) this.drawerClose();
                else {
                  this.drawerData = new activityhead();
                  this.resetDrawer(activityform);
                }
                this.isSpinning = false;
              } else {
                this.message.error('Activity Head Creation Failed...', '');
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
    }
  }
}
