import { Component, OnInit } from '@angular/core';
import { CommomFunctionsService } from 'src/app/Services/commom-functions.service';
import { TrackBookTask } from '../../Models/track-book-Task';
import { ApiService } from 'src/app/Services/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NgForm } from '@angular/forms';
import { appkeys } from 'src/app/app.constant';
import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-trackbook-tasks',
  templateUrl: './trackbook-tasks.component.html',
  styleUrls: ['./trackbook-tasks.component.css'],
})
export class TrackbookTasksComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  isSpinning = false;
  isOk = true;
  drawerData: TrackBookTask = new TrackBookTask();
  public commonFunction = new CommomFunctionsService();
  formTitle = 'Manage TrackBook Tasks/Challenges';
  dataList: any[] = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  Dimensions: [] = [];
  dimensionload: boolean = false;
  activityheadlist: [] = [];
  Headsload: boolean = false;
  Activitys: [] = [];
  Activitysload: boolean = false;
  drawerClose2!: Function;

  columns: string[][] = [
    ['LABEL', ' Name '],
    ['DIAMENTION_NAME', ' DIAMENTION_NAME '],
    ['SEQ_NO', 'Sequence No'],
  ];

  constructor(
    private api: ApiService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getallDimensions();
    this.getallHeads();
    this.getAllAgeCategories();
  }
  agecategoryload=false
  agecategories:any=[]
  getAllAgeCategories(){
    this.api.getAgeCateogary(0, 0, '', '', ' AND STATUS!=false').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.agecategories = data['data'];
          this.agecategoryload = false;
        } else {
          this.agecategories = [];
          this.agecategoryload = false;
        }
      },
      (err) => {
        this.agecategoryload = false;
      }
    );
  }
  getallDimensions() {
    this.dimensionload = false;
    this.api
      .getAllDimensionMaster(0, 0, '', '', ' AND STATUS!=false')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.Dimensions = data['data'];
            this.dimensionload = false;
          } else {
            this.Dimensions = [];
            this.dimensionload = false;
          }
        },
        (err) => {
          this.dimensionload = false;
        }
      );
  }

  getallHeads() {
    this.Headsload = true;
    this.api
      .getActivityHeadMaster(0, 0, '', '', ' AND STATUS!=false AND USER_ID = 0')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.activityheadlist = data['data'];
            this.Headsload = false;
          } else {
            this.activityheadlist = [];
            this.Headsload = false;
          }
        },
        (err) => {
          this.Headsload = false;
        }
      );
  }
  getallActivitys(data) {
    if (this.drawerData.FITNESS_ACTIVITY_ID != null) {
      this.drawerData.FITNESS_ACTIVITY_ID = 0;
    }
    this.Activitysload = true;

    if (data != null && data != undefined) {
      this.api
        .getAllactivityheadmapping(0, 0, '', '', ' AND HEAD_ID=' + data)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.Activitys = data['data'];
              this.Activitysload = false;
            } else {
              this.Activitys = [];
              this.Activitysload = false;
            }
          },
          (err) => {
            this.Activitysload = false;
          }
        );
    }
  }
  onTypeChange(type:string,form:NgForm){
    // if(type!='' && type){
    //   this.drawerData.LABEL=''
    //   form.form.markAsPristine();
    //   form.form.markAsUntouched();
    // }
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
      .getAllTrackBookTasks(
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
    this.drawerTitle = ' Create New Task/Challenge ';
    this.drawerData = new TrackBookTask();
    this.api.getAllTrackBookTasks(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          if (data['count'] == 0) {
            this.drawerData.SEQ_NO = 1;
          } else {
            this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
          }

          this.drawerVisible = true;
          // this.drawerData.ACTIVITY = true;
          this.Activitys = []
        }
      },
      (err) => {}
    );
    this.drawerVisible = true;
  }
  edit(data: TrackBookTask): void {
    // console.log(data);

    this.drawerTitle = ' Update Task';
    this.drawerData = Object.assign({}, data);
    this.taskurl = this.imgUrl + 'taskImage/' + this.drawerData.IMAGE_URL;
    this.drawerVisible = true;
    if (
      this.drawerData.HEAD_ID != undefined &&
      this.drawerData.HEAD_ID != null &&
      this.drawerData.HEAD_ID > 0
    ) {
     
      this.api.getActivityMaster(0, 0, '', '', ' AND HEAD_ID=' + this.drawerData.HEAD_ID).subscribe((data)=>
        {
          if (data['code'] == 200) {
            this.Activitys = data['data'];
            this.Activitysload = false;
            this.drawerData.ACTIVITY = true
          } else {
            this.Activitys = [];
            this.Activitysload = false;
            this.drawerData.ACTIVITY = false

          }
        },
        (err) => {
          this.Activitysload = false;
        }
      );
  }

    // console.log(this.drawerData.ACTIVITY);
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
      // (this.drawerData.TYPE=='' || this.drawerData.TYPE==null) &&
      (this.drawerData.LABEL == undefined ||
        this.drawerData.LABEL == null ||
        this.drawerData.LABEL.trim() == '') &&
        (this.drawerData.AGE_CATEGORY_ID <= 0 ||
          this.drawerData.AGE_CATEGORY_ID == null ||
          this.drawerData.AGE_CATEGORY_ID == undefined) &&
      (this.drawerData.DIAMENTION_ID <= 0 ||
        this.drawerData.DIAMENTION_ID == null ||
        this.drawerData.DIAMENTION_ID == undefined) 
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');

    }
    else if(this.drawerData.TYPE=='' || this.drawerData.TYPE==null || this.drawerData.TYPE==undefined){
      this.isOk = false;
      this.message.error('Please Select Type ', '');
    }
     else if (
      this.drawerData.LABEL == null ||
      this.drawerData.LABEL.trim() == '' ||
      this.drawerData.LABEL == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Task ', '');
    } 
    else if (
      this.drawerData.AGE_CATEGORY_ID <= 0 ||
      this.drawerData.AGE_CATEGORY_ID == null ||
      this.drawerData.AGE_CATEGORY_ID == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Age Category', '');
    } 
    else if (
      this.drawerData.DIAMENTION_ID == undefined ||
      this.drawerData.DIAMENTION_ID == null ||
      this.drawerData.DIAMENTION_ID <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Dimension ', '');
    } else if (
      this.drawerData.SEQ_NO == undefined ||
      this.drawerData.SEQ_NO == null ||
      this.drawerData.SEQ_NO <= 0 
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Sequence Number ', '');
    } else if (
      this.drawerData.ACTIVITY == true &&
      (this.drawerData.HEAD_ID == undefined ||
        this.drawerData.HEAD_ID == null ||
        this.drawerData.HEAD_ID <= 0)
    ) {
      this.isOk = false;
      this.message.error(' Please Select Activity Head ', '');
    } else if (
      this.drawerData.ACTIVITY == true &&
      (this.drawerData.FITNESS_ACTIVITY_ID == undefined ||
        this.drawerData.FITNESS_ACTIVITY_ID == null ||
        this.drawerData.FITNESS_ACTIVITY_ID <= 0)
    ) {
      this.isOk = false;
      this.message.error(' Please Select Activity ', '');
    }
    if (this.isOk) {
      // this.isSpinning=false;

      this.isSpinning = true;
      if (this.drawerData.ID) {
        this.api
          .updateTrackbookTask(this.drawerData)
          .subscribe((successCode) => {
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
          .createTrackbookTask(this.drawerData)
          // this.type=.TYPE_ID
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(
                ' Task Information Saved Successfully...',
                ''
              );
              if (!addNew) this.drawerClose();
              else {
                this.drawerData = new TrackBookTask();
                this.resetDrawer(statepage);
                this.api.getAllTrackBookTasks(1, 1, '', 'desc', '').subscribe(
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
              this.message.error(' Failed To Save Task Information...', '');
              this.isSpinning = false;
            }
          });
      }
    }
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
          if (img.width < 832 && img.height < 596) {
            // Continue with uploading process
            const number = Math.floor(100000 + Math.random() * 900000);
            const fileExt = this.fileList2.name.split('.').pop();
            const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
            let url = '';
            url = d == null ? '' : d + number + '.' + fileExt.toLowerCase();
            if (
              this.drawerData.IMAGE_URL != undefined &&
              this.drawerData.IMAGE_URL.trim() != ''
            ) {
              const arr = this.drawerData.IMAGE_URL.split('/');
              if (arr.length > 1) {
                url = arr[5];
              }
            }

            this.isSpinning = true;
            this.progressBarProfilePhoto = true;
            this.timerThree = this.api
              .onUpload('taskImage', this.fileList2, url)
              .subscribe((res) => {
                if (res.type === HttpEventType.Response) {
                }
                if (res.type === HttpEventType.UploadProgress) {
                  const percentDone = Math.round(
                    (100 * res.loaded) / res.total
                  );
                  console.log(percentDone);

                  this.percentProfilePhoto = percentDone;
                  if (this.percentProfilePhoto == 100) {
                    this.isSpinning = false;
                  }
                } else if (res.type == 2 && res.status != 200) {
                  this.message.error('Failed to upload image.', '');
                  this.isSpinning = false;
                  this.progressBarProfilePhoto = false;
                  this.percentProfilePhoto = 0;
                  this.drawerData.IMAGE_URL = null;
                  this.taskurl = '';
                } else if (res.type == 4 && res.status == 200) {
                  if (res.body['code'] == 200) {
                    this.message.success('Image uploaded successfully.', '');
                    this.isSpinning = false;
                    this.drawerData.IMAGE_URL = url;
                    this.taskurl =
                      this.imgUrl + 'taskImage/' + this.drawerData.IMAGE_URL;
                  } else {
                    this.isSpinning = false;
                  }
                }
              });
          } else {
            this.message.error(
              'Image dimensions must be between 832 x 596 pixels.',
              ''
            );
            this.fileList2 = null;
            this.drawerData.IMAGE_URL = null;
          }
        };
      } else {
        this.message.error('File size exceeds 10MB.', '');
        this.fileList2 = null;
        this.drawerData.IMAGE_URL = null;
      }
    } else {
      this.message.error('Please select only JPEG/JPG/PNG extensions.', '');
      this.fileList2 = null;
    }
  }

  deleteConfirm(data) {
    this.isSpinning = true;
    if (this.drawerData.ID) {
      this.drawerData.IMAGE_URL = null;
      this.isSpinning = false;
    } else {
      this.drawerData.IMAGE_URL = null;
      data.ACTIVITY_GIF = null;
      this.isSpinning = false;
    }
  }
  deleteCancel(): void {}
  resetDrawer(statepage: NgForm) {
    this.drawerData = new TrackBookTask();
    statepage.form.markAsPristine();
    statepage.form.markAsUntouched();
  }
}
